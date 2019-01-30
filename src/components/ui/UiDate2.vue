<template>
  <div>
    <div ref="singledate" style="background: #fff; cursor: pointer; padding: 5px 10px; border: 1px solid #ccc; width: 100%">
      <i class="icon ic-Calendar-Icon" />&nbsp;
      <span>{{ value }}</span>
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
    value: {
      type: String,
    },
  },
  mounted() {
    let startDate;
    if (this.start) {
      startDate = moment(this.value, 'DD/MM/YYYY');
    } else {
      startDate = moment();
    }

    const onDateSelected = value => {
      this.$emit('change', value.format('DD/MM/YYYY'));
    };

    // TODO: add i18n support
    $(this.$refs.singledate).daterangepicker(
      {
        singleDatePicker: true,
        startDate: startDate,
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
      },
      onDateSelected
    );
  },
};
</script>

<style lang="scss" scoped>
.date {
}
</style>
