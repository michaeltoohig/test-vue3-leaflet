<template>
  <div class="about">
    <MapContainer :center="center" :zoom="zoom" class="h-full w-full" v-on:zoomend="onMapChange" v-on:move="onMapChange">
      <OpenStreetMap />
      <Polygon v-for="l in lands" :key="l.id" :positions="l.polygon" :color="'green'" :weight="2.0" :fill-color="'blue'">
        <TestPopup :land="l" />
      </Polygon>
      </MapContainer>
  </div>
</template>

<script setup lang="ts">
import leaflet from 'leaflet';
import { MapContainer, OpenStreetMap, Marker, Popup, Polygon } from 'vue3-leaflet';
import { ref } from 'vue';
import { directus } from '../api';
import { debounce } from 'lodash';
import TestPopup from '@/components/TestPopup.vue';

const center = ref([-17.7351, 168.32461]);
const zoom = ref(14);

const lands = ref([]);
const fetchLands = async (bounds: leaflet.LatLngBounds) => {
  const feature = leaflet.polygon([
    bounds.getSouthWest(),
    bounds.getNorthWest(),
    bounds.getNorthEast(),
    bounds.getSouthEast(),
  ]).toGeoJSON()
  const response = await directus.items('Land').readByQuery({
    limit: 150,
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

const debouncedUpdate = debounce(async (map) => {
  console.log('update map');
  const bounds = map.getBounds();
  await fetchLands(bounds);
},  250);

const onMapChange = ({ map }) => {
  debouncedUpdate(map);
};
</script>

<style scoped lang="scss">
@import 'leaflet/dist/leaflet.css';

@media (min-width: 1024px) {
  .about {
    min-height: 100vh;
    display: flex;
    gap: 1rem;
    flex-direction: column;
    justify-content: center;
    align-content: center;
  }
}

.about {
  padding: 5rem;
  display: flex;
  flex-flow: row nowrap;
  justify-content: center;
  gap: 1rem;
  align-items: center;
}
</style>
