<template>
  <div>
    <div ref="singledate" class="row datepicker" :class="{ error: !!error }">
      <div class="col"><i class="icon ic-Calendar-Icon" /></div>
      <div class="col-9" style="padding: 0"><span>{{ value }}</span></div>
      <div class="col"><button v-if="value" @click.stop="clearValue" class="btn btn-link"><i class="icon ic-Cross-Icon" /></button></div>
    </div>
    <span v-if="error" class="error-text">{{ $t(error) }}</span>
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
    error: {
      type: String,
      required: false,
    },
  },
  methods: {
    clearValue() {
      this.$emit('change', '');
    },
    createDatePicker() {
      let startDate;
      if (this.start) {
        startDate = moment(this.value, 'DD/MM/YYYY');
      } else {
        // startDate = moment();
      }

      const onDateSelected = value => {
        this.$emit('change', value.format('DD/MM/YYYY'));
      };

      // TODO: add i18n support
      this.dateInstance = $(this.$refs.singledate).daterangepicker(
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
  },
  watch: {
    value(newValue) {
      // le date picker garde la dernière date séléctionnée, la seule façon de la vider est de recréer le date picker
      if (!newValue && this.dateInstance) {
        this.createDatePicker();
      }
    },
  },
  mounted() {
    this.createDatePicker();
  },
};
</script>

<style lang="scss" scoped>
.datepicker {
  background: #fff;
  cursor: pointer;
  padding: 5px 10px;
  border: 1px solid #ccc;
  width: 100%;
  margin: 0;

  &.error {
    border: 1px solid $orange;
    border-radius: 3px;
  }

  .col {
    padding: 0;
  }

  button {
    padding: 0;
  }
}
</style>
