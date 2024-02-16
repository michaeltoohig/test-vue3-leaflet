<template>
  <div :class="[show ? 'block' : 'hidden']">
    <Marker :position="land.center">
      <Popup>
        <div class="text-blue-600 font-semibold">{{ land.id }}</div>
      </Popup>
    </Marker>  
  </div>
</template>

<script setup lang="ts">
import { inject, onMounted, onUnmounted, ref } from 'vue';
import { MapContainer, OpenStreetMap, Marker, Popup, Polygon } from 'vue3-leaflet';

const props = defineProps({
  land: {
    type: Object,
    required: true,
  },
});

const show = ref(false);
const polygon = inject('layer');
onMounted(() => {
  polygon.on('click', () => console.log('test', props.land.id))
  polygon.on('mouseover', () => show.value = true);
  polygon.on('mouseout', () => show.value = false);
})
onUnmounted(() => {
  polygon.off('mouseover');
  polygon.off('mouseout');
})
</script>