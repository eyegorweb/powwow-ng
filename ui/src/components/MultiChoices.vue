<template>
  <div>
    <div class="checkboxes">
      <Checkbox v-for="v in options" :key="v.code" v-model="model" :value="v">
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
    options: {
      type: Array,
    },
    value: {
      type: Array,
    },
  },

  computed: {
    model: {
      get() {
        return this.value;
      },
      set(newValues) {
        this.$emit('input', newValues);
      },
    },
  },
};
</script>

<style scoped></style>
