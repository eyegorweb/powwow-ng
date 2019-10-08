<template>
  <MultiSelectSearch
    :items="items"
    :default-selected-items="selectedTypesValues"
    @update:defaultSelectedItems="setFilterValues"
  />
</template>

<script>
import MultiSelectSearch from '@/components/ui/MultiSelectSearch';
import { getManagementActTypes } from '@/api/managementAct';
// import { setActTypeFilter } from '@/store/getparc/actHistory.module';
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
    const data = await getManagementActTypes();
    this.items = data.map(a => ({ id: a, label: this.$t('getparc.actTypes.' + a) }));
  },
  methods: {
    ...mapMutations('actHistory', ['setActTypesFilter']),
    setFilterValues(values) {
      this.setActTypesFilter(values);
    },
  },
  computed: {
    ...mapGetters('actHistory', ['selectedTypesValues']),
  },
};
</script>

<style scoped></style>
