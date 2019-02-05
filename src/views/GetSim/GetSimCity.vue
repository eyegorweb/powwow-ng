<template>
  <div>
    <UiInput
      v-model="city"
    />
  </div>
</template>

<script>
import UiInput from '@/components/ui/UiInput';

import { mapMutations, mapGetters } from 'vuex';

export default {
  name: 'City',

  methods: {
    ...mapMutations(['setCityFilter']),
  },
  computed: {
    ...mapGetters(['selectedCityValue']),
    city: {
      get() {
        return this.selectedCityValue;
      },
      set(newValue) {
        this.setCityFilter(newValue);
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
