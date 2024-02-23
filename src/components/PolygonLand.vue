<template>
  <Polygon v-for="land in lands" :key="land.id" :positions="land.polygon" :color="color(land.id)" :fill-color="'light-blue'" :weight="2.0">
    <PolygonLandClick :land="land" :selected-ids="selectedIds" v-on:select="select" />
  </Polygon>
</template>

<script setup lang="ts">
import { inject, onMounted, onUnmounted, ref, watch } from 'vue';
import { Polygon, Popup } from 'vue3-leaflet';
import PopupSelectLand from './PopupSelectLand.vue';
import { useLandStore } from '@/stores/landStore';
import PolygonLandClick from './PolygonLandClick.vue';

// https://github.com/geonativefr/vue3-leaflet/issues/41
// TODO: clean up my now working implementation
// TODO: remove item from selectedLandIds
// TODO: remove old popup based implementation

const landStore = useLandStore();

const emits = defineEmits(['select']);

const map = inject('map');
const select = async (lid) => {
  console.log('sel', lid)
  emits('select', lid);
  await landStore.fetchWithinBounds(map.value.getBounds())
};

const props = defineProps({
  lands: {
    type: Array,
    required: true,
  },
  selectedIds: {
    type: Array<String>,
    required: true,
  },
});

// const isSelected = ref(false);
// onMounted(() => {
//   watch(props.selectedIds, (ids) => isSelected.value = ids.includes(props.land.id), { immediate: true });
//   // whenever(props.selectedIds, (selectedIds) => isSelected.value = selectedIds.includes(props.land.id));
// })

// const color = computed(() => {
//   return isSelected.value ? 'red' : 'blue';
// });

const color = (lid) => {
  return props.selectedIds.includes(lid) ? 'red' : 'blue';
}


// const polygon = inject('layer');
// onMounted(() => {
//   polygon.on('click', () => {
//     emits('select', props.land.id);
//   });
// })
// onUnmounted(() => {
//   polygon.off('click');
// })
</script>