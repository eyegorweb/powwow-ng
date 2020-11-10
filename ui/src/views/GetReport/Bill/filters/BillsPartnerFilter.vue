<template>
  <PartnerCombo :value.sync="selectedPartner" />
</template>

<script>
import PartnerCombo from '@/components/CustomComboxes/PartnerCombo.vue';

export default {
  components: {
    PartnerCombo,
  },

  props: {
    selectedData: Object,
    selectedFilters: Array,
  },

  data() {
    return {
      isReady: false,
    };
  },

  mounted() {
    setTimeout(() => {
      this.isReady = true;
    });
  },

  computed: {
    selectedPartner: {
      get() {
        if (!this.selectedData) return;

        return this.selectedData.data;
      },
      set(selectedPartner) {
        if (!this.isReady) return;
        this.$emit('change', selectedPartner);
      },
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
