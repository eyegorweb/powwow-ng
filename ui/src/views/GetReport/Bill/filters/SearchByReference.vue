<template>
  <form class="searchInput" @submit.prevent="doSearch">
    <div class="form-row">
      <div class="form-group mb-0 col-md-8">
        <UiInput
          :placeholder="$t('bills.searchByRef')"
          class="d-block"
          v-model="searchValue"
          have-cross-button
        >
          <i slot="icon" class="select-icon ic-Magnify-Icon" />
        </UiInput>
      </div>
      <div class="form-group col-md-3 mb-0">
        <UiButton
          :variant="isDisabled ? 'primary' : ''"
          :disabled="!isDisabled"
          @click="doSearch"
          >{{ $t('search') }}</UiButton
        >
      </div>
    </div>
  </form>
</template>

<script>
import UiInput from '@/components/ui/UiInput';
import UiButton from '@/components/ui/Button';

export default {
  components: {
    UiInput,
    UiButton,
  },
  props: {
    initValue: String,
  },
  mounted() {
    this.searchValue = this.initValue;
  },
  data() {
    return {
      searchValue: undefined,
    };
  },
  methods: {
    doSearch() {
      this.$emit('search', this.searchValue);
    },
  },
  computed: {
    isDisabled() {
      return !!this.searchValue;
    },
  },

  watch: {
    searchValue(newValue, oldValue) {
      if (oldValue && !newValue) {
        this.$emit('inputIsEmpty');
      }
    },
  },
};
</script>

<style lang="scss" scoped></style>
