<template>
  <SimpleMultiSelect
    :options="items"
    :values="selectedSimStatusesValues || []"
    :disabled="isDisabled"
    @updateValues="setSimStatusesFilter"
  />
</template>

<script>
import SimpleMultiSelect from '@/components/Filters/SimpleMultiSelect';
import { mapMutations, mapGetters, mapState } from 'vuex';

// import xorWith from 'lodash.xorwith';

export default {
  name: 'ActLinesSimStatuses',
  components: {
    SimpleMultiSelect,
  },
  computed: {
    ...mapGetters(['userIsBO']),
    ...mapGetters('actLines', ['selectedSimStatusesValues']),
    ...mapState('actLines', ['actToCreate']),
    isDisabled() {
      if (!this.actToCreate) return false;

      const concernedFilter = this.actToCreate.filters.find(
        f => f.id === 'filters.lines.SIMCardStatus'
      );

      if (concernedFilter && concernedFilter.values) {
        return true;
      }

      return false;

      /*
      if (
        !concernedFilter ||
        !this.selectedSimStatusesValues ||
        !this.selectedSimStatusesValues.length
      ) {
        return false;
      }

      return !!xorWith(
        this.selectedSimStatusesValues,
        concernedFilter.values,
        (a, b) => a.id === b.id
      ).length;
      //*/
    },

    disabledItems() {
      if (this.actToCreate) {
        const concernedFilter = this.actToCreate.filters.find(
          f => f.id === 'filters.lines.SIMCardStatus'
        );
        if (concernedFilter) {
          return concernedFilter.values;
        }
      }
      return [];
    },
  },
  methods: {
    ...mapMutations('actLines', ['setSimStatusesFilter']),
  },
  data() {
    return {
      items: [],
    };
  },
  mounted() {
    const statusChoices = [
      {
        id: 'NOT_PREACTIVATED',
        label: this.$t('getparc.actLines.simStatuses.NOT_PREACTIVATED'),
      },
      {
        id: 'PREACTIVATED',
        label: this.$t('getparc.actLines.simStatuses.PREACTIVATED'),
      },
      {
        id: 'ACTIVATED',
        label: this.$t('getparc.actLines.simStatuses.ACTIVATED'),
      },
      {
        id: 'SUSPENDED',
        label: this.$t('getparc.actLines.simStatuses.SUSPENDED'),
      },
    ];

    if (this.userIsBO) {
      statusChoices.push({
        id: 'RELEASED',
        label: this.$t('getparc.actLines.simStatuses.RELEASED'),
      });
    }

    this.items = statusChoices;
  },
};
</script>

<style lang="scss" scoped></style>
