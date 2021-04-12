<template>
  <div>
    <UiSelectFilterUsingStore
      v-if="options"
      :options="options"
      ns="actLines"
      filter-key="indicators.getparc.lines.esim.type"
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
      options: [
        {
          label: 'STEP1',
          value: 'STEP1',
        },
        {
          label: 'STEP2',
          value: 'STEP2',
        },
      ],
    };
  },
};
</script>

<style lang="scss" scoped>
</style>
