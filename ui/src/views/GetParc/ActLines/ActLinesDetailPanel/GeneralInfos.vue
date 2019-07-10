<template>
  <div class="overview-container m-3 bg-white">
    <div class="overview-item">
      <h4 class="font-weight-normal text-uppercase">
        {{ $t('orders.detail.information') }}
      </h4>
    </div>
    <div class="overview-item mr-5">
      <h6>{{ $t('getparc.actDetail.col.iccid') }}:</h6>
      <p>{{ get('iccid') }}</p>
    </div>
    <div class="overview-item mr-5">
      <h6>{{ $t('getparc.actLines.col.manufacturer') }} :</h6>
      <p>{{ get('deviceInstance.manufacturer') }}</p>
    </div>
    <div class="overview-item mr-5">
      <h6>{{ $t('getparc.actLines.col.commercialRef') }} :</h6>
      <p>{{ get('deviceInstance.deviceReference') }}</p>
    </div>
    <div class="overview-item mr-5">
      <h6>{{ $t('getparc.actLines.col.offer') }} :</h6>
      <p>{{ get('accessPoint.offer.marketingOffer.description') }}</p>
    </div>
    <div class="overview-item mr-5">
      <h6>{{ $t('getparc.actLines.col.lineStatus') }} :</h6>
      <p>
        <SimStatusCell :row="content" />
      </p>
    </div>
    <div class="overview-item mr-5">
      <h6>{{ $t('getparc.actLines.col.lineStatus') }} :</h6>
      <p>-</p>
    </div>
    <div class="overview-item mr-5">
      <h6>{{ $t('getparc.actLines.col.billingStatus') }} :</h6>
      <p>-</p>
    </div>
    <div class="overview-item mr-5">
      <h6>{{ $t('getparc.actLines.col.currentSynthesis') }} :</h6>
      <p>-</p>
    </div>
    <div v-if="get('accessPoint.customFields.custom1')" class="overview-item mr-5">
      <h6>{{ $t('col.customFields', { num: 1 }) }} :</h6>
      <p>{{ get('accessPoint.customFields.custom1') }}</p>
    </div>
    <div v-if="get('accessPoint.customFields.custom2')" class="overview-item mr-5">
      <h6>{{ $t('col.customFields', { num: 2 }) }} :</h6>
      <p>{{ get('accessPoint.customFields.custom2') }}</p>
    </div>
    <div v-if="get('accessPoint.customFields.custom3')" class="overview-item mr-5">
      <h6>{{ $t('col.customFields', { num: 3 }) }} :</h6>
      <p>{{ get('accessPoint.customFields.custom3') }}</p>
    </div>
    <div v-if="get('accessPoint.customFields.custom4')" class="overview-item mr-5">
      <h6>{{ $t('col.customFields', { num: 4 }) }} :</h6>
      <p>{{ get('accessPoint.customFields.custom4') }}</p>
    </div>
    <div v-if="get('accessPoint.customFields.custom5')" class="overview-item mr-5">
      <h6>{{ $t('col.customFields', { num: 5 }) }} :</h6>
      <p>{{ get('accessPoint.customFields.custom5') }}</p>
    </div>
    <div v-if="get('accessPoint.customFields.custom6')" class="overview-item mr-5">
      <h6>{{ $t('col.customFields', { num: 6 }) }} :</h6>
      <p>{{ get('accessPoint.customFields.custom6') }}</p>
    </div>
  </div>
</template>

<script>
import get from 'lodash.get';
import SimStatusCell from '@/views/GetParc/ActLines/LinesTable/SimStatusCell';

export default {
  components: {
    SimStatusCell,
  },
  props: {
    content: {
      type: Object,
    },
  },

  methods: {
    get(path, defaultVal = '-') {
      return get(this.content, path, defaultVal);
    },
  },
};
</script>

<style lang="scss" scoped></style>
