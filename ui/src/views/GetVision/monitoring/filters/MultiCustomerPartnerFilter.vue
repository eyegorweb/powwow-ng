<template>
  <PartnerCombo
    :value.sync="selectedPartner"
    :party-types="['MULTI_CUSTOMER', 'CUSTOMER']"
    offline
  />
</template>

<script>
import PartnerCombo from '@/components/CustomComboxes/PartnerCombo.vue';

export default {
  components: {
    PartnerCombo,
  },

  props: {
    selectedData: Object,
  },

  data() {
    return {
      selectedPartner: undefined,
      isReady: false,
    };
  },

  mounted() {
    if (this.selectedData) {
      this.selectedPartner = this.selectedData.data;
    }

    setTimeout(() => {
      this.isReady = true;
    });
  },

  watch: {
    selectedPartner(selectedPartner) {
      if (!this.isReady) return;

      if (selectedPartner) {
        if (selectedPartner.id) {
          this.$emit('change', selectedPartner);
        }
      } else {
        this.$emit('change', undefined);
      }
    },
  },

  methods: {
    onChange(partners) {
      this.$emit('change', partners);
    },
  },
};
</script>

<style scoped></style>
