<template>
  <div>
    <h6>Date de début</h6>

    <UiDate @change="onDateStartChange" :value="startDate" class="d-block">
      <i slot="icon" class="select-icon ic-Flag-Icon" />
    </UiDate>
    <h6>Date de fin</h6>

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
