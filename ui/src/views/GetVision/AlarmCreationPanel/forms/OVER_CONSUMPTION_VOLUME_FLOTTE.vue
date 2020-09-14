<template>
  <AlarmCreationBaseForm
    :alarm="alarm"
    have-form
    skip-scope-check
    :container-height="'4rem'"
    @save="onSave"
    :check-errors-fn="isFormValid"
  >
    <SectionTitle :num="3">Définir des seuils de déclenchement par usage (3 max.)</SectionTitle>
    <div class="d-flex justify-content-center mt-4 mb-2">
      <Toggle
        v-if="toggleValues"
        @update="currentPeriod = $event.id"
        :values="toggleValues"
        class="pl-2"
      />
    </div>

    <keep-alive>
      <OverConsoDataForm v-if="currentPeriod == 'data'" @change="levelsData = $event" />
    </keep-alive>
    <keep-alive>
      <OverConsoSMSForm v-if="currentPeriod == 'sms'" @change="levelsSms = $event" />
    </keep-alive>
    <keep-alive>
      <OverConsoVoiceForm v-if="currentPeriod == 'voice'" @change="levelsVoice = $event" />
    </keep-alive>

    <template v-slot:scopechoice="{ partner }">
      <OfferBillingAccountChoice
        :key="'offercf_' + (partner ? partner.id : '')"
        :partner="partner"
        @change="filterForCreation = $event"
      />
    </template>
  </AlarmCreationBaseForm>
</template>

<script>
import AlarmCreationBaseForm from './AlarmCreationBaseForm';
import Toggle from '@/components/ui/UiToggle2';
import SectionTitle from '@/components/SectionTitle';
import OverConsoDataForm from './OverConsoForms/OverConsoDataForm';
import OverConsoSMSForm from './OverConsoForms/OverConsoSMSForm';
import OverConsoVoiceForm from './OverConsoForms/OverConsoVoiceForm';
import OfferBillingAccountChoice from './ScopeChoice/OfferBillingAccountChoice.vue';
import get from 'lodash.get';
import { createSharedConsumptionAlarm } from '@/api/alarmCreation.js';
import { mapMutations } from 'vuex';

export default {
  components: {
    AlarmCreationBaseForm,
    Toggle,
    SectionTitle,
    OverConsoDataForm,
    OverConsoSMSForm,
    OverConsoVoiceForm,
    OfferBillingAccountChoice,
  },
  props: {
    alarm: Object,
    duplicateFrom: Object,
  },

  data() {
    return {
      filterForCreation: undefined,
      currentPeriod: 'data',
      scopeChoice: undefined,
      levelsData: undefined,
      levelsSms: undefined,
      levelsVoice: undefined,
      toggleValues: [
        {
          id: 'data',
          label: 'services.DATA',
        },
        {
          id: 'sms',
          label: 'services.SMS',
        },
        {
          id: 'voice',
          label: 'services.VOICE',
        },
      ],
    };
  },

  methods: {
    ...mapMutations(['flashMessage', 'closePanel']),

    async onSave(payload) {
      const marketingOfferId = get(this.filterForCreation, 'offerCF.meta.workflow.initialOffer.id');
      const customerAccountId = get(this.filterForCreation, 'offerCF.meta.customerAccount.id');

      const levelsData = {};
      const levelsSms = {};
      const levelsVoice = {};

      if (this.levelsData) {
        levelsData.levelMax = { level: parseInt(this.levelsData.basePercent) };
        if (this.levelsData.levels.length == 1) {
          levelsData.level1 = {
            level: this.levelsData.levels[0].value,
            dayOfMonth: this.levelsData.levels[0].limit,
          };
        }

        if (this.levelsData.levels.length == 2) {
          levelsData.level1 = {
            level: this.levelsData.levels[0].value,
            dayOfMonth: this.levelsData.levels[0].limit,
          };

          levelsData.level2 = {
            level: this.levelsData.levels[1].value,
            dayOfMonth: this.levelsData.levels[1].limit,
          };
        }
      }

      if (this.levelsSms) {
        levelsSms.levelMax = { level: parseInt(this.levelsSms.basePercent) };
        if (this.levelsSms.levels.length == 1) {
          levelsSms.level1 = {
            level: this.levelsSms.levels[0].value,
            dayOfMonth: this.levelsSms.levels[0].limit,
          };
        }

        if (this.levelsSms.levels.length == 2) {
          levelsSms.level1 = {
            level: this.levelsSms.levels[0].value,
            dayOfMonth: this.levelsSms.levels[0].limit,
          };

          levelsSms.level2 = {
            level: this.levelsSms.levels[1].value,
            dayOfMonth: this.levelsSms.levels[1].limit,
          };
        }
      }

      if (this.levelsVoice) {
        levelsVoice.levelMax = { level: parseInt(this.levelsVoice.basePercent) };
        if (this.levelsVoice.levels.length == 1) {
          levelsVoice.level1 = {
            level: this.levelsVoice.levels[0].value,
            dayOfMonth: this.levelsVoice.levels[0].limit,
          };
        }

        if (this.levelsVoice.levels.length == 2) {
          levelsVoice.level1 = {
            level: this.levelsVoice.levels[0].value,
            dayOfMonth: this.levelsVoice.levels[0].limit,
          };

          levelsVoice.level2 = {
            level: this.levelsVoice.levels[1].value,
            dayOfMonth: this.levelsVoice.levels[1].limit,
          };
        }
      }

      const params = {
        alarmName: payload.alarmName,
        marketingOfferId,
        customerAccountId,
        levelsData,
        levelsSms,
        levelsVoice,
        activateAlarm: payload.enableAlarm,
        emailNotification: payload.sholdNotify,
        webServiceNotification: payload.webserviceNotification,
        mailingList: payload.notifList,
      };

      let response;

      if (this.duplicateFrom && this.duplicateFrom.toModify) {
        // response = await modifyOverConso({ ...params, id: this.duplicateFrom.id });
      } else {
        response = await createSharedConsumptionAlarm(params);
      }

      if (response.errors && response.errors.length) {
        this.flashMessage({ level: 'danger', message: this.$t('genericErrorMessage') });
      } else {
        this.flashMessage({ level: 'success', message: this.$t('genericSuccessMessage') });
      }

      this.closePanel({ resetSearch: true });
    },
    isFormValid() {
      let isFormValid;
      isFormValid = !!this.filterForCreation;
      if (this.levelsData) {
        isFormValid &= !!this.levelsData.basePercent;
        if (this.levelsData.levels && this.levelsData.levels.length) {
          if (this.levelsData.levels.length > 0) {
            isFormValid &= !!this.levelsData.levels[0].value && !!this.levelsData.levels[0].limit;
          }
          if (this.levelsData.levels.length === 2) {
            isFormValid &= !!this.levelsData.levels[1].value && !!this.levelsData.levels[1].limit;
          }
        }
      }

      if (this.levelsSms) {
        isFormValid &= !!this.levelsSms.basePercent;
        if (this.levelsSms.levels && this.levelsSms.levels.length) {
          if (this.levelsSms.levels.length > 0) {
            isFormValid &= !!this.levelsSms.levels[0].value && !!this.levelsSms.levels[0].limit;
          }
          if (this.levelsSms.levels.length === 2) {
            isFormValid &= !!this.levelsSms.levels[1].value && !!this.levelsSms.levels[1].limit;
          }
        }
      }

      if (this.levelsVoice) {
        isFormValid &= !!this.levelsVoice.basePercent;
        if (this.levelsVoice.levels && this.levelsVoice.levels.length) {
          if (this.levelsVoice.levels.length > 0) {
            isFormValid &= !!this.levelsVoice.levels[0].value && !!this.levelsVoice.levels[0].limit;
          }
          if (this.levelsVoice.levels.length === 2) {
            isFormValid &= !!this.levelsVoice.levels[1].value && !!this.levelsVoice.levels[1].limit;
          }
        }
      }

      return isFormValid;
    },
  },
};
</script>
