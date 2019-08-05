<template>
  <div class="d-flex justify-content-between">
    <div>
      <p>Data : {{ dataField }}</p>
      <p>{{ $t('getparc.actLines.col.voice') }} : {{ voiceField }}</p>
      <p>Sms : {{ smsField }}</p>
    </div>
    <UiButton @click="openDetail" class="btn btn-outline-primary">
      {{ $t('getparc.actLines.col.UsageCounterBtn') }}
    </UiButton>
  </div>
</template>

<script>
import get from 'lodash.get';
import UiButton from '@/components/ui/Button';

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
      console.log('openDetail');
    },
  },
  computed: {
    dataField() {
      const counter1DownRounded = get('accessPoint.usageCounter.counter1DownRounded')
        ? Number(get('accessPoint.usageCounter.counter1DownRounded'))
        : '';
      const counter1UpRounded = get('accessPoint.usageCounter.counter1UpRounded')
        ? Number(get('accessPoint.usageCounter.counter1UpRounded'))
        : '';
      return counter1DownRounded + counter1UpRounded;
    },
    voiceField() {
      const counter2DownRounded = get('accessPoint.usageCounter.counter2DownRounded')
        ? Number(get('accessPoint.usageCounter.counter1DownRounded'))
        : '';
      const counter2UpRounded = get('accessPoint.usageCounter.counter2UpRounded')
        ? Number(get('accessPoint.usageCounter.counter2UpRounded'))
        : '';
      return counter2DownRounded + counter2UpRounded;
    },
    smsField() {
      const counter3DownRounded = get('accessPoint.usageCounter.counter3DownRounded')
        ? Number(get('accessPoint.usageCounter.counter3DownRounded'))
        : '';
      const counter3UpRounded = get('accessPoint.usageCounter.counter3UpRounded')
        ? Number(get('accessPoint.usageCounter.counter3UpRounded'))
        : '';
      return counter3DownRounded + counter3UpRounded;
    },
  },
};
</script>

<style lang="scss" scoped></style>
