<template>
  <ChoiceContainer @search="searchLines" :show-button="showButton && !!partner" show-result-block>
    <template slot="form"> </template>
    <template slot="message">
      <ScopeSearchMessage :is-loading="isLoading" @refresh="searchLines" v-if="!!partner">
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
import { countLines } from '@/api/linesActions.js';

export default {
  components: {
    ChoiceContainer,
    ScopeSearchMessage,
  },

  props: {
    partner: Object,
  },

  data() {
    return {
      showButton: true,
      isLoading: false,
      totalLines: 0,
    };
  },

  mounted() {
    this.$emit('change', { partner: this.partner });
  },

  methods: {
    async searchLines() {
      const filters = [
        {
          id: 'filters.partners',
          values: [this.partner],
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
