<template>
  <div class="input-group w-100">
    <UiDropdownButton ref="dropdown" class="input-group-prepend">
      <template slot="button">Période</template>

      <h6>Choisir une période :</h6>
      <div>
        <!-- TODO spécifique aux commandes, si ce composant est réutilisé, réfactoriser -->
        <UiButton variant="outline-primary" block @click="updateRange(1)">Commandes depuis 1 mois</UiButton>
        <UiButton variant="outline-primary" block @click="updateRange(3)">Commandes depuis 3 mois</UiButton>
        <UiButton variant="outline-primary" block @click="updateRange(6)">Commandes depuis 6 mois</UiButton>
        <UiButton variant="outline-primary" block @click="updateRange(12)">Commandes depuis 1 an</UiButton>
        <UiButton variant="outline-primary" block>Toutes les commandes</UiButton>
      </div>

      <div slot="append" :key="containerVersion" class="input-group position-relative">
        <input class="form-control border-right-0 rounded-0 h-100" type="text" ref="start">
        <i class="icon ic-Arrow-Right-Icon position-absolute" />
        <input class="form-control h-100" type="text" ref="end">
      </div>
    </UiDropdownButton>
  </div>
</template>

<script>
/**
 * DEPRECATED will be removed next sprint
 */
import flatpickr from 'flatpickr';
import RangePlugin from 'flatpickr/dist/plugins/rangePlugin';
import 'flatpickr/dist/flatpickr.min.css';
import { propWithSync } from '@/mixins';
import { French } from 'flatpickr/dist/l10n/fr.js';
import { subMonths } from 'date-fns';
import UiButton from '@/components/ui/Button';
import UiDropdownButton from '@/components/ui/UiDropdownButton';

flatpickr.defaultConfig.plugins;

export default {
  name: 'UiDateRange',
  mixins: [propWithSync('start'), propWithSync('end')],

  data() {
    return {
      show: false,
      date: new Date(),
      containerVersion: 0,
      // start: undefined,
      //  end: new Date(),
    };
  },

  mounted() {
    this.createFlatpickr();
  },

  methods: {
    hideDropdown() {
      this.$refs.dropdown.hide();
    },
    async onChange([start, end]) {
      // on evite des changer la date vers un objet different si celui-ci représente la même date
      if (
        (start && !this.start_) ||
        (this.start_ && start && this.start_.toString() !== start.toString())
      )
        this.start_ = start;
      if ((end && !this.end_) || (this.end_ && end && this.end_.toString() !== end.toString()))
        this.end_ = end;

      if (start && end) {
        this.$emit('update:range', { start, end });
        await this.$nextTick();
        // this.createFlatpickr();
      }
    },

    createFlatpickr() {
      if (this.fp) this.fp.destroy();
      this.fp = flatpickr(this.$refs.start, {
        dateFormat: 'd/m/y',
        showMonths: 2,
        allowInput: true,
        closeOnSelect: false,
        onChange: this.onChange,
        onOpen: this.hideDropdown,
        defaultDate: [this.start, this.end],
        locale: French,
        plugins: [
          new RangePlugin({
            input: this.$refs.end,
          }),
        ],
      });
    },

    async updateRange(amount) {
      const today = new Date();
      const start = subMonths(today, amount);
      this.start_ = start;
      this.end_ = today;
      this.containerVersion += 1;
      this.$emit('update:range', { start, end: today });
      await this.$nextTick();
      this.createFlatpickr();
      this.$refs.dropdown.hide();
    },
  },

  watch: {
    start(start) {
      this.fp.setDate(start, false);
    },
    // end() {
    // Bug https://github.com/flatpickr/flatpickr/issues/1345 ne permet pas
    // changer la date du deuxième input, du coup on recréer le tout
    //
    // this.createFlatpickr();
    // },
  },

  beforeDestroy() {
    this.fp.destroy();
  },

  components: { UiButton, UiDropdownButton },
};
</script>

<style lang="scss" scoped>
@import '~bootstrap/scss/functions';
@import '~bootstrap/scss/variables';

.input-group-prepend /deep/ .dropdown-toggle {
  background-color: $light-gray;
}

.icon {
  color: $gray-700;
  left: 50%;
  top: 50%;
  z-index: 10;
  transform: translate(-50%, -50%);
}

.form-control:focus {
  color: $secondary;
}

input:last-child {
  border-left-width: 0;
  border-top-left-radius: 0;
  border-bottom-left-radius: 0;
  text-align: right;
}
</style>

<style>
.flatpickr-calendar.arrowTop:before,
.flatpickr-calendar.arrowTop:after {
  content: none;
}
</style>
