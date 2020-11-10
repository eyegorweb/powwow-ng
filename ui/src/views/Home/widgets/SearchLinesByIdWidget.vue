<template>
  <WidgetBloc :widget="widget" no-padding>
    <div class="pl-3 pr-3 pb-3">
      <SearchByLinesId @searchById="searchById" :inline="inline" disable-when-empty />
      <div v-if="lastSearchResult && noResults" class="alert-light" role="alert">
        {{ $t('noResult') }}
      </div>
      <button v-if="searching" class="btn btn-primary btn-block" disabled>
        {{ $t('processing') }}...
        <CircleLoader />
      </button>
    </div>
  </WidgetBloc>
</template>

<script>
import SearchByLinesId from '@/views/GetParc/ActLines/SearchByLinesId';
import WidgetBloc from './WidgetBloc';
import { searchLines } from '@/api/linesActions';
import CircleLoader from '@/components/ui/CircleLoader';

export default {
  components: {
    WidgetBloc,
    SearchByLinesId,
    CircleLoader,
  },
  props: {
    widget: Object,
    contextFilters: Array,
  },
  data() {
    return {
      noResults: false,
      inline: false,
      lastSearchResult: undefined,
      lastSEarchFiler: undefined,
      searching: false,
    };
  },

  methods: {
    async searchById(filterObj) {
      this.lastSEarchFiler = filterObj;
      this.searching = true;
      const result = await searchLines({ key: 'id', direction: 'DESC' }, { page: 0, limit: 1 }, [
        ...this.contextFilters,
        filterObj,
      ]);
      this.searching = false;

      this.lastSearchResult = result;
      this.noResults = !result || !result.items || !result.items.length;
      this.viewResult();
    },

    viewResult() {
      if (this.lastSearchResult.total === 1) {
        this.$router.push({
          name: 'lineDetail',
          params: { lineId: this.lastSearchResult.items[0].id },
        });
      } else {
        this.$router.push({
          name: 'actLines',
          params: {
            queryFilters: [...this.contextFilters, this.lastSEarchFiler],
            idFilters: this.lastSEarchFiler,
          },
        });
      }
    },
  },
};
</script>

<style lang="scss" scoped></style>
