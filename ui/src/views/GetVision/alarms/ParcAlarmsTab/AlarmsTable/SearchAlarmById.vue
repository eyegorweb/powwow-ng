<template>
  <form class="searchInput" @submit.prevent="searchById">
    <div class="form-row">
      <div class="form-group mb-0 col-md-8">
        <UiInput
          class="d-block"
          :placeholder="$t('getvsion.search-by-id')"
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

export default {
  components: {
    UiInput,
    UiButton,
  },
  props: {
    initValue: {
      type: String,
    },
  },
  mounted() {
    this.searchValue = this.initValue;
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
    async searchById() {
      this.$emit('searchById', this.searchValue);
    },
  },

  watch: {
    searchValue(newValue, oldValue) {
      if (!newValue && oldValue) {
        this.$emit('searchById', newValue);
      }
    },
  },
};
</script>

<style lang="scss" scoped></style>
