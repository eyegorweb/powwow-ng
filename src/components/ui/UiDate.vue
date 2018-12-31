<template>
  <div>
    <input placeholder="Immédiate" class="p-1 m-1" type="text" v-bind="$attrs" ref="dateValue">
  </div>
</template>

<script>
import flatpickr from 'flatpickr';
import 'flatpickr/dist/flatpickr.min.css';
import { propWithSync } from '@/mixins';

export default {
  name: 'UiDate',

  mixins: [propWithSync('dateValue')],

  mounted() {
    this.createFlatpickr();
  },

  methods: {
    onChange([dateValue]) {
      this.dateValue_ = dateValue;
    },

    createFlatpickr() {
      this.fp = flatpickr(this.$refs.dateValue, {
        dateFormat: 'd/m/y',
        allowInput: true,
        // closeOnSelect: false,
        onChange: this.onChange,
      });
    },
  },
};
</script>

<style scoped>
</style>
