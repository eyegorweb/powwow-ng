<template>
  <ChoiceContainer @search="searchLines" :show-button="showButton" :show-result-block="!!fileMeta">
    <template slot="form">
      <SearchLinesByFileImportFilter
        :file-meta="fileMeta"
        @clear="onClear"
        @setFilter="onSetFilter"
      />
    </template>
    <template slot="message">
      <ScopeSearchMessage :is-loading="isLoading" @refresh="searchLines">
        <template v-if="isLoading">
          <span>{{ $t('loading') }}...</span>
        </template>
        <template v-else>
          <h5>{{ totalLines }} {{ $t('getvsion.alarm-creation.linesFound') }}</h5>
          <p>{{ $t('getvsion.alarm-creation.limitedScope') }}</p>
        </template>
      </ScopeSearchMessage>
    </template>
  </ChoiceContainer>
</template>

<script>
import ChoiceContainer from './ChoiceContainer';
import ScopeSearchMessage from './ScopeSearchMessage';
import SearchLinesByFileImportFilter from '@/components/Filters/SearchLinesByFileImportFilter.vue';
import { countLines } from '@/api/linesActions.js';

export default {
  components: {
    ChoiceContainer,
    ScopeSearchMessage,
    SearchLinesByFileImportFilter,
  },

  data() {
    return {
      fileMeta: undefined,
      showButton: true,
      isLoading: false,
      totalLines: 0,
    };
  },
  props: {
    partner: Object,
  },
  methods: {
    onClear() {
      this.fileMeta = undefined;
    },
    onSetFilter(value) {
      this.fileMeta = value;
      this.$emit('change', {
        searchByFile: value,
        partner: this.partner,
      });
    },
    async searchLines() {
      const filters = [
        {
          id: 'filters.lines.fromFile.title',
          values: [{ tempDataUuid: this.fileMeta.tempDataUuid }],
        },
        {
          id: 'idParty',
          value: this.partner.id,
        },
      ];
      this.isLoading = true;

      this.totalLines = (await countLines(filters)) || 0;

      this.showButton = false;
      this.isLoading = false;
    },
  },
};
</script>

<style lang="scss" scoped></style>
