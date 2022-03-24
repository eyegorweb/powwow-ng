<template>
  <div class="mb-3 cmp-conso-history-data-graph">
    <template v-if="hasStreams">
      <UiTabs :tabs="tabs">
        <template slot-scope="{ tab }">
          <UiTab v-if="tab" :is-selected="tab.label === currentTab" class="tab-grow">
            <a href="#" @click.prevent="() => (currentTab = tab.label)">{{ tab.title }}</a>
          </UiTab>
        </template>
      </UiTabs>
      <template v-for="(_tab, index) in tabs">
        <div :key="_tab.label">
          <div v-if="currentTab === _tab.label">
            <chart v-if="streamChartOptions.length > 0" :options="streamChartOptions[index]" />
          </div>
        </div>
      </template>
    </template>

    <template v-else>
      <chart v-if="classicChartOptions" :options="classicChartOptions" />
    </template>
  </div>
</template>

<script>
import UiTabs from '@/components/ui/Tabs';
import UiTab from '@/components/ui/Tab';
import Highcharts from 'highcharts';
import { Chart } from 'highcharts-vue';
import { fetchConsoHistory, fetchStreamConsoHistory } from '@/api/consumption.js';
import { getMonthString } from '@/utils/date';
import { formatBytes } from '@/api/utils';

export default {
  components: {
    Chart,
    UiTabs,
    UiTab,
  },

  props: {
    partner: Object,
    billingAccount: Object,
  },

  async mounted() {
    await this.refreshDataUsageStreams();
    this.initFlowTypesToggle();
    this.refreshDataChart();
  },

  data() {
    return {
      chartOptions: [],
      classicChartOptions: undefined,
      streamChartOptions: [],
      currentTab: 'classic',
      tabs: [],
      dataUsage: [],
      dataUsageStreams: [],
    };
  },

  computed: {
    hasStreams() {
      let hasStreams = this.dataUsageStreams.length;
      if (hasStreams > 0) this.$emit('hasStreams', true);
      return hasStreams > 0;
    },
  },

  methods: {
    async refreshDataUsageStreams() {
      if (!this.partner) return;

      const params = {
        partyId: this.partner.id,
      };

      if (this.billingAccount && this.billingAccount.data) {
        params.customerAccountCode = this.billingAccount.data.code;
      }
      this.$emit('isLoading', true);
      this.dataUsageStreams = await fetchStreamConsoHistory(params);
      this.$emit('isLoading', false);
    },

    formattedData(dataConsumption) {
      return dataConsumption.reduce(
        (all, c) => {
          const month = getMonthString(c.consumptionDate);
          all.categories.push(month.slice(0, 3));
          all.consumptionFrIn.push(c.consumptionFrIn);
          all.consumptionFrOut.push(c.consumptionFrOut);
          all.consumptionRoamingIn.push(c.consumptionRoamingIn);
          all.consumptionRoamingOut.push(c.consumptionRoamingOut);
          return all;
        },
        {
          categories: [],
          consumptionFrIn: [],
          consumptionFrOut: [],
          consumptionRoamingIn: [],
          consumptionRoamingOut: [],
        }
      );
    },

    async refreshDataChart() {
      if (!this.partner) return;

      const params = {
        partyId: this.partner.id,
      };

      if (this.billingAccount && this.billingAccount.data) {
        params.customerAccountCode = this.billingAccount.data.code;
      }

      this.$emit('isLoading', true);

      this.dataUsage = await fetchConsoHistory(params);

      this.$emit('isLoading', false);

      if (!this.dataUsage) return;
      const formattedData = this.formattedData(this.dataUsage.dataConsumption);

      this.classicChartOptions = {
        chart: {
          type: 'column',
        },
        colors: ['#488bf7', '#083e96', '#dc73de', '#9c109e'],
        title: {
          text: '',
        },
        xAxis: [
          {
            categories: formattedData.categories,
            crosshair: true,
          },
        ],
        yAxis: {
          labels: {
            formatter() {
              return formatBytes(this.value);
            },
            style: {
              color: Highcharts.getOptions().colors[1],
            },
          },
          title: {
            text: 'Conso',
            style: {
              color: Highcharts.getOptions().colors[1],
            },
          },
        },
        tooltip: {
          formatter() {
            return (
              '<b>' +
              this.x +
              '</b><br/>' +
              this.series.name +
              ': ' +
              formatBytes(this.y) +
              '<br/>' +
              'Total: ' +
              formatBytes(this.point.stackTotal)
            );
          },
        },

        plotOptions: {
          column: {
            stacking: 'normal',
            zones: [
              {
                color: '#FE2E64',
                value: 2,
              },
            ],
          },
        },

        series: [
          {
            name: this.$t('getreport.dashboard.legends.incomingFrance'),
            data: formattedData.consumptionFrIn,
            stack: 'entrant',
          },
          {
            name: this.$t('getreport.dashboard.legends.incomingRoming'),
            data: formattedData.consumptionRoamingIn,
            stack: 'entrant',
          },
          {
            name: this.$t('getreport.dashboard.legends.outgoingFrance'),
            data: formattedData.consumptionFrOut,
            stack: 'sortant',
          },
          {
            name: this.$t('getreport.dashboard.legends.outgoingRoaming'),
            data: formattedData.consumptionRoamingOut,
            stack: 'sortant',
          },
        ],
      };

      if (this.hasStreams) {
        for (let i = 0; i < this.dataUsageStreams.length; i++) {
          const formattedData = this.formattedData(this.dataUsageStreams[i].dataConsumption);

          this.streamChartOptions.push({
            chart: {
              type: 'column',
            },
            colors: ['#488bf7', '#083e96', '#dc73de', '#9c109e'],
            title: {
              text: '',
            },
            xAxis: [
              {
                categories: formattedData.categories,
                crosshair: true,
              },
            ],
            yAxis: {
              labels: {
                formatter() {
                  return formatBytes(this.value);
                },
                style: {
                  color: Highcharts.getOptions().colors[1],
                },
              },
              title: {
                text: 'Conso',
                style: {
                  color: Highcharts.getOptions().colors[1],
                },
              },
            },
            tooltip: {
              formatter() {
                return (
                  '<b>' +
                  this.x +
                  '</b><br/>' +
                  this.series.name +
                  ': ' +
                  formatBytes(this.y) +
                  '<br/>' +
                  'Total: ' +
                  formatBytes(this.point.stackTotal)
                );
              },
            },

            plotOptions: {
              column: {
                stacking: 'normal',
                zones: [
                  {
                    color: '#FE2E64',
                    value: 2,
                  },
                ],
              },
            },

            series: [
              {
                name: this.$t('getreport.dashboard.legends.incomingFrance'),
                data: formattedData.consumptionFrIn,
                stack: 'entrant',
              },
              {
                name: this.$t('getreport.dashboard.legends.incomingRoming'),
                data: formattedData.consumptionRoamingIn,
                stack: 'entrant',
              },
              {
                name: this.$t('getreport.dashboard.legends.outgoingFrance'),
                data: formattedData.consumptionFrOut,
                stack: 'sortant',
              },
              {
                name: this.$t('getreport.dashboard.legends.outgoingRoaming'),
                data: formattedData.consumptionRoamingOut,
                stack: 'sortant',
              },
            ],
          });
        }

        this.streamChartOptions = [this.classicChartOptions, ...this.streamChartOptions];
      }
    },

    initFlowTypesToggle() {
      const flowTypes = [
        {
          label: 'classic',
          title: 'Classique',
          default: true,
        },
      ];

      if (this.dataUsageStreams && this.dataUsageStreams.length) {
        this.dataUsageStreams.forEach((d) => {
          flowTypes.push({
            label: d.stream,
            title: d.stream,
          });
        });
      }

      this.tabs = flowTypes;
    },
  },

  watch: {
    async partner() {
      await this.refreshDataUsageStreams();
      this.initFlowTypesToggle();
      this.refreshDataChart();
    },
    async billingAccount() {
      await this.refreshDataUsageStreams();
      this.initFlowTypesToggle();
      this.refreshDataChart();
    },
  },
};
</script>

<style lang="scss" scoped>
.tab-grow {
  flex-grow: 1;
}
.tab-label {
  &:not(.is-selected) {
    background: $medium-gray;
  }
  margin-left: 1px;
  margin-right: 1px;
}
</style>
