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
    ...mapGetters('actHistory', ['selectedPartnersValues']),
  },
  methods: {
    ...mapActions('actHistory', ['setPartnersFilter']),

    updatePartners(partners) {
      this.setPartnersFilter({ partners });
    },
  },
};
</script>

<style scoped></style>
