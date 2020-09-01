<template>
  <div class="d-flex justify-content-between">
    <div>
      <p>Data : {{ formatBytes(dataField) }}</p>
      <p>{{ $t('getparc.actLines.col.voice') }} : {{ formattedValueFromSeconds(voiceField) }}</p>
      <p>Sms : {{ smsField }}</p>
    </div>
    <UiButton
      @click="openDetail"
      class="btn btn-outline-primary"
    >{{ $t('getparc.actLines.col.UsageCounterBtn') }}</UiButton>
  </div>
</template>

<script>
import get from 'lodash.get';
import UiButton from '@/components/ui/Button';
import { formatBytes, formattedValueFromSeconds } from '@/api/utils';

export default {
  name: 'UsageCounter',
  components: {
    UiButton,
  },
  props: {
    row: Object,
  },
  methods: {
    openDetail() {
      this.$router.push({
        name: 'lineDetail',
        params: { lineId: '' + this.row.id, tabIndex: 1 },
      });
    },
    formatBytes(value) {
      return formatBytes(value);
    },
    formattedValueFromSeconds(value) {
      return formattedValueFromSeconds(value);
    },
  },
  computed: {
    dataField() {
      const counter1DownRounded = get(this.row, 'accessPoint.usageCounter.counter1DownRounded')
        ? Number(get(this.row, 'accessPoint.usageCounter.counter1DownRounded'))
        : 0;
      const counter1UpRounded = get(this.row, 'accessPoint.usageCounter.counter1UpRounded')
        ? Number(get(this.row, 'accessPoint.usageCounter.counter1UpRounded'))
        : 0;
      return counter1DownRounded + counter1UpRounded;
    },
    smsField() {
      const counter2DownRounded = get(this.row, 'accessPoint.usageCounter.counter2DownRounded')
        ? Number(get(this.row, 'accessPoint.usageCounter.counter1DownRounded'))
        : 0;
      const counter2UpRounded = get(this.row, 'accessPoint.usageCounter.counter2UpRounded')
        ? Number(get(this.row, 'accessPoint.usageCounter.counter2UpRounded'))
        : 0;
      return counter2DownRounded + counter2UpRounded;
    },
    voiceField() {
      const counter3DownRounded = get(this.row, 'accessPoint.usageCounter.counter3DownRounded')
        ? Number(get(this.row, 'accessPoint.usageCounter.counter3DownRounded'))
        : 0;
      const counter3UpRounded = get(this.row, 'accessPoint.usageCounter.counter3UpRounded')
        ? Number(get(this.row, 'accessPoint.usageCounter.counter3UpRounded'))
        : 0;
      return counter3DownRounded + counter3UpRounded;
    },
  },
};
</script>

<style lang="scss" scoped></style>
