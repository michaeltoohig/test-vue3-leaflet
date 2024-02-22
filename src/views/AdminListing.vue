<template>
  <div class="admin-listing">
    <div v-if="loading">Loading</div>
    <div v-else>
      {{ listing }}

      <div class="h-200 grid gap-4 max-w-2xl">  
        <h1>Listing Location</h1>
        <MapContainer :center="center" :zoom="zoom" class="h-full w-full" v-on:move="onMapMove">
          <OpenStreetMap />
          <Marker :position="listing.coordinates">  </Marker>
        </MapContainer>
        <h1>Land Titles</h1>
        <MapContainer :center="center" :zoom="zoom" class="h-full w-full" v-on:move="onMapMove">
          <OpenStreetMap />
          <Polygon v-for="land in lands" :key="land.id" :positions="land.polygon" :color="'blue'" :fill-color="'light-blue'" :weight="2.0">
            <Popup v-if="isSelected(land.id)">
              <button class="btn btn-sm btn-primary text-blue-600 font-semibold" @click="selectLand(land.id)">{{ land.id }}</button>
            </Popup>
            <Popup v-else>
              <button class="btn btn-sm btn-default text-blue-600 font-semibold" @click="selectLand(land.id)">{{ land.id }}</button>
            </Popup>
          </Polygon>
        </MapContainer>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from 'vue';
import { whenever } from '@vueuse/core'
import { useRoute } from 'vue-router';
import { directus } from '../api'
import { MapContainer, Marker, OpenStreetMap, Polygon, Popup } from 'vue3-leaflet';
import leaflet from 'leaflet';
import { debounce } from 'lodash';

// TODO: move Popups into components to allow for reactivity to the local land id to match the selected via a computed
// TODO: populate selectedLands when we fetch the listing
// TODO: display info about the listing
// TODO: image gallary etc.

const zoom = ref(18)
const center = ref([-17.7351, 168.32461]);
const loading = ref(true);
const listing = ref()
const lands = ref([]);
const selectedLands = ref([]);

const selectLand = (lid) => {
  console.log('sl', lid);
  if (!selectedLands.value.includes(lid)) {
    selectedLands.value.push(lid);
  }
};

const isSelected = (lid) => {
  return selectedLands.value.includes(lid);
}

const onMapMove = debounce(async ({ center: newCenter, map }) => {
  center.value = newCenter;
  await fetchLands(map.getBounds());
}, 500);

const fetchListing = async (listingId: string) => {
  console.log('Fetching listing', listingId);
  try {
    const response = await directus
    .items('Listing')
    .readOne(listingId, {
      fields: [
        "*",
        "source.id",
        "source.name",
        "source.logo",
      ],
    });
    const coordinates = new leaflet.LatLng(response.coordinates.coordinates[1], response.coordinates.coordinates[0]); 
    return {
      ...response,
      coordinates,
    };
  } catch (error) {
    console.error('api error', error);
  }
};

const fetchLands = async (bounds: leaflet.LatLngBounds) => {
  const feature = leaflet.polygon([
    bounds.getSouthWest(),
    bounds.getNorthWest(),
    bounds.getNorthEast(),
    bounds.getSouthEast(),
  ]).toGeoJSON()
  const response = await directus.items('Land').readByQuery({
    limit: 200,
    fields: ['id', 'name', 'center', 'geometry', 'listings', 'listings.id', 'listings.amount'],
    filter: {
      center: {
        _intersects: feature,
      },
    },
  });
  lands.value = response.data.map(s => {
    let has_listings = s.listings.length > 0;  
    let polygon = s.geometry.coordinates[0].map(c => new leaflet.LatLng(c[1], c[0]));
    return {
      id: s.id,
      name: s.name,
      has_listings: has_listings,
      starting_price: has_listings ? s.listings[0].amount : null,
      polygon: polygon,
      center: new leaflet.LatLng(s.center.coordinates[1], s.center.coordinates[0]),
    };
  });
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