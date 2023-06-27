<script setup lang="ts">
import { computed, ref } from 'vue'
import { GoogleMap } from 'vue3-google-map'

const props = defineProps({
  lat: {
    type: Number,
    required: true,
  },
  lng: {
    type: Number,
    required: true,
  }
})

const center = computed(() => ({ lat: props.lat, lng: props.lng }))
</script>

<template>
  <GoogleMap api-key="AIzaSyCgObvklYJ0PBIfkmWKKCTuK28ghXfjymk" style="width: 100%; height: 500px" :center="center" :zoom="15">
    <!-- <Marker :options="{ position: center }" /> -->
  </GoogleMap>
</template>