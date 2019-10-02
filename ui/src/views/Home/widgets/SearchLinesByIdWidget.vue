<template>
  <WidgetBloc :widget="widget" no-padding>
    <div class="pl-3 pr-3 pb-3">
      <SearchByLinesId @searchById="searchById" :inline="inline" />
      <div v-if="noResults" class="alert-light" role="alert">{{ $t('noResult') }}</div>
    </div>
  </WidgetBloc>
</template>

<script>
import SearchByLinesId from '@/views/GetParc/ActLines/SearchByLinesId';
import WidgetBloc from './WidgetBloc';
import { searchLines } from '@/api/linesActions';

export default {
  components: {
    WidgetBloc,
    SearchByLinesId,
  },
  props: {
    widget: Object,
    contextFilters: Array,
  },
  data() {
    return {
      noResults: false,
      inline: false,
    };
  },

  methods: {
    async searchById(filterObj) {
      const result = await searchLines({ key: 'id', direction: 'DESC' }, { page: 0, limit: 1 }, [
        ...this.contextFilters,
        filterObj,
      ]);

      if (!result || !result.items || !result.items.length) {
        this.noResults = true;
      } else if (result.total === 1) {
        this.$router.push({
          name: 'lineDetail',
          params: { lineId: result.items[0].id },
        });
      } else {
        this.$router.push({
          name: 'actLines',
          params: {
            queryFilters: [...this.contextFilters, filterObj],
          },
        });
      }
    },
  },
};
</script>

<style lang="scss" scoped></style>
