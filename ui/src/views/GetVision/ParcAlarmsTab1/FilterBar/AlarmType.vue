<template>
  <div>
    <UiSelect v-model="alarmType" :placeholder="$t('partnerType')" :options="items" />
  </div>
</template>

<script>
import UiSelect from '@/components/ui/UiSelect';
import { mapMutations, mapGetters } from 'vuex';

export default {
  components: {
    UiSelect,
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
    ...mapGetters('alarms', ['selectedAlarmType']),

    alarmType: {
      get() {
        return this.selectedAlarmType;
      },
      set(value) {
        this.setAlarmType(this.items.find(o => o.value === value));
      },
    },
  },

  methods: {
    ...mapMutations('alarms', ['setAlarmType']),
  },
};
</script>

<style lang="scss" scoped></style>
