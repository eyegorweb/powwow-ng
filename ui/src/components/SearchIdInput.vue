<template>
  <form class="searchInput" @submit.prevent="searchById">
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
      <div v-if="!noSearchButton" class="form-group" :class="inline ? 'col-md-3 mb-0' : 'd-flex'">
        <UiButton
          :variant="'primary'"
          @click="searchById"
          :disabled="!isEnabled"
          :class="{ 'search-id-button': true, 'flex-grow-1': !inline }"
        >
          {{ $t('search') }}
        </UiButton>
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
    noSearchButton: Boolean,
    inline: {
      type: Boolean,
      default: true,
      required: false,
    },
    initValue: {
      type: String,
      required: false,
    },
    disableWhenEmpty: Boolean,
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
    } else {
      this.resultQuery = '';
    }
  },

  computed: {
    resultType: {
      get() {
        return this.selectedSearchType;
      },
      set(newType) {
        this.$emit('update:selectedSearchType', newType);
        setTimeout(() => {
          this.$emit('valueChange', { type: newType, value: this.resultQuery });
        });
      },
    },
    resultQuery: {
      get() {
        return this.inputSearchValue;
      },
      set(newValue) {
        this.$emit('findType', newValue);
        this.inputSearchValue = newValue;
        setTimeout(() => {
          this.$emit('valueChange', { type: this.resultType, value: newValue });
        });
      },
    },
    haveValue: {
      get() {
        return !!this.resultType && !!this.inputSearchValue;
      },
    },

    isEnabled() {
      if (this.disableWhenEmpty) {
        return this.haveValue;
      }
      return true;
    },
  },

  methods: {
    async searchById() {
      if (!this.selectedSearchType) {
        this.$emit('searchById');
        return;
      }
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
