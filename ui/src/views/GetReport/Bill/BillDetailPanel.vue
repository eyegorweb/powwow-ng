<template>
  <BaseDetailPanelContent>
    <div>
      <div class="overview-container m-3 bg-white">
        <div class="overview-item">
          <h4 class="font-weight-normal text-uppercase">{{ $t('orders.detail.information') }}</h4>
        </div>
        <div class="overview-item mr-5">
          <h6>{{ $t('common.billingAccount') }}</h6>
          <p>{{ getContent('customerAccountCode') }}</p>
        </div>
        <div class="overview-item mr-5">
          <h6>{{ $t('bills.billPeriod') }}</h6>
          <p>{{ billingPeriod }}</p>
        </div>
        <div class="overview-item mr-5">
          <h6>{{ $t('bills.lineTotal') }}</h6>
          <p>{{ getContent('simCount') }}</p>
        </div>
      </div>
      <div class="overview-container m-3 bg-white">
        <div class="overview-item">
          <h4 class="font-weight-normal text-uppercase">{{ $t('bills.billDetail') }}</h4>
        </div>
        <table class="table">
          <thead class="bottom-line">
            <tr>
              <td class="bill-name">{{ $t('bills.title') }}</td>
              <td class="text-end">{{ $t('common.quantity') }}/Volume</td>
              <td class="text-end">{{ $t('bills.amount') }}</td>
            </tr>
          </thead>
          <tbody>
            <tr :key="item.label" v-for="item in getContent('headings', [])">
              <td>{{ item.label }}</td>
              <td class="text-end">{{ formatQuantity(item) }}</td>
              <td class="text-end">{{ formatCurrency(item.amountExcTaxe) }} €</td>
            </tr>
            <tr class="top-line font-weight-bold">
              <td>Total H.T.</td>
              <td colspan="2" class="text-end">
                {{ formatCurrency(getContent('amountExclTaxes')) }} €
              </td>
            </tr>
            <tr>
              <td>T.V.A.(20%)</td>
              <td colspan="2" class="text-end">{{ formatCurrency(tva) }} €</td>
            </tr>
            <tr class="top-line font-weight-bold">
              <td>Total T.T.C.</td>
              <td colspan="2" class="text-end">{{ formatCurrency(getContent('amount')) }} €</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
    <div slot="footer" class="action-buttons">
      <div>
        <ExportButton
          :export-fn="getExportFn()"
          btn-class-name="btn btn-import btn-block text-uppercase"
          variant="import"
        >
          <span slot="title">&nbsp;{{ $t('bills.export') }}</span>
        </ExportButton>
      </div>
      <div>
        <UiButton variant="primary" @click="downloadBill" :disabled="!content.documentId" block>
          <i class="ic-Download-Icon" />
          {{ $t('bills.download') }}
        </UiButton>
      </div>
    </div>
  </BaseDetailPanelContent>
</template>

<script>
import BaseDetailPanelContent from '@/components/BaseDetailPanelContent';
import get from 'lodash.get';
import { getMonthAndYear } from '@/utils/date.js';
import { formatCurrency } from '@/utils/numbers.js';
import { formatBytes, resumeAndTruncateFormattedValueFromSeconds } from '@/api/utils';
import ExportButton from '@/components/ExportButton';
import { exportBill } from '@/api/bills';
import UiButton from '@/components/ui/Button';

import { mapMutations } from 'vuex';
import { getBaseURL } from '@/utils.js';

export default {
  components: {
    BaseDetailPanelContent,
    ExportButton,
    UiButton,
  },
  props: {
    content: Object,
  },
  methods: {
    ...mapMutations(['startDownload']),

    downloadBill() {
      this.startDownload(`${getBaseURL()}/api/file/download/document/${this.content.documentId}`);
      return;
    },
    getContent(path, defaultValue = '-') {
      return get(this.content, path, defaultValue);
    },
    formatCurrency(value) {
      return formatCurrency(value);
    },
    formatQuantity(data) {
      if (!data || !data.usage) return;
      switch (data.usage) {
        case 'DATA':
          return formatBytes(data.quantity);
        case 'VOICE':
          return resumeAndTruncateFormattedValueFromSeconds(data.quantity);
        default:
          return data.quantity;
      }
    },

    getExportFn() {
      return async (columnsParam, orderBy, exportFormat) => {
        return await exportBill(
          this.content.selectedPartnerId,
          this.content.reference,
          this.content.customerAccountCode,
          exportFormat
        );
      };
    },
  },

  computed: {
    billingPeriod() {
      return getMonthAndYear(this.content.date);
    },
    tva() {
      const res = this.getContent('amount') - this.getContent('amountExclTaxes');
      if (!isNaN(res)) {
        return res.toFixed(2);
      }
      return '-';
    },
  },
};
</script>

<style lang="scss" scoped>
.table th,
.table td {
  padding: 0.75rem 0.75rem 0.75rem 0;
}
.bottom-line {
  border-bottom: 2px solid black;
}

.top-line {
  border-top: 2px solid black;
}

.text-end {
  text-align: end;
}

.bill-name {
  width: 53%;
}
</style>
