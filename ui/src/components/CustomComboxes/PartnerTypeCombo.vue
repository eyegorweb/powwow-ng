<template>
  <div class="pb-4">
    <UiSelect v-model="partnerType" placeholder="Aucun" :options="partnersTypesOptions" />
  </div>
</template>

<script>
import UiSelect from '@/components/ui/UiSelect';

export default {
  components: {
    UiSelect,
  },

  props: {
    value: Object,
    noEmptyOption: Boolean,
  },

  mounted() {
    if (this.noEmptyOption) {
      this.partnersTypesOptions = [
        {
          label: 'M2M',
          value: 'CUSTOMER',
        },
        {
          label: 'MVNO',
          value: 'MVNO',
        },
        {
          label: 'MARQUE BLANCHE',
          value: 'MULTI_CUSTOMER',
        },
      ];
    } else {
      this.partnersTypesOptions = [
        {
          label: '',
          value: '',
        },
        {
          label: 'M2M',
          value: 'CUSTOMER',
        },
        {
          label: 'MVNO',
          value: 'MVNO',
        },
        {
          label: 'MARQUE BLANCHE',
          value: 'MULTI_CUSTOMER',
        },
      ];
    }
  },

  computed: {
    partnerType: {
      get() {
        return this.value ? this.value.label : '';
      },
      set(value) {
        this.$emit(
          'input',
          this.partnersTypesOptions.find(o => o.value === value)
        );
      },
    },
  },
  data() {
    return {
      partnersTypesOptions: [],
    };
  },
};
</script>

<style lang="scss" scoped>
.select-container {
  display: block;
}
</style>
