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
    :check-errors-fn="isFormValidFn"
    :shared-alarm="true"
  >
    <template #default="{ scopeIndex }">
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
    <template #scopechoice="{ chosenPartner }">
      <SectionTitle :num="2">{{ $t('getvsion.alarm-creation.chooseOffer') }}</SectionTitle>
      <OfferBillingAccountChoice
        :key="'offercf_' + (chosenPartner ? chosenPartner.id : '')"
        :partner="chosenPartner"
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

import { createSharedConsumptionAlarm } from '@/api/alarmCreation.js';
import { fetchUsageLimits } from '@/api/offers';
import { updateSharedConsumptionAlarm } from '@/api/alarmsModifications';

import { mapMutations } from 'vuex';
import get from 'lodash.get';

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
      if (this.duplicateFrom.levelData1 && this.duplicateFrom.dateLevelData1 == null) {
        this.duplicateFrom.dateLevelData1 = 'endOfMonth';
      }
      if (this.duplicateFrom.levelData2 && this.duplicateFrom.dateLevelData2 == null) {
        this.duplicateFrom.dateLevelData2 = 'endOfMonth';
      }

      // SMS
      if (this.duplicateFrom.levelSms1 && this.duplicateFrom.dateLevelSms1 == null) {
        this.duplicateFrom.dateLevelSms1 = 'endOfMonth';
      }
      if (this.duplicateFrom.levelSms2 && this.duplicateFrom.dateLevelSms2 == null) {
        this.duplicateFrom.dateLevelSms2 = 'endOfMonth';
      }

      // VOICE
      if (this.duplicateFrom.levelVoice1 && this.duplicateFrom.dateLevelVoice1 == null) {
        this.duplicateFrom.dateLevelVoice1 = 'endOfMonth';
      }
      if (this.duplicateFrom.levelVoice2 && this.duplicateFrom.dateLevelVoice2 == null) {
        this.duplicateFrom.dateLevelVoice2 = 'endOfMonth';
      }
    }

    if (this.duplicateFrom) {
      if (this.duplicateFrom.levelDataMax) {
        this.levelsData = {
          levelMax: {
            level: this.duplicateFrom.levelDataMax,
          },
        };
      }
      if (this.duplicateFrom.levelData1) {
        this.levelsData = {
          levelMax: {
            level: this.duplicateFrom.levelDataMax,
          },
          level1: {
            level: this.duplicateFrom.levelData1,
            dayOfMonth: this.duplicateFrom.dateLevelData1,
          },
        };
        this.includeDataLimits = true;
      }
      if (this.duplicateFrom.levelData2) {
        this.levelsData = {
          levelMax: {
            level: this.duplicateFrom.levelDataMax,
          },
          level1: {
            level: this.duplicateFrom.levelData1,
            dayOfMonth: this.duplicateFrom.dateLevelData1,
          },
          level2: {
            level: this.duplicateFrom.levelData2,
            dayOfMonth: this.duplicateFrom.dateLevelData2,
          },
        };
        this.includeDataLimits = true;
      }

      if (this.duplicateFrom.levelSmsMax) {
        this.levelsSms = {
          levelMax: {
            level: this.duplicateFrom.levelSmsMax,
          },
        };
      }
      if (this.duplicateFrom.levelSms1) {
        this.levelsSms = {
          levelMax: {
            level: this.duplicateFrom.levelSmsMax,
          },
          level1: {
            level: this.duplicateFrom.levelSms1,
            dayOfMonth: this.duplicateFrom.dateLevelSms1,
          },
        };
        this.includeSMSLimits = true;
      }
      if (this.duplicateFrom.levelSms2) {
        this.levelsSms = {
          levelMax: {
            level: this.duplicateFrom.levelSmsMax,
          },
          level1: {
            level: this.duplicateFrom.levelSms1,
            dayOfMonth: this.duplicateFrom.dateLevelSms1,
          },
          level2: {
            level: this.duplicateFrom.levelSms2,
            dayOfMonth: this.duplicateFrom.dateLevelSms2,
          },
        };
        this.includeSMSLimits = true;
      }

      if (this.duplicateFrom.levelVoiceMax) {
        this.levelsVoice = {
          levelMax: {
            level: this.duplicateFrom.levelVoiceMax,
          },
        };
      }
      if (this.duplicateFrom.levelVoice1) {
        this.levelsVoice = {
          levelMax: {
            level: this.duplicateFrom.levelVoiceMax,
          },
          level1: {
            level: this.duplicateFrom.levelVoice1,
            dayOfMonth: this.duplicateFrom.dateLevelVoice1,
          },
        };
        this.includeVoiceLimits = true;
      }
      if (this.duplicateFrom.levelVoice2) {
        this.levelsVoice = {
          levelMax: {
            level: this.duplicateFrom.levelVoiceMax,
          },
          level1: {
            level: this.duplicateFrom.levelVoice1,
            dayOfMonth: this.duplicateFrom.dateLevelVoice1,
          },
          level2: {
            level: this.duplicateFrom.levelVoice2,
            dayOfMonth: this.duplicateFrom.dateLevelVoice2,
          },
        };
        this.includeVoiceLimits = true;
      }

      this.toggleValues = this.toggleValues.map((t) => {
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
        this.dataOfferPackage = offerLimits.find((f) => f.usageType === 'DATA');
        this.voiceOfferPackage = offerLimits.find((f) => f.usageType === 'VOICE');
        this.smsOfferPackage = offerLimits.find((f) => f.usageType === 'SMS');
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

      // DATA
      // Structure json jamais modifiée…
      if (this.levelsData) {
        levelsData = {};

        if (!this.editMode) {
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
        } else {
          if (this.levelsData.basePercent) {
            levelsData.levelMax = { level: parseInt(this.levelsData.basePercent) };
          }
          if (this.levelsData.levelMax) {
            levelsData.levelMax = { level: parseInt(this.levelsData.levelMax.level) };
          }

          if (this.levelsData.levels && this.levelsData.levels.length == 1) {
            levelsData.levelMax = {
              level: this.levelsData.levels[0].value,
              dayOfMonth: this.levelsData.levels[0].limit,
            };
          }
          if (this.levelsData.levels && this.levelsData.levels.length == 2) {
            levelsData.levelMax = {
              level: this.levelsData.levels[0].value,
              dayOfMonth: this.levelsData.levels[0].limit,
            };

            levelsData.level1 = {
              level: this.levelsData.levels[1].value,
              dayOfMonth: this.levelsData.levels[1].limit,
            };
          }
          if (this.levelsData.levels && this.levelsData.levels.length == 3) {
            levelsData.levelMax = {
              level: this.levelsData.levels[0].value,
              dayOfMonth: this.levelsData.levels[0].limit,
            };

            levelsData.level1 = {
              level: this.levelsData.levels[1].value,
              dayOfMonth: this.levelsData.levels[1].limit,
            };

            levelsData.level2 = {
              level: this.levelsData.levels[2].value,
              dayOfMonth: this.levelsData.levels[2].limit,
            };
          }
        }
      }

      // SMS
      if (this.levelsSms) {
        levelsSms = {};

        if (!this.editMode) {
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
        } else {
          // Structure json modifiée si modification des inputs
          if (this.levelsSms.basePercent) {
            levelsSms.levelMax = { level: parseInt(this.levelsSms.basePercent) };
          }
          if (this.levelsSms.levelMax) {
            levelsSms.levelMax = { level: parseInt(this.levelsSms.levelMax.level) };
          }

          if (this.levelsSms.levels && this.levelsSms.levels.length == 1) {
            levelsSms.levelMax = {
              level: this.levelsSms.levels[0].value,
              dayOfMonth: this.levelsSms.levels[0].limit,
            };
          }
          if (this.levelsSms.levels && this.levelsSms.levels.length == 2) {
            levelsSms.levelMax = {
              level: this.levelsSms.levels[0].value,
              dayOfMonth: this.levelsSms.levels[0].limit,
            };

            levelsSms.level1 = {
              level: this.levelsSms.levels[1].value,
              dayOfMonth: this.levelsSms.levels[1].limit,
            };
          }

          if (this.levelsSms.levels && this.levelsSms.levels.length == 3) {
            levelsSms.levelMax = {
              level: this.levelsSms.levels[0].value,
              dayOfMonth: this.levelsSms.levels[0].limit,
            };

            levelsSms.level1 = {
              level: this.levelsSms.levels[1].value,
              dayOfMonth: this.levelsSms.levels[1].limit,
            };

            levelsSms.level2 = {
              level: this.levelsSms.levels[2].value,
              dayOfMonth: this.levelsSms.levels[2].limit,
            };
          }
        }
      }

      // VOICE
      if (this.levelsVoice) {
        levelsVoice = {};

        if (!this.editMode) {
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
        } else {
          // Structure json modifiée si modification des inputs
          if (this.levelsVoice.basePercent) {
            levelsVoice.levelMax = { level: parseInt(this.levelsVoice.basePercent) };
          }
          if (this.levelsVoice.levelMax) {
            levelsVoice.levelMax = { level: parseInt(this.levelsVoice.levelMax.level) };
          }

          if (this.levelsVoice.levels && this.levelsVoice.levels.length == 1) {
            levelsVoice.levelMax = {
              level: this.levelsVoice.levels[0].value,
              dayOfMonth: this.levelsVoice.levels[0].limit,
            };
          }

          if (this.levelsVoice.levels && this.levelsVoice.levels.length == 2) {
            levelsVoice.levelMax = {
              level: this.levelsVoice.levels[0].value,
              dayOfMonth: this.levelsVoice.levels[0].limit,
            };

            levelsVoice.level1 = {
              level: this.levelsVoice.levels[1].value,
              dayOfMonth: this.levelsVoice.levels[1].limit,
            };
          }
          if (this.levelsVoice.levels && this.levelsVoice.levels.length == 3) {
            levelsVoice.levelMax = {
              level: this.levelsVoice.levels[0].value,
              dayOfMonth: this.levelsVoice.levels[0].limit,
            };

            levelsVoice.level1 = {
              level: this.levelsVoice.levels[1].value,
              dayOfMonth: this.levelsVoice.levels[1].limit,
            };

            levelsVoice.level2 = {
              level: this.levelsVoice.levels[2].value,
              dayOfMonth: this.levelsVoice.levels[2].limit,
            };
          }
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
          mailingList: payload.notifList,
          activateAlarm: payload.enableAlarm,
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
        this.onClose(response);
      } catch (e) {
        console.log('Erreur ', e);
      }
    },

    isFormValidFn() {
      let isFormValid;
      isFormValid = !this.editMode ? !!this.filterForCreation : this.editMode;
      // DATA
      if (this.levelsData) {
        if (this.levelsData.levels && this.levelsData.levels.length) {
          this.levelsData.levels.filter((l) => {
            isFormValid &= !!l.value && !!l.limit;
          });
        }
      }

      // SMS
      if (this.levelsSms) {
        if (this.levelsSms.levels && this.levelsSms.levels.length) {
          this.levelsSms.levels.filter((l) => {
            isFormValid &= !!l.value && !!l.limit;
          });
        }
      }

      // VOICE
      if (this.levelsVoice) {
        if (this.levelsVoice.levels && this.levelsVoice.levels.length) {
          this.levelsVoice.levels.filter((l) => {
            isFormValid &= !!l.value && !!l.limit;
          });
        }
      }

      if (!this.levelsData && !this.levelsSms && !this.levelsVoice) {
        isFormValid &= false;
      }
      return isFormValid;
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
};
</script>
