import Highcharts from 'highcharts';

import mapInit from 'highcharts/modules/map';

export default function configureHighcharts() {
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
  mapInit(Highcharts);

  Highcharts.maps['custom/world'] = window.WORLD_MAP_DATA;
}
