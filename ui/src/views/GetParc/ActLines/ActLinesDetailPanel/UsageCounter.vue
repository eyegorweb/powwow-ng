<template>
  <LoaderContainer :is-loading="isLoading">
    <div slot="on-loading">
      {{ $t('processing') }}...
      <CircleLoader />
    </div>
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
  </LoaderContainer>
</template>

<script>
import get from 'lodash.get';
import UiButton from '@/components/ui/Button';
import LoaderContainer from '@/components/LoaderContainer';
import CircleLoader from '@/components/ui/CircleLoader';
import { formatBytes, formattedValueFromSeconds } from '@/api/utils';
import { fetchCurrentConsumption } from '@/api/linesActions';

export default {
  name: 'UsageCounter',
  components: {
    UiButton,
    LoaderContainer,
    CircleLoader,
  },
  props: {
    content: Object,
  },

  data() {
    return {
      consumption: undefined,
      isLoading: false,
    };
  },

  async mounted() {
    if (this.content && this.content.party && this.content.party.partyType === 'MVNO') {
      this.isLoading = true;
      try {
        this.consumption = await fetchCurrentConsumption({
          simCardInstanceId: this.content.id,
        });
      } catch (e) {
        console.error(e);
      }
      this.isLoading = false;
    }
  },

  methods: {
    openDetail() {
      this.$router.push({
        name: 'lineDetail',
        params: { lineId: '' + this.content.id, tabIndex: 1 },
      });
    },
    getFromContent(path, defaultValue = '') {
      const value = get(this.content, path, defaultValue);
      return value !== null ? value : '';
    },
    getConsumptionData(path, defaultValue = '') {
      const value = get(this.consumption, path, defaultValue);
      return value !== null ? value : '';
    },
  },

  computed: {
    partnerTypeMVNO() {
      return get(this.content, 'party.partyType') === 'MVNO';
    },

    dataField() {
      if (this.partnerTypeMVNO) {
        return formatBytes(parseInt(this.getConsumptionData('dataTotal')));
      } else {
        const counter1DownRounded = get(
          this.content,
          'accessPoint.usageCounter.counter1DownRounded'
        )
          ? Number(get(this.content, 'accessPoint.usageCounter.counter1DownRounded'))
          : 0;
        const counter1UpRounded = get(this.content, 'accessPoint.usageCounter.counter1UpRounded')
          ? Number(get(this.content, 'accessPoint.usageCounter.counter1UpRounded'))
          : 0;
        return formatBytes(counter1DownRounded + counter1UpRounded);
      }
    },

    smsField() {
      if (this.partnerTypeMVNO) {
        return this.getConsumptionData('smsTotal');
      } else {
        const counter2DownRounded = get(
          this.content,
          'accessPoint.usageCounter.counter2DownRounded'
        )
          ? Number(get(this.content, 'accessPoint.usageCounter.counter2DownRounded'))
          : 0;
        const counter2UpRounded = get(this.content, 'accessPoint.usageCounter.counter2UpRounded')
          ? Number(get(this.content, 'accessPoint.usageCounter.counter2UpRounded'))
          : 0;
        return counter2DownRounded + counter2UpRounded;
      }
    },

    voiceField() {
      if (this.partnerTypeMVNO) {
        return formattedValueFromSeconds(this.getConsumptionData('voiceTotal'));
      } else {
        const counter3DownRounded = get(
          this.content,
          'accessPoint.usageCounter.counter3DownRounded'
        )
          ? Number(get(this.content, 'accessPoint.usageCounter.counter3DownRounded'))
          : 0;
        const counter3UpRounded = get(this.content, 'accessPoint.usageCounter.counter3UpRounded')
          ? Number(get(this.content, 'accessPoint.usageCounter.counter3UpRounded'))
          : 0;
        return formattedValueFromSeconds(counter3DownRounded + counter3UpRounded);
      }
    },
  },
};
</script>

<style lang="scss" scoped></style>
