<template>
  <div>
    <template v-if="isLoading">
      <div class="mb-3">
        <div class="skeleton-line" :key="'sk_filter__' + index" v-for="index in 2"></div>
      </div>
    </template>
    <template v-else>
      <div
        class="saved-filter hover-pointer"
        :key="'filter__' + savedFilter.id"
        :class="{ active: selectedFilter && selectedFilter.id === savedFilter.id }"
        v-for="savedFilter in savedFilters"
        @click="() => $emit('chooseFilter', savedFilter)"
      >
        <span class="name">
          {{ savedFilter.name }}
        </span>
        <button class="btn" @click.stop="() => deleteFilter(savedFilter)">
          <span aria-hidden="true">&times;</span>
        </button>
      </div>
    </template>

    <div v-if="!isLoading && (!savedFilters || !savedFilters.length)">
      <div class="alert alert-warning" role="alert">
        {{ $t('noSavedFilter') }}
      </div>
    </div>
  </div>
</template>

<script>
import { fetchFilters, deleteFilter } from '@/api/filters.js';
import { mapMutations } from 'vuex';

export default {
  props: {
    moduleName: String,
    currentFilters: Array,
    selectedFilter: Object,
  },

  data() {
    return {
      savedFilters: [],
      isLoading: true,
    };
  },

  methods: {
    ...mapMutations(['confirmAction']),

    async refreshList() {
      this.isLoading = true;
      this.savedFilters = await fetchFilters(this.moduleName);
      this.isLoading = false;
    },

    async deleteFilter(filterToDelete) {
      const doReset = () => {
        this.refreshList();
      };
      this.confirmAction({
        message: 'confirmAction',
        actionFn: async () => {
          const response = await deleteFilter(filterToDelete.id);
          if (response) {
            doReset();
          }
        },
      });
    },
  },

  mounted() {
    this.refreshList();
  },
};
</script>

<style lang="scss" scoped>
.skeleton-line {
  &:first-child {
    margin-top: 0;
  }
}
.saved-filter {
  border: 1px solid $medium-gray;
  border-radius: 0.2rem;
  align-items: stretch;
  display: flex;
  flex-flow: row nowrap;
  justify-content: space-between;
  margin-bottom: 0.5rem;

  &.active {
    background-color: $primary;
    span {
      color: white;
    }
  }

  .name {
    padding: calc(0.75em - 2px) 0.875em;
  }
}
</style>
