<template>
  <div class="about">
    <MapContainer :center="center" :zoom="15.0" class="h-full w-full" v-on:zoomend="onMapChange" v-on:move="onMapChange">
      <OpenStreetMap />
      <div v-if="!showIslands">
        <Polygon v-if="selectedLand" :positions="selectedLand.polygon" :color="'red'" :weight="5.0" :fill-color="'red'" @click="unselectLand" />
        <Polygon
          v-for="l in lands"
          :key="l.id"
          :positions="l.polygon"
          :color="'green'"
          :weight="2.0"
          :fill-color="'blue'"
        >
          <Popup @click="selectLand(l.id)">
            <div class="text-blue-600 font-semibold" @click="selectLand(l.id)">{{ l.id }}</div>
          </Popup>
          <TestPopup :land="l" />
        </Polygon>
        <Marker v-if="selectedLand" :position="selectedLand.center" />
      </div>
      <div v-if="showIslands">
        <Polygon v-for="i in islands" :key="i.id" :positions="i.polygon" :color="'blue'" :weight="3.0" :fill-color="'light-blue'">
          <IslandClickHandler :island="i" />
        </Polygon>
      </div>
    </MapContainer>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from 'vue';
import { whenever } from '@vueuse/core';
import leaflet from 'leaflet';
import { MapContainer, OpenStreetMap, Marker, Popup, Polygon } from 'vue3-leaflet';
import { directus } from '../api';
import { debounce } from 'lodash';
import TestPopup from '@/components/TestPopup.vue';
import IslandClickHandler from '@/components/IslandClickHandler.vue';

const center = ref([-17.7351, 168.32461]);
const zoom = ref(12);
const lands = ref([]);
const selectedLandId = ref(null);
const islands = ref([]);
const groups = ref([]);
const groupBounds = ref({});
const showIslands = ref(false);

const selectLand = (marker) => {
  console.log('sl', marker);
  selectedLandId.value = marker;
};
const unselectLand = () => {
  console.log('usl')
  selectedLandId.value = null;
};
const selectedLand = computed(() => {
  if (!selectedLandId.value) return null;
  return lands.value.find((l) => l.id === selectedLandId.value);
});

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

const fetchIslands = async () => {
  const response = await directus.items('Island').readByQuery({
    fields: [
      'id',
      'name',
      'geometry',
      'group.id',
      'group.name',
    ],
    limit: -1,
  });
  islands.value = response.data?.map((i) => {
    const polygon = i.geometry.coordinates[0].map(c => new leaflet.LatLng(c[1], c[0]));
    return {
      ...i,
      polygon,
    };
  });
  islands.value.forEach((i: any) => {
    if (!i.group) return;
    let poly = new leaflet.GeoJSON(i.geometry);
    let bounds = poly.getBounds()
    if (!groupBounds.value[i.group.id]) {
      groupBounds.value[i.group.id] = new leaflet.LatLngBounds();
    }
    groupBounds.value[i.group.id].extend(bounds);
  });
  groups.value = [...new Set(islands.value.map((i: any) => i.group))] as any[];
};

const debouncedUpdate = debounce(async (map) => {
  console.log('update map');
  const bounds = map.getBounds();
  await fetchLands(bounds);
  if (islands.value.length === 0) {
    await fetchIslands();
  }
},  250);

const onMapChange = ({ zoom: z = undefined, map }) => {
  if (z) {
    console.log('z', z);
    zoom.value = z;
  }
  debouncedUpdate(map);
};

onMounted(async () => {
  await fetchIslands();
  whenever(zoom, (zoom) =>  showIslands.value = zoom < 10, { immediate: true });
});
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
