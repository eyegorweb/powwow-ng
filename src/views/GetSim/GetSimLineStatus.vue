<template>
  <div>
    <UiCheckbox
      :checked="false"
      :value="$t('filters.lineStatusValues.ACTIVATED')"
      v-model="lineActivated"
    >{{ $t('filters.lineStatusValues.ACTIVATED') }}
    </UiCheckbox>
    <UiCheckbox
      :checked="false"
      :value="$t('filters.lineStatusValues.NON_PREACTIVATED')"
      v-model="lineNoPreActivated"
    >{{ $t('filters.lineStatusValues.NON_PREACTIVATED') }}
    </UiCheckbox>
    <UiCheckbox
      :checked="false"
      :value="$t('filters.lineStatusValues.PREACTIVATED')"
      v-model="linePreActivated"
    >{{ $t('filters.lineStatusValues.PREACTIVATED') }}
    </UiCheckbox>
  </div>
</template>

<script>
import UiCheckbox from '@/components/ui/Checkbox';

import { mapMutations, mapGetters } from 'vuex';

export default {
  name: 'LineStatus',
  methods: {
    ...mapMutations(['setLineStatusFilter']),
    getValueByCode(code) {
      const found = this.selectedLineStatus && this.selectedLineStatus.find(s => s.id === code);
      if (found) {
        return found.value;
      }
    },
    setFilterValue(code, value, labelForSynthesis) {
      if (!value) {
        this.setLineStatusFilter([...this.selectedLineStatus.filter(s => s.id !== code)]);
      } else {
        this.setLineStatusFilter([
          ...this.selectedLineStatus,
          {
            id: code,
            value: value,
            label: labelForSynthesis,
          },
        ]);
      }
    },
  },
  computed: {
    ...mapGetters(['selectedLineStatus']),
    lineActivated: {
      get() {
        return this.getValueByCode('linestatus.active');
      },
      set(newValue) {
        this.setFilterValue(
          'linestatus.active',
          newValue,
          this.$t('filters.lineStatusValues.ACTIVATED')
        );
      },
    },
    lineNoPreActivated: {
      get() {
        return this.getValueByCode('linestatus.NoPreActive');
      },
      set(newValue) {
        this.setFilterValue(
          'linestatus.NoPreActive',
          newValue,
          this.$t('filters.lineStatusValues.NON_PREACTIVATED')
        );
      },
    },
    linePreActivated: {
      get() {
        return this.getValueByCode('linestatus.PreActive');
      },
      set(newValue) {
        this.setFilterValue(
          'linestatus.PreActive',
          newValue,
          this.$t('filters.lineStatusValues.PREACTIVATED')
        );
      },
    },
  },
  components: {
    UiCheckbox,
  },
};
</script>
