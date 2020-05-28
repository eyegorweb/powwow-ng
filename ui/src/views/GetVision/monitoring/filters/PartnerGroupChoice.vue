<template>
  <div class="pb-4">
    <UiSelect v-model="selectedOption" placeholder="Groupe de partenaires" :options="options" />
  </div>
</template>

<script>
import UiSelect from '@/components/ui/UiSelect';

export default {
  components: {
    UiSelect,
  },
  props: {
    selectedData: Object,
  },
  computed: {
    selectedOption: {
      get() {
        return this.selectedData ? this.selectedData.data.value : '';
      },
      set(value) {
        this.$emit('change', this.options.find(o => o.value === value));
      },
    },
  },
  data() {
    return {
      options: [
        {
          label: '',
          value: '',
        },
        {
          label: ' M2M Automobile & télématique',
          value: 'M2M_AUTOMOTIVE',
        },
        {
          label: ' M2M Utilities, sécurité & monétique',
          value: 'M2M_UTILITIES',
        },
      ],
    };
  },
};
</script>

<style lang="scss" scoped></style>
