<template>
  <div class="container-fluid mt-3">
    <h2>🗺️ Nearby Youth Mental Health Services</h2>
    <p class="text-muted">Search places, click a result to see route from your current location.</p>

    <div v-if="msg" class="alert alert-warning py-2" role="status" aria-live="polite">{{ msg }}</div>

    <div class="row g-3">
      <div class="col-md-4">
        <div class="input-group">
          <input
            v-model="query"
            class="form-control"
            placeholder="e.g. counselling, clinic, headspace"
            aria-label="Search places"
            :disabled="!mapReady"
            @keyup.enter="searchPlaces" 
          />
          <button class="btn btn-primary" @click="searchPlaces" :disabled="!mapReady || !query.trim()">Search</button>
        </div>

        <ul class="list-group mt-3" style="max-height: 420px; overflow:auto">
          <li
            v-for="p in results"
            :key="p.id || p.place_name"
            class="list-group-item list-group-item-action"
            role="button"
            tabindex="0"
            @click="selectPlace(p)"
            @keyup.enter="selectPlace(p)"
          >
            <strong>{{ p.text }}</strong>
            <div class="small text-muted">{{ p.place_name }}</div>
          </li>
        </ul>
      </div>

      <div class="col-md-8">
        <div id="map" style="height:520px" role="application" aria-label="Map showing search results and route"></div>
        <div class="mt-2">
          <span v-if="distance && duration" class="badge bg-success">
            Distance: {{ (distance/1000).toFixed(1) }} km • Duration: {{ Math.round(duration/60) }} min
          </span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { onMounted, onBeforeUnmount, ref } from 'vue'
import mapboxgl from 'mapbox-gl'
import 'mapbox-gl/dist/mapbox-gl.css'

const query = ref('youth center') 
const results = ref([])
const map = ref(null)
const mapReady = ref(false)
const destroyed = ref(false)

const userMarker = ref(null)
const userLngLat = ref([144.9631, -37.8136]) 
const poiMarkers = ref([])
const routeLayerId = 'route-line'
const routeSourceId = 'route'
const distance = ref(null)
const duration = ref(null)
const msg = ref('')

onMounted(() => {
  const token = import.meta.env.VITE_MAPBOX_TOKEN
  if (!token) {
    msg.value = 'Missing VITE_MAPBOX_TOKEN (.env). Map is disabled.'
    return
  }
  mapboxgl.accessToken = token

  map.value = new mapboxgl.Map({
    container: 'map',
    style: 'mapbox://styles/mapbox/streets-v12',
    center: userLngLat.value,
    zoom: 12
  })

  map.value.on('load', () => {
    if (destroyed.value) return
    mapReady.value = true

    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          if (destroyed.value || !map.value) return
          userLngLat.value = [pos.coords.longitude, pos.coords.latitude]
          map.value.setCenter(userLngLat.value)
          userMarker.value?.remove()
          userMarker.value = new mapboxgl.Marker().setLngLat(userLngLat.value).addTo(map.value)
        },
        (err) => {
          msg.value = 'Could not access your location. Using default center.'
        },
        { enableHighAccuracy: true, timeout: 8000 }
      )
    }
  })
})

async function safeFetch(url) {
  const res = await fetch(url)
  if (!res.ok) {
    const text = await res.text().catch(()=> '')
    throw new Error(`HTTP ${res.status}: ${text || res.statusText}`)
  }
  return res.json()
}

async function searchPlaces () {
  if (!mapReady.value || !map.value || destroyed.value) return
  msg.value = 'Searching…'

  poiMarkers.value.forEach(m => m.remove())
  poiMarkers.value = []
  distance.value = null
  duration.value = null
  results.value = []

  const q = encodeURIComponent(query.value.trim())
  if (!q) { msg.value = 'Enter a keyword (e.g. headspace, clinic, hospital)'; return }

  const center = map.value.getCenter().toArray()
  const proximity = `${center[0]},${center[1]}`
  const base = 'https://api.mapbox.com/geocoding/v5/mapbox.places/'
  const token = mapboxgl.accessToken

  const url1 = `${base}${q}.json?bbox=144.7,-38.1,145.2,-37.6&types=poi&limit=10&language=en&country=AU&fuzzyMatch=true&autocomplete=true&access_token=${token}`
  const url2 = `${base}${q}.json?proximity=${proximity}&types=poi&limit=10&language=en&country=AU&fuzzyMatch=true&autocomplete=true&access_token=${token}`
  const url3 = `${base}${q}.json?limit=10&language=en&fuzzyMatch=true&autocomplete=true&access_token=${token}`

  try {
    let data = await safeFetch(url1)
    let feats = Array.isArray(data.features) ? data.features : []

    if (!feats.length) {
      data = await safeFetch(url2)
      feats = Array.isArray(data.features) ? data.features : []
    }
    if (!feats.length) {
      data = await safeFetch(url3)
      feats = Array.isArray(data.features) ? data.features : []
    }

    results.value = feats

    if (!feats.length) {
      msg.value = 'No results found. Try keywords like "hospital", "headspace", "clinic".'
      return
    }

    const bounds = new mapboxgl.LngLatBounds()
    feats.forEach(f => {
      const m = new mapboxgl.Marker({ color: '#2c7' })
        .setLngLat(f.center)
        .addTo(map.value)
      m.getElement().style.cursor = 'pointer'
      m.getElement().addEventListener('click', () => selectPlace(f))
      poiMarkers.value.push(m)
      bounds.extend(f.center)
    })
    map.value.fitBounds(bounds, { padding: 40, maxZoom: 15 })
    msg.value = `${feats.length} place(s) found. Click one to route.`

  } catch (e) {
    msg.value = 'Search failed. Check token URL restrictions or network. ' + (e.message || '')
  }
}


async function selectPlace (p) {
  if (!mapReady.value || !map.value || destroyed.value) return
  msg.value = 'Routing…'

  const start = userMarker.value
    ? userMarker.value.getLngLat().toArray()
    : (map.value?.getCenter()?.toArray() || userLngLat.value)
  const dest = p.center
  const url = `https://api.mapbox.com/directions/v5/mapbox/driving/${start[0]},${start[1]};${dest[0]},${dest[1]}?geometries=geojson&language=en&access_token=${mapboxgl.accessToken}`

  try {
    const data = await safeFetch(url)
    const route = data.routes && data.routes[0]
    if (!route) {
      msg.value = 'No route found.'
      return
    }

    distance.value = route.distance
    duration.value = route.duration

    if (map.value.getLayer(routeLayerId)) map.value.removeLayer(routeLayerId)
    if (map.value.getSource(routeSourceId)) map.value.removeSource(routeSourceId)

    map.value.addSource(routeSourceId, {
      type: 'geojson',
      data: { type: 'Feature', properties: {}, geometry: route.geometry }
    })
    map.value.addLayer({
      id: routeLayerId,
      type: 'line',
      source: routeSourceId,
      paint: { 'line-width': 4, 'line-color': '#007bff' }
    })

    const bounds = new mapboxgl.LngLatBounds()
    route.geometry.coordinates.forEach(c => bounds.extend(c))
    map.value.fitBounds(bounds, { padding: 40 })
    msg.value = ''
  } catch (e) {
    msg.value = 'Directions failed. Check token scopes (Directions) or network. ' + (e.message || '')
  }
}

onBeforeUnmount(() => {
  destroyed.value = true
  try {
    poiMarkers.value.forEach(m => m.remove())
    poiMarkers.value = []
    if (userMarker.value) { userMarker.value.remove(); userMarker.value = null }
    if (map.value) {
      if (map.value.getLayer(routeLayerId)) map.value.removeLayer(routeLayerId)
      if (map.value.getSource(routeSourceId)) map.value.removeSource(routeSourceId)
      map.value.remove()
      map.value = null
    }
  } catch {}
})
</script>

<style scoped>
#map :focus { outline: 2px dashed #333; }
</style>
