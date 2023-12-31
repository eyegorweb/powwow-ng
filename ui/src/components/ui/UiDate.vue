<template>
  <div>
    <div class="disableDate" v-if="disabled"></div>
    <div ref="singledate" class="row datepicker" :class="{ error: !!error, large: large }">
      <div class="col">
        <i class="icon ic-Calendar-Icon" />
      </div>
      <div class="col-9 value" style="padding: 0">
        <span>{{ value }}</span>
      </div>
      <div>
        <button v-if="value && !fixed" @click.stop="clearValue" class="btn btn-link">
          <i class="icon ic-Cross-Icon" />
        </button>
      </div>
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
  name: 'UiDate',
  model: {
    prop: 'value',
    event: 'change',
  },
  props: {
    value: {
      type: String,
    },
    error: {
      type: String,
      required: false,
    },
    /**
     * enlève la possibilité de mettre une valeur vide
     */
    fixed: Boolean,
    large: Boolean,
    timePicker: Boolean,
    disabled: Boolean,
    direction: {
      type: String,
      required: false,
      default: 'up',
    },
    minDate: String,
  },
  computed: {
    dateFormat() {
      if (this.timePicker) return 'DD/MM/YYYY HH:mm:ss';
      else return 'DD/MM/YYYY';
    },
  },
  methods: {
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
      };
    },
    clearValue() {
      this.$emit('change', '');
    },
    disableTest(event) {
      if (this.disabled) {
        event.preventDefault();
      }
    },
    createDatePicker() {
      const onDateSelected = (value) => {
        this.$emit('change', value.format(this.dateFormat));
      };

      const onDateShowCalendar = () => {
        if (!this.value) {
          this.$emit('change', moment().format(this.dateFormat));
        }
      };

      // TODO: add i18n support
      // Problème avec l'utilisation de la librairie, obligatoire pour refresh le state startDate
      setTimeout(() => {
        const localeParam = this.getLocaleParam();
        this.dateInstance = $(this.$refs.singledate).daterangepicker(
          {
            singleDatePicker: true,
            startDate: this.value ? this.value : undefined,
            drops: this.direction,
            timePicker: this.timePicker,
            timePicker24Hour: true,
            minDate: this.minDate,
            showDropdowns: true,
            ...localeParam,
          },
          onDateSelected
        );

        this.dateInstance.on('showCalendar.daterangepicker', onDateShowCalendar);

        if (this.direction === 'auto') {
          this.dateInstance.on('showCalendar.daterangepicker', function(ev, picker) {
            if (
              picker.element.offset().top - $(window).scrollTop() + picker.container.outerHeight() >
              $(window).height()
            ) {
              return (picker.drops = 'up');
            } else {
              return (picker.drops = 'down');
            }
          });
        }
      });
    },
  },
  watch: {
    async '$i18n.locale'() {
      this.canShowCalendar = false;
      this.$nextTick(() => {
        this.createCalendar();
      });
    },
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
.disableDate {
  position: absolute;
  width: 100%;
  height: 2.5rem;
  z-index: 9;
}

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

  &.large {
    padding-top: 0.3rem;
    padding-bottom: 0.4rem;

    .icon {
      font-size: 1.4rem;
      top: 0.2rem;
      position: relative;
    }

    .value {
      font-size: 0.7rem;
      justify-content: center;
      flex-direction: column;
      display: flex;
    }
  }
}
</style>
<style lang="scss">
.daterangepicker {
  z-index: 9999 !important;
}
</style>
