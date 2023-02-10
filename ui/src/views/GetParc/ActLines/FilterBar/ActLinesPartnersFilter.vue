<template>
  <PartnersFilter
    :values="selectedPartnersValues"
    @updatePartners="updatePartners"
    @updatePartnersEsimEnabled="updatePartnersEsimEnabled"
  />
</template>

<script>
import PartnersFilter from '@/components/Filters/PartnersFilter';
import { mapActions, mapGetters } from 'vuex';

export default {
  components: {
    PartnersFilter,
  },
  computed: {
    ...mapGetters('actLines', ['selectedPartnersValues']),
  },
  methods: {
    ...mapActions('actLines', ['setPartnersFilter', 'setPartnersEsimEnabled']),
    updatePartners(partners) {
      this.setPartnersFilter({ partners });
    },
    updatePartnersEsimEnabled(partnersEsimEnabled) {
      this.setPartnersEsimEnabled({ partnersEsimEnabled });
    },
  },
};
</script>

<style scoped></style>
