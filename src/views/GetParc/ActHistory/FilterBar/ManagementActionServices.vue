<template>
  <div>
    <UiCheckbox
      v-for="service in services"
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
import { mapGetters, mapMutations } from 'vuex';

export default {
  components: {
    UiCheckbox,
  },
  data() {
    return {
      services: [],
    };
  },
  async mounted() {
    const data = await getActionServices();
    this.services = data.map(a => ({ id: a, label: a }));
  },
  methods: {
    ...mapMutations('actHistory', ['setServicesFilter']),
    setFilterValues(values) {
      this.setServicesFilter(values);
    },
  },
  computed: {
    ...mapGetters('actHistory', ['selectedServicesValues']),
    selectedServices: {
      get() {
        return this.selectedServicesValues;
      },
      set(newValue) {
        this.setServicesFilter(newValue);
      },
    },
  },
};
</script>

<style scoped></style>
