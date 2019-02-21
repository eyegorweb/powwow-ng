<template>
  <div>
    <UiCheckbox
      :checked="false"
      :value="$t('filters.actionValues.ACTIVATED')"
      v-model="lineActivated"
    >{{ $t('filters.actionValues.ACTIVATED') }}
    </UiCheckbox>
    <UiCheckbox
      :checked="false"
      :value="$t('filters.actionValues.PREACTIVATED')"
      v-model="linePreActivated"
    >{{ $t('filters.actionValues.PREACTIVATED') }}
    </UiCheckbox>
  </div>
</template>

<script>
import UiCheckbox from '@/components/ui/Checkbox';

import { mapMutations, mapGetters } from 'vuex';

export default {
  name: 'Action',
  methods: {
    ...mapMutations(['setActionFilter']),
    getValueByCode(code) {
      const found = this.selectedAction && this.selectedAction.find(s => s.id === code);
      if (found) {
        return found.value;
      }
    },
    setFilterValue(code, value, labelForSynthesis) {
      if (!value) {
        this.setActionFilter([...this.selectedAction.filter(s => s.id !== code)]);
      } else {
        this.setActionFilter([
          ...this.selectedAction,
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
    ...mapGetters(['selectedAction']),
    lineActivated: {
      get() {
        return this.getValueByCode('action.active');
      },
      set(newValue) {
        this.setFilterValue('action.active', newValue, this.$t('filters.actionValues.ACTIVATED'));
      },
    },
    lineNoPreActivated: {
      get() {
        return this.getValueByCode('action.NoPreActive');
      },
      set(newValue) {
        this.setFilterValue(
          'action.NoPreActive',
          newValue,
          this.$t('filters.actionValues.NON_PREACTIVATED')
        );
      },
    },
    linePreActivated: {
      get() {
        return this.getValueByCode('action.PreActive');
      },
      set(newValue) {
        this.setFilterValue(
          'action.PreActive',
          newValue,
          this.$t('filters.actionValues.PREACTIVATED')
        );
      },
    },
  },
  components: {
    UiCheckbox,
  },
};
</script>
