<template>
  <SimpleMultiSelect
    :options="items"
    :values="selectedNetworkStatusesValues || []"
    @updateValues="setNetworkStatusesFilter"
  />
</template>

<script>
import SimpleMultiSelect from '@/components/Filters/SimpleMultiSelect';
import { mapMutations, mapGetters } from 'vuex';

export default {
  components: {
    SimpleMultiSelect,
  },
  computed: {
    ...mapGetters('actLines', ['selectedNetworkStatusesValues']),
  },
  methods: {
    ...mapMutations('actLines', ['setNetworkStatusesFilter']),
  },
  data() {
    return {
      items: [
        {
          id: 'SUSPENDED',
          label: this.$t('getparc.actLines.networkStatuses.SUSPENDED'),
        },
        {
          id: 'CANCELED',
          label: this.$t('getparc.actLines.simStatuses.RELEASED'),
        },
        {
          id: 'ACTIVATED',
          label: this.$t('getparc.actLines.networkStatuses.ACTIVATED'),
        },
      ],
    };
  },
};
</script>

<style lang="scss" scoped></style>
