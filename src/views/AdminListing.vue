<template>
  <div v-if="loading">Loading</div>
  <div v-else class="grid grid-cols-0 md:grid-cols-2 gap-4 max-w-6xl">
    <div class="flex flex-col gap-4">
      <div class="card bg-secondary shadow-xl">
        <div class="card-body">
          <h2 class="card-title">{{ listing.title }}</h2>
          <h4 class="card-subtitle font-semibold">{{ listing.amount }}</h4>
          <div>Last Seen: <span class="font-light">{{ listing.date_lastseen }}</span></div>
          <div>
            <div>Status: {{ listing.status }}</div>
            <div>Available: {{ listing.available }}</div>
          </div>
          <div class="card-actions justify-end">
            <a :href="listing.url" class="btn btn-primary">
              <figure class="rounded-xl me-3"><img class="max-h-10" :src="listing.source.logo" :alt="listing.source.name"/></figure>
              Visit URL</a>
          </div>
          <div class="divider"></div>
          <div class="grid grid-cols-2 gap-2">
            <img :src="src" :key="i" v-for="(src, i) in listing.images" />
          </div>
        </div>
      </div>
    </div>
    <div>
      <div class="card bg-primary shadow-xl">
        <div class="card-body">
          <div v-if="!listing.coordinates" role="alert" class="alert alert-warning justify-start">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" class="stroke-current shrink-0 w-6 h-6"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
            <div class="flex-col items-start gap-0">
              <h3 class="font-bold">Location Not Known!</h3>
              <div class="text-xs">You must locate the listing on the map manually</div>
            </div>
          </div>
          <h2 class="card-title flex row justify-between items-center">
            Listing Location
            <div class="tooltip tooltip-left" data-tip="Double click to set the listing's location on the map">
              <button class="btn btn-sm btn-ghost">?</button>
            </div>
          </h2>
          <MapContainer :center="center" :zoom="zoom" class="h-full w-full" v-on:zoomend="onMapZoom" v-on:move="onMapMove">
            <OpenStreetMap />
            <Marker v-if="position" :position="position" />
            <Circle v-if="newPosition" :center="newPosition" :opacity="50.0" :color="'blue'" :fill-color="'light-blue'" :radius="3.0" :weight="3.0" />
            <MapClickHandler @click="setNewPosition" />
          </MapContainer>
          <button class="btn" @click="saveNewPosition">Save</button>
          <div class="divider"></div>
          <h2 class="card-title flex row justify-between items-center">
            Listing Land Title
            <div class="tooltip tooltip-left" data-tip="Select land titles being sold in the listing where 'red' is selected">
              <button class="btn btn-sm btn-ghost">?</button>
            </div>
          </h2>
          <MapContainer :center="center" :zoom="zoom" class="h-full w-full" v-on:move="onMapMove" v-on:zoomend="onMapZoom">
            <OpenStreetMap />
            <PolygonLand :lands="unselectedLands" :color="'blue'" v-on:select="add" />
            <PolygonLand :lands="selectedLands" :color="'red'" v-on:select="remove" />
          </MapContainer>
          <button class="btn" @click="saveSelectedlands">Save (count: {{ selectedLandIds.length }})</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from 'vue';
import { useRoute } from 'vue-router';
import { storeToRefs } from 'pinia';
import { useLandStore } from '@/stores/landStore'
import { directus, getAssetUrl } from '../api'
import { Circle, MapContainer, Marker, OpenStreetMap } from 'vue3-leaflet';
import leaflet from 'leaflet';
import { debounce } from 'lodash';
import PolygonLand from '@/components/PolygonLand.vue';
import MapClickHandler from '@/components/MapClickHandler.vue';

const landStore = useLandStore();
const { lands } = storeToRefs(landStore)

const zoom = ref(18)
const center = ref([-17.7351, 168.32461]);
const loading = ref(true);
const listing = ref()

const selectedLandIds = ref([]);
const unselectedLands = computed(() => {
  return lands.value.filter((l) => !selectedLandIds.value.includes(l.id))
})
const selectedLands = computed(() => {
  return lands.value.filter((l) => selectedLandIds.value.includes(l.id))
})

const position = computed(() => {
  if (!listing.value) return null;
  return listing.value.coordinates;
});
const newPosition = ref(null);
const setNewPosition = (center: leaflet.LatLng) => {
  newPosition.value = [center.lat, center.lng];
}
const saveNewPosition = async () => {
  if (!newPosition.value) return;
  try {
    const coordinates = {
      type: 'Point',
      coordinates: [newPosition.value[1], newPosition.value[0]],
    }
    await directus.items('Listing').updateOne(listing.value.id, { coordinates })
    await fetchListing(listing.value.id);
    newPosition.value = null;
  } catch (err) {
    console.log(err);
  }
}

const add = async (id) => {
  selectedLandIds.value.push(id);
}

const remove = async (id) => {
  selectedLandIds.value = selectedLandIds.value.filter((i) => i !== id);
}

const onMapMove = debounce(async ({ center: newCenter, map }) => {
  center.value = newCenter;
  await landStore.fetchWithinBounds(map.getBounds());
}, 500); //, { trailing: false, leading: true, wait: 150 });
const onMapZoom = debounce(async ({ zoom: newZoom, map }) => {
  zoom.value = newZoom;
  await landStore.fetchWithinBounds(map.getBounds());
}, 500); //, { trailing: false, leading: true, wait: 150 })

const saveSelectedlands = async () => {
  try {
    const payload = selectedLandIds.value.map((landId) => {
      return {
        Land_id: landId,
        Listing_id: listing.value.id,
      }
    });
    await directus
      .items('Listing')
      .updateOne(listing.value.id, { lands: payload })
  } catch (err) {
    console.error(err);
  }
};

const fetchListing = async (listingId: string) => {
  console.log('Fetching listing', listingId);
  try {
    const response = await directus
    .items('Listing')
    .readOne(listingId, {
      fields: [
        "*",
        "images.id",
        "images.directus_files_id",
        "source.id",
        "source.name",
        "source.logo",
        "lands.id",
        "lands.Land_id",
      ],
    });
    selectedLandIds.value = response.lands.map((i) => i.Land_id);
    let coordinates = null;
    if (response.coordinates) {
      coordinates = new leaflet.LatLng(response.coordinates.coordinates[1], response.coordinates.coordinates[0]);
    }
    const logo = await getAssetUrl(response.source.logo);
    response.source.logo = logo;
    const images = await Promise.all(response.images.map(async (i) => await getAssetUrl(i.directus_files_id)));
    return {
      ...response,
      coordinates,
      images,
    };
  } catch (error) {
    console.error('api error', error);
  }
};

onMounted(async () => {
  const route = useRoute();
  const listingId = route.params.id as string;
  listing.value = await fetchListing(listingId);
  loading.value = false;
  setTimeout(() => {
    center.value = listing.value.coordinates;
  }, 1000)
})
</script>