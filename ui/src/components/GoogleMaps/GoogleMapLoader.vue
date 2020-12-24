<template>
  <div>
    <div class="google-map" ref="googleMap" :style="cssStyle"></div>
    <template v-if="!!google && !!map">
      <slot :map="map" :google="google" />
    </template>
  </div>
</template>

<script>
export default {
  props: {
    mapConfig: Object,
    cssStyle: {
      type: Object,
      required: false,
    },
  },
  data() {
    return {
      map: undefined,
      google: undefined,
    };
  },

  async mounted() {
    await this.createMap();
  },

  watch: {
    async '$i18n.locale'() {
      await this.reloadGoogleMapScript();
      await this.createMap();
    },
  },

  methods: {
    clearGoogleMapScript() {
      const script = document.getElementById('gmap-src');
      script.parentNode.removeChild(script);
      window.google.maps = undefined;
      delete window.google.maps;
      this.google = undefined;
      this.map = undefined;
    },
    reloadGoogleMapScript() {
      if (window.google && window.google.maps) {
        this.clearGoogleMapScript();
      }
      return new Promise(resolve => {
        const script = document.createElement('script');
        script.type = 'text/javascript';
        script.id = 'gmap-src';
        script.src = `https://maps.googleapis.com/maps/api/js?client=${process.env.VUE_APP_GMAP_CLIENT}&channel=${process.env.VUE_APP_GMAP_CHANNEL}&language=${this.$i18n.locale}`;
        script.async = true;
        script.defer = true;
        script.onload = () => {
          resolve();
        };
        document.body.appendChild(script);
      });
    },
    async createMap() {
      await this.reloadGoogleMapScript();
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
  },
};
</script>

<style lang="scss" scoped>
.google-map {
  width: 100%;
  height: 22.7rem;
}
</style>
