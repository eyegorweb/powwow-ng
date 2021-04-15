<template>
  <UiSelect class="text-gray" v-model="val" :options="options" block />
</template>

<script>
import UiSelect from '@/components/ui/UiSelect';

export default {
  components: {
    UiSelect,
  },
  props: {
    options: Array,

    ns: String,
    getter: {
      type: String,
      default: 'genericGetter',
    },
    setter: {
      type: String,
      default: 'genericSetter',
    },
    filterKey: String,
  },
  computed: {
    selectedValue() {
      return this.$store.getters[`${this.ns}/${this.getter}`](this.filterKey);
    },
    val: {
      get() {
        if (this.selectedValue) {
          const found = this.options.find(o => o.label === this.selectedValue.value);
          if (found) {
            return found.value;
          }
        }

        return undefined;
      },
      set(value) {
        const selectedOpt = this.options.find(o => o.value === value);
        this.$store.commit(`${this.ns}/${this.setter}`, {
          value: selectedOpt.label, // value est affichée dans la synthèse
          meta: selectedOpt,
          id: this.filterKey,
        });
      },
    },
  },
};
</script>

<style lang="scss" scoped></style>
