<script setup lang="ts">
import { computed } from 'vue';

const props = defineProps({
  currentPage: {
    type: Number,
    reuqired: true,
  },
  totalPages: {
    type: Number,
    required: true,
  },
})

defineEmits(['prev', 'next', 'change'])

const prevIsDisabled = computed(() => props.currentPage === 0)
const nextIsDisabled = computed(() => props.currentPage === props.totalPages - 1)
</script>

<template>
  <div class="space-x-2">
    <button :disabled="prevIsDisabled" @click="$emit('prev')" :class="['border rounded-full  px-3 py-1 ', prevIsDisabled ? 'bg-gray-100 text-gray-400 cursor-not-allowed' : 'text-blue-500 hover:bg-gray-200 hover:text-blue-800']">Prev</button>
    <button v-for="n in totalPages" :key="n" @click="$emit('change', (n - 1))" :class="['border rounded-full px-3 py-1', (n-1 === currentPage) ? 'bg-blue-500 text-white hover:bg-blue-800' : 'text-blue-500 hover:bg-gray-200 hover:text-blue-800']">{{ n }}</button>
    <button :disabled="nextIsDisabled" @click="$emit('next')" :class="['border rounded-full  px-3 py-1 ', nextIsDisabled ? 'bg-gray-100 text-gray-400 cursor-not-allowed' : 'text-blue-500 hover:bg-gray-200 hover:text-blue-800']">Next</button>
  </div>
</template>