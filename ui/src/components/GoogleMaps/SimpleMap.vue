<template>
  <div v-if="showMap">
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
  </div>
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
    zoomControl: Boolean,
    zoom: {
      type: Number,
      required: false,
    },
    maxZoom: {
      type: Number,
      required: false,
    },
    center: {
      type: Object,
      required: false,
      default: () => {
        return {
          lat: 46.8989,
          lng: 2.3522,
        };
      },
    },
  },
  data() {
    return {
      showMap: false,
    };
  },
  mounted() {
    this.showMap = true;
    setTimeout(() => {}, 500);
  },
  computed: {
    mapCenter() {
      if (!this.center.lat) {
        return {
          lat: this.center.latitude,
          lng: this.center.longitude,
        };
      }

      return this.center;
    },
    mapConfig() {
      const config = {
        center: this.mapCenter,
        zoom: this.zoomLevel,
        zoomControl: this.zoomControl,
      };

      if (this.maxZoom) {
        config.maxZoom = this.maxZoom;
      }
      return config;
    },
    formattedMarkers() {
      if (!this.markers) return;
      return this.markers.map((m) => {
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
      if (this.zoom) {
        return this.zoom;
      }
      return this.defaultZoomLevel;
    },
    defaultZoomLevel() {
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
