<template>
  <AlarmCreationBaseForm
    :alarm="alarm"
    have-form
    skip-scope-check
    :duplicate-from="duplicateFrom"
    :container-height="'9rem'"
    @save="onSave"
    @partnerChange="selectedPartner = $event"
    :partner="partner"
    :no-suspension="true"
    :is-loading="isLoading"
    :no-wsnotification="true"
    :check-errors-fn="isFormValid"
    :shared-alarm="true"
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
          :duplicate-from="duplicateFrom"
        />
      </keep-alive>
      <keep-alive>
        <OverConsoSMSForm
          v-if="currentPeriod == 'sms'"
          @change="levelsSms = $event"
          :active.sync="includeSMSLimits"
          :offer-package="smsOfferPackage"
          :duplicate-from="duplicateFrom"
        />
      </keep-alive>
      <keep-alive>
        <OverConsoVoiceForm
          v-if="currentPeriod == 'voice'"
          @change="levelsVoice = $event"
          :active.sync="includeVoiceLimits"
          :offer-package="voiceOfferPackage"
          :duplicate-from="duplicateFrom"
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
import { updateSharedConsumptionAlarm } from '@/api/alarmsModifications';

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

  mounted() {
    if (this.duplicateFrom) {
      if (this.duplicateFrom.levelDataMax) {
        this.levelsData = {
          basePercent: this.duplicateFrom.levelDataMax,
        };
      }
      if (this.duplicateFrom.levelData1) {
        this.levelsData = {
          ...this.levelsData,
          levels: [
            {
              value: this.duplicateFrom.levelData1,
              limit: this.duplicateFrom.dateLevelData1,
            },
          ],
        };
        this.includeDataLimits = true;
      }
      if (this.duplicateFrom.levelData2) {
        this.levelsData = {
          ...this.levelsData,
          levels: [
            ...this.levelsData.levels,
            {
              value: this.duplicateFrom.levelData2,
              limit: this.duplicateFrom.dateLevelData2,
            },
          ],
        };
        this.includeDataLimits = true;
      }

      if (this.duplicateFrom.levelSmsMax) {
        this.levelsSms = {
          basePercent: this.duplicateFrom.levelSmsMax,
        };
      }
      if (this.duplicateFrom.levelSms1) {
        this.levelsSms = {
          ...this.levelsSms,
          levels: [
            {
              value: this.duplicateFrom.levelSms1,
              limit: this.duplicateFrom.dateLevelSms1,
            },
          ],
        };
        this.includeSMSLimits = true;
      }
      if (this.duplicateFrom.levelSms2) {
        this.levelsSms = {
          ...this.levelsSms,
          levels: [
            ...this.levelsSms.levels,
            {
              value: this.duplicateFrom.levelSms2,
              limit: this.duplicateFrom.dateLevelSms2,
            },
          ],
        };
        this.includeSMSLimits = true;
      }

      if (this.duplicateFrom.levelVoiceMax) {
        this.levelsVoice = {
          basePercent: this.duplicateFrom.levelVoiceMax,
        };
      }
      if (this.duplicateFrom.levelVoice1) {
        this.levelsVoice = {
          ...this.levelsVoice,
          levels: [
            {
              value: this.duplicateFrom.levelVoice1,
              limit: this.duplicateFrom.dateLevelVoice1,
            },
          ],
        };
        this.includeVoiceLimits = true;
      }
      if (this.duplicateFrom.levelVoice2) {
        this.levelsVoice = {
          ...this.levelsVoice,
          levels: [
            ...this.levelsVoice.levels,
            {
              value: this.duplicateFrom.levelVoice2,
              limit: this.duplicateFrom.dateLevelVoice2,
            },
          ],
        };
        this.includeVoiceLimits = true;
      }

      this.toggleValues = this.toggleValues.map(t => {
        t.default = t.id === this.duplicateFrom.observationCycle;
        return t;
      });
    }
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
    editMode() {
      return this.duplicateFrom && this.duplicateFrom.toModify;
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

      let params;

      if (!this.editMode) {
        params = {
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
      } else {
        params = {
          sharedAlarmId: this.duplicateFrom.id,
          alarmName: payload.alarmName,
          levelsData,
          levelsSms,
          levelsVoice,
          emailNotification: payload.sholdNotify,
        };
      }

      try {
        let response;

        if (this.duplicateFrom && this.duplicateFrom.toModify) {
          response = await updateSharedConsumptionAlarm({ ...params });
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
      isFormValid = !this.editMode ? !!this.filterForCreation : this.editMode;
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
