<template>
  <div class="map-container" :class="{ hidden: !visible }">
    <GoogleMapLoader :map-config="mapConfig" :css-style="cssStyle">
      <template slot-scope="{ google, map }">
        <MapContent
          :google="google"
          :map="map"
          :applied-filters="appliedFilters"
          :usage="usage"
          :loading.sync="loading"
          @activeClick="$emit('activeClick', $event)"
          @passiveClick="$emit('passiveClick', $event)"
          @cockpitClick="$emit('cockpitClick', $event)"
          @centeredCountry="$emit('centeredCountry', $event)"
        />
      </template>
    </GoogleMapLoader>
    <LoaderBackdrop :loading="loading" />
  </div>
</template>

<script>
import GoogleMapLoader from '@/components/GoogleMaps/GoogleMapLoader.vue';
import MapContent from './MapContent';
import LoaderBackdrop from '@/components/LoaderBackdrop.vue';

export default {
  components: {
    GoogleMapLoader,
    MapContent,
    LoaderBackdrop,
  },

  props: {
    appliedFilters: Array,
    usage: String,
    visible: Boolean,
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
.map-container {
  position: relative;
  overflow: hidden;
}
</style>
