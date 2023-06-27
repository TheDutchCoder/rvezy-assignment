<script setup lang="ts">
defineProps({
  img: {
    type: String,
    required: true,
  },
  alt: {
    type: String,
  },
  name: {
    type: String,
    required: true,
  },
  guests: {
    type: Number,
    required: true,
  },
  price: {
    type: Number,
    required: true,
  }
})
</script>

<template>
  <div class="text-blue-950 space-y-4">
    <div class="rounded-lg overflow-hidden relative">
      <img :src="img" :alt="alt || ''" class="object-cover">
    </div>
    <div class="space-y-2">
      <h2 class="text-md font-bold">{{name}}</h2>
      <p>Sleeps: {{guests }}</p>
      <p><span class="font-bold text-lg">$ {{price}} CAD</span>/night</p>
    </div>
  </div>
</template>