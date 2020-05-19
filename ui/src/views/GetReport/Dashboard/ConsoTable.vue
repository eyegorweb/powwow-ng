<template>
  <div>
    <table v-if="consumptionData" class="table table-blue mt-1 mb-3 partnerTypeM2M">
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
                {{ formattedData('VOICE', consumptionData.voiceIncomingInternationalConsumption) }}
              </li>
              <li>
                {{ formattedData('VOICE', consumptionData.voiceOutgoingInternationalConsumption) }}
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
import { formatBytes, formattedValueFromSeconds } from '@/api/utils';
import { fetchCurrentConsumption } from '@/api/linesActions';

export default {
  data() {
    return {
      consumptionData: undefined,
    };
  },

  props: {
    partner: Object,
    offer: Object,
    billingAccount: Object,
  },

  async mounted() {
    this.consumptionData = await fetchCurrentConsumption({
      partyId: this.partner.id,
      workflowId: this.workflowId,
      customerAccoutId: this.customerAccountId,
    });
  },
  computed: {
    workflowId() {
      if (!this.offer) return;
      return this.offer.meta.id;
    },
    customerAccountId() {
      if (!this.offer) return;
      return this.billingAccount.data.id;
    },
  },
  methods: {
    formattedData(type, value) {
      switch (type) {
        case 'DATA':
          return value ? formatBytes(value) : '-';

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
