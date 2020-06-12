<template>
  <PartnerCombo :value.sync="selectedPartner" offline />
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

        if (selectedPartner) {
          if (selectedPartner.id) {
            this.$emit('change', selectedPartner);
          }
        } else {
          this.$emit('change', undefined);
        }
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
