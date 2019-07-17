<template>
  <div>
    <div class="row">
      <div class="col d-flex">
        <UiCheckbox v-model="isRangeMode" />
        <span>{{ $t('range') }}</span>
      </div>
    </div>
    <UiInput v-model="fromValue" />
    <UiInput v-if="isRangeMode" v-model="toValue" />
  </div>
</template>

<script>
import UiCheckbox from '@/components/ui/Checkbox';
import UiInput from '@/components/ui/UiInput';

export default {
  components: {
    UiCheckbox,
    UiInput,
  },
  props: {
    value1: String,
    value2: String,
  },
  data() {
    return {
      isRangeMode: false,
    };
  },

  methods: {
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
    fromValue: {
      get() {
        return this.value1;
      },
      set(newValue1) {
        this.emitNewValues(newValue1, this.value2);
      },
    },
    toValue: {
      get() {
        return this.value2;
      },
      set(newValue2) {
        this.emitNewValues(this.value1, newValue2);
      },
    },
  },
};
</script>

<style lang="scss" scoped></style>
