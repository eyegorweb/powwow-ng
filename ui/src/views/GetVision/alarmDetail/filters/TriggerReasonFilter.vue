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
          label: 'Tous',
          value: 'all',
        },
        {
          label: 'Data ou Data E/S',
          value: 'level1',
        },
        {
          label: 'Data sortante',
          value: 'level1Up',
        },
        {
          label: 'Data entrante',
          value: 'level1Down',
        },
        {
          label: 'SMS E/S',
          value: 'level2',
        },
        {
          label: 'SMS sortants',
          value: 'level2Up',
        },
        {
          label: 'SMS entrants',
          value: 'level2Down',
        },
        {
          label: 'Voix E/S',
          value: 'level3',
        },
        {
          label: 'Voix sortante',
          value: 'level3Up',
        },
        {
          label: 'Voix entrante',
          value: 'level3Down',
        },
      ],
    };
  },
};
</script>

<style lang="scss" scoped></style>
