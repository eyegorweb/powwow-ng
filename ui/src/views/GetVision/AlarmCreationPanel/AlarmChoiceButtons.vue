<template>
  <div class="buttons-container">
    <h5>CHOISIR UNE ALARME</h5>

    <ul class="list-unstyled mt-4">
      <li
        v-for="alarm in alarms"
        :key="alarm.id"
        @mouseover="$emit('hover', alarm)"
        @mouseleave="$emit('hover', undefined)"
      >
        <UiButton :variant="getVariant(alarm)" class="p-3" block @click="() => chooseAlarm(alarm)">
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
      alarms: [
        { id: 'CONSO_GROUPED' },
        { id: 'CONSUMPTION_ON_PLMN' },
        { id: 'COUNTRY_CHANGE' },
        { id: 'IMEI_CHANGE' },
        { id: 'NOCHANGE_STATUS' },
        {
          id: 'OVER_CONSUMPTION_VOLUME',
          description: `L'alarme de sur-consommation vous permet de surveiller la consommation d'une ligne ou d'un ensemble de ligne.`,
        },
        { id: 'OVER_CONSUMPTION_VOLUME_FLOTTE' },
        { id: 'OVER_CONSUMPTION_VOLUME_ROUNDED' },
        { id: 'PLMN_CHANGE' },
        { id: 'STATUS_CHANGE' },
        { id: 'SOLD_OVER_THRESHOLD' },
        { id: 'SOLD_UNDER_THRESHOLD' },
        { id: 'UNDER_CONSUMPTION_VOLUME' },
      ],
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
    font-weight: 800;
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
