<template>
  <div>
    <div class="row">
      <div class="col d-flex">
        <UiCheckbox v-model="isRangeMode" />
        <span>{{ $t('range') }}</span>
      </div>
    </div>
    <UiInput v-model="inputFrom" />
    <UiInput v-if="isRangeMode" v-model="inputTo" />
  </div>
</template>

<script>
import UiInput from '@/components/ui/UiInput';
import UiCheckbox from '@/components/ui/Checkbox';

export default {
  components: {
    UiInput,
    UiCheckbox,
  },
  props: {
    selectedData: Object,
  },

  watch: {
    isRangeMode() {
      this.emitNewValues(this.inputFrom, this.inputTo);
    },
  },
  data() {
    return {
      isRangeMode: false,
    };
  },

  methods: {
    onChange({ inputFrom, inputTo }) {
      this.$emit('change', {
        from: inputFrom,
        to: inputTo,
      });
    },
    emitNewValues(value1, value2) {
      if (this.isRangeMode) {
        this.$emit('input', {
          value1,
          value2,
        });
      } else {
        this.$emit('input', {
          value1,
        });
      }
    },
  },

  computed: {
    inputTo: {
      get() {
        return this.selectedData ? this.selectedData.to : undefined;
      },
      set(value) {
        this.$emit('change', {
          to: value,
          from: this.inputFrom,
        });
      },
    },
    inputFrom: {
      get() {
        return this.selectedData ? this.selectedData.from : undefined;
      },
      set(value) {
        this.$emit('change', {
          from: value,
          to: this.inputTo,
        });
      },
    },
  },
};
</script>

<style lang="scss" scoped></style>
