<template>

</template>

<script setup lang="ts">
import { inject, onMounted, onUnmounted} from 'vue';

const emits = defineEmits(['click']);

const map = inject('map');
onMounted(() => {
  map.value.on('dblclick', onClickMap);
})
onUnmounted(() => {
  map.value.off('dblclick', onClickMap);
})

const onClickMap = ({ latlng }) => {
  emits('click', latlng);
}
</script>