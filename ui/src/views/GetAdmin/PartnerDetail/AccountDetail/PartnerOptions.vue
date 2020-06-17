<template>
  <div v-if="canShowOptions">
    <ContentBlock no-handle>
      <template slot="title">{{ $t('common.services') }}</template>
      <template slot="content">
        <ToggleGroup :services="services" :size="3" />
        <div class="d-flex">
          <div class="third-size pr-4">
            <h6>{{ $t('getvsion.mailing-list') }}</h6>
            <UiSelect
              class="report-field"
              v-model="resilationSecurityNotificationMails"
              :options="mailingLists"
              block
            />
          </div>
          <div class="third-size pr-4">
            <h6>{{ $t('getadmin.partners.optionsDetails.smsCodes') }}</h6>
            <UiInput v-model="shortCodes" block />
          </div>
        </div>
      </template>
    </ContentBlock>
    <ContentBlock no-handle>
      <template slot="title">{{ $t('common.order') }}</template>
      <template slot="content">
        <div class="d-flex">
          <div class="third-size">
            <h6>{{ $t('getadmin.partners.optionsDetails.notifyEmail') }}</h6>
            <UiSelect class="report-field" v-model="mailOrder" :options="mailingLists" block />
          </div>
          <div class="two-thirds">
            <ToggleGroup :services="orderToggles" :size="2" />
          </div>
        </div>
        <div class="d-flex">
          <div class="third-size pr-4">
            <h6>{{ $t('getadmin.partners.optionsDetails.userReference') }}</h6>
            <UiInput v-model="refUser" block />
          </div>
          <div class="third-size pr-4">
            <h6>{{ $t('getadmin.partners.optionsDetails.list') }}</h6>
            <UiSelect class="report-field" v-model="crEmail" :options="mailingLists" block />
          </div>
        </div>
      </template>
    </ContentBlock>
    <ContentBlock no-handle>
      <template slot="title">{{ $t('common.billing') }}</template>
      <template slot="content">
        <ToggleGroup :services="billingToggles" :size="3" />

        <div class="d-flex mb-2">
          <div class="third-size to-bottom pb-3">
            <UiToggle
              label="Facturation PDP et CELL ID"
              :editable="true"
              :bold-label="flagBillingPDPCellHistory"
              v-model="flagBillingPDPCellHistory"
              small-label
            />
          </div>
          <div class="third-size to-bottom pb-3">
            <UiToggle
              label="Liste de diffusion activée"
              :editable="true"
              :bold-label="diffusionListEnabled"
              v-model="diffusionListEnabled"
              small-label
            />
          </div>

          <div class="third-size pr-4">
            <h6>{{ $t('getvsion.mailing-list') }}</h6>
            <UiSelect class="report-field" v-model="diffusionList" :options="mailingLists" block />
          </div>
        </div>

        <div class="d-flex">
          <div class="third-size pr-4">
            <h6>{{ $t('getadmin.partners.optionsDetails.dualSimInfo') }}</h6>
            <UiInput v-model="billingDualSIM" block />
          </div>
          <div class="third-size pr-4" v-if="getToggle(billingToggles, 'AUTO_ACT_SIM')">
            <h6>{{ $t('getadmin.partners.optionsDetails.delayAutoActivation') }}</h6>
            <UiInput v-model="autoActivationDelay" input-type="number" block />
            <small v-if="fieldErrors && errors.autoActivationDelay" class="form-text error-text">{{
              $t('required')
            }}</small>
          </div>
          <div class="third-size pr-4" v-if="getToggle(billingToggles, 'AUTO_ACT_SIM')">
            <h6>{{ $t('getadmin.partners.optionsDetails.offerActivation') }}</h6>
            <OfferCombo :value.sync="selectedOffer" :partners="[partner]" />
          </div>
        </div>
        <div class="d-flex">
          <div class="third-size pr-4" v-if="selectedOffer">
            <h6>{{ $t('common.billingAccounts') }}</h6>
            <BillingAccountCombo :value.sync="selectedBillingAccount" :partners="[partner]" />
          </div>
          <div class="third-size pr-4" v-if="getToggle(billingToggles, 'FACT_SIM_STOCK')">
            <h6>{{ $t('getadmin.partners.optionsDetails.delayBillings') }}</h6>
            <UiInput v-model="billingDelay" input-type="number" block />
            <small v-if="fieldErrors && errors.billingDelay" class="form-text error-text">{{
              $t('required')
            }}</small>
          </div>
        </div>
      </template>
    </ContentBlock>

    <ContentBlock no-handle>
      <template slot="title">{{ $t('common.export') }}</template>
      <template slot="content">
        <div class="d-flex">
          <div class="third-size to-bottom pb-3">
            <UiToggle
              label="Export compta mode BSCS"
              :editable="true"
              :bold-label="comptaExport"
              v-model="comptaExport"
              small-label
            />
          </div>
          <div class="third-size to-bottom pb-3">
            <UiToggle
              label="Export des services"
              :editable="true"
              :bold-label="flagServicesAudit"
              v-model="flagServicesAudit"
              small-label
            />
          </div>

          <div class="third-size">
            <h6>{{ $t('getadmin.partners.optionsDetails.dataReporting') }}</h6>
            <Toggle
              block
              v-if="reportConsoValues"
              @update="reportConsoValue = $event.id"
              :values="reportConsoValues"
              class="pl-2"
            />
          </div>
        </div>
      </template>
    </ContentBlock>

    <ContentBlock no-handle>
      <template slot="title">{{ $t('common.others') }}</template>
      <template slot="content">
        <ToggleGroup :services="otherToggles" :size="3" />

        <div class="d-flex">
          <div class="third-size pr-4">
            <h6>{{ $t('getadmin.partners.optionsDetails.paymentEmails') }}</h6>

            <UiSelect
              class="report-field"
              v-model="portabilityAcquittalsEmails"
              :options="mailingLists"
              block
            />
          </div>
          <div class="third-size pr-4">
            <h6>{{ $t('getadmin.partners.optionsDetails.cdrEmails') }}</h6>

            <UiSelect class="report-field" v-model="dailyCdrEmails" :options="mailingLists" block />
          </div>
          <div class="third-size pr-4">
            <h6>{{ $t('getadmin.partners.optionsDetails.preactivateFormat') }}</h6>
            <Toggle
              block
              @update="preactivationFormat = $event.id"
              :values="preactivationFormats"
              class="pl-2"
            />
          </div>
        </div>

        <div class="d-flex">
          <div class="third-size pr-4">
            <h6>{{ $t('getvision.notify-ws') }}</h6>
            <Toggle block @update="notificationChoice = $event.id" :values="notificationChoices" />
          </div>
          <div class="third-size pr-4">
            <h6>{{ $t('login') }}</h6>
            <UiInput v-model="login" block />
          </div>
          <div class="third-size pr-4">
            <h6>{{ $t('password') }}</h6>
            <UiInput v-model="password" block />
          </div>
        </div>

        <div class="d-flex">
          <div class="third-size pr-4">
            <h6>{{ $t('getadmin.partners.optionsDetails.ws-address') }}</h6>
            <UiInput v-model="webserviceAdress" input-type="number" block />
          </div>

          <div class="third-size pr-4">
            <h6>{{ $t('getadmin.partners.optionsDetails.maxViews') }}</h6>
            <UiInput v-model="geolocViewLimit" block />
          </div>

          <div class="third-size pr-4">
            <h6>{{ $t('getadmin.partners.optionsDetails.actualView') }}</h6>
            <UiInput v-model="geolocViewCounter" block />
          </div>
        </div>
      </template>
    </ContentBlock>

    <div class="d-flex">
      <div class="save-block">
        <UiButton
          variant="primary"
          class="p-3"
          block
          @click="saveOptions"
          :disabled="!!fieldErrors"
        >
          <span class="btn-label">{{ $t('save') }}</span>
        </UiButton>
      </div>
    </div>
  </div>
</template>

<script>
import ContentBlock from '@/views/GetParc/LineDetail/ContentBlock';
import UiToggle from '@/components/ui/UiToggle';
import Toggle from '@/components/ui/UiToggle2';
import OfferCombo from '@/components/CustomComboxes/OfferCombo.vue';
import BillingAccountCombo from '@/components/CustomComboxes/BillingAccountCombo.vue';
import UiButton from '@/components/ui/Button';

import ToggleGroup from '@/components/ToggleGroup.vue';
import UiInput from '@/components/ui/UiInput';
import UiSelect from '@/components/ui/UiSelect';
import get from 'lodash.get';

import { getPartyOptions, updatePartyOptions } from '@/api/partners.js';

export default {
  components: {
    ContentBlock,
    UiToggle,
    Toggle,
    ToggleGroup,
    UiInput,
    UiSelect,
    OfferCombo,
    BillingAccountCombo,
    UiButton,
  },
  computed: {
    mailingLists() {
      if (!this.partner) return [];
      const mailingLists = get(this.partner, 'mailingLists', []);
      return mailingLists.map(m => ({ label: m.name, value: m.id }));
    },
    canSave() {
      return false;
    },
    fieldErrors() {
      return this.haveFieldErrors();
    },
  },
  props: {
    partner: Object,
  },

  async mounted() {
    await this.resetOptions();
  },

  methods: {
    async resetOptions() {
      this.canShowOptions = false;
      this.partnerOptions = await getPartyOptions(this.partner.id);
      this.checkToggle(this.services, 'AMSISDN', this.partnerOptions.flagMsisdnA);
      this.checkToggle(this.services, 'NOTIF_EUICC', this.partnerOptions.euiccEnabled);
      this.checkToggle(this.services, 'SECU_RESIL', this.partnerOptions.resilationSecurityEnabled);

      this.resilationSecurityNotificationMails = this.partnerOptions.resilationSecurityNotificationMails;
      this.mailOrder = this.partnerOptions.mailOrder;
      this.crEmail = this.partnerOptions.crEmail;
      this.portabilityAcquittalsEmails = this.partnerOptions.portabilityAcquittalsEmails;

      this.checkToggle(
        this.services,
        'NOTIF_DEM_RESIL',
        this.partnerOptions.resilationSecurityNotificationEnabled
      );
      this.checkToggle(this.services, 'COMPAT_OTA', this.partnerOptions.otaSensitive);
      this.checkToggle(this.services, 'BROADCAST_SMS', this.partnerOptions.smsAuthorized);
      this.shortCodes = this.partnerOptions.shortCodes;

      this.checkToggle(this.orderToggles, 'REF_CLIENT', this.partnerOptions.orderNumberRequired);
      this.checkToggle(
        this.orderToggles,
        'PREACTIV_MANDATORY',
        this.partnerOptions.orderPreactivationMandatory
      );

      this.checkToggle(
        this.orderToggles,
        'MANDATORY_ACTIVATION',
        this.partnerOptions.orderActivationMandatory
      );
      this.checkToggle(this.orderToggles, 'REF_USER', this.partnerOptions.userReferenceEnabled);

      this.checkToggle(
        this.orderToggles,
        'MAD_FACT',
        this.partnerOptions.resilationSecurityDelayEnabled
      );

      this.resilationSecurityDelay = this.partnerOptions.resilationSecurityDelay;
      this.flagBillingPDPCellHistory = this.partnerOptions.flagBillingPDPCellHistory;

      this.checkToggle(this.orderToggles, 'REF_CLIENT', this.partnerOptions.orderNumberRequired);
      this.checkToggle(this.billingToggles, 'SWITCH_RCARD', this.partnerOptions.switchRcard);
      this.checkToggle(this.billingToggles, 'FACT_IMEI', this.partnerOptions.flagBillingIMEI);
      this.checkToggle(this.billingToggles, 'FACT_DUAL_SIM', this.partnerOptions.dualSimBilling);
      this.checkToggle(
        this.billingToggles,
        'FACT_REPORT_CONSO',
        this.partnerOptions.dualSimBilling
      );
      this.checkToggle(
        this.billingToggles,
        'DISABLE_RCARD',
        this.partnerOptions.controlDeactivateRCard
      );

      this.checkToggle(this.billingToggles, 'CHANGE_OFFER', this.partnerOptions.offerChangeEnabled);
      this.checkToggle(
        this.billingToggles,
        'AUTO_ACT_SIM',
        this.partnerOptions.flagDefautWorkflowActication
      );

      this.checkToggle(
        this.billingToggles,
        'FACT_SIM_STOCK',
        this.partnerOptions.flagbillingNonActDelay
      );

      this.autoActivationDelay = this.partnerOptions.DefautWorkflowActicationDelay;
      if (this.partnerOptions.defaultWorkflowForActivation) {
        this.selectedOffer = {
          id: this.partnerOptions.defaultWorkflowForActivation.code,
          label: this.partnerOptions.defaultWorkflowForActivation.workflowDescription,
          meta: this.partnerOptions.defaultWorkflowForActivation,
        };
      }

      this.selectedBillingAccount = get(this.partnerOptions, 'defaultCustomerForActivation');

      this.billingDelay = this.partnerOptions.billingNonActDelay;
      this.comptaExport = this.partnerOptions.exportComptaBSCSModeEnabled;
      this.flagServicesAudit = this.partnerOptions.flagServicesAudit;
      this.geolocViewLimit = this.partnerOptions.geolocViewLimit;
      this.geolocViewCounter = this.partnerOptions.geolocViewCounter;
      this.dailyCdrEmails = this.partnerOptions.dailyCdrEmails;

      this.diffusionList = this.partnerOptions.diffusionList;

      this.checkToggle(
        this.otherToggles,
        'CUSTOM_FIELD_IMPORT',
        this.partnerOptions.importCustomFieldsEnabled
      );

      this.checkToggle(
        this.otherToggles,
        'DASHBOARD_COUNTRY',
        this.partnerOptions.dashBoarDetailsPerCountry
      );

      this.preactivationFormat = this.partnerOptions.msisdnFormatPreactivation;

      this.preactivationFormats = this.preactivationFormats.map(f => {
        if (f.id === this.preactivationFormat) {
          f.default = true;
        }
        return f;
      });

      this.notificationChoice = get(this.partnerOptions, 'wsNotificationParam.notificationOption');
      this.notificationChoices = this.notificationChoices.map(f => {
        if (f.id === this.notificationChoice) {
          f.default = true;
        }
        return f;
      });

      this.checkToggle(this.otherToggles, 'AUTO_SUSPEND', this.partnerOptions.suspensionAuto);
      this.checkToggle(this.otherToggles, 'HIDE_ADRESS', this.partnerOptions.optionViewCellId);
      this.checkToggle(this.otherToggles, 'COACH_M2M', this.partnerOptions.coachM2MAvailable);
      this.checkToggle(
        this.otherToggles,
        'PROMO_SUPERVISION',
        this.partnerOptions.coachM2MFleetpromotion
      );
      this.checkToggle(this.otherToggles, 'OPTION_24H', this.partnerOptions.coachM2m24h);

      this.login = get(this.partnerOptions, 'wsNotificationParam.login');
      this.webserviceAdress = get(this.partnerOptions, 'wsNotificationParam.url');

      this.canShowOptions = true;

      let reportConsoValue = 'no';
      if (this.partnerOptions.consoReporting) {
        reportConsoValue = this.partnerOptions.dailyOutstandingReporting ? 'detailed' : 'simple';
      }
      this.reportConsoValue = reportConsoValue;
      this.reportConsoValues = this.reportConsoValues.map(r => {
        if (r.id === reportConsoValue) {
          r.default = true;
        }
        return r;
      });
    },
    async saveOptions() {
      await updatePartyOptions({
        partyOptions: {
          partyId: this.partner.id,
          flagMsisdnA: this.getToggle(this.services, 'AMSISDN'),
          euiccEnabled: this.getToggle(this.services, 'NOTIF_EUICC'),
          resilationSecurityEnabled: this.getToggle(this.services, 'SECU_RESIL'),
          resilationSecurityDelay: parseInt(this.resilationSecurityDelay || 0),
          resilationSecurityNotificationEnabled: this.getToggle(this.services, 'NOTIF_DEM_RESIL'),
          resilationSecurityNotificationMails: parseInt(
            this.resilationSecurityNotificationMails | 0
          ),
          otaSensitive: this.getToggle(this.services, 'COMPAT_OTA'),
          smsAuthorized: this.getToggle(this.services, 'BROADCAST_SMS'),
          shortCodes: this.shortCodes,
          mailOrder: parseInt(this.mailOrder),
          orderNumberRequired: this.getToggle(this.orderToggles, 'REF_CLIENT'),
          orderPreactivationMandatory: this.getToggle(this.orderToggles, 'PREACTIV_MANDATORY'),
          orderActivationMandatory: this.getToggle(this.orderToggles, 'MANDATORY_ACTIVATION'),
          userReferenceEnabled: this.getToggle(this.orderToggles, 'REF_USER'),
          crEmail: parseInt(this.crEmail),
          diffusionListEnabled: this.diffusionListEnabled,
          diffusionList: parseInt(this.diffusionList),
          flagBillingPDPCellHistory: this.flagBillingPDPCellHistory,
          flagBillingIMEI: this.getToggle(this.billingToggles, 'FACT_IMEI'),
          switchRcard: this.getToggle(this.billingToggles, 'SWITCH_RCARD'),
          controlDeactivateRCard: this.getToggle(this.billingToggles, 'DISABLE_RCARD'),
          dualSimBilling: this.getToggle(this.billingToggles, 'FACT_DUAL_SIM'),
          offerChangeEnabled: this.getToggle(this.billingToggles, 'CHANGE_OFFER'),
          flagDefautWorkflowActication: this.getToggle(this.billingToggles, 'AUTO_ACT_SIM'),
          defautWorkflowActication: parseInt(this.autoActivationDelay), // error
          defaultWorkflowForActivationId: parseInt(get(this.selectedOffer, 'meta.id')), // error
          defaultCustomerForActivationId: parseInt(get(this.selectedBillingAccount, 'meta.id')), // error
          flagbillingNonActDelay: this.getToggle(this.billingToggles, 'FACT_SIM_STOCK'), // error
          billingNonActDelay: parseInt(this.billingDelay), // error
          exportComptaBSCSModeEnabled: this.comptaExport,
          flagServicesAudit: this.flagServicesAudit,
          flagStatisticsEnabled: this.getToggle(this.billingToggles, 'FACT_REPORT_CONSO'),
          portabilityAcquittalsEmails: parseInt(this.portabilityAcquittalsEmails),
          importCustomFieldsEnabled: this.getToggle(this.otherToggles, 'CUSTOM_FIELD_IMPORT'),
          dashBoarDetailsPerCountry: this.getToggle(this.otherToggles, 'DASHBOARD_COUNTRY'),
          dailyCdrEmails: parseInt(this.dailyCdrEmails),
          msisdnFormatPreactivation: { type: 'enum', value: this.preactivationFormat },
          suspensionAuto: this.getToggle(this.otherToggles, 'AUTO_SUSPEND'),
          optionViewCellId: this.getToggle(this.otherToggles, 'HIDE_ADRESS'),
          wsNotificationOption: { type: 'enum', value: this.notificationChoice },
          wsLogin: this.login,
          wsPassword: this.password,
          wsUrl: this.webserviceAdress,
          coachM2MAvailable: this.getToggle(this.otherToggles, 'COACH_M2M'),
          coachM2MFleetpromotion: this.getToggle(this.otherToggles, 'PROMO_SUPERVISION'),
          coachM2m24h: this.getToggle(this.otherToggles, 'OPTION_24H'),
          geolocViewLimit: this.geolocViewLimit,
          geolocViewCounter: this.geolocViewCounter,
        },
      });

      await this.resetOptions();
    },
    getToggle(toggles, code) {
      const toggle = toggles.find(t => t.code === code);
      if (!toggle) return false;

      return toggle.checked;
    },
    checkToggle(toggles, code, value) {
      toggles.map(t => {
        if (t.code === code) {
          t.checked = value;
        }
        return t;
      });
    },
    haveFieldErrors() {
      const fieldErrors = {};
      let haveError = false;
      if (this.getToggle(this.billingToggles, 'AUTO_ACT_SIM')) {
        if (!this.autoActivationDelay) {
          fieldErrors.autoActivationDelay = true;
          haveError = true;
        }
      }

      if (this.getToggle(this.billingToggles, 'FACT_SIM_STOCK')) {
        if (!this.billingDelay) {
          fieldErrors.billingDelay = true;
          haveError = true;
        }
      }

      this.errors = fieldErrors;
      return haveError;
    },
  },
  data() {
    return {
      canShowOptions: false,
      partnerOptions: undefined,
      notifList: undefined,
      refUser: undefined,
      crEmail: undefined,
      resilationSecurityDelay: undefined,
      flagBillingPDPCellHistory: undefined,
      diffusionListEnabled: undefined,
      diffusionList: undefined,
      billingDualSIM: undefined,
      autoActivationDelay: undefined,
      selectedOffer: undefined,
      selectedBillingAccount: undefined,
      billingDelay: undefined,
      portabilityAcquittalsEmails: undefined,
      dailyCdrEmails: undefined,
      login: undefined,
      password: undefined,
      webserviceAdress: undefined,
      shortCodes: undefined,
      mailOrder: undefined,
      geolocViewLimit: undefined,
      geolocViewCounter: undefined,
      resilationSecurityNotificationMails: undefined,
      errors: undefined,

      comptaExport: false,
      flagServicesAudit: false,

      reportConsoValue: undefined,
      reportConsoValues: [
        {
          id: 'no',
          label: 'common.NO',
        },
        {
          id: 'simple',
          label: 'common.simple',
        },
        {
          id: 'detailed',
          label: 'common.detailed',
        },
      ],

      preactivationFormat: undefined,
      preactivationFormats: [
        {
          id: 'ELEVEN',
          label: 'getadmin.partnerDetail.ELEVEN',
        },
        {
          id: 'FIFTEEN',
          label: 'getadmin.partnerDetail.FIFTEEN',
        },
        {
          id: 'BOTH',
          label: 'getadmin.partnerDetail.BOTH',
        },
      ],

      notificationChoice: undefined,
      notificationChoices: [
        {
          id: 'NONE',
          label: 'none',
        },
        {
          id: 'UNIT',
          label: 'common.unit',
        },
        {
          id: 'MASS',
          label: 'common.mass',
        },
      ],

      otherToggles: [
        {
          code: 'CUSTOM_FIELD_IMPORT',
          checked: false,
          editable: true,
          optional: false,
          activationDate: null,
          labelService: 'Champ libre par import',
        },
        {
          code: 'DASHBOARD_COUNTRY',
          checked: false,
          editable: true,
          optional: false,
          activationDate: null,
          labelService: 'Tableau de bord - Détails par pays',
        },
        {
          code: 'AUTO_SUSPEND',
          checked: false,
          editable: true,
          optional: false,
          activationDate: null,
          labelService: 'Suspension automatique',
        },
        {
          code: 'HIDE_ADRESS',
          checked: false,
          editable: true,
          optional: false,
          activationDate: null,
          labelService: 'Cacher notion adresse',
        },
        {
          code: 'COACH_M2M',
          checked: false,
          editable: true,
          optional: false,
          activationDate: null,
          labelService: 'Coach M2M',
        },
        {
          code: 'PROMO_SUPERVISION',
          checked: false,
          editable: true,
          optional: false,
          activationDate: null,
          labelService: 'Promotion de la Supervision',
        },
        {
          code: 'OPTION_24H',
          checked: false,
          editable: true,
          optional: false,
          activationDate: null,
          labelService: 'Option 24h',
        },
      ],

      billingToggles: [
        {
          code: 'MAD_FACT',
          checked: false,
          editable: true,
          optional: false,
          activationDate: null,
          labelService: 'Mise à disposition des factures',
        },
        {
          code: 'SWITCH_RCARD',
          checked: false,
          editable: true,
          optional: false,
          activationDate: null,
          labelService: 'Switch vers R-Card',
        },
        {
          code: 'DISABLE_RCARD',
          checked: false,
          editable: true,
          optional: false,
          activationDate: null,
          labelService: 'Désactiver - contôler R-Card',
        },
        {
          code: 'CHANGE_OFFER',
          checked: false,
          editable: true,
          optional: false,
          activationDate: null,
          labelService: "Changement d'offre",
        },
        {
          code: 'AUTO_ACT_SIM',
          checked: false,
          editable: true,
          optional: false,
          activationDate: null,
          labelService: 'Auto-Activation SIM préactivées',
        },
        {
          code: 'FACT_SIM_STOCK',
          checked: false,
          editable: true,
          optional: false,
          activationDate: null,
          labelService: 'Facturation SIMs en stock',
        },
        {
          code: 'FACT_IMEI',
          checked: false,
          editable: true,
          optional: false,
          activationDate: null,
          labelService: 'Facturation IMEI',
        },
        {
          code: 'FACT_DUAL_SIM',
          checked: false,
          editable: true,
          optional: false,
          activationDate: null,
          labelService: 'Information dual SIM dans la facture',
        },
        {
          code: 'FACT_REPORT_CONSO',
          checked: false,
          editable: true,
          optional: false,
          activationDate: null,
          labelService: 'Reporting consommations',
        },
      ],

      services: [
        {
          code: 'AMSISDN',
          checked: false,
          editable: true,
          optional: false,
          activationDate: null,
          labelService: 'A-MSISDN',
        },
        {
          code: 'NOTIF_EUICC',
          checked: false,
          editable: true,
          optional: false,
          activationDate: null,
          labelService: 'Notification eUICC',
        },
        {
          code: 'SECU_RESIL',
          checked: false,
          editable: true,
          optional: false,
          activationDate: null,
          labelService: 'Sécurisation des résiliations',
        },
        {
          code: 'NOTIF_DEM_RESIL',
          checked: false,
          editable: true,
          optional: false,
          activationDate: null,
          labelService: 'Notification des demandes de résiliation',
        },
        {
          code: 'COMPAT_OTA',
          checked: false,
          editable: true,
          optional: false,
          activationDate: null,
          labelService: 'Compatibilité OTA',
        },
        //
        {
          code: 'BROADCAST_SMS',
          checked: false,
          editable: true,
          optional: false,
          activationDate: null,
          labelService: 'Broadcast SMS',
        },
      ],

      orderToggles: [
        {
          code: 'REF_CLIENT',
          checked: false,
          editable: true,
          optional: false,
          activationDate: null,
          labelService: 'Référence client obligatoire',
        },
        {
          code: 'PREACTIV_MANDATORY',
          checked: false,
          editable: true,
          optional: false,
          activationDate: null,
          labelService: 'Préactivation obligatoire',
        },
        {
          code: 'MANDATORY_ACTIVATION',
          checked: false,
          editable: true,
          optional: false,
          activationDate: null,
          labelService: 'Activation obligatoire',
        },
        {
          code: 'REF_USER',
          checked: false,
          editable: true,
          optional: false,
          activationDate: null,
          labelService: 'Référence utilisateur',
        },
      ],
    };
  },
};
</script>

<style lang="scss" scoped>
.third-size {
  width: 33%;
}

.to-bottom {
  align-self: flex-end;
}

.two-thirds {
  width: 67% !important;
}

.save-block {
  width: 40%;
  margin-left: auto;
}
</style>
