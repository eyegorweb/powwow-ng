<template>
  <PartnersFilter :values="selectedPartnersValues" @updatePartners="updatePartners" />
</template>

<script>
import PartnersFilter from '@/components/Filters/PartnersFilter';
import { mapActions, mapGetters } from 'vuex';

export default {
  components: {
    PartnersFilter,
  },
  computed: {
    ...mapGetters('getsim', ['selectedPartnersValues']),
  },
  methods: {
    ...mapActions('getsim', ['setPartnersFilter']),

    updatePartners(partners) {
      this.setPartnersFilter({ partners });
    },
  },
};
</script>

<style scoped></style>
