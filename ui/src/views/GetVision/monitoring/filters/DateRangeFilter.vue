<template>
  <div>
    <h5>Date de début</h5>

    <UiDate @change="onDateStartChange" :value="startDate" class="d-block">
      <i slot="icon" class="select-icon ic-Flag-Icon" />
    </UiDate>
    <h5>Date de fin</h5>

    <UiDate @change="onDateEndChange" :value="endDate" class="d-block">
      <i slot="icon" class="select-icon ic-Flag-Icon" />
    </UiDate>
  </div>
</template>

<script>
import UiDate from '@/components/ui/UiDate';

export default {
  components: {
    UiDate,
  },

  data() {
    return {
      startDate: undefined,
      endDate: undefined,
    };
  },

  methods: {
    onDateStartChange(date) {
      this.startDate = date;
      this.$emit('change', {
        startDate: this.startDate,
        endDate: this.endDate,
      });
    },
    onDateEndChange(date) {
      this.endDate = date;
      this.$emit('change', {
        startDate: this.startDate,
        endDate: this.endDate,
      });
    },
  },
};
</script>

<style lang="scss" scoped></style>
