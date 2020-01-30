<template>
  <div>
    <h5 class="text-primary text-uppercase">
      <span class="badge badge-pill badge-primary">{{ num }}</span>
      <span class="title">Choisir un moyen de notification</span>
    </h5>

    <div class="row">
      <div class="col">
        <div class="d-flex mb-3 mt-3">
          <UiCheckbox v-model="sholdNotify" />
          <span>{{ $t('mailNotification') }}</span>
        </div>
        <div class="d-flex">
          <UiCheckbox v-model="webserviceNotification" />
          <span>{{ $t('webserviceNotification') }}</span>
        </div>
      </div>
      <div class="col">
        <h5>Liste de diffusion</h5>
        <UiSelect v-model="notifList" :options="notifLists" block />
      </div>
    </div>

    <hr />

    <div class="row">
      <div class="col to-bottom">
        <h5>Nom de l'alarme</h5>
        <UiInput class="d-block" v-model="alarmName" />
      </div>
      <div class="col">
        <div class="d-flex mb-3 mt-1">
          <UiCheckbox v-model="enableAlarm" />
          <span>{{ $t('getvsion.alarm.enableAlarm') }}</span>
        </div>

        <UiButton variant="primary" class="p-3" block @click="saveAlarm">
          <span class="btn-label">{{ $t('getvsion.alarm.saveAlarm') }}</span>
        </UiButton>
      </div>
    </div>
  </div>
</template>

<script>
import UiCheckbox from '@/components/ui/Checkbox';
import UiSelect from '@/components/ui/UiSelect';
import UiInput from '@/components/ui/UiInput';
import UiButton from '@/components/ui/Button';

export default {
  components: {
    UiCheckbox,
    UiSelect,
    UiInput,
    UiButton,
  },
  props: {
    num: {
      type: Number,
      default: 3,
    },
  },

  methods: {
    saveAlarm() {
      console.log('Save Alarm >>');
    },
  },

  data() {
    return {
      sholdNotify: false,
      notifList: undefined,
      webserviceNotification: false,
      alarmName: undefined,
      enableAlarm: false,

      notifLists: [
        {
          label: 'Liste 1',
          value: 'list1',
        },
      ],
    };
  },
};
</script>

<style lang="scss" scoped>
h5 {
  font-weight: 700;

  .title {
    position: relative;
    top: 3px;
    padding-left: 5px;
  }
}

.to-bottom {
  align-self: flex-end;
}
</style>
