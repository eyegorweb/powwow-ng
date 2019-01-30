<template>
  <div>
    <div id="reportrange" ref="daterange" style="background: #fff; cursor: pointer; padding: 5px 10px; border: 1px solid #ccc; width: 100%">
      <i class="icon ic-Calendar-Icon" />&nbsp;
      <span>{{ formattedResult }}</span>
      <i class="fa fa-caret-down" />
    </div>
  </div>
</template>

<script>
import $ from 'jquery';
import 'daterangepicker/moment.min.js';
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
  data() {
    return {
      selectedStart: '',
      selectedEnd: '',
    };
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

    this.selectedStart = startDate.format('DD/MM/YYYY');
    this.selectedEnd = endDate.format('DD/MM/YYYY');

    const onDateSelected = (start, end) => {
      this.selectedStart = start.format('DD/MM/YYYY');
      this.selectedEnd = end.format('DD/MM/YYYY');

      this.$emit('change', {
        start: this.selectedStart,
        end: this.selectedEnd,
      });
    };

    // TODO: add i18n support
    $(this.$refs.daterange).daterangepicker(
      {
        startDate: startDate,
        endDate: endDate,
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

    // onDateSelected(start, end);
  },

  computed: {
    formattedResult() {
      return this.selectedStart + ' - ' + this.selectedEnd;
    },
  },
};
</script>

<style lang="scss" scoped>
.date {
}
</style>
