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
        <UiSelect v-model="notifList" :options="mailingLists" block />
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

        <UiButton variant="primary" class="p-3" block @click="saveAlarm" :disabled="!canSaveAlarm">
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
import get from 'lodash.get';

export default {
  components: {
    UiCheckbox,
    UiSelect,
    UiInput,
    UiButton,
  },
  props: {
    partner: Object,
    canSave: Boolean,
    num: {
      type: Number,
      default: 3,
    },
  },
  computed: {
    mailingLists() {
      if (!this.partner) return [];
      const mailingLists = get(this.partner, 'data.mailingLists', []);
      return mailingLists.map(m => ({ label: m.name, value: m.id }));
    },
    canSaveAlarm() {
      let notifCondition = true;
      if (this.sholdNotify) {
        notifCondition = !!this.notifList;
      }

      return notifCondition && this.alarmName && this.canSave;
    },
  },

  methods: {
    saveAlarm() {
      this.$emit('save', {
        alarmName: this.alarmName,
        enableAlarm: this.enableAlarm,
        notifList: this.notifList,
        sholdNotify: this.sholdNotify,
        webserviceNotification: this.webserviceNotification,
      });
    },
  },

  data() {
    return {
      sholdNotify: false,
      webserviceNotification: false,
      alarmName: undefined,
      enableAlarm: false,

      notifList: undefined,
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
