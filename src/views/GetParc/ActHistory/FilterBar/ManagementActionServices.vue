<template>
  <MultiSelectSearch
    :items="items"
    :default-selected-items="selectedServicesValues"
    @update:defaultSelectedItems="setServicesFilter"
  />
</template>

<script>
import MultiSelectSearch from '@/components/ui/MultiSelectSearch';
import { getActionServices } from '@/api/actionServices';
import { mapGetters, mapMutations } from 'vuex';

export default {
  components: {
    MultiSelectSearch,
  },
  data() {
    return {
      items: [],
    };
  },
  async mounted() {
    const data = await getActionServices();
    this.items = data.map(a => ({ id: a, label: this.$t('getparc.services.' + a) }));
  },
  methods: {
    ...mapMutations('actHistory', ['setServicesFilter']),
    setFilterValues(values) {
      this.setServicesFilter(values);
    },
  },
  computed: {
    ...mapGetters('actHistory', ['selectedServicesValues']),
  },
};
</script>

<style scoped></style>
