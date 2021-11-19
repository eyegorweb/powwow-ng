<template>
  <div>
    <div v-if="!singlePartner" class="alert-light">
      {{ $t('chooseAPartner') }}
    </div>
    <div v-else>
      <chart :key="'conso_' + version" v-if="chartOptions" :options="chartOptions" />
      <div v-else class="noResult alert-light" role="alert">
        {{ $t('noResult') }}
      </div>
    </div>
  </div>
</template>

<script>
import { Chart } from 'highcharts-vue';
import { mapState, mapGetters } from 'vuex';
import get from 'lodash.get';
import { formatBytes, resumeFormattedValueFromSeconds } from '@/api/utils.js';
import { formatLargeNumber } from '@/utils/numbers';

function formatterCallbackFn(usage, name, value) {
  if (usage === 'SMS') {
    return `${name}: ${formatLargeNumber(value)}`;
  } else if (usage === 'VOICE') {
    return `${name}: ${resumeFormattedValueFromSeconds(value)}`;
  }
  return `${name}: ${formatBytes(value)}`;
}

export default {
  components: {
    Chart,
  },
  props: {
    loadDataFn: Function,
    usage: {
      type: String,
      default: '',
    },
  },
  async mounted() {
    await this.refreshData();
  },
  data() {
    return {
      chartOptions: undefined,
      graphData: undefined,
      version: 1,
    };
  },

  methods: {
    createChart() {
      this.chartOptions = undefined;
      if (!this.graphData) return;

      const upSerieData = this.graphData.map((d) => [d.date, d.out]);
      const downSerieData = this.graphData.map((d) => [d.date, d.in]);
      const usage = this.usage;

      this.chartOptions = {
        chart: {
          renderTo: 'container',
          zoomType: 'xy',
          height: 230,
          type: 'column',
        },
        title: {
          text: '',
        },
        tooltip: {
          headerFormat: '',
          pointFormatter() {
            return formatterCallbackFn(usage, this.series.name, this.y);
          },
        },
        xAxis: {
          title: {
            text: '',
          },
          type: 'datetime',
        },
        yAxis: {
          title: {
            text: '',
          },
        },

        plotOptions: {
          series: {
            stacking: 'normal',
          },
        },
        series: [
          {
            name: 'Sortant',
            color: '#0054a4',
            data: upSerieData,
          },
          {
            name: 'Entrant',
            color: '#039dcb',
            data: downSerieData,
          },
        ],
      };
    },

    async refreshData() {
      // format {data: Utc, up: number, down: number }
      this.graphData = await this.loadDataFn(this.partners);
      this.createChart();

      this.version += 1;
    },
  },
  watch: {
    contextPartners() {
      this.refreshData();
    },
  },
  computed: {
    ...mapState('userContext', ['contextPartnersType', 'contextPartners']),
    ...mapGetters(['userIsPartner', 'userInfos']),
    partners() {
      if (!this.userIsPartner) {
        if (this.contextPartners && this.contextPartners.length) {
          return this.contextPartners.map((p) => p.id);
        }
      } else {
        const partners = get(this.userInfos, 'partners', []);
        return partners.map((p) => p.id);
      }

      return [];
    },
    singlePartner() {
      return this.partners.length === 1;
    },
  },
};
</script>

<style lang="scss"></style>
