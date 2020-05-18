<template>
  <div>
    <UiSelect v-model="selectedValue" :options="options" block />
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
    selectedValue: {
      get() {
        if (this.selectedData) {
          return this.selectedData.value;
        }
        return undefined;
      },

      set(newValue) {
        const selected = this.options.find(o => o.value === newValue);
        this.$emit('change', selected);
      },
    },
  },
  data() {
    return {
      options: [
        {
          label: 'Data ou Data E/S',
          value: 'DATA',
        },
        {
          label: 'Data sortante',
          value: 'DATA_OUT',
        },
        {
          label: 'Data entrante',
          value: 'DATA_IN',
        },
        {
          label: 'SMS E/S',
          value: 'SMS',
        },
        {
          label: 'SMS sortants',
          value: 'SMS_OUT',
        },
        {
          label: 'SMS entrants',
          value: 'SMS_IN',
        },
        {
          label: 'Voix E/S',
          value: 'VOICE',
        },
        {
          label: 'Voix sortante',
          value: 'VOICE_OUT',
        },
        {
          label: 'Voix entrante',
          value: 'VOICE_IN',
        },
      ],
    };
  },
};
</script>

<style lang="scss" scoped></style>
