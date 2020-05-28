<template>
  <div class="map-container">
    <GoogleMapLoader :map-config="mapConfig" :css-style="cssStyle">
      <template slot-scope="{ google, map }">
        <MapContent
          :google="google"
          :map="map"
          :applied-filters="appliedFilters"
          :usage="usage"
          :loading.sync="loading"
        />
      </template>
    </GoogleMapLoader>
    <div v-if="loading" class="backdrop"></div>
  </div>
</template>

<script>
import GoogleMapLoader from '@/components/GoogleMaps/GoogleMapLoader.vue';
import MapContent from './MapContent';

export default {
  components: {
    GoogleMapLoader,
    MapContent,
  },

  props: {
    appliedFilters: Array,
    usage: String,
  },

  data() {
    return {
      loading: false,
    };
  },

  computed: {
    cssStyle() {
      return {
        width: '100%',
        height: '50rem',
        position: 'relative',
        overflow: 'hidden',
      };
    },
    mapConfig() {
      return {
        center: {
          lat: 30.51,
          lng: 18.52,
        },
        mapTypeId: 'roadmap',
        zoom: 2,
        zoomControl: true,
        draggable: true,
      };
    },
  },
};
</script>

<style lang="scss" scoped>
.backdrop {
  background: rgba(0, 0, 0, 0.6);
  width: 100%;
  height: 100%;
  position: fixed;
  top: 0;
  left: 0;
  z-index: 5;
}

.map-container {
  position: relative;
  overflow: hidden;
}
</style>
