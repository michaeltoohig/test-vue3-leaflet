<template>
  <div class="about">
    <MapContainer :center="center" class="h-full w-full" v-on:zoomend="onMapChange" v-on:move="onMapChange">
      <OpenStreetMap />
      <Marker :position="[48.3151, 3.68461]" />
      <Marker :position="[49.68561, 3.9881]">
        <Popup>
          <div class="text-blue-600 font-semibold">Hello world!</div>
        </Popup>
      </Marker>
    </MapContainer>
  </div>
</template>

<script setup lang="ts">
console.log('1')

import { MapContainer, OpenStreetMap, Marker, Popup } from 'vue3-leaflet';
import { inject, ref } from 'vue';

const center = ref([48.3151, 3.68461]);

const makeMarkers = () => {
  // TODO produce a couple hundred random markers with tooltips etc to test
}

const onMapChange = () => {
  makeMarkers();
}
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
