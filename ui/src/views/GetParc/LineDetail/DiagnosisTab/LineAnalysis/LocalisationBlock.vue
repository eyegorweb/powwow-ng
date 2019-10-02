<template>
  <div class="bg-white p-2">
    <button
      class="modal-default-button btn btn-light btn-sm ml-1"
      style="width: 100%; height: 22.7rem"
      disabled
      v-if="loading"
    >
      {{ $t('loading') }}
      <CircleLoader />
    </button>
    <div v-else class="row">
      <div class="col">
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
            v-for="m in markers"
            :position="m.position"
            :clickable="true"
            :draggable="true"
            @click="center = m.position"
          ></GMarker>
        </GoogleMap>
      </div>
    </div>
    <div class="row mt-2">
      <div class="col">
        <button class="btn btn-block btn-outline-primary">Couverture du réseau</button>
      </div>
      <div class="col">
        <button class="btn btn-block btn-outline-primary">Météo du réseau</button>
      </div>
    </div>
  </div>
</template>

<script>
import { Map as GoogleMap, Marker as GMarker } from 'vue2-google-maps';
import CircleLoader from '@/components/ui/CircleLoader';

export default {
  props: {
    data: Object,
    loading: Boolean,
  },
  components: {
    GoogleMap,
    GMarker,
    CircleLoader,
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
    markers() {
      if (!this.data) return;
      if (this.data.latitude && this.data.longitude) {
        return [
          {
            id: 0,
            position: {
              lat: this.data.latitude,
              lng: this.data.longitude,
            },
          },
        ];
      }

      return undefined;
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
