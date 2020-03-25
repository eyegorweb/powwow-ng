<template>
  <PartnersFilter :values="selectedPartnersValues" @updatePartners="onChange" />
</template>

<script>
import PartnersFilter from '@/components/Filters/PartnersFilter';
import { mapActions, mapGetters } from 'vuex';

export default {
  components: {
    PartnersFilter,
  },

  data() {
    return {
      selectedPartnersValues: [],
    };
  },

  methods: {
    onChange(partners) {
      this.selectedPartnersValues = partners;
    },
  },
  watch: {
    selectedPartnersValues(values) {
      this.$emit('change', values);
    },
  },
};
</script>

<style scoped></style>
