<template>
  <ChoiceContainer
    @search="searchLines"
    :show-button="showButton"
    :show-result-block="!!params"
    message-height="6rem"
  >
    <template slot="form">
      <SearchById
        @valueChange="onValueChange"
        :init-value="searchByIdValue"
        :additional-ids="[]"
        placeholder="searchLine"
        :inline="false"
        no-search-button
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
import SearchById from '@/components/SearchById';
import ChoiceContainer from './ChoiceContainer';
import ScopeSearchMessage from './ScopeSearchMessage';

import { countLines } from '@/api/linesActions.js';

export default {
  components: {
    SearchById,
    ChoiceContainer,
    ScopeSearchMessage,
  },

  props: {
    partner: {
      type: Object,
      default: undefined,
    },
  },

  data() {
    return {
      searchByIdValue: undefined,
      params: undefined,
      showButton: true,
      isLoading: false,
      totalLines: 0,
    };
  },
  methods: {
    async searchLines() {
      this.isLoading = true;
      const filters = [
        {
          id: 'filters.' + this.params.type,
          value: this.params.value,
        },
        {
          id: 'filters.partners',
          values: [{ id: this.partner.id }],
        },
      ];

      this.totalLines = await countLines(filters);
      this.showButton = false;
      this.isLoading = false;
    },
    onValueChange(params) {
      this.searchByIdValue = params.value;
      if (params && params.value && params.type) {
        this.$emit('change', {
          searchById: params,
        });

        this.params = params;
      } else {
        this.$emit('change', {
          searchById: undefined,
        });
        this.params = undefined;
      }
    },
  },
};
</script>

<style lang="scss" scoped></style>
