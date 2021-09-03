<template>
  <div>
    <ul class="list-unstyled" :class="{ 'hover-pointer': canShowMap }" @click="showMap()">
      <li>{{ $loGet(geographicalLocation, 'geographicCoordinatesDTO.label') }}</li>
      <li v-if="$loGet(geographicalLocation, 'geographicCoordinatesDTO.address')">
        {{ $loGet(geographicalLocation, 'geographicCoordinatesDTO.address') }}
      </li>
    </ul>

    <Modal v-if="showModal">
      <div slot="body">
        <SimpleMap
          :markers="markers"
          :center="center"
          :zoom="zoom"
          :maxZoom="maxZoom"
          :zoomControl="canZoom"
        />
      </div>
      <div slot="footer">
        <button class="modal-default-button btn btn-danger btn-sm" @click.stop="closeModal">
          {{ $t('close') }}
        </button>
      </div>
    </Modal>
  </div>
</template>

<script>
import SimpleMap from '@/components/GoogleMaps/SimpleMap';
import Modal from '@/components/Modal';

export default {
  components: {
    SimpleMap,
    Modal,
  },
  props: {
    geographicalLocation: Object,
  },

  data() {
    return {
      showModal: false,
    };
  },

  methods: {
    showMap() {
      if (this.canShowMap) this.showModal = true;
    },

    closeModal() {
      this.showModal = false;
    },
  },

  computed: {
    canZoom() {
      return !!this.maxZoom;
    },
    zoom() {
      return parseInt(this.$loGet(this.geographicalLocation, 'geographicCoordinatesDTO.zoomLevel'));
    },
    maxZoom() {
      return parseInt(this.$loGet(this.geographicalLocation, 'geographicCoordinatesDTO.maxLevel'));
    },
    center() {
      return {
        latitude: parseFloat(
          this.$loGet(this.geographicalLocation, 'geographicCoordinatesDTO.latitude')
        ),
        longitude: parseFloat(
          this.$loGet(this.geographicalLocation, 'geographicCoordinatesDTO.longitude')
        ),
      };
    },
    markers() {
      return [this.center];
    },
    canShowMap() {
      return (
        !!this.$loGet(this.geographicalLocation, 'geographicCoordinatesDTO.latitude') &&
        !!this.$loGet(this.geographicalLocation, 'geographicCoordinatesDTO.longitude')
      );
    },
  },
};
</script>

<style lang="scss" scoped>
</style>
