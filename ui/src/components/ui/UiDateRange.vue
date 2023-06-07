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
      var self = this;
      this.canShowCalendar = true;
      this.$nextTick(() => {
        let startDate;
        let endDate;

        if (this.start && this.end) {
          startDate = moment(this.start, 'DD/MM/YYYY HH:mm:ss');
          endDate = moment(this.end, 'DD/MM/YYYY HH:mm:ss');
        }

        // TODO: add i18n support
        const localeParam = this.getLocaleParam();
        $(this.$refs.daterange).daterangepicker({
          timePicker: true,
          timePicker24Hour: true,
          startDate,
          endDate,
          drops: this.direction,
          ...localeParam,
        });

        $(this.$refs.daterange).on('apply.daterangepicker', function(_evt, picker) {
          let limitDateError = false;
          if (this.oneYearLimit) {
            if (picker.startDate && picker.endDate) {
              const diff = picker.endDate.diff(picker.startDate, 'year', true);
              if (diff <= 1.003) {
                this.$emit('change', {
                  startDate: picker.startDate.format('DD/MM/YYYY HH:mm:ss'),
                  endDate: picker.endDate.format('DD/MM/YYYY HH:mm:ss'),
                });
              } else {
                this.rangeInError = `${picker.startDate.format(
                  'DD/MM/YYYY HH:mm:ss'
                )} - ${picker.endDate.format('DD/MM/YYYY HH:mm:ss')}`;

                limitDateError = true;
              }
            }
          } else {
            self.$emit('change', {
              startDate: picker.startDate.format('DD/MM/YYYY HH:mm:ss'),
              endDate: picker.endDate.format('DD/MM/YYYY HH:mm:ss'),
            });
          }

          this.limitDateError = limitDateError;
        });
      });
    },
    getLocaleParam() {
      if (this.$i18n.locale === 'en') {
        return {
          locale: {
            format: 'DD/MM/YYYY HH:mm:ss',
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
          format: 'DD/MM/YYYY HH:mm:ss',
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

      if (this.start && this.end) {
        return this.start + ' - ' + this.end;
      }

      return '';
    },
  },
};
</script>

<style></style>
