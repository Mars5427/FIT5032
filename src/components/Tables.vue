<template>
  <div class="container mt-4">
    <h2 class="mb-3">📄 Resources (searchable, sortable, paginated)</h2>
    <div class="table-responsive">
      <table class="table table-striped table-hover align-middle">
        <thead>
          <tr>
            <th @click="toggleSort('title')" role="button" tabindex="0" @keyup.enter="toggleSort('title')">
              Title <SortIcon :field="'title'" :sort="sort"/>
            </th>
            <th @click="toggleSort('category')" role="button" tabindex="0" @keyup.enter="toggleSort('category')">
              Category <SortIcon :field="'category'" :sort="sort"/>
            </th>
            <th @click="toggleSort('source')" role="button" tabindex="0" @keyup.enter="toggleSort('source')">
              Source <SortIcon :field="'source'" :sort="sort"/>
            </th>
          </tr>
          <tr>
            <th>
              <input v-model="filters.title" class="form-control form-control-sm" placeholder="Search title" aria-label="Search title"/>
            </th>
            <th>
              <input v-model="filters.category" class="form-control form-control-sm" placeholder="Search category" aria-label="Search category"/>
            </th>
            <th>
              <input v-model="filters.source" class="form-control form-control-sm" placeholder="Search source" aria-label="Search source"/>
            </th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="r in paginatedResources" :key="r.id">
            <td>{{ r.title }}</td>
            <td><span class="badge bg-info">{{ r.category }}</span></td>
            <td><a :href="r.url" target="_blank" rel="noopener">{{ r.source }}</a></td>
          </tr>
        </tbody>
      </table>
    </div>

    <Pagination :page="page" :pageCount="pageCountResources" @change="page=$event"/>

    <hr class="my-4"/>

    <h2 class="mb-3">🗓️ Workshops</h2>
    <div class="table-responsive">
      <table class="table table-striped table-hover align-middle">
        <thead>
          <tr>
            <th @click="toggleSort2('name')" role="button" tabindex="0" @keyup.enter="toggleSort2('name')">
              Name <SortIcon :field="'name'" :sort="sort2"/>
            </th>
            <th @click="toggleSort2('date')" role="button" tabindex="0" @keyup.enter="toggleSort2('date')">
              Date <SortIcon :field="'date'" :sort="sort2"/>
            </th>
            <th @click="toggleSort2('location')" role="button" tabindex="0" @keyup.enter="toggleSort2('location')">
              Location <SortIcon :field="'location'" :sort="sort2"/>
            </th>
          </tr>
          <tr>
            <th>
              <input v-model="filters2.name" class="form-control form-control-sm" placeholder="Search name" aria-label="Search name"/>
            </th>
            <th>
              <input v-model="filters2.date" type="date" class="form-control form-control-sm" aria-label="Filter by date"/>
            </th>
            <th>
              <input v-model="filters2.location" class="form-control form-control-sm" placeholder="Search location" aria-label="Search location"/>
            </th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="w in paginatedWorkshops" :key="w.id">
            <td>{{ w.name }}</td>
            <td>{{ w.date }}</td>
            <td>{{ w.location }}</td>
          </tr>
        </tbody>
      </table>
    </div>

    <Pagination :page="page2" :pageCount="pageCountWorkshops" @change="page2=$event"/>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import resourcesData from '../assets/json/resources.json'
import workshopsData from '../assets/json/workshops.json'

const pageSize = 10

const resources = ref([])
const filters = ref({ title: '', category: '', source: '' })
const sort = ref({ field: 'title', dir: 'asc' })
const page = ref(1)

const workshops = ref([])
const filters2 = ref({ name: '', date: '', location: '' })
const sort2 = ref({ field: 'date', dir: 'asc' })
const page2 = ref(1)

onMounted(() => {
  resources.value = resourcesData
  workshops.value = workshopsData
})

const filteredResources = computed(() => {
  return resources.value.filter(r =>
    r.title.toLowerCase().includes(filters.value.title.toLowerCase()) &&
    r.category.toLowerCase().includes(filters.value.category.toLowerCase()) &&
    r.source.toLowerCase().includes(filters.value.source.toLowerCase())
  )
})

const sortedResources = computed(() => {
  const arr = [...filteredResources.value]
  arr.sort((a,b) => {
    const fa = a[sort.value.field]?.toString().toLowerCase() ?? ''
    const fb = b[sort.value.field]?.toString().toLowerCase() ?? ''
    if (fa < fb) return sort.value.dir === 'asc' ? -1 : 1
    if (fa > fb) return sort.value.dir === 'asc' ? 1 : -1
    return 0
  })
  return arr
})

const pageCountResources = computed(() => Math.max(1, Math.ceil(sortedResources.value.length / pageSize)))
const paginatedResources = computed(() => {
  const start = (page.value - 1) * pageSize
  return sortedResources.value.slice(start, start + pageSize)
})

function toggleSort(field){
  if (sort.value.field === field) {
    sort.value.dir = sort.value.dir === 'asc' ? 'desc' : 'asc'
  } else {
    sort.value.field = field
    sort.value.dir = 'asc'
  }
}

const filteredWorkshops = computed(() => {
  return workshops.value.filter(w => {
    const nameOk = w.name.toLowerCase().includes(filters2.value.name.toLowerCase())
    const locOk = w.location.toLowerCase().includes(filters2.value.location.toLowerCase())
    const dateOk = !filters2.value.date || w.date === filters2.value.date
    return nameOk && dateOk && locOk
  })
})

const sortedWorkshops = computed(() => {
  const arr = [...filteredWorkshops.value]
  arr.sort((a,b) => {
    const fa = a[sort2.value.field]?.toString().toLowerCase() ?? ''
    const fb = b[sort2.value.field]?.toString().toLowerCase() ?? ''
    if (fa < fb) return sort2.value.dir === 'asc' ? -1 : 1
    if (fa > fb) return sort2.value.dir === 'asc' ? 1 : -1
    return 0
  })
  return arr
})

const pageCountWorkshops = computed(() => Math.max(1, Math.ceil(sortedWorkshops.value.length / pageSize)))
const paginatedWorkshops = computed(() => {
  const start = (page2.value - 1) * pageSize
  return sortedWorkshops.value.slice(start, start + pageSize)
})

function toggleSort2(field){
  if (sort2.value.field === field) {
    sort2.value.dir = sort2.value.dir === 'asc' ? 'desc' : 'asc'
  } else {
    sort2.value.field = field
    sort2.value.dir = 'asc'
  }
}
</script>

<script>
export default {
  components: {
    SortIcon: {
      props: ['field','sort'],
      template:`<span aria-hidden="true">
          <span v-if="sort.field===field && sort.dir==='asc'">▲</span>
          <span v-else-if="sort.field===field && sort.dir==='desc'">▼</span>
        </span>`
    },
    Pagination: {
      props:['page','pageCount'],
      emits:['change'],
      template:`
        <nav class="d-flex justify-content-center" role="navigation" aria-label="Pagination">
          <ul class="pagination">
            <li class="page-item" :class="{disabled: page<=1}">
              <button class="page-link" @click="$emit('change', page-1)" :disabled="page<=1" aria-label="Previous">Previous</button>
            </li>
            <li class="page-item disabled">
              <span class="page-link">Page {{ page }} / {{ pageCount }}</span>
            </li>
            <li class="page-item" :class="{disabled: page>=pageCount}">
              <button class="page-link" @click="$emit('change', page+1)" :disabled="page>=pageCount" aria-label="Next">Next</button>
            </li>
          </ul>
        </nav>`
    }
  }
}
</script>
