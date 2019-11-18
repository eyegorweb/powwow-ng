<template>
  <form class="searchInput">
    <div :class="{ 'form-row': inline }">
      <div class="form-group mb-0" :class="{ 'col-md-8': inline }">
        <SearchWithSelect
          :options="types"
          :query.sync="resultQuery"
          :type.sync="resultType"
          :input-placeholder="inputPlaceholder"
          :select-placeholder="selectPlaceholder"
        />
      </div>
      <div class="form-group" :class="inline ? 'col-md-3 mb-0' : 'd-flex'">
        <UiButton
          :variant="isDisabled ? 'primary' : ''"
          :disabled="!isDisabled"
          @click="searchById"
          :class="{ 'flex-grow-1': !inline }"
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
    inline: {
      type: Boolean,
      default: true,
      required: false,
    },
    initValue: {
      type: String,
      required: false,
    },
  },

  data() {
    return {
      selectPlaceholder: this.$t('type'),
      inputSearchValue: undefined,
    };
  },
  mounted() {
    if (this.initValue) {
      this.resultQuery = this.initValue;
    }
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
