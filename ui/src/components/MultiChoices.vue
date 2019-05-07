<template>
  <div>
    <div class="checkboxes">
      <Checkbox v-for="v in values" :key="v.code" v-model="model" :value="v">
        {{ v.label }}
      </Checkbox>
    </div>
  </div>
</template>

<script>
import Checkbox from '@/components/ui/Checkbox.vue';

export default {
  name: 'ChoicesFilter',

  components: { Checkbox },
  props: {
    values: {
      type: Array,
    },
    selectedValues: {
      type: Array,
    },
  },

  computed: {
    model: {
      get() {
        return this.selectedValues;
      },
      set(newValues) {
        this.$emit('update:selectedValues', newValues);
      },
    },
  },
};
</script>

<style scoped></style>
