<script setup lang="ts">
/**
 * The search results page that allow users to paginate through results and
 * apply filters to them as well.
 * 
 * I have some notes and thoughts on performance for this:
 *  1. I would use SSR to render the initial page. Since the query is going to
 *     be cached anyway, you might as well fetch the initial set of data on the
 *     server and render everything. This means the cleint would receive a full
 *     set of data before hydrating, reuslting in no loaders being shown.
 *  2. I would use nuxt/image to do the heavy lifting on responsive images.
 *     Alternatively (or in combination with) a service like Thumbor or AWS
 *     Image Optimization, to generate appropriate sizes optimized for different
 *     viewports.
 *  3. I would not lazy load a sensible first set of images (maybe 9) and lazy
 *     load all others, so that the Largest Contentful Paint isn't a lazy loaded
 *     image.
 *  4. I've added a pretty naïve skeleton loader to the page. Ideally the RVCard
 *     component would have its own loading state and populate real data as it
 *     comes in, so that the DOM doesn't need to do a full rerender of the list.
 */
import { ref, computed, watch } from 'vue'

import RVCard from '@/components/RVCard.vue'
import RVCardSkeleton from '@/components/RVCardSkeleton.vue'
import RPaginator from '@/components/RPaginator.vue'
import RVFilters from '@/components/RVFilters.vue'
import RVMap from '@/components/RVMap.vue'

import type { SearchData, Filter } from '@/types'

const isLoading = ref(false)
const errorMessage = ref('')
const data = ref<SearchData>()


/**
 * Search map
 */
const lat = ref(45.41539)
const lng = ref(-75.68938)


/**
 * Pagination.
 */
const currentPage = ref(0)
const itemsPerPage = ref(30) // This doesn't seem to part of the query params, so I hard coded it in this case.
const totalPages = computed(() => {
  return data.value?.PopularRVs.TotalRVs ? Math.ceil(data.value?.PopularRVs.TotalRVs / itemsPerPage.value) : 1
})

const nextPage = () => {
  if (currentPage.value < totalPages.value - 1) {
    currentPage.value++
  }
}

const prevPage = () => {
  if (currentPage.value > 0) {
    currentPage.value--
  }
}

const changePage = (number: number) => {
  currentPage.value = number
}

// Whenever the page changes from the pagninator, fetch a new set of results.
watch(() => currentPage.value, () => {
  fetchData()
})


/**
 * Filters.
 */
const drivableFilters = ref<Filter[]>([])
const towableFilters = ref<Filter[]>([])
const filterParams = computed(() => drivableFilters.value.length ? `&SearchVariant=18${ drivableFilters.value.length ? '&' + drivableFilters.value.map(filter => `${filter}=true`).join('&') : '' }${towableFilters.value.length ? '&' + towableFilters.value.map(filter => `${filter}=true`).join('&') : ''}` : '')

const handleDrivableFilters = (newFilters: Filter[]) => {
  drivableFilters.value = newFilters
}

const handleTowableFilters = (newFilters: Filter[]) => {
  towableFilters.value = newFilters
}

watch([drivableFilters, towableFilters], () => {
  currentPage.value = 0
  fetchData()
})


/**
 * Constants.
 */
const URL = computed(() => `https://api.rvezy.com/api/rvlistings/unified-search?SearchLat=${lat.value}&SearchLng=${lng.value}&Country=CA${filterParams.value}&SortOrder=Recommended&CurrentPage=${currentPage.value}&FeaturedCurrentPage=0&FeaturedPageSize=5&IncludeFeatured=true`)

// Hard-coded as Photos returns with relative paths.
// You'll also note that I string replace `jpg` and `png with `webp`, this is
// not great, but the jpg's don't seem to actually work.
const CDN_URL = 'https://cdn-d.rvezy.com/960x640x80'
const DRIVABLE_FILTERS = [
  { id: 'ClassA', label: 'Class A' },
  { id: 'ClassB', label: 'Class B' },
  { id: 'ClassC', label: 'Class C' },
  { id: 'TruckCamper', label: 'Truck Camper' },
  { id: 'Campervan', label: 'Campervan' },
]
const TOWABLE_FILTERS = [
  { id: 'FifthWheel', label: 'Fifth Wheel' },
  { id: 'SubTravelTrailer', label: 'Travel Trailer' },
  { id: 'TentTrailer', label: 'Tent Trailer' },
  { id: 'Hybrid', label: 'Hybrid' },
  { id: 'ToyHauler', label: 'Toy hauler' },
  { id: 'MicroTrailer', label: 'MicroTrailer' },
]


/**
 * Fetches the data from the API and handles the loading state.
 * I personally like to use State Machines for this.
 */
const fetchData = async () => {
  try {
    isLoading.value = true

    const result = await fetch(URL.value)
    data.value = await result.json()
  } catch (e) {
    if (typeof e === 'string') {
      errorMessage.value = e
    }
  } finally {
    isLoading.value = false
  }
}

// Computed helpers.
const featuredRvs = computed(() => data.value?.FeaturedRVs.ListRVs)
const popularRvs = computed(() => data.value?.PopularRVs.ListRVs)

// Initially fetch the data on load. This is async, so that the page always
// renders and doesn't block the client.
fetchData()
</script>

<template>
  <main class="p-10">
    <h1 class="text-2xl font-bold text-blue-900">RV Rentals</h1>

    <RVMap :lat="lat" :lng="lng" />

    <div>
      <div class="flex space-x-2">
        <RVFilters :filters="DRIVABLE_FILTERS" name="drivable" @apply="handleDrivableFilters" />
        <RVFilters :filters="TOWABLE_FILTERS" name="towable" @apply="handleTowableFilters" />
      </div>

      <template v-if="isLoading">
        <ul class="grid grid-cols-3 gap-9">
          <li>
            <RVCardSkeleton></RVCardSkeleton>
          </li>
          <li>
            <RVCardSkeleton></RVCardSkeleton>
          </li>
          <li>
            <RVCardSkeleton></RVCardSkeleton>
          </li>
          <li>
            <RVCardSkeleton></RVCardSkeleton>
          </li>
          <li>
            <RVCardSkeleton></RVCardSkeleton>
          </li>
          <li>
            <RVCardSkeleton></RVCardSkeleton>
          </li>
          <li>
            <RVCardSkeleton></RVCardSkeleton>
          </li>
          <li>
            <RVCardSkeleton></RVCardSkeleton>
          </li>
          <li>
            <RVCardSkeleton></RVCardSkeleton>
          </li>
        </ul>
      </template>

      <div v-else>
        <h2 class="text-xl font-bold text-blue-900">Featured RVs</h2>
        <ul v-if="featuredRvs?.length" class="grid grid-cols-3 gap-9">
          <RVCard
            v-for="rv in featuredRvs"
            :key="rv.Id"
            :img="`${CDN_URL}${rv.Photos[0].Path.replace(/jpg|png/,'webp')}`"
            :alt="rv.Photos[0].Description"
            :name="rv.RVName"
            :guests="rv.Guests"
            :price="rv.PreDiscountedAverageNightlyPrice"
          />
        </ul>

        <h2 class="text-xl font-bold text-blue-900">Popular RVs</h2>
        <ul v-if="popularRvs?.length" class="grid grid-cols-3 gap-9">
          <RVCard
            v-for="rv in popularRvs"
            :key="rv.Id"
            :img="`${CDN_URL}${rv.Photos[0].Path.replace(/jpg|png/,'webp')}`"
            :alt="rv.Photos[0].Description"
            :name="rv.RVName"
            :guests="rv.Guests"
            :price="rv.PreDiscountedAverageNightlyPrice"
          />
        </ul>

        <RPaginator
          :total-pages="totalPages"
          :current-page="currentPage"
          @prev="prevPage"
          @next="nextPage"
          @change="changePage"
        />
      </div>

    </div>
  </main>
</template>
