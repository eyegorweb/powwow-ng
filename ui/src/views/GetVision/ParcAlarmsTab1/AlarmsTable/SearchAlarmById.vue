<template>
  <form class="searchInput">
    <div class="form-row">
      <div class="form-group mb-0 col-md-8">
        <UiInput
          class="d-block"
          :placeholder="$t('orders.add-custom-field-to-list')"
          v-model="searchValue"
          have-cross-button
        />
      </div>
      <div class="form-group col-md-3 mb-0">
        <UiButton
          :variant="isDisabled ? 'primary' : ''"
          :disabled="!isDisabled"
          @click="searchById"
          >{{ $t('search') }}</UiButton
        >
      </div>
    </div>
  </form>
</template>

<script>
import UiInput from '@/components/ui/UiInput';
import UiButton from '@/components/ui/Button';

import { mapMutations } from 'vuex';

export default {
  components: {
    UiInput,
    UiButton,
  },
  computed: {
    isDisabled() {
      return !!this.searchValue;
    },
  },
  data() {
    return {
      searchValue: undefined,
    };
  },
  methods: {
    ...mapMutations('alarms', ['forceAppliedFilters']),
    async searchById() {
      this.$emit('search');
      this.forceAppliedFilters([
        {
          id: 'filters.alarmId',
          value: this.searchValue,
        },
      ]);
    },
  },
};
</script>

<style lang="scss" scoped></style>
