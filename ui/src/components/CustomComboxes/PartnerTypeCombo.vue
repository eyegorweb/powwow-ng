<template>
  <UiSelect v-model="partnerType" :placeholder="$t('partnerType')" :options="partnersTypesOptions" />
</template>

<script>
import UiSelect from '@/components/ui/UiSelect';

export default {
  components: {
    UiSelect,
  },

  props: {
    value: Object,
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
      partnersTypesOptions: [
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
      ],
    };
  },
};
</script>

<style lang="scss" scoped></style>
