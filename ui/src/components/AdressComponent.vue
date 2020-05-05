<template>
  <UiApiAutocomplete
    :api-method="searchAddress"
    v-model="selectedAddress"
    :error="error"
    :big="big"
    no-icon
  />
</template>

<script>
import UiApiAutocomplete from '@/components/ui/UiApiAutocomplete';
import { searchAddress } from '@/api/address';

export default {
  components: {
    UiApiAutocomplete,
  },
  props: {
    value: Object,
    big: Boolean,
    error: {
      type: String,
      required: false,
    },
  },
  methods: {
    searchAddress,
  },
  computed: {
    selectedAddress: {
      get() {
        return this.value;
      },
      set(newValue) {
        this.$emit('input', newValue);
      },
    },
  },
};
</script>

<style lang="scss" scoped></style>
