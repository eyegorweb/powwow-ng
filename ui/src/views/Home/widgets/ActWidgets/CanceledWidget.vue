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
          values: [{ id: 'STATUS_CHANGE', label: this.$t('getparc.actTypes.STATUS_CHANGE') }],
        },
        {
          id: 'filters.transitionName',
          value: 'valider',
        },
      ],
    };
  },
};
</script>

<style lang="scss" scoped></style>
