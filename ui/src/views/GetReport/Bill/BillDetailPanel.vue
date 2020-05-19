<template>
  <BaseDetailPanelContent>
    <div class="overview-container m-3 bg-white">
      <div class="overview-item">
        <h4 class="font-weight-normal text-uppercase">
          Informations générales
        </h4>
      </div>
      <div class="overview-item mr-5">
        <h6>Compte de facturation</h6>
        <p>{{ getContent('customerAccountCode') }}</p>
      </div>
      <div class="overview-item mr-5">
        <h6>Période facturée</h6>
        <p>{{ billingPeriod }}</p>
      </div>
    </div>
    <div class="overview-container m-3 bg-white">
      <div class="overview-item">
        <h4 class="font-weight-normal text-uppercase">
          Informations générales
        </h4>
      </div>
      <table class="table">
        <thead class="bottom-line">
          <tr>
            <td>Intitulé</td>
            <td>Quantité</td>
            <td>Montant</td>
          </tr>
        </thead>
        <tbody>
          <tr :key="item.label" v-for="item in getContent('headings', [])">
            <td>{{ item.label }}</td>
            <td class="text-end">{{ item.nbSim }}</td>
            <td class="text-end">{{ formatCurrency(item.amountExcTaxe) }} €</td>
          </tr>
          <tr class="top-line font-weight-bold">
            <td colspan="2">Total H.T.</td>
            <td class="text-end">{{ formatCurrency(getContent('amountExclTaxes')) }} €</td>
          </tr>
          <tr>
            <td colspan="2">T.V.A.(20%)</td>
            <td class="text-end">{{ formatCurrency(tva) }} €</td>
          </tr>
          <tr class="top-line font-weight-bold">
            <td colspan="2">Total T.T.C.</td>
            <td class="text-end">{{ formatCurrency(getContent('amount')) }} €</td>
          </tr>
        </tbody>
      </table>
    </div>
  </BaseDetailPanelContent>
</template>

<script>
import BaseDetailPanelContent from '@/components/BaseDetailPanelContent';
import get from 'lodash.get';
import { getMonthAndYear } from '@/utils/date.js';
import { formatCurrency } from '@/utils/numbers.js';

export default {
  components: {
    BaseDetailPanelContent,
  },
  props: {
    content: Object,
  },
  methods: {
    getContent(path, defaultValue) {
      return get(this.content, path, defaultValue);
    },
    formatCurrency(value) {
      return formatCurrency(value);
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
.bottom-line {
  border-bottom: 2px solid black;
}

.top-line {
  border-top: 2px solid black;
}

.text-end {
  text-align: end;
}
</style>
