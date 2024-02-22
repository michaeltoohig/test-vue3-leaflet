<template>

</template>

<script setup lang="ts">
import { inject, onMounted, onUnmounted } from 'vue';

const props = defineProps({
  island: {
    type: Object,
    required: true,
  },
});

const map = inject('map');
const polygon = inject("layer");
onMounted(() => {
  polygon.on('click', () => map.value.fitBounds(props.island.polygon));
})
onUnmounted(() => {
  polygon.off('click');
})
</script>