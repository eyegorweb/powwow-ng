<template>
  <div>
    <UiSelectFilterUsingStore
      v-if="options"
      :options="options"
      ns="actLines"
      filter-key="indicators.getparc.lines.esim.pairedLine"
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
        label: this.$t('common.YES'),
        value: 'YES',
      },
      {
        label: this.$t('common.NO'),
        value: 'NO',
      },
    ];
  },
};
</script>

<style lang="scss" scoped>
</style>
