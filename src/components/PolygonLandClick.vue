<template>

</template>

<script setup lang="ts">
import { computed, inject, ref, onMounted, onUnmounted, watch, watchEffect } from 'vue';
import { whenever } from '@vueuse/core';
import leaflet from 'leaflet';
import { Popup, Polygon } from 'vue3-leaflet';
import { useLandStore } from '@/stores/landStore';

// const landStore = useLandStore();

const emits = defineEmits(['select']);

const props = defineProps({
  land: {
    type: Object,
    required: true,
  },
  selectedIds: {
    type: Array<String>,
    required: true,
  },
});

const isSelected = ref(false);
onMounted(() => {
  watch(props.selectedIds, (ids) => isSelected.value = ids.includes(props.land.id), { immediate: true });
  // whenever(props.selectedIds, (selectedIds) => isSelected.value = selectedIds.includes(props.land.id));
})

const polygon = inject('layer');
onMounted(() => {
  polygon.on('click', onClickLayer);
})
onUnmounted(() => {
  polygon.off('click', onClickLayer);
})

const updateColor = (selected) => {
  const color = selected ? 'red' : 'blue';
  polygon.setStyle({ color })
}

watch(isSelected, (newValue) => {
  updateColor(newValue);
});

const onClickLayer = () => {
  emits('select', props.land.id);
  // setTimeout(() => {
  //   const color = isSelected.value ? 'red' : 'blue'
  //   polygon.setStyle({ color })
  // }, 250)
}

// const map = inject('map');
// const fetchLandsByMapBounds = async () => {
//   await landStore.fetchWithinBounds(map.value.getBounds());
// }

// const select = async () => {
//   console.log('sel', props.land.id);
//   emits('select', props.land.id); 
//   // await fetchLandsByMapBounds()
// };
</script>