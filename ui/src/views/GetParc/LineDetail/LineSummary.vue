<template>
  <div class="row mb-4">
    <div class="col">
      <div class="bg-white p-4 rounded">
        <div class="d-flex">
          <div class="item">
            <h6>{{ $t('getparc.lineDetail.offer') }}:</h6>
            <p>
              {{ getFromContent('accessPoint.offer.marketingOffer.description') }}
            </p>
          </div>
          <div class="item">
            <h6>{{ $t('getparc.lineDetail.lineStatus') }}:</h6>
            <p class="text-success">
              {{ $t(simStatus) }}
            </p>
          </div>
          <div class="item">
            <h6>{{ $t('getparc.lineDetail.triggeredAlarms') }}:</h6>
            <p class="text-danger mock-value">
              Oui
            </p>
          </div>
        </div>
        <hr />
        <div class="d-flex">
          <div class="item">
            <h6>{{ $t('getparc.actDetail.col.iccid') }}:</h6>
            <p>
              {{ getFromContent('iccid') }}
            </p>
          </div>
          <div class="item">
            <h6>{{ $t('getparc.lineDetail.manufacturer') }}:</h6>
            <p>
              {{ getFromContent('deviceInstance.manufacturer') }}
            </p>
          </div>
          <div class="item">
            <h6>{{ $t('getparc.lineDetail.model') }}:</h6>
            <p>
              {{ getFromContent('deviceInstance.deviceReference') }}
            </p>
          </div>
        </div>
      </div>
    </div>
    <div class="col">
      <div class="bg-white p-4 rounded">
        <div class="d-flex">
          <div class="item">
            <h6>{{ $t('getparc.lineDetail.consummated.data') }}:</h6>
            <p>
              <!-- total DATA consommées -->
              {{ totalUsed('DATA', 'used') }}
            </p>
          </div>
          <div class="item">
            <h6>{{ $t('getparc.lineDetail.consummated.sms') }}:</h6>
            <p>
              <!-- total SMS consommées -->
              {{ totalUsed('SMS', 'used') }}
            </p>
          </div>
          <div class="item">
            <h6>{{ $t('getparc.lineDetail.consummated.voice') }}:</h6>
            <p>
              <!-- total VOIX consommées -->
              {{ totalUsed('VOICE', 'used') }}
            </p>
          </div>
        </div>
        <hr />
        <div class="d-flex">
          <div class="item">
            <h6>{{ $t('getparc.lineDetail.estimated.data') }}:</h6>
            <p>
              <!-- prévisionnel DATA  -->
              {{ totalUsed('DATA') }}
            </p>
          </div>
          <div class="item">
            <h6>{{ $t('getparc.lineDetail.estimated.sms') }}:</h6>
            <p>
              <!-- prévisionnel SMS  -->
              {{ totalUsed('SMS') }}
            </p>
          </div>
          <div class="item">
            <h6>{{ $t('getparc.lineDetail.estimated.voice') }}:</h6>
            <p>
              <!-- prévisionnel VOIX  -->
              {{ totalUsed('VOICE') }}
            </p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import get from 'lodash.get';
import { formatBytes } from '@/api/utils';
import moment from 'moment';

export default {
  props: {
    content: Object,
  },
  computed: {
    simStatus() {
      const commercialStatus = get(this.content, 'accessPoint.commercialStatus');
      const simStatus = get(this.content, 'statuts');
      const networkStatus = get(this.content, 'accessPoint.networkStatus');

      if (simStatus === 'AVAILABLE') {
        return 'getparc.actLines.simStatuses.NOT_PREACTIVATED';
      }
      if (simStatus === 'ALLOCATED' && !commercialStatus) {
        return 'getparc.actLines.simStatuses.PREACTIVATED';
      }
      if (simStatus === 'ALLOCATED' && !networkStatus) {
        return 'getparc.actLines.simStatuses.ACTIVATING';
      }
      if (simStatus === 'ALLOCATED' && networkStatus === 'ACTIVATED') {
        return 'getparc.actLines.simStatuses.ACTIVATED';
      }
      if (simStatus === 'ALLOCATED' && networkStatus === 'SUSPENDED') {
        return 'getparc.actLines.simStatuses.SUSPENDED';
      }
      if (simStatus === 'RELEASED') {
        return 'getparc.actLines.simStatuses.RELEASED';
      }

      return get(this.content, 'statuts');
    },
  },
  methods: {
    getFromContent(path, defaultValue = '') {
      const value = get(this.content, path, defaultValue);
      return value !== null ? value : '';
    },
    totalUsed(type, mode) {
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
          estimatedTotal = (daysInMonth * (nationalTotal + internationalTotal)) / pastDays;
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
          usedTotal = moment(nationalTotal + internationalTotal, 'HHmmss').format('HH:mm:ss');
          estimatedTotal = moment(
            (daysInMonth * (nationalTotal + internationalTotal)) / pastDays,
            'HHmmss'
          ).format('HH:mm:ss');
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
