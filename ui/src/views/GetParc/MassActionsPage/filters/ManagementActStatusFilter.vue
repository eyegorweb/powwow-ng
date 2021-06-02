<template>
  <div>
    <UiCheckbox
      v-for="status in statuses"
      :value="{ id: status.id, label: $t(`getparc.actStatuses.${status.id}`) }"
      :key="status.a"
      v-model="selectedStatus"
    >
      {{ $t(`getparc.actStatuses.${status.id}`) }}
    </UiCheckbox>
  </div>
</template>

<script>
import { getActStatuses } from '@/api/actStatuses';
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
    this.statuses = data.map((a) => ({
      id: a,
      label: a,
    }));
  },

  computed: {
    selectedStatus: {
      get() {
        if (!this.selectedData) {
          return [];
        }
        return this.selectedData.values;
      },
      set(values) {
        this.$emit('change', values);
      },
    },
  },
};
</script>

<style scoped></style>
