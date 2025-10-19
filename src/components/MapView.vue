<template>
  <div class="container-fluid mt-3">
    <h2>🗺️ Nearby Youth Mental Health Services</h2>
    <p class="text-muted">Search places, click a result to see route from your current location.</p>

    <div v-if="msg" class="alert alert-warning py-2">{{ msg }}</div>

    <div class="row g-3">
      <div class="col-md-4">
        <div class="input-group">
          <input
            v-model="query"
            class="form-control"
            placeholder="e.g. counselling, clinic, headspace"
            aria-label="Search places"
            :disabled="!mapReady"
          />
          <button class="btn btn-primary" @click="searchPlaces" :disabled="!mapReady">Search</button>
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

const query = ref('counselling')
const results = ref([])
const map = ref(null)
const mapReady = ref(false)
const destroyed = ref(false)

const userMarker = ref(null)
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
    center: [144.9631, -37.8136],
    zoom: 11
  })

  map.value.on('load', () => {
    if (destroyed.value) return
    mapReady.value = true

    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          if (destroyed.value || !map.value) return
          const coords = [pos.coords.longitude, pos.coords.latitude]
          map.value.setCenter(coords)
          userMarker.value = new mapboxgl.Marker().setLngLat(coords).addTo(map.value)
        },
        () => { }
      )
    }
  })
})

async function searchPlaces () {
  if (!mapReady.value || !map.value || destroyed.value) return

  poiMarkers.value.forEach(m => m.remove())
  poiMarkers.value = []

  try {
    const base = 'https://api.mapbox.com/geocoding/v5/mapbox.places/'
    const url = `${base}${encodeURIComponent(query.value)}.json?proximity=144.9631,-37.8136&types=poi&limit=10&access_token=${mapboxgl.accessToken}`
    const res = await fetch(url)
    const data = await res.json()
    results.value = data.features || []

    if (!map.value || destroyed.value) return

    results.value.forEach(f => {
      const m = new mapboxgl.Marker({ color: '#2c7' }).setLngLat(f.center).addTo(map.value)
      poiMarkers.value.push(m)
    })
  } catch (e) {
    msg.value = 'Search failed. Please try again.'
  }
}

async function selectPlace (p) {
  if (!mapReady.value || !map.value || destroyed.value) return

  const start = userMarker.value ? userMarker.value.getLngLat().toArray() : map.value.getCenter().toArray()
  const dest = p.center
  const url = `https://api.mapbox.com/directions/v5/mapbox/driving/${start[0]},${start[1]};${dest[0]},${dest[1]}?geometries=geojson&access_token=${mapboxgl.accessToken}`

  const res = await fetch(url)
  const data = await res.json()
  const route = data.routes && data.routes[0]
  if (!route || !map.value || destroyed.value) return

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
  } catch { /* ignore */ }
})
</script>

<style scoped>
#map :focus { outline: 2px dashed #333; }
</style>
