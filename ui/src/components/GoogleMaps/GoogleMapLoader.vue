<template>
  <div>
    <div class="google-map" ref="googleMap"></div>
    <template v-if="!!google && !!map">
      <slot :map="map" :google="google" />
    </template>
  </div>
</template>

<script>
export default {
  props: {
    mapConfig: Object,
  },
  data() {
    return {
      map: undefined,
      google: undefined,
    };
  },

  async mounted() {
    const mapContainer = this.$refs.googleMap;
    this.google = window.google;
    try {
      const defaultOptions = {
        center: new this.google.maps.LatLng(51.508742, -0.12085),
        zoomControl: false,
        mapTypeControl: false,
        scaleControl: false,
        streetViewControl: false,
        rotateControl: false,
        fullscreenControl: false,
        disableDefaultUi: false,
        draggable: false,
        zoom: 5,
      };

      this.map = new this.google.maps.Map(mapContainer, {
        ...defaultOptions,
        ...(this.mapConfig || {}),
      });
    } catch (e) {
      console.log(e);
    }
  },
};
</script>

<style lang="scss" scoped>
.google-map {
  width: 100%;
  height: 22.7rem;
}
</style>
