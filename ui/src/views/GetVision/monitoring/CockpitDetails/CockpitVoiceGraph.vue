<template>
  <div class="mb-3">
    <chart v-if="chartOptions" :options="chartOptions" />
  </div>
</template>

<script>
import Highcharts from 'highcharts';
import { Chart } from 'highcharts-vue';

import { fetchSupervisionGraphVoice, exportRequestFleetSupervision } from '@/api/supervision.js';
import { formatLargeNumber } from '@/utils/numbers';
import { formatUTCtoStrDate } from '@/utils/date.js';
import { mapMutations } from 'vuex';

export default {
  components: {
    Chart,
  },

  data() {
    return {
      chartOptions: undefined,
    };
  },

  props: {
    supervisionType: String,
    filters: Object,
  },

  async mounted() {
    await this.refreshData();
    this.$emit('loaded');
  },

  watch: {
    filters() {
      this.refreshData();
    },
  },

  methods: {
    ...mapMutations(['openExportChoice']),
    chooseExportFormat(params) {
      this.params = params;
      this.openExportChoice({
        exportFn: async (params, orderBy, exportFormat, asyncExportRequest) => {
          return await exportRequestFleetSupervision(
            this.params,
            exportFormat,
            this.supervisionType,
            'VOICE'
          );
        },
      });
    },
    sumAllData(dataOut, dataIn) {
      return dataOut.map((n) => {
        const corresponding = dataIn.find((c) => c.x == n.x);
        const sum = n.y + corresponding.y;
        return {
          x: n.x,
          y: sum,
          myData: n.myData,
        };
      });
    },
    async refreshData() {
      const data = await fetchSupervisionGraphVoice({
        supervisionType: this.supervisionType,
        ...this.filters,
      });

      if (!data) return;

      const formattedData = data.responses.reduce(
        (all, item) => {
          const dateFirstSplit = item.date.split(' ');
          const dateParts = dateFirstSplit[0].split('/');
          const timeParts =
            dateFirstSplit && dateFirstSplit.length > 1 ? dateFirstSplit[1].split(':') : ['0'];
          const formattedObj = {
            ...item,
            date: Date.UTC(
              parseInt(dateParts[2]),
              parseInt(dateParts[1] - 1),
              parseInt(dateParts[0]),
              parseInt(timeParts[0])
            ),
          };
          all.minIn.push({ x: formattedObj.date, y: formattedObj.volumeIn, myData: formattedObj });
          all.minOut.push({
            x: formattedObj.date,
            y: formattedObj.volumeOut,
            myData: formattedObj,
          });
          all.nbCallsIn.push({
            x: formattedObj.date,
            y: formattedObj.numberCallsIn,
            myData: formattedObj,
          });
          all.nbCallsOut.push({
            x: formattedObj.date,
            y: formattedObj.numberCallsOut,
            myData: formattedObj,
          });
          all.trafficSMS.push({
            x: formattedObj.date,
            y: formattedObj.numberTraffSims,
            myData: formattedObj,
          });

          return all;
        },
        { minIn: [], minOut: [], nbCallsIn: [], nbCallsOut: [], trafficSMS: [] }
      );

      const tickPositions = formattedData.minIn.map((d) => d.x);

      const pointFormatter = (p) => {
        return `
              <div style="width: 7px; height: 7px; border-radius: 15px; background-color: ${p.series.userOptions.color}; display: inline-block; margin-right: 0.5rem"></div>
              ${p.series.userOptions.name}
              :
              ${p.y} <br/>
              `;
      };
      var that = this;
      this.chartOptions = {
        chart: {
          zoomType: 'xy',
        },
        title: {
          text: 'Voix par Tranches',
          align: 'center',
        },
        subtitle: {
          text: 'Dernière mise à jour:' + data.lastUpdateDate,
          align: 'center',
        },
        plotOptions: {
          column: {
            stacking: 'normal',
            dataLabels: {
              enabled: false,
              color: (Highcharts.theme && Highcharts.theme.dataLabelsColor) || 'white',
              style: {
                textShadow: '0 0 3px black',
              },
            },
          },
          series: {
            marker: {
              enabled: false,
            },
            // allowPointSelect: true,
            events: {
              click() {
                const chart = this.chart;
                if (chart.lbl) {
                  chart.lbl.hide();
                }
              },
              // mouseOut: function() {
              //   const chart = this.chart;
              //   if (chart.lbl) {
              //     chart.lbl.hide();
              //   }
              // },
            },
            point: {
              events: {
                contextmenu(e) {
                  if (that.filters.params.partyIds) {
                    const chart = this.series.chart;
                    const text = `<button class="btn btn-primary btn-block py-1 small-text">Export</button>`;
                    if (!chart.lbl) {
                      chart.lbl = chart.renderer
                        .label(text, undefined, undefined, undefined, undefined, undefined, true) // true for useHTML
                        .css({
                          fontSize: '12px',
                        })
                        .add();
                    }
                    chart.lbl.show().attr({
                      x: e.offsetX,
                      y: e.offsetY - 40,
                    });
                    chart.lbl.on('click', (evt) => {
                      const elem = chart.series[0].options.data.filter((e) => e.x === this.x);
                      const dateSplitted = elem[0].myData.formatDate.split(' ');
                      const params = {
                        dateSplitted,
                        partyId: that.filters.params.partyIds[0],
                        country: that.filters.params.locationCode,
                        offerCode: that.filters.params.offerCode,
                      };

                      that.chooseExportFormat(params);
                      if (evt.stopPropagation) {
                        evt.stopPropagation();
                      }
                      if (evt.preventDefault) {
                        evt.preventDefault();
                      }
                      this.series.chart.lbl.hide();
                    });
                    // chart.lbl.on('mouseout', (evt) => {
                    //   const chart = this.series.chart;
                    //   if (chart.lbl) {
                    //     chart.lbl.hide();
                    //   }
                    // });
                  }
                },
                click() {
                  const chart = this.series.chart;
                  if (chart.lbl) {
                    chart.lbl.hide();
                  }
                },
              },
            },
          },
        },
        xAxis: [
          {
            tickPositions,
            labels: {
              formatter() {
                var x = formattedData.minIn.filter((e) => e.x === this.value);
                var xSplitted = x[0].myData.formatDate.split(' ');
                if(that.supervisionType==='INTRA_DAY' || that.supervisionType==='INTRADAY_CUMUL' ){
                if (xSplitted.length == 2) {
                  if(xSplitted.[1]==='06h')
                  return  x[0].myData.formatDate;
                  else
                  return xSplitted.[1];
                }
                return x[0].myData.formatDate;
                }else{
                   return formatUTCtoStrDate(this.value, 'DD. MMM');
                }
              },
              style: {
                color: Highcharts.getOptions().colors[1],
              },
              rotation: -45,
            },
            crosshair: true,
          },
        ],
        yAxis: [
          {
            labels: {
              formatter() {
                return formatLargeNumber(this.value);
              },
              style: {
                color: Highcharts.getOptions().colors[1],
              },
            },
            title: {
              text: '',
              style: {
                color: Highcharts.getOptions().colors[1],
              },
            },
          },
          {
            allowDecimals: false,
            title: {
              text: '',
              style: {
                color: Highcharts.getOptions().colors[0],
              },
            },
            labels: {
              format: '{value} trafiquantes',
              formatter() {
                return formatLargeNumber(this.value);
              },
              style: {
                color: Highcharts.getOptions().colors[0],
              },
            },
            opposite: true,
          },
        ],
        tooltip: {
          shared: true,
          useHTML: true,
          formatter() {
            return this.points.reduce(
              (all, p) => {
                const pointOut = pointFormatter(p);
                all.push(pointOut);
                return all;
              },
              [this.points[0].point.myData.formatDate, '<br />']
            );
          },
        },
        legend: {
          layout: 'horizontal',
          align: 'center',
          verticalAlign: 'bottom',
          floating: false,
          backgroundColor:
            Highcharts.defaultOptions.legend.backgroundColor || 'rgba(255,255,255,0.25)', // theme
        },
        series: [
          {
            name: 'Minutes total',
            type: 'column',
            stack: 'vol',
            color: '#05d0a6',
            visible: false,
            data: this.sumAllData(formattedData.minIn, formattedData.minOut),
          },
          {
            name: 'Minutes Reçues',
            type: 'column',
            stack: 'vol',
            color: '#3498db',
            data: formattedData.minIn,
          },
          {
            name: 'Minutes Emises',
            type: 'column',
            stack: 'vol',
            color: '#3498db',
            data: formattedData.minOut,
          },

          {
            name: 'Appels Entrants',
            type: 'column',
            stack: 'vol',
            visible: false,
            color: '#6cc3de',
            data: formattedData.nbCallsIn,
          },
          {
            name: 'Appels Sortants',
            type: 'column',
            stack: 'vol',
            color: '#debc6c',
            visible: false,
            data: formattedData.nbCallsOut,
          },

          {
            name: 'Appels total',
            type: 'spline',
            stack: 'vol',
            color: '#05d0a6',
            visible: false,
            data: this.sumAllData(formattedData.nbCallsIn, formattedData.nbCallsOut),
          },

          {
            name: 'SIM Trafiquantes',
            type: 'spline',
            yAxis: 1,
            color: '#c8007b',
            tooltip: {
              valueSuffix: ' sim',
            },
            data: formattedData.trafficSMS,
          },
        ],
      };
    },
  },
};
</script>

<style lang="scss" scoped></style>
