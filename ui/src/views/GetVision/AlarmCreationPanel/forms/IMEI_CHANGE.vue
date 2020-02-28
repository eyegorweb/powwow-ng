<template>
  <AlarmCreationBaseForm :alarm="alarm" @save="onSave" @scope="scopeChoice = $event">
  </AlarmCreationBaseForm>
</template>

<script>
import AlarmCreationBaseForm from './AlarmCreationBaseForm';
import { alarmOnDeviceChange } from '@/api/alarmCreation';
import { mapMutations } from 'vuex';

export default {
  components: {
    AlarmCreationBaseForm,
  },
  props: {
    alarm: Object,
  },
  data() {
    return {
      scopeChoice: undefined,
    };
  },
  methods: {
    ...mapMutations(['flashMessage', 'closePanel']),

    async onSave(payload) {
      const params = {
        ...payload,
        scope: this.scopeChoice,
        formData: this.selectedOptions,
      };

      const response = await alarmOnDeviceChange(params);
      if (response.errors && response.errors.length) {
        this.flashMessage({ level: 'danger', message: this.$t('genericErrorMessage') });
      } else {
        this.flashMessage({ level: 'success', message: this.$t('genericSuccessMessage') });
      }

      this.closePanel({ resetSearch: true });
    },
  },
};
</script>
