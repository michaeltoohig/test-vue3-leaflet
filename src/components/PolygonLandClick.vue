<template>

</template>

<script setup lang="ts">
import { inject, onMounted, onUnmounted } from 'vue';

const emits = defineEmits(['select']);

const props = defineProps({
  land: {
    type: Object,
    required: true,
  },
});

const polygon = inject('layer');
onMounted(() => {
  polygon.on('click', onClickLayer);
})
onUnmounted(() => {
  polygon.off('click', onClickLayer);
})

const onClickLayer = () => {
  emits('select', props.land.id);
}
</script>