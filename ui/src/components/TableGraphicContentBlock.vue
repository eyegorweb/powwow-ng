<template>
  <div>
    <div class="d-flex justify-content-end align-items-center">
      {{ $t('display') }}:
      <Toggle @update="updateContentType" :values="toggleValues" class="pl-2"></Toggle>
    </div>
    <div>
      <slot v-if="contentType === 'graph'" name="graph">Graph</slot>
      <slot v-if="contentType === 'table'" name="table">Table</slot>
    </div>
  </div>
</template>

<script>
import Toggle from '@/components/ui/UiToggle2';

export default {
  components: {
    Toggle,
  },
  data() {
    return {
      contentType: 'table',
      toggleValues: [
        {
          id: 'graph',
          label: 'getparc.lineDetail.tab2.lineAnalysisContent.toggle.graph',
        },
        {
          id: 'table',
          label: 'getparc.lineDetail.tab2.lineAnalysisContent.toggle.table',
          default: true,
        },
      ],
    };
  },
  methods: {
    updateContentType(newVal) {
      this.contentType = newVal.id;
    },
  },
};
</script>

<style lang="scss" scoped></style>
