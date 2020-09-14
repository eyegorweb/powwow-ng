<template>
  <SimpleMultiSelect
    :options="items"
    :values="selectedCommercialStatusesValues || []"
    @updateValues="setCommercialStatusesFilter"
  />
</template>

<script>
import SimpleMultiSelect from '@/components/Filters/SimpleMultiSelect';
import { mapMutations, mapGetters } from 'vuex';
import { fetchCommercialStatuses } from '@/api/linesActions';

export default {
  name: 'ActLinesBillingStatuses',
  components: {
    SimpleMultiSelect,
  },
  computed: {
    ...mapGetters('actLines', ['selectedCommercialStatusesValues', 'selectedPartnersValues']),
  },
  methods: {
    ...mapMutations('actLines', ['setCommercialStatusesFilter']),

    async refreshList() {
      const data = await fetchCommercialStatuses(this.selectedPartnersValues);
      this.items = data.map(l => {
        return {
          id: l,
          label: this.$t(`${'getparc.actLines.commercialStatuses.'}${l}`),
        };
      });
    }
  },
  mounted() {
    this.refreshList();
  },

  data() {
    return {
      items: [],
    };
  },
};
</script>

<style lang="scss" scoped></style>
