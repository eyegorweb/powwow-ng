<template>
  <div>
    <UiSelect v-model="alarmType" :placeholder="$t('partnerAlarm')" :options="items" />
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
  data() {
    const alarm = code => {
      return {
        code,
        value: this.$t('alarms.' + code),
        label: this.$t('alarms.' + code),
      };
    };
    return {
      items: [
        alarm('OVER_CONSUMPTION_VOLUME'),
        alarm('UNDER_CONSUMPTION_VOLUME'),
        alarm('PLMN_CHANGE'),
        alarm('NOCHANGE_STATUS'),
        alarm('SOLD_UNDER_THRESHOLD'),
        alarm('SOLD_OVER_THRESHOLD'),
        alarm('ACTION'),
        alarm('CONSUMPTION_ON_PLMN'),
        alarm('OVER_CONSUMPTION_VOLUME_ROUNDED'),
        alarm('STATUS_CHANGE'),
        alarm('IMEI_CHANGE'),
        alarm('COUNTRY_CHANGE'),
        alarm('UNDER_CONSUMPTION_VOLUME_FLOTTE'),
        alarm('OVER_CONSUMPTION_VOLUME_FLOTTE'),
      ],
    };
  },

  computed: {
    alarmType: {
      get() {
        if (this.selectedData) return;
        return this.selectedData;
      },
      set(value) {
        this.$emit(
          'change',
          this.items.find(o => o.value === value)
        );
      },
    },
  },
};
</script>

<style lang="scss" scoped></style>
