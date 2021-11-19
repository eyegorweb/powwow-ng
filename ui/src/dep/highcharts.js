import Highcharts from 'highcharts';

import mapInit from 'highcharts/modules/map';
import variablepie from 'highcharts/modules/variable-pie';

let highchartsIsReady = false;

export default function configureHighcharts(lang) {
  if (lang === 'fr') {
    Highcharts.setOptions({
      lang: {
        months: [
          'Janvier',
          'Février',
          'Mars',
          'Avril',
          'Mai',
          'Juin',
          'Juillet',
          'Août',
          'Septembre',
          'Octobre',
          'Novembre',
          'Décembre',
        ],
        weekdays: ['Dimanche', 'Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi'],
        shortMonths: [
          'Jan',
          'Fév',
          'Mar',
          'Avr',
          'Mai',
          'Jui',
          'Juil',
          'Aoû',
          'Sep',
          'Oct',
          'Nov',
          'Déc',
        ],
      },
    });
  }
  if (lang === 'en') {
    Highcharts.setOptions({
      lang: {
        loading: 'Loading...',
        months: [
          'January',
          'February',
          'March',
          'April',
          'May',
          'June',
          'July',
          'August',
          'September',
          'October',
          'November',
          'December',
        ],
        shortMonths: [
          'Jan',
          'Feb',
          'Mar',
          'Apr',
          'May',
          'Jun',
          'Jul',
          'Aug',
          'Sep',
          'Oct',
          'Nov',
          'Dec',
        ],
        weekdays: ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
        decimalPoint: '.',
        numericSymbols: ['k', 'M', 'G', 'T', 'P', 'E'],
        resetZoom: 'Reset zoom',
        resetZoomTitle: 'Reset zoom level 1:1',
        thousandsSep: ' ',
      },
    });
  }

  if (!highchartsIsReady) {
    mapInit(Highcharts);
    variablepie(Highcharts);

    Highcharts.setOptions({
      credits: {
        enabled: false,
      },
    });

    highchartsIsReady = true;
  }

  Highcharts.maps['custom/world'] = window.WORLD_MAP_DATA;

  Highcharts.wrap(Highcharts.Chart.prototype, 'firstRender', function (proceed) {
    // Run original proceed method
    proceed.call(this);
    let chart = this, container = this.container, pointer = this.pointer;
    container.oncontextmenu = function(e) {
      let hoverPoint = chart.hoverPoint;
      e = pointer.normalize(e);

        e.cancelBubble = true; // IE specific
        e.returnValue = false; // IE 8 specific
        if (e.stopPropagation) {
            e.stopPropagation();
        }
        if (e.preventDefault) {
          e.preventDefault();
        }

        if (!pointer.hasDragged) {
          if (hoverPoint && pointer.inClass(e.target, 'highcharts-tracker')) {
            // the point click event
            hoverPoint.firePointEvent('contextmenu', e);
          }
        }
    }
});


}
