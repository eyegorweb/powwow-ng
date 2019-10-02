<template>
  <div>
    <div class="d-flex justify-content-end align-items-center">
      {{ $t('display') }}:
      <Toggle
        v-if="toggleValues"
        @update="updateContentType"
        :values="toggleValues"
        class="pl-2"
      ></Toggle>
    </div>
    <div v-if="toggleValues">
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
  props: {
    starting: {
      type: String,
      default: 'table',
    },
  },
  mounted() {
    this.contentType = '' + this.starting;
    this.toggleValues = [
      {
        id: 'graph',
        label: 'getparc.lineDetail.tab2.lineAnalysisContent.toggle.graph',
        default: this.starting === 'graph',
      },
      {
        id: 'table',
        label: 'getparc.lineDetail.tab2.lineAnalysisContent.toggle.table',
        default: this.starting === 'table',
      },
    ];
  },
  data() {
    return {
      contentType: undefined,
      toggleValues: undefined,
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
