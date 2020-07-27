<template>
  <div>
    <div ref="singledate" class="row datepicker" :class="{ error: !!error, large: large }">
      <div class="col">
        <i class="icon ic-Calendar-Icon" />
      </div>
      <div class="col-9 value" style="padding: 0;">
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

export default {
  model: {
    prop: 'value',
    event: 'change'
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
    direction: {
      type: String,
      required: false,
      default: 'up',
    },
  },
  computed: {
    dateFormat() {
      if (this.timePicker) return 'DD/MM/YYYY HH:mm:ss';
      else return 'DD/MM/YYYY';
    },
  },
  methods: {
    clearValue() {
      this.$emit('change', '');
    },
    createDatePicker() {
      const onDateSelected = value => {
        this.$emit('change', value.format(this.dateFormat));
      };

      // TODO: add i18n support
      // Problème avec l'utilisation de la librairie, obligatoire pour refresh le state startDate
      setTimeout(() => {
        this.dateInstance = $(this.$refs.singledate).daterangepicker(
          {
            singleDatePicker: true,
            startDate: this.value ? this.value : undefined,
            drops: this.direction,
            timePicker: this.timePicker,
            timePicker24Hour: true,
            locale: {
              format: this.dateFormat,
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
      });
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

  &.large {
    padding-top: 0.3rem;
    padding-bottom: 0.4rem;

    .icon {
      font-size: 1.4rem;
      top: 0.2rem;
      position: relative;
    }

    .value {
      font-size: 1.3rem;
    }
  }
}
</style>
<style lang="scss">
.daterangepicker {
  z-index: 9999 !important;
}
</style>
