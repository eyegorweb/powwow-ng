<template>
  <div>
    <div
      v-if="canShowCalendar"
      ref="daterange"
      style="
        background: #fff;
        cursor: pointer;
        padding: 5px 10px;
        border: 1px solid #ccc;
        width: 100%;
      "
    >
      <i class="icon ic-Calendar-Icon" />&nbsp;
      <span>{{ formattedResult }}</span>
      <i class="fa fa-caret-down" />
    </div>
    <div v-if="limitDateError" class="alert alert-danger mt-1" role="alert">
      {{ $t('common.limitDateError') }}
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
    direction: {
      type: String,
      default: 'down',
    },
    oneYearLimit: Boolean,
  },
  data() {
    return {
      canShowCalendar: false,
      limitDateError: false,
      rangeInError: undefined,
    };
  },
  watch: {
    async '$i18n.locale'() {
      this.canShowCalendar = false;
      this.$nextTick(() => {
        this.createCalendar();
      });
    },
  },
  methods: {
    createCalendar() {
      this.canShowCalendar = true;
      this.$nextTick(() => {
        let startDate;
        let endDate;

        if (this.start && this.end) {
          startDate = moment(this.start, 'DD/MM/YYYY');
          endDate = moment(this.end, 'DD/MM/YYYY');
        }

        const onDateSelected = (start, end) => {
          let limitDateError = false;
          if (this.oneYearLimit) {
            if (start && end) {
              const diff = end.diff(start, 'months');
              if (diff <= 12) {
                this.$emit('change', {
                  startDate: start.format('DD/MM/YYYY'),
                  endDate: end.format('DD/MM/YYYY'),
                });
              } else {
                this.rangeInError = `${start.format('DD/MM/YYYY')} - ${end.format('DD/MM/YYYY')}`;
                limitDateError = true;
              }
            }
          } else {
            this.$emit('change', {
              startDate: start.format('DD/MM/YYYY'),
              endDate: end.format('DD/MM/YYYY'),
            });
          }

          this.limitDateError = limitDateError;
        };

        // TODO: add i18n support
        const localeParam = this.getLocaleParam();
        $(this.$refs.daterange).daterangepicker(
          {
            startDate,
            endDate,
            drops: this.direction,
            ...localeParam,
          },
          onDateSelected
        );
      });
    },
    getLocaleParam() {
      if (this.$i18n.locale === 'en') {
        return {
          locale: {
            format: 'DD/MM/YYYY',
            separator: ' - ',
            applyLabel: 'Apply',
            cancelLabel: 'Cancel',
            fromLabel: 'From',
            toLabel: 'To',
            customRangeLabel: 'Others',
            daysOfWeek: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
            monthNames: [
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
            firstDay: 1,
          },
          ranges: {
            'Past month': [moment().subtract(1, 'month'), moment()],
            'Past 3 months': [moment().subtract(3, 'month'), moment()],
            'past 6 months': [moment().subtract(6, 'month'), moment()],
            'last year': [moment().subtract(1, 'year'), moment()],
          },
        };
      }

      return {
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
      };
    },
  },
  mounted() {
    this.createCalendar();
  },

  computed: {
    formattedResult() {
      if (this.limitDateError) {
        return this.rangeInError;
      }

      if (!this.start && !this.end) return '';

      return this.start + ' - ' + this.end;
    },
  },
};
</script>

<style></style>
