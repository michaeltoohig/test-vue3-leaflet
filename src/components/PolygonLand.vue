<template>
  <Polygon v-for="land in lands" :key="land.id" :positions="land.polygon" :color="color" :fill-color="'light-blue'" :weight="2.0">
    <PolygonLandClick :land="land" v-on:select="select" />
  </Polygon>
</template>

<script setup lang="ts">
import { Polygon } from 'vue3-leaflet';
import PolygonLandClick from './PolygonLandClick.vue';

const emits = defineEmits(['select']);

const select = async (lid) => {
  emits('select', lid);
};

const props = defineProps({
  lands: {
    type: Array,
    required: true,
  },
  color: {
    type: String,
    required: true,
  },
});
</script>