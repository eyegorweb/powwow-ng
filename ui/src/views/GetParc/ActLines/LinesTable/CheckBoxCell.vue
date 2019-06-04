<template>
  <UiCheckbox v-model="value"> </UiCheckbox>
</template>

<script>
import UiCheckbox from '@/components/ui/Checkbox';
import { mapActions } from 'vuex';

export default {
  components: {
    UiCheckbox,
  },
  props: {
    row: Object,
  },
  data() {
    return {
      value: false,
    };
  },
  watch: {
    value(isChecked) {
      if (isChecked) {
        this.addLineForActCreation(this.row);
      } else {
        this.removeLineFromActCreation(this.row);
      }
    },
  },
  methods: {
    ...mapActions('actLines', ['addLineForActCreation', 'removeLineFromActCreation']),
  },
};
</script>

<style lang="scss" scoped></style>
