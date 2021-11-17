<template>
  <AlarmCreationBaseForm
    :alarm="alarm"
    :check-errors-fn="isFormValid"
    :duplicate-from="duplicateFrom"
    have-form
    :is-loading="isLoading"
    :partner="partner"
    @save="onSave"
    @scope="scopeChoice = $event"
  >
    <SectionTitle :num="numStep">
      {{ $t('getvsion.alarm-creation.setISPs') }}
    </SectionTitle>

    <GroupMultiSelect
      from-title="getvsion.alarm-creation.change_plmn.isp_list"
      to-title="getvsion.alarm-creation.change_plmn.chosen_isp"
      :options.sync="options"
    />
  </AlarmCreationBaseForm>
</template>

<script>
import AlarmCreationBaseForm from './AlarmCreationBaseForm';
import SectionTitle from '@/components/SectionTitle';
import GroupMultiSelect from '@/components/GroupMultiSelect';
import { fetchIsps } from '@/api/isp';
import { alarmOnChangeISP } from '@/api/alarmCreation';
import { updateISPList } from '@/api/alarmsModifications';

import { mapMutations } from 'vuex';

export default {
  components: {
    AlarmCreationBaseForm,
    GroupMultiSelect,
    SectionTitle,
  },
  props: {
    alarm: Object,
    duplicateFrom: Object,
    partner: Object,
  },
  async mounted() {
    const isps = await fetchIsps();

    if (!isps || !isps.total) return;

    const options = isps.items.map((i) => {
      i.label = i.operator;
      return i;
    });

    const formattedOptions = options.reduce((all, current) => {
      const alreadyInOptions = all.find((o) => o.label === current.label);
      if (!alreadyInOptions) {
        all.push(current);
      }
      return all;
    }, []);

    if (this.editMode) {
      this.options = formattedOptions.map((o) => {
        o.selected = !!this.duplicateFrom.plmnsList.find((p) => p === '' + o.id);
        return o;
      });
    } else {
      this.options = formattedOptions;
    }
  },
  methods: {
    ...mapMutations(['flashMessage', 'closePanel', 'confirmAction']),

    isFormValid() {
      return this.selectedOptions && this.selectedOptions.length;
    },
    async onSave(payload) {
      const params = {
        ...payload,
        scope: this.scopeChoice,
        formData: this.selectedOptions,
      };

      // const response = await alarmOnChangeISP(params);

      let response;

      if (this.duplicateFrom && this.duplicateFrom.toModify) {
        this.isLoading = true;
        response = await updateISPList({ ...params, id: this.duplicateFrom.id });
        this.isLoading = false;
      } else {
        this.isLoading = true;
        response = await alarmOnChangeISP(params);
        this.isLoading = false;
      }
      this.onClose(response);
    },
    onClose(response) {
      const errorKeys = ['MAX_ALARM_INSTANCE_TO_CATCH_UP', 'ALARMS_D_MAX_ALARM_PER_AP_REACHED'];
      if (
        response.errors &&
        response.errors.length &&
        response.errors.find((err) => err.key === errorKeys[0])
      ) {
        setTimeout(() => {
          this.confirmAction({
            message: 'getvsion.alarm-creation.alarmPopUp',
            noOkButton: true,
            isWarning: true,
            customCloseLabel: 'close',
          });
        }, 500);
      } else if (
        response.errors &&
        response.errors.length &&
        response.errors.find((err) => err.extensions.alarm === errorKeys[1])
      ) {
        this.flashMessage({
          level: 'danger',
          message: this.$t('alarms.errors.ALARMS_D_MAX_ALARM_PER_AP_REACHED'),
        });
      } else if (
        response.errors &&
        response.errors.length &&
        !response.errors.find((err) => err.key === errorKeys[0])
      ) {
        this.flashMessage({ level: 'danger', message: this.$t('genericErrorMessage') });
      } else {
        this.flashMessage({ level: 'success', message: this.$t('genericSuccessMessage') });
      }
      this.closePanel({ resetSearch: true });
    },
  },
  data() {
    return {
      options: [],
      scopeChoice: undefined,
      isLoading: false,
    };
  },
  computed: {
    selectedOptions() {
      return this.options.filter((o) => o.selected);
    },
    editMode() {
      return this.duplicateFrom && this.duplicateFrom.toModify;
    },
    numStep() {
      return this.editMode ? 1 : 3;
    },
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
</style>
