<template>
  <div>
    <LoaderContainer :is-loading="isLoading">
      <div slot="on-loading">
        <ConsoSkeletonTable v-if="!partnerTypeMVNO" />
        <OnGoingSkeleton v-if="partnerTypeMVNO" />
      </div>
      <div v-if="isLigneActive" class="mb-4">
        <div class="row mt-4 mb-4">
          <div class="col">
            <h2 class="text-gray font-weight-light" style="font-size: 2rem">
              {{ $t('getparc.lineDetail.consumingFromMonthBeginning') }}
            </h2>
          </div>
          <div class="col">
            <ExportButton :export-fn="getExportFn()">
              <span slot="title">{{ $t('getparc.lineDetail.consummated.export') }}</span>
            </ExportButton>
          </div>
        </div>
        <table v-if="consumptionData && !partnerTypeMVNO" class="table table-blue mt-1 mb-3">
          <thead>
            <tr>
              <th>{{ $t('getparc.lineDetail.titled') }}</th>
              <th>{{ $t('getparc.lineDetail.data') }}</th>
              <th>{{ $t('getparc.lineDetail.sms') }}</th>
              <th>{{ $t('getparc.lineDetail.voice') }}</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>
                <ul class="content-cell list-unstyled">
                  <li>{{ $t('getparc.lineDetail.consummated.nationalConsumption') }}</li>
                  <li>{{ $t('getparc.lineDetail.consummated.incoming') }}</li>
                  <li>{{ $t('getparc.lineDetail.consummated.outgoing') }}</li>
                </ul>
              </td>
              <td>
                <ul class="content-cell list-unstyled">
                  <li>{{ formattedData('DATA', consumptionData.dataNationalConsumption) }}</li>
                  <li>
                    {{ formattedData('DATA', consumptionData.dataIncomingNationalConsumption) }}
                  </li>
                  <li>
                    {{ formattedData('DATA', consumptionData.dataOutgoingNationalConsumption) }}
                  </li>
                </ul>
              </td>
              <td>
                <ul class="content-cell list-unstyled">
                  <li>{{ consumptionData.smsNationalConsumption }} SMS</li>
                  <li>{{ consumptionData.smsIncomingNationalConsumption }} SMS</li>
                  <li>{{ consumptionData.smsOutgoingNationalConsumption }} SMS</li>
                </ul>
              </td>
              <td>
                <ul class="content-cell list-unstyled">
                  <li>{{ formattedData('VOICE', consumptionData.voiceNationalConsumption) }}</li>
                  <li>
                    {{ formattedData('VOICE', consumptionData.voiceIncomingNationalConsumption) }}
                  </li>
                  <li>
                    {{ formattedData('VOICE', consumptionData.voiceOutgoingNationalConsumption) }}
                  </li>
                </ul>
              </td>
            </tr>
            <tr>
              <td>
                <ul class="content-cell list-unstyled">
                  <li>{{ $t('getparc.lineDetail.consummated.internationalConsumption') }}</li>
                  <li>{{ $t('getparc.lineDetail.consummated.incoming') }}</li>
                  <li>{{ $t('getparc.lineDetail.consummated.outgoing') }}</li>
                </ul>
              </td>
              <td>
                <ul class="content-cell list-unstyled">
                  <li>{{ formattedData('DATA', consumptionData.dataInternationalConsumption) }}</li>
                  <li>
                    {{
                      formattedData('DATA', consumptionData.dataIncomingInternationalConsumption)
                    }}
                  </li>
                  <li>
                    {{
                      formattedData('DATA', consumptionData.dataOutgoingInternationalConsumption)
                    }}
                  </li>
                </ul>
              </td>
              <td>
                <ul class="content-cell list-unstyled">
                  <li>{{ consumptionData.smsInternationalConsumption }} SMS</li>
                  <li>{{ consumptionData.smsIncomingInternationalConsumption }} SMS</li>
                  <li>{{ consumptionData.smsOutgoingInternationalConsumption }} SMS</li>
                </ul>
              </td>
              <td>
                <ul class="content-cell list-unstyled">
                  <li>
                    {{ formattedData('VOICE', consumptionData.voiceInternationalConsumption) }}
                  </li>
                  <li>
                    {{
                      formattedData('VOICE', consumptionData.voiceIncomingInternationalConsumption)
                    }}
                  </li>
                  <li>
                    {{
                      formattedData('VOICE', consumptionData.voiceOutgoingInternationalConsumption)
                    }}
                  </li>
                </ul>
              </td>
            </tr>
            <tr class="total-line">
              <td>{{ $t('total') }}</td>
              <td>{{ formattedData('DATA', consumptionData.dataTotal) }}</td>
              <td>{{ consumptionData.smsTotal }} SMS</td>
              <td>{{ formattedData('VOICE', consumptionData.voiceTotal) }}</td>
            </tr>
          </tbody>
        </table>
        <!-- ------------------------------------ MVNO TYPE PARTNER -------------------------------------------- -->
        <table
          v-else-if="consumptionData && partnerTypeMVNO"
          class="table table-blue mt-1 mb-3 partnerTypeMVNO"
        >
          <tbody>
            <tr>
              <td>
                <ul class="content-cell list-unstyled">
                  <li class="total-line" v-if="getFromContent('voiceTotal') !== null">
                    {{ $t('getparc.lineDetail.consummated.totalVoice') }}
                  </li>
                  <li
                    class="value-line"
                    v-if="getFromContent('voiceIncomingNationalConsumption') !== null"
                  >
                    {{ $t('getparc.lineDetail.consummated.voiceIncomingNationalConsumption') }}
                  </li>
                  <li
                    class="value-line"
                    v-if="getFromContent('voiceOutgoingNationalConsumption') !== null"
                  >
                    {{ $t('getparc.lineDetail.consummated.voiceOutgoingNationalConsumption') }}
                  </li>
                  <li
                    class="value-line"
                    v-if="getFromContent('voiceInternationalConsumption') !== null"
                  >
                    {{ $t('getparc.lineDetail.consummated.voiceRoaming') }}
                  </li>
                </ul>
              </td>
              <td>
                <ul class="content-cell list-unstyled">
                  <li class="total-value" v-if="getFromContent('voiceTotal') !== null">
                    {{ formattedData('VOICE', consumptionData.voiceTotal) }}
                  </li>
                  <li
                    class="value-line"
                    v-if="getFromContent('voiceIncomingNationalConsumption') !== null"
                  >
                    {{ formattedData('VOICE', consumptionData.voiceIncomingNationalConsumption) }}
                  </li>
                  <li
                    class="value-line"
                    v-if="getFromContent('voiceOutgoingNationalConsumption') !== null"
                  >
                    {{ formattedData('VOICE', consumptionData.voiceOutgoingNationalConsumption) }}
                  </li>
                  <li
                    class="value-line"
                    v-if="getFromContent('voiceInternationalConsumption') !== null"
                  >
                    {{ formattedData('VOICE', consumptionData.voiceInternationalConsumption) }}
                  </li>
                </ul>
              </td>
            </tr>
            <tr>
              <td>
                <ul class="content-cell list-unstyled">
                  <li class="total-line" v-if="getFromContent('smsTotal') !== null">
                    {{ $t('getparc.lineDetail.consummated.totalSMS') }}
                  </li>
                  <li
                    class="value-line"
                    v-if="getFromContent('smsIncomingNationalConsumption') !== null"
                  >
                    {{ $t('getparc.lineDetail.consummated.smsIncomingNationalConsumption') }}
                  </li>
                  <li
                    class="value-line"
                    v-if="getFromContent('smsOutgoingNationalConsumption') !== null"
                  >
                    {{ $t('getparc.lineDetail.consummated.smsOutgoingNationalConsumption') }}
                  </li>
                  <li
                    class="value-line"
                    v-if="getFromContent('smsIncomingInternationalConsumption') !== null"
                  >
                    {{ $t('getparc.lineDetail.consummated.smsIncomingInternationalConsumption') }}
                  </li>
                  <li
                    class="value-line"
                    v-if="getFromContent('smsOutgoingInternationalConsumption') !== null"
                  >
                    {{ $t('getparc.lineDetail.consummated.smsOutgoingInternationalConsumption') }}
                  </li>
                </ul>
              </td>
              <td>
                <ul class="content-cell list-unstyled">
                  <li class="total-value" v-if="getFromContent('smsTotal') !== null">
                    {{ getFromContent('smsTotal') }} SMS
                  </li>
                  <li
                    class="value-line"
                    v-if="getFromContent('smsIncomingNationalConsumption') !== null"
                  >
                    {{ getFromContent('smsIncomingNationalConsumption') }} SMS
                  </li>
                  <li
                    class="value-line"
                    v-if="getFromContent('smsOutgoingNationalConsumption') !== null"
                  >
                    {{ getFromContent('smsOutgoingNationalConsumption') }} SMS
                  </li>
                  <li
                    class="value-line"
                    v-if="getFromContent('smsIncomingInternationalConsumption') !== null"
                  >
                    {{ getFromContent('smsIncomingInternationalConsumption') }} SMS
                  </li>
                  <li
                    class="value-line"
                    v-if="getFromContent('smsOutgoingInternationalConsumption') !== null"
                  >
                    {{ getFromContent('smsOutgoingInternationalConsumption') }} SMS
                  </li>
                </ul>
              </td>
            </tr>
            <tr class="total-line">
              <td>
                <ul class="content-cell list-unstyled">
                  <li class="total-line" v-if="getFromContent('dataTotal') !== null">
                    {{ $t('getparc.lineDetail.consummated.totalData') }}
                  </li>
                </ul>
              </td>
              <td>
                <ul class="content-cell list-unstyled">
                  <li class="total-value" v-if="getFromContent('dataTotal') !== null">
                    {{ formattedData('DATA', consumptionData.dataTotal) }}
                  </li>
                </ul>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      <div v-else class="warning-message">
        <h3 class="text-warning text-center mt-5">
          {{ $t('getparc.lineDetail.tab2.lineAnalysisContent.inactiveLineWarning') }}
        </h3>
      </div>
    </LoaderContainer>
    <div class="longLife" v-if="longLifeInfo && !userIsMVNO">
      <div class="longLife-title">
        <h2 class="text-gray font-weight-light" style="font-size: 2rem">
          {{ $t('getparc.lineDetail.longLife') }}
        </h2>
      </div>
      <div class="longLife-bars">
        <div class="longLife-bar">
          <div class="longLife-bar-title">SMS</div>
          <div class="longLife-bar-rest">
            {{ $t('getparc.lineDetail.rest') }} {{ longLifeInfo.smsAvailable }}
          </div>
          <div class="barConso">
            <div class="barConso-use" :style="smsBarUse">
              {{ $t('getparc.lineDetail.consume') }}&nbsp;{{ longLifeInfo.smsConsumed }}
            </div>
          </div>
        </div>
        <div class="longLife-bar">
          <div class="longLife-bar-title">VOIX</div>
          <div class="longLife-bar-rest">
            {{ $t('getparc.lineDetail.rest') }}
            {{ formattedData('VOICE', longLifeInfo.voiceAvailable) }}
          </div>
          <div class="barConso">
            <div class="barConso-use" :style="voiceBarUse">
              {{ $t('getparc.lineDetail.consume') }}&nbsp;{{
                formattedData('VOICE', longLifeInfo.voiceConsumed)
              }}
            </div>
          </div>
        </div>
        <div class="longLife-bar">
          <div class="longLife-bar-title">DATA</div>
          <div class="longLife-bar-rest">
            {{ $t('getparc.lineDetail.rest') }}&nbsp;{{
              formattedData('DATA', longLifeInfo.dataAvailable)
            }}
          </div>
          <div class="barConso">
            <div class="barConso-use" :style="dataBarUse">
              {{ $t('getparc.lineDetail.consume') }}&nbsp;{{
                formattedData('DATA', longLifeInfo.dataConsumed)
              }}
            </div>
          </div>
        </div>
      </div>
      <div class="longLife-date">
        {{ $t('getparc.lineDetail.limitDate') }} {{ longLifeInfo.DLV }} <br />
        {{
          $t('getparc.lineDetail.lastRecharge', {
            date: longLifeInfo.lastRechargeDate,
            offer: longLifeInfo.envelopeName,
          })
        }}
      </div>
    </div>
  </div>
</template>

<script>
import LoaderContainer from '@/components/LoaderContainer';
import ConsoSkeletonTable from './ConsoSkeletonTable';
import OnGoingSkeleton from './OnGoingSkeleton';
import { mapGetters } from 'vuex';

import {
  fetchCurrentConsumption,
  exportCurrentConsumption,
  fetchlvConsumption,
} from '@/api/linesActions';
import ExportButton from '@/components/ExportButton';
import { formatBytes, resumeFormattedValueFromSeconds } from '@/api/utils';
import get from 'lodash.get';

export default {
  components: {
    ExportButton,
    LoaderContainer,
    ConsoSkeletonTable,
    OnGoingSkeleton,
  },
  props: {
    content: Object,
  },
  data() {
    return {
      consumptionData: undefined,
      isLoading: true,
      skeletonColumns: undefined,
      paramSearch: undefined,
      longLifeInfo: undefined,
      dataBarUse: '0%',
      smsBarUse: '0%',
      voiceBarUse: '0%',
    };
  },
  computed: {
    ...mapGetters(['userIsMVNO']),
    isLigneActive() {
      const networkStatus = get(this.content, 'accessPoint.networkStatus');
      const simStatus = get(this.content, 'statuts');
      return (
        simStatus === 'ALLOCATED' &&
        (networkStatus === 'ACTIVATED' || networkStatus === 'SUSPENDED')
      );
    },
    partnerTypeMVNO() {
      return get(this.content, 'party.partyType') === 'MVNO';
    },
  },
  async mounted() {
    this.isLoading = true;

    var longLife = await fetchlvConsumption(this.content.id);
    this.longLifeInfo = longLife[0];

    if (this.longLifeInfo) {
      const getPercentValue = (consumed, max) => {
        return (100 * consumed) / max;
      };

      this.dataBarUse =
        'width: ' +
        getPercentValue(this.longLifeInfo.dataConsumed, this.longLifeInfo.dataAvailable) +
        '%';
      this.smsBarUse =
        'width: ' +
        getPercentValue(this.longLifeInfo.smsConsumed, this.longLifeInfo.smsAvailable) +
        '%';
      this.voiceBarUse =
        'width: ' +
        getPercentValue(this.longLifeInfo.dataConsumed, this.longLifeInfo.dataAvailable) +
        '%';
    }

    try {
      if (this.$route.params && this.$route.params.tabIndex && this.$route.params.lineId) {
        this.consumptionData = await fetchCurrentConsumption({
          simCardInstanceId: this.$route.params.lineId,
        });
      } else if (
        this.$route.params &&
        this.$route.params.tabIndex &&
        this.$route.params.lineIccid
      ) {
        this.consumptionData = await fetchCurrentConsumption({
          partyId: this.$route.params.lineIccid,
        });
      } else {
        // Vérifier si le partyId passé est le bon pour récupérer les données avec l'api currentConsumptionV2
        this.consumptionData = await fetchCurrentConsumption({
          simCardInstanceId: this.content.id,
        });
      }

      setTimeout(() => {
        this.isLoading = false;
      }, 3000);
    } catch {
      this.isLoading = false;
    }
  },
  methods: {
    getExportFn() {
      return async (columns, orderBy, exportFormat) => {
        return await exportCurrentConsumption(this.content.id, exportFormat);
      };
    },

    formattedData(type, value) {
      switch (type) {
        case 'DATA':
          return formatBytes(value);

        case 'VOICE':
          return resumeFormattedValueFromSeconds(value);
      }
    },

    getFromContent(path, defaultValue = '') {
      const value = get(this.consumptionData, path, defaultValue);
      return value;
    },
  },
};
</script>

<style lang="scss" scoped>
.longLife {
  &-title {
    margin-bottom: 2rem;
  }

  &-date {
    background-color: white;
    padding: 2rem;
    font-size: 14px;
    font-weight: bold;
  }

  &-bars {
    display: flex;
    justify-content: space-between;
    background-color: white;
    padding: 2rem;
  }

  &-bar {
    position: relative;
    width: 30%;

    &-title {
      font-size: 14px;
      font-weight: bold;
      margin-bottom: 5px;
    }

    &-rest {
      font-size: 12px;
      font-weight: 600;
      margin-bottom: 10px;
    }
  }
}
.barConso {
  background: rgb(137, 208, 255);
  width: 100%;
  height: 1.8rem;
  color: white;
  position: relative;
  border-radius: 50px;
  overflow: hidden;

  .barConso-use {
    background: rgb(0, 151, 255);
    display: block;
    position: absolute;
    padding: 0 10px;
    border-radius: 50px;
    left: 0;
    top: 0;
    width: 0%;
    height: 100%;
    z-index: 2;
  }

  .dataBarUse {
    transition: 500ms;
    transition-delay: 1s;
  }
}
.partnerTypeM2M .content-cell {
  li:nth-child(1) {
    color: $dark-gray;
    font-size: 1.4rem;
    font-weight: 300;
    line-height: 40px;
    text-align: right;
  }
  li:nth-child(2) {
    color: $blue;
    font-size: 1rem;
    line-height: 1.4rem;
    text-align: right;
  }
  li:nth-child(3) {
    color: $accent;
    font-size: 1rem;
    line-height: 1.4rem;
    text-align: right;
  }
}
.partnerTypeMVNO .content-cell {
  li.total-line {
    color: $dark-gray;
    font-size: 1.4rem;
    font-weight: 300;
    line-height: 40px;
    text-align: right;
  }
  li.total-value {
    font-size: 1.4rem;
    font-weight: 300;
    line-height: 40px;
    text-align: left;
  }
  li.value-line {
    font-size: 1rem;
    line-height: 1.4rem;
    text-align: right;
  }
}

.total-line {
  font-size: 2rem;
  color: $dark-gray;
  font-weight: 600;
  line-height: 40px;
  text-align: right;
}

.table thead th {
  text-align: right;
}

.partnerTypeMVNO tr td:nth-child(2) {
  width: 50%;
  padding-right: 30%;
}
</style>
