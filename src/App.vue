<script setup lang="ts">

</script>

<template>
  <main class="flex justify-center p-3">
    <RouterView :key="$route.fullPath" />
  </main>
</template>
