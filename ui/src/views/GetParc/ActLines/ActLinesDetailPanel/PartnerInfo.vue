<template>
  <div class="overview-container m-3 bg-white">
    <div class="overview-item">
      <h4 class="font-weight-normal text-uppercase">
        {{ $t('getparc.actLines.details.partners') }}
      </h4>
    </div>
    <div class="overview-item mr-5">
      <h6>{{ $t('common.lastName') }} :</h6>
      <p>{{ get('party.name') }}</p>
    </div>
    <div class="overview-item mr-5">
      <h6>{{ $t('common.billingAccount') }} :</h6>
      <p>-</p>
    </div>
  </div>
</template>

<script>
import get from 'lodash.get';

export default {
  props: {
    content: {
      type: Object,
    },
  },

  methods: {
    get(path, defaultVal = '') {
      return get(this.content, path, defaultVal);
    },
  },
};
</script>

<style lang="scss" scoped></style>
