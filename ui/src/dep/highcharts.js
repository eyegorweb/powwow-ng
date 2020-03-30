import Highcharts from 'highcharts';

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
}
