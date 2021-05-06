<template>
  <SimpleMultiSelect
    :options="items"
    :values="selectedErrorValues || []"
    @updateValues="setErrorFilter"
  />
</template>

<script>
import SimpleMultiSelect from '@/components/Filters/SimpleMultiSelect';
import { fetchErrorCodes } from '@/api/massActions';
import { mapGetters, mapMutations } from 'vuex';
import uuid from 'uuid/v1';

export default {
  components: {
    SimpleMultiSelect,
  },
  data() {
    return {
      items: [],
    };
  },
  computed: {
    ...mapGetters('actHistory', ['selectedErrorValues']),
  },
  methods: {
    ...mapMutations('actHistory', ['setErrorFilter']),
    async refreshList() {
      const data = await fetchErrorCodes();
      this.items = data.map((l) => {
        return {
          meta: l,
          id: uuid(),
          label: l.libelle,
          code: l.code,
          type: l.type,
        };
      });
    },
  },
  mounted() {
    this.refreshList();
  },
};
</script>

<style lang="scss" scoped></style>
