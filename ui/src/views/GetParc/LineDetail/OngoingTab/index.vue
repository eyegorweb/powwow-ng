<template>
  <div>
    <div class="row mb-3">
      <div class="col">
        <h2 class="text-gray font-weight-light mock-value" style="font-size: 2rem">
          Encours de la ligne depuis 01 Novembre
        </h2>
      </div>
      <div class="col">
        <ExportButton :export-fn="getExportFn()">
          <span slot="title">{{ $t('export') }}</span>
        </ExportButton>
      </div>
    </div>
    <table v-if="consumptionData" class="table table-blue mt-1">
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
              <li>Consommations nationales</li>
              <li>Entrantes</li>
              <li>Sortantes</li>
            </ul>
          </td>
          <td>
            <ul class="content-cell list-unstyled">
              <li>{{ consumptionData.nationalConsumption }} Kio</li>
              <li>{{ consumptionData.incomingNationalConsumption }} Kio</li>
              <li>{{ consumptionData.outgoingNationalConsumption }} Kio</li>
            </ul>
          </td>
          <td>
            <ul class="content-cell list-unstyled">
              <li class="mock-value">32 Kio</li>
              <li class="mock-value">29.85 Kio</li>
              <li class="mock-value">29.85 Kio</li>
            </ul>
          </td>
          <td>
            <ul class="content-cell list-unstyled">
              <li class="mock-value">32 Kio</li>
              <li class="mock-value">29.85 Kio</li>
              <li class="mock-value">29.85 Kio</li>
            </ul>
          </td>
        </tr>
        <tr>
          <td>
            <ul class="content-cell list-unstyled">
              <li>Consommations internationales</li>
              <li>Entrantes</li>
              <li>Sortantes</li>
            </ul>
          </td>
          <td>
            <ul class="content-cell list-unstyled">
              <li>{{ consumptionData.internationalConsumption }} Kio</li>
              <li>{{ consumptionData.incomingInternationalConsumption }} Kio</li>
              <li>{{ consumptionData.outgoingInternationalConsumption }} Kio</li>
            </ul>
          </td>
          <td>
            <ul class="content-cell list-unstyled">
              <li class="mock-value">32 Kio</li>
              <li class="mock-value">29.85 Kio</li>
              <li class="mock-value">29.85 Kio</li>
            </ul>
          </td>
          <td>
            <ul class="content-cell list-unstyled">
              <li class="mock-value">32 Kio</li>
              <li class="mock-value">29.85 Kio</li>
              <li class="mock-value">29.85 Kio</li>
            </ul>
          </td>
        </tr>
        <tr class="total-line">
          <td>total</td>
          <td>{{ consumptionData.total }} Kio</td>
          <td class="mock-value">32 Kio</td>
          <td class="mock-value">32 Kio</td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script>
import { fetchCurrentConsumption } from '@/api/linesActions';
import ExportButton from '@/components/ExportButton';

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
        console.log('Do export >', columns, orderBy, exportFormat);
      };
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
