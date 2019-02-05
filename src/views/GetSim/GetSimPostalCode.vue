<template>
  <div>
    <UiInput
      v-model="postalCode"
      input-type="number"
      :min-value="1"
    />
  </div>
</template>

<script>
import UiInput from '@/components/ui/UiInput';

import { mapMutations, mapGetters } from 'vuex';

export default {
  name: 'PostalCode',

  methods: {
    ...mapMutations(['setPostalCodeFilter']),
  },
  computed: {
    ...mapGetters(['selectedPostalCodeValue']),
    postalCode: {
      get() {
        return this.selectedPostalCodeValue;
      },
      set(newValue) {
        this.setPostalCodeFilter(newValue);
      },
    },
  },
  components: {
    UiInput,
  },
};
</script>

<style scoped>
label {
  width: 100%;
}
</style>
