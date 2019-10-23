<template>
  <GoogleMapLoader :map-config="mapConfig">
    <template slot-scope="{ google, map }">
      <MapMarker
        :key="m.id"
        v-for="m in formattedMarkers"
        :google="google"
        :map="map"
        :position="m.position"
      ></MapMarker>
    </template>
  </GoogleMapLoader>
</template>

<script>
import GoogleMapLoader from './GoogleMapLoader';
import MapMarker from './MapMarker';
import uuid from 'uuid/v1';

export default {
  components: {
    MapMarker,
    GoogleMapLoader,
  },
  props: {
    markers: Array,
  },
  computed: {
    mapConfig() {
      return {
        center: {
          lat: 46.8989,
          lng: 2.3522,
        },
        zoom: this.zoomLevel,
      };
    },
    formattedMarkers() {
      if (!this.markers) return;
      return this.markers.map(m => {
        return {
          id: uuid(),
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
