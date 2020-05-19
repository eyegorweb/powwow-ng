<template>
  <div>
    <div v-if="!partners.length" class="alert-light">
      {{ $t('choosePartner') }}
    </div>
    <div v-else>
      <chart
        :key="'conso_' + version"
        v-if="chartOptions && partners && partners.length"
        :options="chartOptions"
      />
    </div>
  </div>
</template>

<script>
import { Chart } from 'highcharts-vue';
import { mapState, mapGetters } from 'vuex';
import get from 'lodash.get';

// import 'highcharts/css/highcharts.css';

export default {
  components: {
    Chart,
  },
  props: {
    loadDataFn: Function,
    unit: {
      type: String,
      default: '',
    },
  },
  async mounted() {
    await this.refresh();
  },
  data() {
    return {
      chartOptions: undefined,
      haveContent: false,
      graphData: undefined,
      version: 1,
    };
  },

  methods: {
    createChart(graphData) {
      this.chartOptions = undefined;
      if (!graphData) return;

      const upSerieData = graphData.map(d => [d.date, d.out]);
      const downSerieData = graphData.map(d => [d.date, d.in]);

      this.chartOptions = {
        chart: {
          renderTo: 'container',
          zoomType: 'xy',
          height: 250,
          type: 'column',
        },
        title: {
          text: '',
        },
        tooltip: {
          headerFormat: '',
          pointFormat: '{series.name}: {point.y} ' + this.unit,
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
        credits: {
          enabled: false,
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

    async refresh() {
      // format {data: Utc, up: number, down: number }
      const graphData = await this.loadDataFn(this.partners);
      this.createChart(graphData);

      this.version += 1;
    },
  },
  watch: {
    contextPartners() {
      this.refresh();
    },
  },
  computed: {
    ...mapState('userContext', ['contextPartnersType', 'contextPartners']),
    ...mapGetters(['userIsPartner', 'userInfos']),
    partners() {
      if (!this.userIsPartner) {
        if (this.contextPartners && this.contextPartners.length) {
          return this.contextPartners.map(p => p.id);
        }
      } else {
        return [get(this.userInfos, 'party.id')];
      }

      return [];
    },
  },
};
</script>

<style lang="scss"></style>
