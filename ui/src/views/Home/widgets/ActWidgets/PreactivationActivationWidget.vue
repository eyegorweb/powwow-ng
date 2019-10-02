<template>
  <GenericWidget :widget="widget" :specific-filters="filters" :context-filters="contextFilters" />
</template>

<script>
import GenericWidget from './GenericWidget';

export default {
  components: {
    GenericWidget,
  },
  props: {
    widget: Object,
    contextFilters: Array,
  },
  data() {
    return {
      filters: [
        {
          id: 'filters.actTypes',
          values: [
            { id: 'PREACTIVATION', label: this.$t('getparc.actTypes.PREACTIVATION') },
            {
              id: 'PREACTIVATION_ACTIVATION',
              label: this.$t('getparc.actTypes.PREACTIVATION_ACTIVATION'),
            },
            { id: 'ACTIVATION', label: this.$t('getparc.actTypes.ACTIVATION') },
          ],
        },
      ],
    };
  },
};
</script>

<style lang="scss" scoped></style>
