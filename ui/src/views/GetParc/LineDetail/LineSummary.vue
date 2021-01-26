<template>
  <div class="row mb-4">
    <div class="col">
      <div class="bg-white p-4 rounded">
        <div class="d-flex">
          <div class="item">
            <h6>{{ $t('getparc.lineDetail.offer') }}:</h6>
            <p><LineOffer :line="content" /></p>
          </div>
          <div class="item">
            <h6>{{ $t('getparc.lineDetail.lineStatus') }}:</h6>
            <p class="text-success">{{ content.statusTranslated }}</p>
          </div>
          <div class="item" v-if="!partnerTypeMVNO">
            <h6>{{ $t('getparc.lineDetail.triggeredAlarms') }}:</h6>
            <p v-if="alarmTriggered" class="text-success">{{ $t('common.YES') }}</p>
            <p v-if="!alarmTriggered" class="text-danger">{{ $t('common.NO') }}</p>
          </div>
        </div>
        <hr />
        <div class="d-flex">
          <div class="item">
            <h6>{{ $t('getparc.actDetail.col.iccid') }}:</h6>
            <p>{{ getFromContent('iccid') }}</p>
          </div>
          <div class="item" v-if="!partnerTypeMVNO">
            <h6>{{ $t('getparc.lineDetail.manufacturer') }}:</h6>
            <p>{{ getFromContent('deviceInstance.manufacturer') }}</p>
          </div>
          <div class="item" v-if="!partnerTypeMVNO">
            <h6>{{ $t('getparc.lineDetail.model') }}:</h6>
            <p>{{ getFromContent('deviceInstance.deviceReference') }}</p>
          </div>
        </div>
      </div>
    </div>
    <div class="col">
      <div v-if="partnerTypeMVNO">
        <LoaderContainer :is-loading="isLoading">
          <div slot="on-loading">
            {{ $t('processing') }}...
            <CircleLoader />
          </div>
          <div class="d-flex bg-white p-4 rounded">
            <div class="item">
              <h6>{{ $t('getparc.lineDetail.consummated.data') }}:</h6>
              <p>
                {{ dataConso }}
              </p>
            </div>
            <div class="item">
              <h6>{{ $t('getparc.lineDetail.consummated.sms') }}:</h6>
              <p>
                {{ smsConso }}
              </p>
            </div>
            <div class="item">
              <h6>{{ $t('getparc.lineDetail.consummated.voice') }}:</h6>
              <p>
                {{ voiceConso }}
              </p>
            </div>
          </div>
        </LoaderContainer>
      </div>

      <div v-else class="bg-white p-4 rounded">
        <div class="d-flex">
          <div class="item">
            <h6>{{ $t('getparc.lineDetail.consummated.data') }}:</h6>
            <p>
              <!-- total DATA consommée -->
              {{ fetchUsageCounter('DATA', 'used') }}
            </p>
          </div>
          <div class="item">
            <h6>{{ $t('getparc.lineDetail.consummated.sms') }}:</h6>
            <p>
              <!-- total SMS consommés -->
              {{ fetchUsageCounter('SMS', 'used') }}
            </p>
          </div>
          <div class="item">
            <h6>{{ $t('getparc.lineDetail.consummated.voice') }}:</h6>
            <p>
              <!-- total VOIX consommée -->
              {{ fetchUsageCounter('VOICE', 'used') }}
            </p>
          </div>
        </div>
        <hr />
        <div class="d-flex">
          <div class="item">
            <h6>{{ $t('getparc.lineDetail.estimated.data') }}:</h6>
            <p>
              <!-- prévisionnel DATA  -->
              {{ fetchUsageCounter('DATA') }}
            </p>
          </div>
          <div class="item">
            <h6>{{ $t('getparc.lineDetail.estimated.sms') }}:</h6>
            <p>
              <!-- prévisionnel SMS  -->
              {{ fetchUsageCounter('SMS') }}
            </p>
          </div>
          <div class="item">
            <h6>{{ $t('getparc.lineDetail.estimated.voice') }}:</h6>
            <p>
              <!-- prévisionnel VOIX  -->
              {{ fetchUsageCounter('VOICE') }}
            </p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import LineOffer from '@/views/GetParc/ActLines/LineOffer.vue';
import LoaderContainer from '@/components/LoaderContainer';
import CircleLoader from '@/components/ui/CircleLoader';
import get from 'lodash.get';
import { formatBytes, resumeFormattedValueFromSeconds } from '@/api/utils';
import moment from 'moment';
import { fetchAlarmsWithInfos } from '@/api/alarms';
import { fetchCurrentConsumption } from '@/api/linesActions';

export default {
  components: {
    LineOffer,
    LoaderContainer,
    CircleLoader,
  },
  async mounted() {
    this.fetchAlarms();
    this.fetchConsumptionData();
  },
  props: {
    content: Object,
  },
  data() {
    return {
      alarmTriggered: false,
      consumption: undefined,
      totalDefault: 0,
      isLoading: false,
    };
  },
  computed: {
    partnerTypeMVNO() {
      return get(this.content, 'party.partyType') === 'MVNO';
    },
    dataConso() {
      if (this.consumption) {
        return formatBytes(parseInt(this.consumption.dataTotal));
      }
      return this.totalDefault;
    },
    smsConso() {
      if (this.consumption) {
        return this.consumption.smsTotal;
      }
      return this.totalDefault;
    },
    voiceConso() {
      if (this.consumption) {
        return resumeFormattedValueFromSeconds(parseInt(this.consumption.voiceTotal));
      }
      return this.totalDefault;
    },
  },
  methods: {
    getFromContent(path, defaultValue = '') {
      const value = get(this.content, path, defaultValue);
      return value !== null ? value : defaultValue;
    },

    async fetchConsumptionData() {
      if (this.partnerTypeMVNO) {
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

    async fetchAlarms() {
      const response = await fetchAlarmsWithInfos(this.content.id);
      if (!response || !response.lenth) return;
      this.alarmTriggered = response[0].isTriggered;
    },

    fetchUsageCounter(type, mode) {
      let usedTotal,
        estimatedTotal,
        nationalIncomingTotal,
        nationalOutgoingTotal,
        nationalTotal,
        internationalIncomingTotal,
        internationalOutgoingTotal,
        internationalTotal;
      const daysInMonth = moment().daysInMonth();
      const pastDays = moment().date();

      switch (type) {
        case 'DATA':
          // Nationales
          // total entrantes
          nationalIncomingTotal =
            this.getFromContent('accessPoint.usageCounter.counter1DownRounded') -
            this.getFromContent('accessPoint.usageCounter.counter1DownRoamingRounded');
          // total sortantes
          nationalOutgoingTotal =
            this.getFromContent('accessPoint.usageCounter.counter1UpRounded') -
            this.getFromContent('accessPoint.usageCounter.counter1UpRoamingRounded');
          // total national
          nationalTotal = nationalIncomingTotal + nationalOutgoingTotal;
          // Internationales
          // total entrantes
          internationalIncomingTotal = this.getFromContent(
            'accessPoint.usageCounter.counter1DownRoamingRounded'
          );
          // total sortantes
          internationalOutgoingTotal = this.getFromContent(
            'accessPoint.usageCounter.counter1UpRoamingRounded'
          );
          // total international
          internationalTotal = internationalIncomingTotal + internationalOutgoingTotal;
          // total
          usedTotal = formatBytes(parseInt(nationalTotal + internationalTotal));
          estimatedTotal = formatBytes(
            parseInt((daysInMonth * (nationalTotal + internationalTotal)) / pastDays)
          );
          break;
        case 'SMS':
          // Nationales
          // total entrantes
          nationalIncomingTotal =
            this.getFromContent('accessPoint.usageCounter.counter2DownRounded') -
            this.getFromContent('accessPoint.usageCounter.counter2DownRoamingRounded');
          // total sortantes
          nationalOutgoingTotal =
            this.getFromContent('accessPoint.usageCounter.counter2UpRounded') -
            this.getFromContent('accessPoint.usageCounter.counter2UpRoamingRounded');
          // total national
          nationalTotal = nationalIncomingTotal + nationalOutgoingTotal;
          // Internationales
          // total entrantes
          internationalIncomingTotal = this.getFromContent(
            'accessPoint.usageCounter.counter2DownRoamingRounded'
          );
          // total sortantes
          internationalOutgoingTotal = this.getFromContent(
            'accessPoint.usageCounter.counter2UpRoamingRounded'
          );
          // total international
          internationalTotal = internationalIncomingTotal + internationalOutgoingTotal;
          // total
          usedTotal = nationalTotal + internationalTotal;
          estimatedTotal = Math.floor(
            (daysInMonth * (nationalTotal + internationalTotal)) / pastDays
          );
          break;
        case 'VOICE':
          // Nationales
          // total entrantes
          nationalIncomingTotal =
            this.getFromContent('accessPoint.usageCounter.counter3DownRounded') -
            this.getFromContent('accessPoint.usageCounter.counter3DownRoamingRounded');
          // total sortantes
          nationalOutgoingTotal =
            this.getFromContent('accessPoint.usageCounter.counter3UpRounded') -
            this.getFromContent('accessPoint.usageCounter.counter3UpRoamingRounded');
          // total national
          nationalTotal = nationalIncomingTotal + nationalOutgoingTotal;
          // Internationales
          // total entrantes
          internationalIncomingTotal = this.getFromContent(
            'accessPoint.usageCounter.counter3DownRoamingRounded'
          );
          // total sortantes
          internationalOutgoingTotal = this.getFromContent(
            'accessPoint.usageCounter.counter3UpRoamingRounded'
          );
          // total international
          internationalTotal = internationalIncomingTotal + internationalOutgoingTotal;
          // total
          usedTotal = resumeFormattedValueFromSeconds(nationalTotal + internationalTotal);
          estimatedTotal = resumeFormattedValueFromSeconds(
            (daysInMonth * (nationalTotal + internationalTotal)) / pastDays
          );
          break;
      }
      let total;
      if (mode && mode === 'used') {
        total = usedTotal;
      } else {
        total = estimatedTotal;
      }
      return total;
    },
  },
};
</script>

<style lang="scss" scoped>
hr {
  border-bottom: 1px dashed #dddddd;
  margin-top: 0;
  margin-bottom: 0.8rem;
}
.item {
  margin-right: 0.5rem;
  flex-grow: 1;
  h6 {
    color: #7d7d7d;
    font-size: 0.8rem;
    font-weight: 400;
  }
}
</style>
