<script setup lang="ts">
import type { Filter } from '@/types';
import { ref, type PropType } from 'vue'

const props = defineProps({
  filters: {
    type: Array as PropType<Filter[]>,
      required: true,
  },
  name: {
    type: String,
    required: true,
  }
})

const isOpen = ref(false)
const localFilters = ref<string[]>([])
const selectAll = ref(false)

const handleSelectAll = (e: Event) => {
  if ((e.target as HTMLInputElement).checked) {
    localFilters.value = props.filters.map(filter => filter.id)
  } else {
    reset()
  }
}
const reset = () => {
  localFilters.value = []
  selectAll.value = false
}

defineEmits(['apply'])
</script>

<template>
  <div class="relative space-y-2">
    <button class="border rounded px-3 py-2" @click="isOpen = !isOpen">{{ name }}</button>
    <div v-show="isOpen" class="absolute top-full w-60 bg-white p-4 border rounded shadow-xl z-10">
      <label><input v-model="selectAll" type="checkbox" id="select-all" @change="handleSelectAll"> Select all {{ name }}s</label>
      <div class="flex flex-col">
        <label v-for="filter in filters" :key="filter.id" :for="filter.id">
          <input type="checkbox" :value="filter.id" :id="filter.id" v-model="localFilters"> {{ filter.label }}
        </label>
      </div>

      <div class="flex justify-between">
        <button @click="reset">Clear all</button>
        <button class="bg-blue-800 text-white rounded-full px-3 py-1" @click="$emit('apply', localFilters)">Apply</button>
      </div>
    </div>
  </div>
</template>