<template>
  <CheckMarkText :state="checkState" :no-check="noCheck">
    <template>
      <ul class="list-unstyled m-0">
        <li class="font-weight-bold">{{ $t(label) }}</li>
        <li v-if="isOK" class="subTitle">Lat.: {{ latitude }} - Lon.: {{ longitude }}</li>
        <li v-if="isOkRoaming" class="subTitle">
          {{ $t('getparc.lineDetail.tab3.localisation.errors.PT03-LOC_DER10501') }}
        </li>
        <li v-if="isKO" class="subTitle">{{ errorTxt }}</li>
        <li v-if="isKOTimeout" class="subTitle">Timeout</li>
        <li v-if="isWaiting" class="subTitle">
          {{ $t('getparc.lineDetail.tab3.localisation.errors.WAITING') }}
        </li>
        <li v-if="isCancelled" class="subTitle">
          {{ $t('getparc.lineDetail.tab3.localisation.errors.CANCELLED') }}
        </li>
      </ul>
    </template>
  </CheckMarkText>
</template>

<script>
import CheckMarkText from '@/components/CheckMarkText';

export default {
  components: {
    CheckMarkText,
  },
  props: {
    act: Object,
  },
  data() {
    return {
      latitude: undefined,
      longitude: undefined,
    };
  },
  mounted() {
    if (this.act.geoloc && this.act.geoloc !== 'null') {
      const parts = this.act.geoloc.split(',');
      this.latitude = parts[0] !== 'null' ? parseFloat(parts[0]).toFixed(2) : '-';
      this.longitude = parts[1] !== 'null' ? parseFloat(parts[1]).toFixed(2) : '-';
    }
  },
  computed: {
    errorTxt() {
      const availableErrors = [
        'PT03-LOC_DER10005',
        'PT03-LOC_DER10006',
        'PT03-LOC_DER10003',
        'PT03-LOC_DER10004',
        'PT03-LOC_DER10601',
        'PT03-LOC_DER10602',
        'PT03-LOC_DER10007',
        'PT03-LOC_DER10500',
      ];
      if (!availableErrors.find(e => e === this.errorCode)) {
        return this.$t('getparc.lineDetail.tab3.localisation.errors.generic', {
          errorCode: this.errorCode,
        });
      }
      return this.$t('getparc.lineDetail.tab3.localisation.errors.' + this.errorCode);
    },
    status() {
      return this.act.unitAction.status;
    },
    errorCode() {
      return this.act.unitAction.errorCode;
    },
    isOkRoaming() {
      return this.status === 'OK' && this.errorCode === 'PT03-LOC_DER10501';
    },
    isOK() {
      return this.status === 'OK' && !this.errorCode;
    },
    isKO() {
      return this.status === 'OK' && this.errorCode && this.errorCode !== 'PT03-LOC_DER10501';
    },
    isKOTimeout() {
      return this.status === 'KO';
    },
    isCancelled() {
      return this.status === 'CANCELLED';
    },
    isWaiting() {
      return !!['WAITING', 'SENT', 'IN_PROGRESS', 'REPLAYED'].find(i => i === this.status);
    },
    label() {
      if (this.isOK) {
        return 'getparc.lineDetail.tab3.statuses.TEST_OK';
      }
      if (this.isOkRoaming) {
        return 'getparc.lineDetail.tab3.statuses.TEST_OK';
      }
      if (this.isWaiting) {
        return '';
      }
      return 'getparc.lineDetail.tab3.statuses.TEST_KO';
    },
    checkState() {
      if (this.label === 'getparc.lineDetail.tab3.statuses.TEST_KO') {
        return 'ERROR';
      }
      return 'SUCCESS';
    },

    noCheck() {
      return this.isKOTimeout || this.isCancelled || this.isWaiting;
    },
  },
};
</script>

<style lang="scss" scoped>
.subTitle {
  color: $gray;
}
li {
  max-width: 18rem;
}
</style>
