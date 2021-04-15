<template>
  <div>
    <UiSelectFilterUsingStore
      v-if="options"
      :options="options"
      ns="actLines"
      filter-key="indicators.getparc.lines.esim.downloadStatus"
    />
  </div>
</template>

<script>
import UiSelectFilterUsingStore from '@/components/Filters/UiSelectFilterUsingStore.vue';

export default {
  components: {
    UiSelectFilterUsingStore,
  },

  data() {
    return {
      options: undefined,
    };
  },

  mounted() {
    this.options = [
      {
        label: this.$t('getparc.actLines.networkStatuses.ACTIVATED'),
        value: 'ENABLED',
      },
      {
        label: this.$t('getreport.report_statut.DISABLED'),
        value: 'DISABLED',
      },
    ];
  },
};
</script>

<style lang="scss" scoped></style>
