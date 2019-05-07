<template>
  <div>
    <div
      ref="daterange"
      style="background: #fff; cursor: pointer; padding: 5px 10px; border: 1px solid #ccc; width: 100%"
    >
      <i class="icon ic-Calendar-Icon" />&nbsp;
      <span>{{ formattedResult }}</span>
      <i class="fa fa-caret-down" />
    </div>
  </div>
</template>

<script>
import $ from 'jquery';
import 'daterangepicker/daterangepicker.js';
import 'daterangepicker/daterangepicker.css';

import moment from 'moment';

export default {
  props: {
    start: {
      type: String,
    },
    end: {
      type: String,
    },
  },
  mounted() {
    let startDate;
    let endDate;
    if (this.start && this.end) {
      startDate = moment(this.start, 'DD/MM/YYYY');
      endDate = moment(this.end, 'DD/MM/YYYY');
    } else {
      startDate = moment().subtract(29, 'days');
      endDate = moment();
    }

    const onDateSelected = (start, end) => {
      this.$emit('change', {
        startDate: start.format('DD/MM/YYYY'),
        endDate: end.format('DD/MM/YYYY'),
      });
    };

    // TODO: add i18n support
    $(this.$refs.daterange).daterangepicker(
      {
        startDate,
        endDate,
        locale: {
          format: 'DD/MM/YYYY',
          separator: ' - ',
          applyLabel: 'Appliquer',
          cancelLabel: 'Annuler',
          fromLabel: 'Du',
          toLabel: 'Au',
          customRangeLabel: 'Autres',
          daysOfWeek: ['Dim', 'Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam'],
          monthNames: [
            'Janvier',
            'Fevrier',
            'Mars',
            'Avril',
            'Mai',
            'Juin',
            'Juillet',
            'Août',
            'Septembre',
            'Octobre',
            'Novembre',
            'Decembre',
          ],
          firstDay: 1,
        },
        ranges: {
          'Depuis 1 mois': [moment().subtract(1, 'month'), moment()],
          'Depuis 3 mois': [moment().subtract(3, 'month'), moment()],
          'Depuis 6 mois': [moment().subtract(6, 'month'), moment()],
          'Depuis 1 an': [moment().subtract(1, 'year'), moment()],
        },
      },
      onDateSelected
    );
  },

  computed: {
    formattedResult() {
      if (!this.start && !this.end) return '';

      return this.start + ' - ' + this.end;
    },
  },
};
</script>

<style></style>
