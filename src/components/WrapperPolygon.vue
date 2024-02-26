<script setup lang="ts">
import { defineEmit } from 'vue';

const emit = defineEmit(['click']);

const handleClick = (marker) => {
  emit('click', marker);
};
</script>

<template>
  <Polygon
    :color="'blue'"
    :weight="3.0"
    :fill-color="'light-blue'"
    @click="handleClick"
  />
</template>