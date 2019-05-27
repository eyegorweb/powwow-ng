<template>
  <MultiSelectSearch
    :items="items"
    :default-selected-items="selectedTypeSimCardValues"
    @update:defaultSelectedItems="setFilterValues"
  />
</template>

<script>
import MultiSelectSearch from '@/components/ui/MultiSelectSearch';
import { getLinesTypeSimCard } from '@/api/linesTypeSimCard';
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
    const pagination = { limit: 20, page: 0 };
    const orderBy = { id: 'DESC' };
    const data = await getLinesTypeSimCard(pagination, orderBy);
    this.items = data.map(a => ({
      id: a.accessPoint.simCardInstance.id,
      label: a.accessPoint.simCardInstance.type,
    }));
  },
  methods: {
    ...mapMutations('actLines', ['setTypeSimCardFilter']),
    setFilterValues(values) {
      this.setTypeSimCardFilter(values);
    },
  },
  computed: {
    ...mapGetters('actLines', ['selectedTypeSimCardValues']),
  },
};
</script>

<style lang="scss" scoped></style>
