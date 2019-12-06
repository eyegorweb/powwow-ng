<template>
  <MultiSelectSearch :items="items" :default-selected-items.sync="selectedItems" />
</template>

<script>
import MultiSelectSearch from '@/components/ui/MultiSelectSearch';
import { mapMutations, mapGetters } from 'vuex';

export default {
  components: {
    MultiSelectSearch,
  },

  methods: {
    ...mapMutations('alarms', ['setAlarmRange']),
  },
  computed: {
    ...mapGetters('alarms', ['selectedAlarmRange']),

    selectedItems: {
      get() {
        return this.selectedAlarmRange;
      },
      set(countries) {
        this.setAlarmRange(countries);
      },
    },
  },
  data() {
    return {
      items: [
        {
          id: 'PARTY',
          label: this.$t('col.partner'),
        },
        {
          id: 'CUSTOMER_ACCOUNT',
          label: this.$t('common.billingAccount'),
        },
        {
          id: 'OFFER',
          label: this.$t('getparc.lineDetail.offer'),
        },
        {
          id: 'LINE',
          label: this.$t('common.line'),
        },
      ],
    };
  },
};
</script>

<style lang="scss" scoped></style>
