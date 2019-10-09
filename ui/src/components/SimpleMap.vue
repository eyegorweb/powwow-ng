<template>
  <GoogleMap
    :center="center"
    :zoom="zoomLevel"
    map-type-id="roadmap"
    style="width: 100%; height: 22.7rem"
    :options="{
      zoomControl: false,
      mapTypeControl: false,
      scaleControl: false,
      streetViewControl: false,
      rotateControl: false,
      fullscreenControl: false,
      disableDefaultUi: false,
      draggable: false,
    }"
  >
    <GMarker
      :key="m.id"
      v-for="m in formattedMarkers"
      :position="m.position"
      :clickable="true"
      :draggable="true"
      @click="center = m.position"
    ></GMarker>
  </GoogleMap>
</template>

<script>
import { Map as GoogleMap, Marker as GMarker } from 'vue2-google-maps';

export default {
  components: {
    GoogleMap,
    GMarker,
  },
  props: {
    markers: {
      type: Array,
    },
  },
  data() {
    return {
      center: {
        lat: 46.8989,
        lng: 2.3522,
      },
    };
  },
  computed: {
    formattedMarkers() {
      if (!this.markers) return;
      return this.markers.map(m => {
        return {
          id: 0,
          position: {
            lat: m.latitude,
            lng: m.longitude,
          },
        };
      });
    },
    zoomLevel() {
      if (window.innerWidth <= 1024) {
        return 4.6;
      }
      if (window.innerWidth > 1024 && window.innerWidth <= 1366) {
        return 4.6;
      }
      return 5;
    },
  },
};
</script>

<style lang="scss" scoped></style>
