<template>
  <div class="mb-4">
    <div class="row mb-3">
      <div class="col">
        <h2 class="text-gray font-weight-light mock-value" style="font-size: 2rem">
          Encours de la ligne depuis 01 Novembre
        </h2>
      </div>
      <div class="col">
        <ExportButton :export-fn="getExportFn()">
          <span slot="title">{{ $t('getparc.lineDetail.consummated.export') }}</span>
        </ExportButton>
      </div>
    </div>
    <table v-if="consumptionData" class="table table-blue mt-1 mb-3">
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
              <li>{{ formattedData('DATA', consumptionData.dataIncomingNationalConsumption) }}</li>
              <li>{{ formattedData('DATA', consumptionData.dataOutgoingNationalConsumption) }}</li>
            </ul>
          </td>
          <td>
            <ul class="content-cell list-unstyled">
              <li>{{ consumptionData.smsNationalConsumption }} SMS</li>
              <li>{{ consumptionData.smsIncomingNationalConsumption }} SMS</li>
              <li>{{ consumptionData.smsIncomingNationalConsumption }} SMS</li>
            </ul>
          </td>
          <td>
            <ul class="content-cell list-unstyled">
              <li>
                {{ formattedData('VOICE', consumptionData.voiceIncomingNationalConsumption) }}
              </li>
              <li>
                {{ formattedData('VOICE', consumptionData.voiceIncomingNationalConsumption) }}
              </li>
              <li>
                {{ formattedData('VOICE', consumptionData.voiceIncomingNationalConsumption) }}
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
              <li>{{ consumptionData.smsIncomingInternationalConsumption }} SMS</li>
            </ul>
          </td>
          <td>
            <ul class="content-cell list-unstyled">
              <li>
                {{ formattedData('VOICE', consumptionData.voiceIncomingInternationalConsumption) }}
              </li>
              <li>
                {{ formattedData('VOICE', consumptionData.voiceIncomingInternationalConsumption) }}
              </li>
              <li>
                {{ formattedData('VOICE', consumptionData.voiceIncomingInternationalConsumption) }}
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
  </div>
</template>

<script>
import { fetchCurrentConsumption, exportCurrentConsumption } from '@/api/linesActions';
import ExportButton from '@/components/ExportButton';
import { formatBytes } from '@/api/utils';
import moment from 'moment';

export default {
  components: {
    ExportButton,
  },
  props: {
    content: Object,
  },
  data() {
    return {
      consumptionData: undefined,
    };
  },
  async mounted() {
    this.consumptionData = await fetchCurrentConsumption(this.content.id);
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
          return moment(value, 'HHmmss').format('HH:mm:ss');
      }
    },
  },
};
</script>

<style lang="scss" scoped>
.content-cell {
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
</style>
