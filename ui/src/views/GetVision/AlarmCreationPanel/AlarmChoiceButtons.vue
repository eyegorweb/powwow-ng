<template>
  <div class="buttons-container">
    <h5>{{ $t('getvsion.alarm-creation.chooseAlarm') }}</h5>

    <ul v-if="alarms" class="list-unstyled mt-4">
      <li
        v-for="alarm in alarms"
        :key="alarm.id"
        @mouseover="$emit('hover', alarm)"
        @mouseleave="$emit('hover', undefined)"
      >
        <UiButton
          :disabled="!!duplicateFrom"
          :variant="getVariant(alarm)"
          class="p-3"
          block
          @click="() => chooseAlarm(alarm)"
        >
          <span class="btn-label">{{ $t('alarms.' + alarm.id) }}</span>
        </UiButton>
      </li>
    </ul>
  </div>
</template>

<script>
import UiButton from '@/components/ui/Button';

export default {
  components: {
    UiButton,
  },

  props: {
    current: Object,
    duplicateFrom: {
      type: Object,
      required: false
    },
  },

  mounted() {
    this.alarms = [
      { id: 'OVER_CONSUMPTION_VOLUME_FLOTTE' },
      {
        id: 'OVER_CONSUMPTION_VOLUME',
        description: this.$t('getvsion.alarm-creation.overConsoDescription'),
      },
      { id: 'UNDER_CONSUMPTION_VOLUME' },
      { id: 'PLMN_CHANGE' },
      { id: 'STATUS_CHANGE' },

      { id: 'IMEI_CHANGE' },
      { id: 'COUNTRY_CHANGE' },
    ];
    if (this.duplicateFrom) {
      const alarmToChoose = this.alarms.find(a => a.id === this.duplicateFrom.type);
      if (alarmToChoose) {
        this.chooseAlarm(alarmToChoose);
      }
    }
  },

  methods: {
    chooseAlarm(alarm) {
      const isActive = this.current && alarm.id === this.current.id;

      this.$emit('choose', isActive ? undefined : alarm);
    },

    getVariant(alarm) {
      const isActive = this.current && alarm.id === this.current.id;

      return isActive ? 'primary' : 'white';
    },
  },

  data() {
    return {
      currentAlarm: undefined,
      alarms: undefined,
    };
  },
};
</script>

<style lang="scss" scoped>
.buttons-container {
  padding: 2rem 1rem 1rem 1rem;
  h5 {
    font-weight: 700;
    text-align: center;
  }

  button {
    padding: 1rem;
  }

  .btn-label {
    font-size: 0.8rem;
  }

  ul {
    li {
      margin-bottom: 1rem;
    }
  }
}

.creation-btn {
  padding: 1rem;
}
</style>
