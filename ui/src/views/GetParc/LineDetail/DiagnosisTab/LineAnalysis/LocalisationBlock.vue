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
        <SimpleMap :markers="markers" />
      </div>
    </div>
    <div class="row mt-2">
      <div class="col">
        <a
          class="btn btn-block btn-outline-primary"
          target="_blank"
          href="https://www.bouyguestelecom.fr/reseau/cartes-de-couverture-reseau-mobile"
          >{{ $t('getparc.lineDetail.tab3.networkCoverage') }}</a
        >
      </div>
      <div class="col">
        <a
          target="_blank"
          href="https://valid-supportexploitation.bouyguestelecom-entreprises.fr"
          class="btn btn-block btn-outline-primary"
          >{{ $t('getparc.lineDetail.tab3.networkMeteo') }}</a
        >
      </div>
    </div>
  </div>
</template>

<script>
import CircleLoader from '@/components/ui/CircleLoader';
import SimpleMap from '@/components/SimpleMap';

export default {
  props: {
    data: Object,
    loading: Boolean,
  },
  components: {
    CircleLoader,
    SimpleMap,
  },

  computed: {
    markers() {
      if (!this.data) {
        return;
      }
      return [{ latitude: this.data.latitude, longitude: this.data.longitude }];
    },
  },
};
</script>

<style lang="scss" scoped></style>
