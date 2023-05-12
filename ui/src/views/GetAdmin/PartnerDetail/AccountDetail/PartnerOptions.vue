<template>
  <div v-if="canShowOptions">
    <!-- BLOCK SERVICES -->
    <ContentBlock no-handle>
      <template slot="title">{{ $t('common.services') }}</template>
      <template slot="content">
        <ToggleGroup :services="services" :size="2" />
        <div class="separator"></div>
        <!-- SECU RESIL BOX -->
        <div class="d-flex two">
          <div class="two-size pb-3">
            <UiToggle
              :label="$t('getadmin.partners.optionsDetails.services.labels.SECU_RESIL')"
              :editable="true"
              :bold-label="isChanged(resilationSecurityEnabled, 'resilationSecurityEnabled')"
              v-model="resilationSecurityEnabled"
              small-label
            />
          </div>
          <div class="two-size pb-3">
            <UiToggle
              v-if="partyType === 'CUSTOMER' && resilationSecurityEnabled"
              :label="$t('notification')"
              :editable="true"
              :bold-label="isChanged(
                resilationSecurityNotificationEnabled,
                'resilationSecurityNotificationEnabled'
              )
                "
              v-model="resilationSecurityNotificationEnabled"
              small-label
            />
          </div>
        </div>
        <div class="d-flex two" v-if="partyType === 'CUSTOMER' && resilationSecurityEnabled">
          <div class="two-size pr-4 ml-2">
            <div class="form-group">
              <label class="small-label">{{ $t('getadmin.partners.optionsDetails.delay') }}</label>
              <UiInput v-model="resilationSecurityDelay" input-type="number" block />
              <small
                v-if="fieldErrors && errors.resilationSecurityDelay"
                class="form-text error-text"
                >{{ $t('required') }}</small
              >
            </div>
          </div>
          <div class="two-size pr-4 ml-2" v-if="resilationSecurityNotificationEnabled">
            <div class="form-group">
              <label class="small-label">{{
                $t('getadmin.partners.optionsDetails.notificationList')
              }}</label>
              <UiSelect
                class="report-field"
                v-model="resilationSecurityNotificationMails"
                :options="mailingLists"
                block
              />
              <small
                v-if="fieldErrors && errors.resilationSecurityNotificationMails"
                class="form-text error-text"
                >{{ $t('required') }}</small
              >
            </div>
          </div>
        </div>
        <div class="separator"></div>
        <!-- SMS BROADCAST BOX -->
        <div class="two-size to-center pb-3">
          <UiToggle
            v-if="partyType === 'CUSTOMER'"
            :label="$t('getadmin.partners.optionsDetails.services.labels.BROADCAST_SMS')"
            :editable="true"
            :bold-label="isChanged(smsAuthorizedEnabled, 'smsAuthorized')"
            v-model="smsAuthorizedEnabled"
            small-label
          />
        </div>

        <div class="d-flex" v-if="partyType === 'CUSTOMER' && smsAuthorizedEnabled">
          <div class="two-size pr-4 ml-2">
            <div class="form-group">
              <label class="small-label">{{
                $t('getadmin.partners.optionsDetails.smsCodes')
              }}</label>
              <UiInput v-model="shortCodes" block />
            </div>
          </div>
        </div>
        <div class="separator"></div>
        <!-- CLIENT REF BOX -->
        <div class="two-size">
          <div class="form-group">
            <UiToggle
              :label="$t('getadmin.partners.optionsDetails.userReference')"
              :editable="true"
              v-model="refUser"
              :bold-label="isChanged(refUser, 'userReferenceEnabled')"
              small-label
            />
          </div>
        </div>
        <div class="two-size pr-4 ml-2" v-if="refUser">
          <div class="form-group">
            <label class="small-label">{{ $t('getadmin.partners.optionsDetails.listCR') }}</label>
            <UiSelect class="report-field" v-model="crEmail" :options="mailingLists" block />
          </div>
        </div>
      </template>
    </ContentBlock>

    <!-- ORDER BLOCK -->
    <ContentBlock no-handle>
      <template slot="title">{{ $t('common.order') }}</template>
      <template slot="content">
        <div class="d-flex mt-3 two">
          <div class="two-size">
            <UiToggle
              :label="$t('getadmin.partners.optionsDetails.services.labels.MANDATORY_PREACTIVATION')
                "
              :checked="orderActivationEnabled"
              :editable="!orderActivationEnabled"
              :bold-label="isChanged(orderPreactivation, 'orderPreactivationMandatory')"
              v-model="orderPreactivation"
              small-label
            />
          </div>
          <div class="two-size">
            <UiToggle
              :label="$t('getadmin.partners.optionsDetails.services.labels.MANDATORY_ACTIVATION')"
              :editable="true"
              :bold-label="isChanged(orderActivationEnabled, 'orderActivationMandatory')"
              v-model="orderActivationEnabled"
              small-label
            />
          </div>
        </div>
        <div class="content mt-4">
          <ToggleGroup :services="orderToggles" :size="2" />
        </div>
        <div class="content two d-flex">
          <div class="two-size ml-2">
            <div class="form-group">
              <label class="small-label">{{
                $t('getadmin.partners.optionsDetails.notifyEmail')
              }}</label>
              <UiSelect class="report-field" v-model="mailOrder" :options="mailingLists" block />
            </div>
          </div>
        </div>
      </template>
    </ContentBlock>

    <!-- BILLING BLOCK  -->
    <ContentBlock no-handle>
      <template slot="title">{{ $t('common.billing') }}</template>
      <template slot="content">
        <ToggleGroup :services="billingToggles" :size="2" />

        <!-- Bill sim stock -->
        <div class="separator"></div>
        <div>
          <div class="two-size pb-3">
            <UiToggle
              :label="$t('getadmin.partners.optionsDetails.services.labels.FACT_SIM_STOCK')"
              :editable="true"
              :bold-label="isChanged(flagbillingNonActDelayEnabled, 'flagbillingNonActDelay')"
              v-model="flagbillingNonActDelayEnabled"
              small-label
            />
          </div>
          <div class="two-size pr-4 ml-2" v-if="flagbillingNonActDelayEnabled">
            <div class="form-group">
              <label class="small-label">{{
                $t('getadmin.partners.optionsDetails.delayBillings')
              }}</label>
              <UiInput v-model="billingDelay" input-type="number" block />
              <small v-if="fieldErrors && errors.billingDelay" class="form-text error-text">{{
                $t('required')
              }}</small>
            </div>
          </div>
        </div>
        <!-- Diffusion list -->
        <div class="separator"></div>
        <div>
          <div class="two-size pb-3">
            <UiToggle
              :label="$t('getadmin.partners.optionsDetails.services.labels.MAD_FACT')"
              :editable="true"
              :bold-label="isChanged(diffusionListEnabled, 'diffusionListEnabled')"
              v-model="diffusionListEnabled"
              small-label
            />
          </div>
          <div class="two-size pr-4 ml-2" v-if="diffusionListEnabled">
            <div class="form-group">
              <label class="small-label">{{ $t('getvsion.mailing-list') }}</label>
              <UiSelect
                class="report-field"
                v-model="diffusionList"
                :options="mailingLists"
                block
              />
              <small v-if="fieldErrors && errors.diffusionList" class="form-text error-text">{{
                $t('required')
              }}</small>
            </div>
          </div>
        </div>
        <div class="separator"></div>
        <!-- Activation auto for SIM preactivated -->
        <div class="d-flex two">
          <div class="two-size pb-3 mt-2">
            <UiToggle
              :label="$t('getadmin.partners.optionsDetails.services.labels.AUTO_ACT_SIM')"
              :editable="true"
              :bold-label="isChanged(flagDefautWorkflowActicationEnabled, 'flagDefautWorkflowActication')
                "
              v-model="flagDefautWorkflowActicationEnabled"
              small-label
            />
          </div>
        </div>
        <div class="d-flex two">
          <div class="two-size pr-4 ml-2" v-if="flagDefautWorkflowActicationEnabled">
            <div class="form-group">
              <label class="small-label">{{
                $t('getadmin.partners.optionsDetails.offerActivation')
              }}</label>
              <OfferCombo v-model="selectedOffer" :partners="[partner]" />
            </div>
          </div>
          <div
            class="two-size pr-4 ml-2"
            v-if="selectedOffer && flagDefautWorkflowActicationEnabled"
          >
            <div class="form-group">
              <label class="small-label">{{ $t('common.billingAccounts') }}</label>
              <BillingAccountAutocomplete
                v-model="selectedBillingAccount"
                :selected-partner="partner"
              />
            </div>
          </div>
        </div>
        <div>
          <div class="two-size pr-4 ml-2" v-if="flagDefautWorkflowActicationEnabled">
            <div class="form-group">
              <label class="small-label">{{
                $t('getadmin.partners.optionsDetails.delayAutoActivation')
              }}</label>
              <UiInput v-model="autoActivationDelay" input-type="number" block />
              <small
                v-if="fieldErrors && errors.autoActivationDelay"
                class="form-text error-text"
                >{{ $t('required') }}</small
              >
            </div>
          </div>
        </div>
      </template>
    </ContentBlock>

    <!-- EXPORT BLOC -->
    <ContentBlock no-handle>
      <template slot="title">{{ $t('common.export') }}</template>
      <template slot="content">
        <div class="d-flex jcsb">
          <div class="half-size to-bottom pb-3">
            <UiToggle
              :label="$t('getadmin.partners.optionsDetails.exportBSCS')"
              :editable="true"
              :bold-label="isChanged(exportBSCS, 'exportComptaBSCSModeEnabled')"
              v-model="exportBSCS"
              small-label
            />
          </div>
          <div class="half-size to-bottom pb-3">
            <UiToggle
              :label="$t('getadmin.partners.optionsDetails.exportServices')"
              :editable="true"
              :bold-label="isChanged(flagServicesAudit, 'flagServicesAudit')"
              v-model="flagServicesAudit"
              small-label
            />
          </div>
        </div>
        <div class="d-flex jcsb">
          <div class="half-size">
            <div class="form-group">
              <label class="small-label pl-2" :class="{ bold: changeOnReportConsoValue }">{{
                $t('getadmin.partners.optionsDetails.dataReporting')
              }}</label>
              <Toggle
                block
                v-if="reportConsoValues"
                @update="reportConsoValue = $event.id"
                :values="reportConsoValues"
                class="pl-2"
              />
            </div>
          </div>
        </div>
      </template>
    </ContentBlock>

    <!-- COACH M2M BLOC -->
    <ContentBlock no-handle>
      <template slot="title">{{
        $t('getadmin.partners.optionsDetails.services.labels.COACH_M2M')
      }}</template>
      <div slot="content">
        <div>
          <div class="two-size to-bottom mb-4" v-if="partyType === 'CUSTOMER'">
            <UiToggle
              :label="$t('getadmin.partners.optionsDetails.services.labels.COACH_M2M')"
              :editable="true"
              :bold-label="isChanged(coachM2MEnabled, 'coachM2MAvailable')"
              v-model="coachM2MEnabled"
              small-label
            />
          </div>
        </div>
        <div class="d-flex two" v-if="coachM2MEnabled">
          <div class="two-size pb-3">
            <UiToggle
              :label="$t('getadmin.partners.optionsDetails.fleetPromotion')"
              :editable="true"
              :bold-label="isChanged(coachM2MFleetpromotion, 'coachM2MFleetpromotion')"
              v-model="coachM2MFleetpromotion"
              small-label
            />
          </div>
          <div class="two-size pb-3">
            <UiToggle
              label="Option 24h"
              :editable="true"
              :bold-label="isChanged(coachM2m24h, 'coachM2m24h')"
              v-model="coachM2m24h"
              small-label
            />
          </div>
        </div>
      </div>
    </ContentBlock>

    <!-- GEOLOC BLOC -->
    <ContentBlock no-handle>
      <template slot="title">GEOLOC</template>
      <div slot="content">
        <div class="d-flex two">
          <div class="two-size pr-4">
            <div class="form-group">
              <label class="small-label">{{
                $t('getadmin.partners.optionsDetails.actualView')
              }}</label>
              <UiInput v-model="geolocViewCounter" input-type="number" block disabled />
            </div>
          </div>
          <div class="two-size pr-4" v-if="partyType === 'CUSTOMER'">
            <div class="form-group">
              <label class="small-label">{{
                $t('getadmin.partners.optionsDetails.maxViews')
              }}</label>
              <UiInput v-model="geolocViewLimit" input-type="number" block />
            </div>
          </div>
        </div>
      </div>
    </ContentBlock>

    <!-- ALARM BLOC -->
    <ContentBlock no-handle>
      <template slot="title">{{ $t('common.alarms') }}</template>
      <template slot="content">
        <div class="two-size to-center pb-3">
          <UiToggle
            :label="$t('getadmin.partners.optionsDetails.atypicalAlarm')"
            :editable="true"
            :bold-label="isChanged(atypicalAlarm, 'atypicalAlarm')"
            v-model="atypicalAlarm"
            small-label
          />
        </div>

        <div class="separator"></div>

        <div class="d-flex">
          <div class="two-size">
            <div class="form-group">
              <label
                class="small-label"
                :class="{
                  bold: boldNotificationChoice,
                }"
              >
                {{ $t('getvsion.notify-ws') }}
              </label>
              <Toggle
                block
                @update="notificationChoice = $event.id"
                :values="notificationChoices"
              />
            </div>
          </div>
        </div>
        <div v-if="activatedNotificationOption">
          <div class="third-size pr-4">
            <div class="form-group">
              <UiToggle
                :label="$t('getadmin.partnerDetail.changePassword.title')"
                :editable="true"
                :bold-label="showPassword"
                v-model="showPassword"
                small-label
              />
            </div>
          </div>
        </div>
        <div class="d-flex" v-if="activatedNotificationOption">
          <div class="third-size pr-4">
            <div class="form-group">
              <label class="small-label">{{ $t('login') }}</label>
              <UiInput v-model="login" block />
              <small v-if="fieldErrors && errors.login" class="form-text error-text">{{
                $t('required')
              }}</small>
            </div>
          </div>
          <div class="third-size pr-4" v-if="showPassword">
            <div class="form-group">
              <label class="small-label">{{ $t('password') }}</label>
              <UiInput v-model="password" block />
              <small v-if="fieldErrors && errors.password" class="form-text error-text">{{
                $t('required')
              }}</small>
            </div>
          </div>
          <div class="third-size pr-4">
            <div class="form-group">
              <label class="small-label">{{
                $t('getadmin.partners.optionsDetails.ws-address')
              }}</label>
              <UiInput v-model="webserviceAdress" block />
              <small v-if="fieldErrors && errors.webserviceAdress" class="form-text error-text">{{
                $t('required')
              }}</small>
            </div>
          </div>
        </div>
      </template>
    </ContentBlock>

    <!-- OTHERS BLOC -->
    <ContentBlock no-handle>
      <template slot="title">{{ $t('common.others') }}</template>
      <template slot="content">
        <ToggleGroup :services="otherToggles" :size="2" />
        <div class="d-flex">
          <div class="third-size pr-4" v-if="partyType === 'MVNO'">
            <div class="form-group">
              <label class="small-label">{{
                $t('getadmin.partners.optionsDetails.paymentEmails')
              }}</label>
              <UiSelect
                class="report-field"
                v-model="portabilityAcquittalsEmails"
                :options="mailingLists"
                block
              />
            </div>
          </div>
          <div class="third-size pr-4" v-if="partyType === 'MVNO'">
            <div class="form-group">
              <label class="small-label">{{
                $t('getadmin.partners.optionsDetails.cdrEmails')
              }}</label>
              <UiSelect
                class="report-field"
                v-model="dailyCdrEmails"
                :options="mailingLists"
                block
              />
            </div>
          </div>
        </div>
        <div class="d-flex two">
          <div class="two-size" v-if="partyType === 'CUSTOMER'">
            <div class="form-group">
              <label
                class="small-label"
                :class="{ bold: preactivationFormat !== partnerOptions.msisdnFormatPreactivation }"
                >{{ $t('getadmin.partners.optionsDetails.preactivateFormat') }}</label
              >
              <Toggle
                block
                @update="preactivationFormat = $event.id"
                :values="preactivationFormats"
              />
            </div>
          </div>

          <!-- Dual Sim -->
          <div class="two-size" v-if="(userIsBO || userIsAdmin) && partyType === 'CUSTOMER'">
            <div class="form-group">
              <label
                class="small-label"
                :class="{ bold: dualSimChoice !== initialServices.dualSimCardPartyType }"
              >
                {{ $t('getparc.lineDetail.tab1.dualSim') }}
              </label>
              <Toggle block @update="dualSimChoice = $event.id" :values="dualSimChoices" />
            </div>
          </div>
        </div>
      </template>
    </ContentBlock>

    <div class="d-flex">
      <div class="save-block">
        <div v-if="exceptionError" class="text-info">
          <h6 class="text-danger">{{ $t('errors.all') }}</h6>
          <div class="text-danger">
            {{ exceptionError }}
          </div>
        </div>
        <UiButton
          v-if="havePermission('party', 'update_main_options') ||
            havePermission('party', 'update_secondary_options')
            "
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
import UiButton from '@/components/ui/Button';
import BillingAccountAutocomplete from '@/components/CustomComboxes/BillingAccountAutocomplete.vue';
import ToggleGroup from '@/components/ToggleGroup.vue';
import UiInput from '@/components/ui/UiInput';
import UiSelect from '@/components/ui/UiSelect';
import cloneDeep from 'lodash.clonedeep';

import { getPartyOptions, updatePartyOptions, fetchBroadcastLists } from '@/api/partners.js';
import { formatBackErrors } from '@/utils/errors';

import get from 'lodash.get';
import { mapGetters, mapMutations } from 'vuex';

export default {
  components: {
    ContentBlock,
    UiToggle,
    Toggle,
    ToggleGroup,
    UiInput,
    UiSelect,
    OfferCombo,
    UiButton,
    BillingAccountAutocomplete,
  },
  computed: {
    ...mapGetters(['havePermission']),
    ...mapGetters(['userIsBO', 'userIsAdmin']),
    mailingLists() {
      if (!this.partner) return [];
      if (this.diffusionListEmails) {
        return this.diffusionListEmails.map((m) => ({ label: m.name, value: m.id }));
      }
      return [];
    },

    boldNotificationChoice() {
      return this.activatedNotificationOption;
    },

    changeOnReportConsoValue() {
      return this.reportConsoValue !== (this.partnerOptions.consoReporting ? 'detailed' : 'simple');
    },

    canSave() {
      return false;
    },
    fieldErrors() {
      return this.haveFieldErrors();
    },
    orderPreactivation: {
      get() {
        return this.orderActivationEnabled || this.orderPreactivationEnabled;
      },
      set(newValue) {
        this.orderPreactivationEnabled = newValue;
      },
    },
    activatedNotificationOption() {
      return this.notificationChoice === 'UNIT' || this.notificationChoice === 'MASS'
        ? true
        : false;
    },
    partyType() {
      if (!this.partner) return [];
      return get(this.partner, 'partyType', []);
    },
  },
  props: {
    partner: Object,
  },

  async mounted() {
    this.diffusionListEmails = await fetchBroadcastLists(this.partner.id);
    this.orderToggles = [
      {
        code: 'REF_CLIENT',
        visible: true,
        checked: false,
        editable: true,
        optional: false,
        activationDate: null,
        labelService: this.$t('getadmin.partners.optionsDetails.services.labels.REF_CLIENT'),
      },
    ];

    this.billingToggles = [
      {
        code: 'SWITCH_RCARD',
        visible: true,
        checked: false,
        editable: true,
        optional: false,
        activationDate: null,
        labelService: this.$t('getadmin.partners.optionsDetails.services.labels.SWITCH_RCARD'),
      },
      {
        code: 'DISABLE_RCARD',
        visible: true,
        checked: false,
        editable: true,
        optional: false,
        activationDate: null,
        labelService: this.$t('getadmin.partners.optionsDetails.services.labels.DISABLE_RCARD'),
      },
      {
        code: 'CHANGE_OFFER',
        visible: true,
        checked: false,
        editable: true,
        optional: false,
        activationDate: null,
        labelService: this.$t('getadmin.partners.optionsDetails.services.labels.CHANGE_OFFER'),
      },
      {
        code: 'FACT_IMEI',
        visible: this.partyType === 'CUSTOMER' ? true : false,
        checked: false,
        editable: true,
        optional: false,
        activationDate: null,
        labelService: this.$t('getadmin.partners.optionsDetails.services.labels.FACT_IMEI'),
      },
      {
        code: 'FACT_DUAL_SIM',
        visible: true,
        checked: false,
        editable: true,
        optional: false,
        activationDate: null,
        labelService: this.$t('getadmin.partners.optionsDetails.services.labels.FACT_DUAL_SIM'),
      },
      {
        code: 'SUSPENSION_FREE',
        visible: true,
        checked: false,
        editable: true,
        optional: false,
        activationDate: null,
        labelService: this.$t('getadmin.partners.optionsDetails.services.labels.SUSPENSION_FREE'),
      },

      {
        code: 'OFFER_TARIFF_ENABLED',
        visible: true,
        checked: false,
        editable: true,
        optional: false,
        activationDate: null,
        labelService: this.$t(
          'getadmin.partners.optionsDetails.services.labels.OFFER_TARIFF_ENABLED'
        ),
      },

      {
        code: 'FLAG_BILLING_PDP',
        visible: true,
        checked: false,
        editable: true,
        optional: false,
        activationDate: null,
        labelService: this.$t('getadmin.partners.optionsDetails.flagBillingPDPCellHistory'),
      },
    ];

    this.otherToggles = [
      {
        code: 'CUSTOM_FIELD_IMPORT',
        visible: true,
        checked: false,
        editable: true,
        optional: false,
        activationDate: null,
        labelService: this.$t(
          'getadmin.partners.optionsDetails.services.labels.CUSTOM_FIELD_IMPORT'
        ),
      },
      {
        code: 'DASHBOARD_COUNTRY',
        visible: this.partyType === 'CUSTOMER' ? true : false,
        checked: false,
        editable: true,
        optional: false,
        activationDate: null,
        labelService: this.$t('getadmin.partners.optionsDetails.services.labels.DASHBOARD_COUNTRY'),
      },
      {
        code: 'AUTO_SUSPEND',
        visible: this.partyType === 'CUSTOMER' ? true : false,
        checked: false,
        editable: true,
        optional: false,
        activationDate: null,
        labelService: this.$t('getadmin.partners.optionsDetails.services.labels.AUTO_SUSPEND'),
      },
      {
        code: 'HIDE_ADRESS',
        visible: this.partyType === 'CUSTOMER' ? true : false,
        checked: false,
        editable: true,
        optional: false,
        activationDate: null,
        labelService: this.$t('getadmin.partners.optionsDetails.services.labels.HIDE_ADRESS'),
      },
    ];

    this.services = [
      {
        code: 'AMSISDN',
        visible: true,
        checked: false,
        editable: true,
        optional: false,
        activationDate: null,
        labelService: 'A-MSISDN',
      },
      {
        code: 'COMPAT_OTA',
        visible: true,
        checked: false,
        editable: true,
        optional: false,
        activationDate: null,
        labelService: this.$t('getadmin.partners.optionsDetails.services.labels.COMPAT_OTA'),
      },
      {
        code: 'IP_FIXE',
        visible: true,
        checked: false,
        editable: true,
        optional: false,
        activationDate: null,
        labelService: this.$t('getadmin.partners.optionsDetails.ipFixe'),
      },
      {
        code: 'FACT_REPORT_CONSO',
        visible: true,
        checked: false,
        editable: true,
        optional: false,
        activationDate: null,
        labelService: this.$t('getadmin.partners.optionsDetails.services.labels.FACT_REPORT_CONSO'),
      },
      {
        code: 'TERMINATION_DFE',
        visible: !!this.userIsBO,
        checked: false,
        editable: true,
        optional: false,
        activationDate: null,
        labelService: this.$t('getadmin.partners.optionsDetails.services.labels.TERMINATION_DFE'),
      },

      {
        code: 'ESIM_TERMINATION',
        visible: !!this.userIsBO,
        checked: false,
        editable: true,
        optional: false,
        activationDate: null,
        labelService: this.$t('getadmin.partners.optionsDetails.services.labels.ESIM_TERMINATION'),
      },

      {
        code: 'ESIM_ENABLE',
        visible: true,
        checked: false,
        editable: true,
        optional: false,
        activationDate: null,
        labelService: this.$t('getadmin.partners.optionsDetails.eSim'),
      },
      {
        code: 'NOTIF_EUICC',
        visible: true,
        checked: false,
        editable: true,
        optional: false,
        activationDate: null,
        labelService: this.$t('getadmin.partners.optionsDetails.services.labels.NOTIF_EUICC'),
      },
    ];

    await this.resetOptions();
  },

  methods: {
    ...mapMutations(['confirmAction']),
    isChanged(checked, serviceCode) {
      if (!this.initialServices) return false;
      return this.initialServices[serviceCode] !== checked;
    },
    async resetOptions() {
      this.canShowOptions = false;
      this.partnerOptions = await getPartyOptions(this.partner.id);
      this.initialServices = cloneDeep(this.partnerOptions);
      this.checkToggle(this.services, 'AMSISDN', this.partnerOptions.flagMsisdnA);
      this.checkToggle(this.services, 'IP_FIXE', this.partnerOptions.ipFixeEnable);

      this.checkToggle(
        this.services,
        'FACT_REPORT_CONSO',
        this.partnerOptions.flagStatisticsEnabled
      );

      this.checkToggle(this.services, 'TERMINATION_DFE', this.partnerOptions.terminationDfeEnabled);
      this.checkToggle(this.services, 'ESIM_ENABLE', this.partnerOptions.esimEnable);
      this.checkToggle(
        this.services,
        'ESIM_TERMINATION',
        this.partnerOptions.esimTerminationDeleteMandatory
      );
      this.diffusionListEnabled = this.partnerOptions.diffusionListEnabled;
      this.resilationSecurityNotificationMails = this.partnerOptions.resilationSecurityNotificationMails;
      this.atypicalAlarm = this.partnerOptions.atypicalAlarm;
      this.mailOrder = this.partnerOptions.mailOrder;
      this.crEmail = this.partnerOptions.crEmail;
      this.portabilityAcquittalsEmails = this.partnerOptions.portabilityAcquittalsEmails;

      this.checkToggle(this.services, 'COMPAT_OTA', this.partnerOptions.otaSensitive);
      this.smsAuthorizedEnabled = this.partnerOptions.smsAuthorized;
      this.shortCodes = this.partnerOptions.shortCodes;

      this.checkToggle(this.orderToggles, 'REF_CLIENT', this.partnerOptions.orderNumberRequired);
      this.orderPreactivationEnabled = this.partnerOptions.orderPreactivationMandatory;
      this.orderActivationEnabled = this.partnerOptions.orderActivationMandatory;
      this.resilationSecurityEnabled = this.partnerOptions.resilationSecurityEnabled;
      this.checkToggle(
        this.orderToggles,
        'MAD_FACT',
        this.partnerOptions.resilationSecurityEnabled
      );
      this.checkToggle(this.services, 'NOTIF_EUICC', this.partnerOptions.euiccEnabled);

      this.resilationSecurityDelay = this.partnerOptions.resilationSecurityDelay;

      this.checkToggle(this.orderToggles, 'REF_CLIENT', this.partnerOptions.orderNumberRequired);
      this.checkToggle(this.billingToggles, 'SWITCH_RCARD', this.partnerOptions.switchRcard);
      this.checkToggle(this.billingToggles, 'FACT_IMEI', this.partnerOptions.flagBillingIMEI);
      this.checkToggle(this.billingToggles, 'SUSPENSION_FREE', this.partnerOptions.suspensionFree);
      this.checkToggle(
        this.billingToggles,
        'OFFER_TARIFF_ENABLED',
        this.partnerOptions.offerTariffEnabled
      );
      this.checkToggle(
        this.billingToggles,
        'FLAG_BILLING_PDP',
        this.partnerOptions.flagBillingPDPCellHistory
      );
      this.billingDualSIM = this.partnerOptions.dualSimBilling;
      this.checkToggle(this.billingToggles, 'FACT_DUAL_SIM', this.partnerOptions.dualSimBilling);
      this.checkToggle(
        this.billingToggles,
        'DISABLE_RCARD',
        this.partnerOptions.controlDeactivateRCard
      );

      this.checkToggle(this.billingToggles, 'CHANGE_OFFER', this.partnerOptions.offerChangeEnabled);
      this.flagDefautWorkflowActicationEnabled = this.partnerOptions.flagDefautWorkflowActication;
      this.flagbillingNonActDelayEnabled = this.partnerOptions.flagbillingNonActDelay;

      this.autoActivationDelay = this.partnerOptions.DefautWorkflowActicationDelay;
      if (this.partnerOptions.defaultWorkflowForActivation) {
        this.selectedOffer = {
          id: this.partnerOptions.defaultWorkflowForActivation.code,
          label: this.partnerOptions.defaultWorkflowForActivation.workflowDescription,
          meta: this.partnerOptions.defaultWorkflowForActivation,
        };
      }

      const ba = get(this.partnerOptions, 'defaultCustomerForActivation');
      if (ba) {
        this.selectedBillingAccount = {
          id: ba.id,
          label: `${ba.code} - ${ba.name}`,
          data: ba,
          code: ba.code,
        };
      }

      this.resilationSecurityNotificationEnabled = this.partnerOptions.resilationSecurityNotificationEnabled;
      this.refUser = this.partnerOptions.userReferenceEnabled;
      this.billingDelay = this.partnerOptions.billingNonActDelay;
      this.exportBSCS = this.partnerOptions.exportComptaBSCSModeEnabled;
      this.consoReport = this.partnerOptions.flagStatisticsEnabled;
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

      this.preactivationFormats = this.preactivationFormats.map((f) => {
        if (f.id === this.preactivationFormat) {
          f.default = true;
        } else {
          f.default = false;
        }
        return f;
      });

      this.notificationChoice = this.$loGet(
        this.partnerOptions,
        'wsNotificationParam.notificationOption'
      );
      this.notificationChoices = this.notificationChoices.map((f) => {
        if (f.id === this.notificationChoice) {
          f.default = true;
        } else {
          f.default = false;
        }
        return f;
      });

      this.dualSimChoice = this.$loGet(this.partnerOptions, 'dualSimCardPartyType', null);
      this.dualSimChoices = this.dualSimChoices.map((f) => {
        if (f.id === this.dualSimChoice) {
          f.default = true;
        } else if (this.dualSimChoice === null && f.id === 'ROAMING') {
          f.default = true;
        } else {
          f.default = false;
        }
        return f;
      });

      this.checkToggle(this.otherToggles, 'AUTO_SUSPEND', this.partnerOptions.suspensionAuto);
      this.checkToggle(this.otherToggles, 'HIDE_ADRESS', this.partnerOptions.optionViewCellId);
      this.coachM2MEnabled = this.partnerOptions.coachM2MAvailable;
      this.coachM2MFleetpromotion = this.partnerOptions.coachM2MFleetpromotion;
      this.coachM2m24h = this.partnerOptions.coachM2m24h;

      this.login = get(this.partnerOptions, 'wsNotificationParam.login');
      if (this.showPassword) {
        this.password = get(this.partnerOptions, 'wsNotificationParam.password');
      }
      this.webserviceAdress = get(this.partnerOptions, 'wsNotificationParam.url');

      this.canShowOptions = true;

      let reportConsoValue = 'no';
      if (this.partnerOptions.dailyOutstandingReporting) {
        reportConsoValue = this.partnerOptions.consoReporting ? 'detailed' : 'simple';
      }
      this.reportConsoValue = reportConsoValue;
      this.reportConsoValues = this.reportConsoValues.map((r) => {
        if (r.id === reportConsoValue) {
          r.default = true;
        } else {
          r.default = false;
        }
        return r;
      });
    },
    async saveOptions() {
      const esimEnable =
        this.partyType === 'CUSTOMER' ? this.getToggle(this.services, 'ESIM_ENABLE') : null;
      const resilationSecurityDelay = this.resilationSecurityEnabled
        ? parseInt(this.resilationSecurityDelay)
        : null;
      const resilationSecurityNotificationMails = this.resilationSecurityNotificationEnabled
        ? parseInt(this.resilationSecurityNotificationMails)
        : null;
      const crEmail = parseInt(this.crEmail);
      const diffusionList = this.diffusionListEnabled ? parseInt(this.diffusionList) : null;
      const coachM2MFleetpromotion = this.coachM2MEnabled ? this.coachM2MFleetpromotion : null;
      const coachM2m24h = this.coachM2MEnabled ? this.coachM2m24h : null;
      const dualSimCardPartyType = this.partyType !== 'MVNO' ? this.dualSimChoice : null;

      const response = await updatePartyOptions({
        partyOptions: {
          partyId: this.partner.id,
          flagMsisdnA: this.getToggle(this.services, 'AMSISDN'),
          euiccEnabled: this.getToggle(this.services, 'NOTIF_EUICC'),
          resilationSecurityEnabled: this.resilationSecurityEnabled,
          resilationSecurityDelay,
          esimEnable,
          atypicalAlarm: this.atypicalAlarm,
          ipFixeEnable: this.getToggle(this.services, 'IP_FIXE'),
          dailyOutstandingReporting: this.reportConsoValue === 'no' ? false : true,
          consoReporting:
            this.reportConsoValue === 'simple' || this.reportConsoValue === 'no' ? false : true,
          resilationSecurityNotificationEnabled: this.resilationSecurityNotificationEnabled,
          resilationSecurityNotificationMails,
          terminationDfeEnabled: this.getToggle(this.services, 'TERMINATION_DFE'),
          esimTerminationDeleteMandatory: this.getToggle(this.services, 'ESIM_TERMINATION'),
          otaSensitive: this.getToggle(this.services, 'COMPAT_OTA'),

          flagStatisticsEnabled: this.getToggle(this.services, 'FACT_REPORT_CONSO'),

          smsAuthorized: this.smsAuthorizedEnabled,
          shortCodes: this.shortCodes,
          mailOrder: parseInt(this.mailOrder),
          orderNumberRequired: this.getToggle(this.orderToggles, 'REF_CLIENT'),
          orderPreactivationMandatory: this.orderPreactivationEnabled,
          orderActivationMandatory: this.orderActivationEnabled,
          userReferenceEnabled: this.refUser,
          crEmail,
          diffusionListEnabled: this.diffusionListEnabled,
          diffusionList,

          flagBillingIMEI: this.getToggle(this.billingToggles, 'FACT_IMEI'),
          suspensionFree: this.getToggle(this.billingToggles, 'SUSPENSION_FREE'),
          flagBillingPDPCellHistory: this.getToggle(this.billingToggles, 'FLAG_BILLING_PDP'),
          offerTariffEnabled: this.getToggle(this.billingToggles, 'OFFER_TARIFF_ENABLED'),
          switchRcard: this.getToggle(this.billingToggles, 'SWITCH_RCARD'),
          controlDeactivateRCard: this.getToggle(this.billingToggles, 'DISABLE_RCARD'),
          dualSimBilling: this.getToggle(this.billingToggles, 'FACT_DUAL_SIM'),
          offerChangeEnabled: this.getToggle(this.billingToggles, 'CHANGE_OFFER'),
          flagDefautWorkflowActication: this.flagDefautWorkflowActicationEnabled,
          defautWorkflowActication: parseInt(this.autoActivationDelay),
          defaultWorkflowForActivationId: parseInt(get(this.selectedOffer, 'meta.id')),
          defaultCustomerForActivationId: parseInt(get(this.selectedBillingAccount, 'id')),
          flagbillingNonActDelay: this.flagbillingNonActDelayEnabled,
          billingNonActDelay: parseInt(this.billingDelay),
          exportComptaBSCSModeEnabled: this.exportBSCS,

          flagServicesAudit: this.flagServicesAudit,
          portabilityAcquittalsEmails: parseInt(this.portabilityAcquittalsEmails),
          importCustomFieldsEnabled: this.getToggle(this.otherToggles, 'CUSTOM_FIELD_IMPORT'),
          dashBoarDetailsPerCountry: this.getToggle(this.otherToggles, 'DASHBOARD_COUNTRY'),
          dailyCdrEmails: parseInt(this.dailyCdrEmails),
          msisdnFormatPreactivation: this.preactivationFormat,
          suspensionAuto: this.getToggle(this.otherToggles, 'AUTO_SUSPEND'),
          optionViewCellId: this.getToggle(this.otherToggles, 'HIDE_ADRESS'),
          dualSimCardPartyType,
          wsNotificationOption: this.notificationChoice,
          wsLogin: this.login,
          wsPassword: this.password,
          showPassword: this.showPassword,
          wsUrl: this.webserviceAdress,
          coachM2MAvailable: this.coachM2MEnabled,
          coachM2MFleetpromotion,
          coachM2m24h,
          geolocViewLimit: this.geolocViewLimit,
          geolocViewCounter: this.geolocViewCounter,
        },
      });

      if (!response) return;

      if (response.errors && response.errors.length) {
        let errorMessage = '';
        const formatted = formatBackErrors(response.errors)
          .map((e) => e.errors)
          .flat();
        formatted.forEach((e) => {
          errorMessage = `${e.key}: ${e.value}`;
        });
        this.exceptionError = errorMessage;
        return {
          errors: response.errors,
        };
      } else {
        await this.resetOptions();
        this.exceptionError = undefined;
        this.onClose();
      }
    },
    onClose() {
      setTimeout(() => {
        this.confirmAction({
          message: 'madeModification',
          noOkButton: true,
          isWarning: true,
          customCloseLabel: 'close',
        });
      }, 200);
    },
    getToggle(toggles, code) {
      const toggle = toggles.find((t) => t.code === code);
      if (!toggle) return false;

      return toggle.checked;
    },
    checkToggle(toggles, code, value) {
      toggles.map((t) => {
        if (t.code === code) {
          t.checked = value;
        }
        return t;
      });
    },
    haveFieldErrors() {
      const fieldErrors = {};
      let haveError = false;
      if (this.flagDefautWorkflowActicationEnabled) {
        if (!this.autoActivationDelay) {
          fieldErrors.autoActivationDelay = true;
          haveError = true;
        }
      }

      if (this.flagbillingNonActDelayEnabled) {
        if (!this.billingDelay) {
          fieldErrors.billingDelay = true;
          haveError = true;
        }
      }

      if (this.resilationSecurityEnabled) {
        if (!this.resilationSecurityDelay) {
          fieldErrors.resilationSecurityDelay = true;
          haveError = true;
        }
      }

      if (this.resilationSecurityNotificationEnabled) {
        if (!this.resilationSecurityNotificationMails) {
          fieldErrors.resilationSecurityNotificationMails = true;
          haveError = true;
        }
      }

      if (this.activatedNotificationOption) {
        if (!this.login) {
          fieldErrors.login = true;
          haveError = true;
        }

        if (!this.password && this.showPassword) {
          fieldErrors.password = true;
          haveError = true;
        }

        if (!this.webserviceAdress) {
          fieldErrors.webserviceAdress = true;
          haveError = true;
        }
      }

      if (this.diffusionListEnabled) {
        if (!this.diffusionList) {
          fieldErrors.diffusionList = true;
          haveError = true;
        }
      }

      this.errors = fieldErrors;
      return haveError;
    },
  },
  data() {
    return {
      diffusionListEmails: [],
      canShowOptions: false,
      showPassword: false,
      initialServices: undefined,
      partnerOptions: undefined,
      notifList: undefined,
      refUser: undefined,
      crEmail: undefined,
      resilationSecurityDelay: undefined,
      flagBillingPDPCellHistory: undefined,
      diffusionListEnabled: undefined,
      smsAuthorizedEnabled: undefined,
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
      esimEnable: undefined,
      atypicalAlarm: undefined,
      resilationSecurityNotificationEnabled: undefined,
      resilationSecurityEnabled: undefined,
      coachM2MEnabled: undefined,
      euiccEnabled: undefined,
      flagDefautWorkflowActicationEnabled: undefined,
      flagbillingNonActDelayEnabled: undefined,
      orderPreactivationEnabled: undefined,
      orderActivationEnabled: undefined,
      coachM2MFleetpromotion: undefined,
      coachM2m24h: undefined,
      exceptionError: undefined,
      consoReport: false,
      exportBSCS: false,
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
      dualSimChoice: undefined,
      dualSimChoices: [
        {
          id: 'FACTORY',
          label: 'Usine',
        },
        {
          id: 'FRANCE',
          label: 'France',
        },
        {
          id: 'ROAMING',
          label: 'Roaming',
        },
      ],
      services: [],
      orderToggles: [],
      otherToggles: [],
      billingToggles: [],

      disabled: true,
    };
  },
};
</script>

<style lang="scss" scoped>
.separator {
  height: 1px;
  width: 100%;
  background-color: #e1e1e1;
  margin: 20px;
}

.third-size {
  width: 33%;
}

.two {
  justify-content: space-between;

  &-size {
    width: 40%;
  }
}

.half-size {
  width: 45%;
}

.jcsb {
  justify-content: space-between;
}

.to-bottom {
  align-self: flex-end;
}

.to-center {
  align-self: center;
}

.two-thirds {
  width: 67% !important;
}

.save-block {
  width: 40%;
  margin-left: auto;
}

.bold {
  font-weight: bold;
}

.small-label {
  font-size: 0.9rem !important;
}
</style>
