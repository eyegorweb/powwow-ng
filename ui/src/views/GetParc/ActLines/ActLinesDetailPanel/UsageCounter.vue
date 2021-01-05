<template>
  <div v-if="partnerTypeMVNO">
    <div v-if="consumption" class="d-flex justify-content-between">
      <div>
        <p>Data: {{ dataField }}</p>
        <p>{{ $t('getparc.actLines.col.voice') }}: {{ voiceField }}</p>
        <p>Sms: {{ smsField }}</p>
      </div>
      <UiButton @click="openDetail" class="btn btn-outline-primary">{{
        $t('getparc.actLines.col.UsageCounterBtn')
      }}</UiButton>
    </div>
    <div v-else>-</div>
  </div>
  <div v-else class="d-flex justify-content-between">
    <div>
      <p>Data : {{ dataField }}</p>
      <p>{{ $t('getparc.actLines.col.voice') }} : {{ voiceField }}</p>
      <p>Sms : {{ smsField }}</p>
    </div>
    <UiButton @click="openDetail" class="btn btn-outline-primary">{{
      $t('getparc.actLines.col.UsageCounterBtn')
    }}</UiButton>
  </div>
</template>

<script>
import get from 'lodash.get';
import UiButton from '@/components/ui/Button';
import { formatBytes, formattedValueFromSeconds } from '@/api/utils';
import { fetchCurrentConsumption } from '@/api/linesActions';

export default {
  name: 'UsageCounter',
  components: {
    UiButton,
  },
  props: {
    row: Object,
  },

  data() {
    return {
      consumption: undefined,
    };
  },

  async mounted() {
    if (this.row.party.partyType === 'MVNO') {
      this.consumption = await fetchCurrentConsumption({
        simCardInstanceId: this.row.id,
      });
    }
  },

  methods: {
    openDetail() {
      this.$router.push({
        name: 'lineDetail',
        params: { lineId: '' + this.row.id, tabIndex: 1 },
      });
    },
    getFromContent(path, defaultValue = '') {
      const value = get(this.row, path, defaultValue);
      return value !== null ? value : '';
    },
    getConsumptionData(path, defaultValue = '') {
      const value = get(this.consumption, path, defaultValue);
      return value !== null ? value : '';
    },
  },

  watch: {
    async row() {
      if (this.row.party.partyType === 'MVNO') {
        this.consumption = await fetchCurrentConsumption({
          simCardInstanceId: this.row.id,
        });
      }
    },
  },

  computed: {
    partnerTypeMVNO() {
      return get(this.row, 'party.partyType') === 'MVNO';
    },

    dataField() {
      if (this.partnerTypeMVNO) {
        return formatBytes(parseInt(this.getConsumptionData('dataTotal')));
      } else {
        const counter1DownRounded = get(this.row, 'accessPoint.usageCounter.counter1DownRounded')
          ? Number(get(this.row, 'accessPoint.usageCounter.counter1DownRounded'))
          : 0;
        const counter1UpRounded = get(this.row, 'accessPoint.usageCounter.counter1UpRounded')
          ? Number(get(this.row, 'accessPoint.usageCounter.counter1UpRounded'))
          : 0;
        return formatBytes(counter1DownRounded + counter1UpRounded);
      }
    },

    smsField() {
      if (this.partnerTypeMVNO) {
        return this.getConsumptionData('smsTotal');
      } else {
        const counter2DownRounded = get(this.row, 'accessPoint.usageCounter.counter2DownRounded')
          ? Number(get(this.row, 'accessPoint.usageCounter.counter2DownRounded'))
          : 0;
        const counter2UpRounded = get(this.row, 'accessPoint.usageCounter.counter2UpRounded')
          ? Number(get(this.row, 'accessPoint.usageCounter.counter2UpRounded'))
          : 0;
        return counter2DownRounded + counter2UpRounded;
      }
    },

    voiceField() {
      if (this.partnerTypeMVNO) {
        return formattedValueFromSeconds(this.getConsumptionData('voiceTotal'));
      } else {
        const counter3DownRounded = get(this.row, 'accessPoint.usageCounter.counter3DownRounded')
          ? Number(get(this.row, 'accessPoint.usageCounter.counter3DownRounded'))
          : 0;
        const counter3UpRounded = get(this.row, 'accessPoint.usageCounter.counter3UpRounded')
          ? Number(get(this.row, 'accessPoint.usageCounter.counter3UpRounded'))
          : 0;
        return formattedValueFromSeconds(counter3DownRounded + counter3UpRounded);
      }
    },
  },
};
</script>

<style lang="scss" scoped></style>
