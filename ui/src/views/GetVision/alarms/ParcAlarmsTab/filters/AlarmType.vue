<template>
  <div>
    <UiSelect
      v-model="alarmType"
      :placeholder="$t('partnerAlarm')"
      :options="items"
      class="alarmsTypes"
    />
  </div>
</template>

<script>
import UiSelect from '@/components/ui/UiSelect';
import { getAlarmTypes } from '@/api/alarms.js';

export default {
  components: {
    UiSelect,
  },
  props: {
    selectedData: Object,
  },
  data() {
    return {
      alarmTypes: [],
      items: [],
    };
  },
  async mounted() {
    this.alarmTypes = await getAlarmTypes();
    this.items = this.alarmTypes.getAlarmTypes.map(e => {
      return {
        code: e.key,
        value: e.value,
        label: e.value,
      };
    });
  },
  computed: {
    alarmType: {
      get() {
        if (this.selectedData) return;
        return this.selectedData;
      },
      set(value) {
        this.$emit('change', this.items.find(o => o.value === value));
      },
    },
  },
};
</script>

<style lang="scss" scoped>
.alarmsTypes {
  width: 100%;
  margin-bottom: 1rem;
}
</style>
