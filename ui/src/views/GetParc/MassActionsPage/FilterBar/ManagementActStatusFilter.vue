<template>
  <div>
    <UiCheckbox
      v-for="status in statuses"
      :value="{ id: status.id, label: $t(`getparc.actStatuses.${status.id}`) }"
      :key="status.a"
      v-model="selectedStatus"
      >{{ $t(`getparc.actStatuses.${status.id}`) }}</UiCheckbox
    >
  </div>
</template>

<script>
import { getActStatuses } from '@/api/actStatuses';
import { mapGetters, mapMutations } from 'vuex';
import UiCheckbox from '@/components/ui/Checkbox';

export default {
  components: {
    UiCheckbox,
  },
  data() {
    return {
      statuses: [],
    };
  },
  async mounted() {
    const data = await getActStatuses();
    this.statuses = data.map(a => ({
      id: a,
      label: a,
    }));
  },
  methods: {
    ...mapMutations('actHistory', ['setActStatusFilter']),
    setFilterValues(values) {
      this.setActTypesFilter(values);
    },
  },
  computed: {
    ...mapGetters('actHistory', ['selectedStatusValues']),
    selectedStatus: {
      get() {
        return this.selectedStatusValues;
      },
      set(newValue) {
        this.setActStatusFilter(newValue);
      },
    },
  },
};
</script>

<style scoped></style>
