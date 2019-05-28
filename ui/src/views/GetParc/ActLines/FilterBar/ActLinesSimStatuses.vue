<template>
  <SimpleMultiSelect
    :options="items"
    :values="selectedSimStatusesValues || []"
    @updateValues="setSimStatusesFilter"
  />
</template>

<script>
import SimpleMultiSelect from '@/components/Filters/SimpleMultiSelect';
import { mapMutations, mapGetters } from 'vuex';

export default {
  name: 'ActLinesSimStatuses',
  components: {
    SimpleMultiSelect,
  },
  computed: {
    ...mapGetters(['userIsBO']),
    ...mapGetters('actLines', ['selectedSimStatusesValues']),
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
