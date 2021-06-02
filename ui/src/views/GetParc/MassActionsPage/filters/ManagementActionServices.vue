<template>
  <div>
    <UiCheckbox
      v-for="service in services"
      input-type="radio"
      :value="{ id: service.id, label: $t(`getparc.services. ${service.id}`) }"
      :key="service.a"
      v-model="selectedServices"
      >{{ $t(`getparc.services. ${service.id}`) }}</UiCheckbox
    >
  </div>
</template>

<script>
import UiCheckbox from '@/components/ui/Checkbox';
import { getActionServices } from '@/api/actionServices';

export default {
  components: {
    UiCheckbox,
  },
  props: {
    selectedData: Object,
  },
  data() {
    return {
      services: [],
    };
  },
  async mounted() {
    const data = await getActionServices();
    this.services = data.map((a) => ({ id: a, label: a }));
  },

  computed: {
    selectedServices: {
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
