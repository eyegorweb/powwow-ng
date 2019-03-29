<template>
  <form class="searchInput">
    <div class="form-row">
      <div class="form-group col-md-8 mb-0">
        <SearchWithSelect
          :options="types"
          :query.sync="resultQuery"
          :type.sync="resultType"
          :input-placeholder="inputPlaceholder"
          :select-placeholder="selectPlaceholder"
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
import SearchWithSelect from '@/components/SearchWithSelect';
import UiButton from '@/components/ui/Button';

export default {
  props: {
    types: Array,
    selectedSearchType: String,
    inputPlaceholder: String,
  },

  data() {
    return {
      selectPlaceholder: this.$t('type'),
      inputSearchValue: undefined,
    };
  },

  computed: {
    resultType: {
      get() {
        return this.selectedSearchType;
      },
      set(newType) {
        this.$emit('update:selectedSearchType', newType);
      },
    },
    resultQuery: {
      get() {
        return this.inputSearchValue;
      },
      set(newValue) {
        this.$emit('findType', newValue);
        this.inputSearchValue = newValue;
      },
    },
    isDisabled: {
      get() {
        return !!this.resultType && !!this.inputSearchValue;
      },
    },
  },

  methods: {
    async searchById() {
      this.$emit('searchById', {
        id: 'filters.' + this.selectedSearchType,
        value: this.resultQuery,
      });
    },
  },

  components: {
    SearchWithSelect,
    UiButton,
  },
};
</script>

<style scoped></style>
