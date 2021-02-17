<template>
  <AlarmCreationBaseForm
    :alarm="alarm"
    have-form
    skip-scope-check
    :container-height="'9rem'"
    @save="onSave"
    @partnerChange="selectedPartner = $event"
    :partner="partner"
    :no-suspension="true"
    :is-loading="isLoading"
    :no-wsnotification="true"
    :check-errors-fn="isFormValid"
  >
    <template v-slot:default="{ scopeIndex }">
      <SectionTitle :num="scopeIndex + 1">{{
        $t('getvsion.alarm-creation.setLimits')
      }}</SectionTitle>
      <div class="d-flex justify-content-center mt-4 mb-2">
        <Toggle
          v-if="toggleValues"
          @update="currentPeriod = $event.id"
          :values="toggleValues"
          class="pl-2"
        />
      </div>
      <keep-alive>
        <OverConsoDataForm
          v-if="currentPeriod == 'data'"
          @change="levelsData = $event"
          :active.sync="includeDataLimits"
          :offer-package="dataOfferPackage"
        />
      </keep-alive>
      <keep-alive>
        <OverConsoSMSForm
          v-if="currentPeriod == 'sms'"
          @change="levelsSms = $event"
          :active.sync="includeSMSLimits"
          :offer-package="smsOfferPackage"
        />
      </keep-alive>
      <keep-alive>
        <OverConsoVoiceForm
          v-if="currentPeriod == 'voice'"
          @change="levelsVoice = $event"
          :active.sync="includeVoiceLimits"
          :offer-package="voiceOfferPackage"
        />
      </keep-alive>
    </template>
    <template v-slot:scopechoice="{ partner }">
      <SectionTitle :num="2">{{ $t('getvsion.alarm-creation.chooseOffer') }}</SectionTitle>
      <OfferBillingAccountChoice
        :key="'offercf_' + (partner ? partner.id : '')"
        :partner="partner"
        @change="onBillingAccountChange"
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
import { fetchUsageLimits } from '@/api/offers';

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
    partner: Object,
  },

  data() {
    return {
      filterForCreation: undefined,
      currentPeriod: 'data',
      scopeChoice: undefined,
      levelsData: undefined,
      levelsSms: undefined,
      levelsVoice: undefined,
      selectedPartner: undefined,
      dataOfferPackage: undefined,
      voiceOfferPackage: undefined,
      smsOfferPackage: undefined,
      includeDataLimits: false,
      includeSMSLimits: false,
      includeVoiceLimits: false,
      isLoading: false,
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

  computed: {
    chosenBillingAccountId() {
      return get(this.filterForCreation, 'offerCF.meta.customerAccount.id');
    },
    offerCode() {
      return get(this.filterForCreation, 'offerCF.meta.workflow.initialOffer.code');
    },
    chosenPartnerId() {
      return get(this.partner, 'id') || get(this.selectedPartner, 'id');
    },
  },

  methods: {
    ...mapMutations(['flashMessage', 'closePanel', 'confirmAction']),

    onBillingAccountChange(value) {
      this.filterForCreation = value;
      this.refreshLimits();
    },

    async refreshLimits() {
      const offerLimits = await fetchUsageLimits(
        this.chosenPartnerId,
        this.chosenBillingAccountId,
        this.offerCode
      );

      if (offerLimits && offerLimits.length) {
        this.dataOfferPackage = offerLimits.find(f => f.usageType === 'DATA');
        this.voiceOfferPackage = offerLimits.find(f => f.usageType === 'VOICE');
        this.smsOfferPackage = offerLimits.find(f => f.usageType === 'SMS');
      } else {
        this.dataOfferPackage = undefined;
      }
    },

    async onSave(payload) {
      const marketingOfferId = get(this.filterForCreation, 'offerCF.meta.workflow.initialOffer.id');
      const customerAccountId = get(this.filterForCreation, 'offerCF.meta.customerAccount.id');

      let levelsData = undefined;
      let levelsSms = undefined;
      let levelsVoice = undefined;

      if (this.includeDataLimits && this.levelsData) {
        levelsData = {};
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

      if (this.includeSMSLimits && this.levelsSms) {
        levelsSms = {};
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

      if (this.includeVoiceLimits && this.levelsVoice) {
        levelsVoice = {};
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
        partyId: payload.partner.id,
      };

      try {
        let response;

        if (this.duplicateFrom && this.duplicateFrom.toModify) {
          // response = await modifyOverConso({ ...params, id: this.duplicateFrom.id });
        } else {
          this.isLoading = true;
          response = await createSharedConsumptionAlarm(params);
          this.isLoading = false;
        }
        const key = 'MAX_ALARM_INSTANCE_TO_CATCH_UP';
        this.onClose(response, key);
      } catch (e) {
        console.log('Erreur ', e);
      }
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
    onClose(response, key) {
      if (
        response.errors &&
        response.errors.length &&
        response.errors.find(err => err.key === key)
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
        !response.errors.find(err => err.key === key)
      ) {
        this.flashMessage({ level: 'danger', message: this.$t('genericErrorMessage') });
      } else {
        this.flashMessage({ level: 'success', message: this.$t('genericSuccessMessage') });
      }
      this.closePanel({ resetSearch: true });
    },
  },
};
</script>
