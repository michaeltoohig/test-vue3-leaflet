<template>
  <div>
      <Popup>
        <button v-if="!isSelected" class="btn btn-sm btn-primary text-blue-600 font-semibold" @click="select">Add</button>
        <button v-else class="btn btn-sm btn-default text-blue-600 font-semibold" @click="select">Remove</button>
      </Popup>
  </div>
</template>

<script setup lang="ts">
import { computed, inject, ref, onMounted, onUnmounted, watch, watchEffect } from 'vue';
import { whenever } from '@vueuse/core';
import { Popup, Polygon } from 'vue3-leaflet';
import { useLandStore } from '@/stores/landStore';

const landStore = useLandStore();

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

const map = inject('map');
const polygon = inject('layer');
onMounted(() => {
  polygon.on('click', onClickLayer);
})
onUnmounted(() => {
  polygon.off('click', onClickLayer);
})

const onClickLayer = () => {
  emits('select', props.land.id);
  setTimeout(() => {
    polygon.color = isSelected.value ? 'red' : 'blue'
  }, 250)
}

// const map = inject('map');
// const fetchLandsByMapBounds = async () => {
//   await landStore.fetchWithinBounds(map.value.getBounds());
// }

const select = async () => {
  console.log('sel', props.land.id);
  emits('select', props.land.id); 
  // await fetchLandsByMapBounds()
};
</script>