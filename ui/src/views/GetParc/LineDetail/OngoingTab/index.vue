<template>
  <LoaderContainer :is-loading="isLoading">
    <div slot="on-loading">
      <ConsoSkeletonTable />
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
      <table
        v-if="consumptionData && !partnerTypeMVNO"
        class="table table-blue mt-1 mb-3 partnerTypeM2M"
      >
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
                  {{ formattedData('DATA', consumptionData.dataIncomingInternationalConsumption) }}
                </li>
                <li>
                  {{ formattedData('DATA', consumptionData.dataOutgoingInternationalConsumption) }}
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
      <table
        v-else-if="consumptionData && partnerTypeMVNO"
        class="table table-blue mt-1 mb-3 partnerTypeMVNO"
      >
        <tbody>
          <tr>
            <td>
              <ul class="content-cell list-unstyled">
                <li class="total-line">{{ $t('getparc.lineDetail.consummated.totalVoice') }}</li>
                <li class="value-line">
                  {{ $t('getparc.lineDetail.consummated.voiceIncomingNationalConsumption') }}
                </li>
                <li class="value-line">
                  {{ $t('getparc.lineDetail.consummated.voiceOutgoingNationalConsumption') }}
                </li>
                <li class="value-line">{{ $t('getparc.lineDetail.consummated.voiceRoaming') }}</li>
              </ul>
            </td>
            <td>
              <ul class="content-cell list-unstyled">
                <li class="total-value">
                  {{ formattedData('VOICE', consumptionData.voiceTotal) }}
                </li>
                <li class="value-line">
                  {{ formattedData('VOICE', consumptionData.voiceIncomingNationalConsumption) }}
                </li>
                <li class="value-line">
                  {{ formattedData('VOICE', consumptionData.voiceOutgoingNationalConsumption) }}
                </li>
                <li class="value-line">
                  {{ formattedData('VOICE', consumptionData.voiceInternationalConsumption) }}
                </li>
              </ul>
            </td>
          </tr>
          <tr>
            <td>
              <ul class="content-cell list-unstyled">
                <li class="total-line">{{ $t('getparc.lineDetail.consummated.totalSMS') }}</li>
                <li class="value-line">
                  {{ $t('getparc.lineDetail.consummated.smsIncomingNationalConsumption') }}
                </li>
                <li class="value-line">
                  {{ $t('getparc.lineDetail.consummated.smsOutgoingNationalConsumption') }}
                </li>
                <li class="value-line">
                  {{ $t('getparc.lineDetail.consummated.smsIncomingInternationalConsumption') }}
                </li>
                <li class="value-line">
                  {{ $t('getparc.lineDetail.consummated.smsOutgoingInternationalConsumption') }}
                </li>
              </ul>
            </td>
            <td>
              <ul class="content-cell list-unstyled">
                <li class="total-value">{{ consumptionData.smsTotal }} SMS</li>
                <li class="value-line">{{ consumptionData.smsIncomingNationalConsumption }} SMS</li>
                <li class="value-line">{{ consumptionData.smsOutgoingNationalConsumption }} SMS</li>
                <li class="value-line">
                  {{ consumptionData.smsIncomingInternationalConsumption }} SMS
                </li>
                <li class="value-line">
                  {{ consumptionData.smsOutgoingInternationalConsumption }} SMS
                </li>
              </ul>
            </td>
          </tr>
          <tr class="total-line">
            <td>
              <ul class="content-cell list-unstyled">
                <li class="total-line">{{ $t('getparc.lineDetail.consummated.totalData') }}</li>
              </ul>
            </td>
            <td>
              <ul class="content-cell list-unstyled">
                <li class="total-value">{{ formattedData('DATA', consumptionData.dataTotal) }}</li>
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
</template>

<script>
import LoaderContainer from '@/components/LoaderContainer';
import ConsoSkeletonTable from './ConsoSkeletonTable';

import { fetchCurrentConsumption, exportCurrentConsumption } from '@/api/linesActions';
import ExportButton from '@/components/ExportButton';
import { formatBytes, formattedValueFromSeconds } from '@/api/utils';
import get from 'lodash.get';

export default {
  components: {
    ExportButton,
    LoaderContainer,
    ConsoSkeletonTable,
  },
  props: {
    content: Object,
  },
  data() {
    return {
      consumptionData: undefined,
      isLoading: true,
      skeletonColumns: undefined,
    };
  },
  computed: {
    isLigneActive() {
      const networkStatus = get(this.content, 'accessPoint.networkStatus');
      const simStatus = get(this.content, 'statuts');
      return (
        simStatus === 'ALLOCATED' &&
        (networkStatus === 'ACTIVATED' || networkStatus === 'SUSPENDED')
      );
    },
    partnerTypeMVNO() {
      const typeForPartner = get(this.content, 'party.partyType');
      let isMVNOPartner;
      if (typeForPartner === 'MVNO') {
        isMVNOPartner = true;
      } else {
        isMVNOPartner = false;
      }
      return isMVNOPartner;
    },
  },
  async mounted() {
    this.isLoading = true;
    try {
      if (this.$route.params && this.$route.params.tabIndex) {
        this.consumptionData = await fetchCurrentConsumption({
          simCardInstanceId: this.$route.params.lineId,
        });
      } else {
        this.consumptionData = await fetchCurrentConsumption({
          simCardInstanceId: this.content.id,
        });
      }
      setTimeout(() => {
        this.isLoading = false;
      }, 3000)
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
          return formattedValueFromSeconds(value);
      }
    },
  },
};
</script>

<style lang="scss" scoped>
.partnerTypeM2M {
  margin-bottom: 20rem !important;
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
