<template>
  <div class="creationContainer">
    <div class="panelContent">
      <div class="checkBoxesContainer">
        <template v-if="!userIsPartner">
          <SectionTitle :num="1">{{ $t('getparc.history.col.partyId') }}</SectionTitle>

          <PartnerCombo
            :value.sync="selectedPartner"
            :options="partnerChoices"
            include-mailing-lists
            offline
          />
        </template>

        <SectionTitle :num="baseNumber + 1">{{
          $t('getreport.creation.chooseInfos')
        }}</SectionTitle>
        <p>{{ $t('getreport.creation.chooseInfosDescription') }}</p>

        <div v-if="reportModels" class="mt-4 mb-2">
          <h6>{{ $t('getreport.creation.fromReport') }}</h6>
          <UiSelect class="report-field" v-model="reportModel" :options="reportModels" block />
        </div>
        <div class="checkbox-groups" v-if="groups">
          <template v-for="group in groups">
            <FoldableBlock
              v-if="!group.canShow || group.canShow()"
              :title="group.title"
              :key="group.title"
              :disabled="group.isDisabled && group.isDisabled()"
            >
              <div class="bg-white p-3 bordered checkboxes-container">
                <div
                  :key="checkbox.label"
                  v-for="checkbox in filterVisible(group.checkboxes)"
                  class="d-flex pt-3 item"
                >
                  <UiCheckbox
                    v-model="checkbox.checked"
                    @change="() => selectOrRemove(checkbox)"
                    :disabled="checkbox.isDisabled && checkbox.isDisabled()"
                  />
                  <span>{{ checkbox.label }}</span>
                </div>
              </div>
            </FoldableBlock>
          </template>
        </div>

        <SectionTitle :num="baseNumber + 2">{{
          $t('getreport.creation.generateReport')
        }}</SectionTitle>
        <div class="mb-2">
          <h6>{{ $t('getreport.creation.dateAndRecursion') }}</h6>
          <Toggle
            v-if="reportFrequency"
            @update="reportFrequency = $event.id"
            :values="reportFrequencyChoices"
            light-theme
            class="pl-2"
          />
        </div>
        <div class="mt-4 mb-2">
          <h6>{{ $t(dateLabel) }}</h6>
          <UiDate
            time-picker
            @change="newVal => (generationDate = newVal)"
            :value="generationDate"
            :start-date="generationDate"
            :error="dateError ? 'errors.mandatory' : undefined"
            class="d-block report-field"
          >
            <i slot="icon" class="select-icon ic-Flag-Icon" />
          </UiDate>
        </div>

        <SectionTitle :num="baseNumber + 3">{{ $t('getvsion.notifications') }}</SectionTitle>

        <div class="row">
          <div class="col">
            <div class="d-flex pt-3">
              <UiCheckbox v-model="shouldNotify" />
              <span>{{ $t('mailNotification') }}</span>
            </div>
          </div>
          <div v-if="!content && shouldNotify" class="col">
            <div class="d-flex mailing-list">
              <span class="pt-3">{{ $t('getreport.creation.list') }}</span>
              <UiSelect
                class="report-field"
                v-model="notifList"
                :disabled="!!content"
                :options="mailingLists"
                block
              />
            </div>
          </div>
        </div>

        <div class="row">
          <div class="col">
            <div class="d-flex pt-3">
              <UiCheckbox v-model="isActive" />
              <span>{{ $t('filters.active') }}</span>
            </div>
          </div>
        </div>
      </div>
      <div class="fieldsRecap">
        <h5>{{ $t('getreport.creation.dataReport') }}</h5>
        <ul class="list-unstyled">
          <li v-for="i in selectedItems" :key="'remove_' + i.label">
            <button class="btn btn-link p-1" @click.stop="() => removeItem(i)">
              <i class="ic-Cross-Icon"></i>
            </button>
            {{ i.label }}
          </li>
        </ul>
      </div>
    </div>
    <div class="fileInfo">
      <div class="fileInfoContainer">
        <div>
          <h6>{{ $t('getreport.creation.nameReport') }}</h6>
          <UiInput v-model="name" :disabled="!!content" class="d-block" />
        </div>
        <div>
          <h6>{{ $t('getreport.creation.fileFormat') }}</h6>
          <UiSelect class="report-field" v-model="fileFormat" :options="fileFormats" block />
        </div>
        <div>
          <UiButton variant="primary" class="p-3" block @click="onSaveReport" :disabled="!canSave">
            <span class="btn-label">{{ $t('save') }}</span>
          </UiButton>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import SectionTitle from '@/components/SectionTitle';
import Toggle from '@/components/ui/UiToggle2';
import UiDate from '@/components/ui/UiDate';
import UiCheckbox from '@/components/ui/Checkbox';
import UiSelect from '@/components/ui/UiSelect';
import FoldableBlock from '@/components/FoldableBlock';
import UiInput from '@/components/ui/UiInput';
import UiButton from '@/components/ui/Button';

import get from 'lodash.get';

import { createReport, updateReport, reportModels } from '@/api/reportCreation.js';
import { mapMutations, mapGetters } from 'vuex';

import { fetchpartnerById } from '@/api/partners.js';

import PartnerCombo from '@/components/CustomComboxes/PartnerCombo.vue';
import { currentDateTimeWithAdd } from '@/utils/date';

function checkIfOneIsPresent(fieldsToCheck, modelFields) {
  for (let i = 0; i < fieldsToCheck.length; i++) {
    if (modelFields.find(m => m === fieldsToCheck[i])) {
      return true;
    }
  }
  return false;
}

export default {
  components: {
    SectionTitle,
    Toggle,
    UiDate,
    UiCheckbox,
    UiSelect,
    FoldableBlock,
    UiInput,
    PartnerCombo,
    UiButton,
  },

  props: {
    content: Object,
  },

  data() {
    return {
      endDateOf: {
        code: '',
        name: '',
      },
      canShowForm: false,
      selectedItems: [],
      generationDate: undefined,
      dateError: false,
      shouldNotify: false,
      reportFrequency: 'ONCE',
      name: undefined,
      selectedPartner: undefined,
      fileFormat: undefined,
      isActive: true,
      disabled: true,
      partnerChoices: undefined,
      fileFormats: [
        {
          value: 'CSV',
          label: 'CSV',
        },
        {
          value: 'EXCEL',
          label: 'Excel',
        },
      ],
      reportFrequencyChoices: [
        {
          id: 'ONCE',
          label: 'frequencies.ONCE',
        },
        {
          id: 'DAILY',
          label: 'frequencies.DAILY',
        },
        {
          id: 'WEEKLY',
          label: 'frequencies.WEEKLY',
        },
        {
          id: 'MONTHLY',
          label: 'frequencies.MONTHLY',
        },
      ],

      reportModel: 'NONE',
      reportModels: undefined,

      notifList: undefined,

      groups: undefined,
    };
  },

  async mounted() {
    this.resetCheckboxes();

    let partnerID, partnerData;

    if (this.userIsMVNO) {
      this.endDateOf = {
        code: 'FLAT_END_DATE',
        name: 'Date de fin de forfait',
      };
    } else {
      this.endDateOf = {
        code: 'COMMITMENT_END_DATE',
        name: "Date de fin d'engagement",
      };
    }
    const preselectPartner = async () => {
      if (this.content) {
        partnerID = this.content.party.id;
      } else if (this.userIsPartner) {
        partnerID = this.userInfos.partners[0].id;
      } else if (this.userIsMultiPartner) {
        this.partnerChoices = this.userInfos.partners;
      }
      if (partnerID) {
        partnerData = await fetchpartnerById(partnerID, {
          includeMailingLists: true,
        });

        if (partnerData) {
          this.selectedPartner = {
            id: partnerData.id,
            label: partnerData.name,
            data: partnerData,
          };
        }
      }
    };

    const prefillForm = async () => {
      if (this.content) {
        this.reportFrequency = this.content.frequency;
        this.name = this.content.name;
        this.reportFrequencyChoices = this.reportFrequencyChoices.map(t => {
          if (t.id === this.content.frequency) {
            t.default = true;
          }
          return t;
        });
        this.generationDate = this.content.generationDate + ' 00:00:00';
        this.shouldNotify = this.content.notification;
        this.isActive = !this.content.disabled;
        this.notifList = this.content.mailingList ? this.content.mailingList.id : undefined;

        this.fileFormat = this.content.exportFormat;
        this.preloadCheckBoxes(this.content.fields.split(','));
      } else if (this.userIsPartner) {
        this.generationDate = currentDateTimeWithAdd(10, 'minutes');
      } else {
        this.generationDate = currentDateTimeWithAdd(10, 'minutes');
      }
    };

    await preselectPartner();
    this.resetCheckboxes();
    await this.loadModels();
    await prefillForm();
    this.canShowForm = true;
  },

  watch: {
    reportModel(newValue) {
      const report = this.reportModels.find(r => r.value === newValue);
      if (newValue !== 'NONE') {
        this.selectedItems.forEach(checkbox => {
          checkbox.checked = false;
        });
        this.selectedItems = [];
      }
      this.preloadCheckBoxes(report.data.fields);
    },
    async selectedPartner(value, previous) {
      if (value && value.id) {
        if (!previous || (previous && previous.id && previous.id !== value.id)) {
          if (this.canShowForm) {
            await this.loadModels();
          }
        }
      }
    },
  },

  methods: {
    ...mapMutations(['flashMessage', 'closePanel']),

    filterVisible(checkboxes) {
      return checkboxes.filter(checkbox => !checkbox.canShow || checkbox.canShow());
    },

    preloadCheckBoxes(fields) {
      this.groups
        .map(g => g.checkboxes)
        .flat()
        .forEach(c => {
          let shouldCheck = !!fields.find(f => f === c.code);

          // pour cocher les cases représentant un groupe de colonnes
          if (!shouldCheck) {
            if (c.code === 'GRP_DEVICE_INFO') {
              if (checkIfOneIsPresent(['DEVICE_REFERENCE', 'MANUFACTURER'], fields)) {
                shouldCheck = true;
              }
            } else if (c.code === 'GRP_CUSTOM_FIELDS') {
              if (
                checkIfOneIsPresent(
                  ['CUSTOM1', 'CUSTOM2', 'CUSTOM3', 'CUSTOM4', 'CUSTOM5', 'CUSTOM6'],
                  fields
                )
              ) {
                shouldCheck = true;
              }
            } else if (c.code === 'GRP_SPECIFIC_FIELDS') {
              if (checkIfOneIsPresent(['SPECIFIC_FIELD1', 'SPECIFIC_FIELD2'], fields)) {
                shouldCheck = true;
              }
            } else if (c.code === 'GRP_SERVICES_APN') {
              if (
                checkIfOneIsPresent(
                  [
                    'OFFER_ROAMING',
                    'OFFER_SMS_IN',
                    'OFFER_SMS_OUT',
                    'OFFER_VOICE_IN',
                    'OFFER_VOICE_OUT',
                    'OFFER_CSD_DATA_IN',
                    'OFFER_CSD_DATA_OUT',
                    'OFFER_DATA_4G',
                    'OFFER_DATA_2G_3G',
                    'OFFER_APN',
                  ],
                  fields
                )
              ) {
                shouldCheck = true;
              }
            } else if (c.code === 'GRP_PREACTIVATE_ACTIVATE') {
              if (checkIfOneIsPresent(['PREACTIVATION', 'ACTIVATION'], fields)) {
                shouldCheck = true;
              }
            } else if (c.code === 'GRP_DELIVERY_CONTACT') {
              if (
                checkIfOneIsPresent(
                  [
                    'FIRSTNAME_DELIVERY',
                    'LASTNAME_DELIVERY',
                    'EMAIL_DELIVERY',
                    'PHONE_DELIVERY',
                    'MOBILE_DELIVERY',
                    'FAX_DELIVERY',
                  ],
                  fields
                )
              ) {
                shouldCheck = true;
              }
            } else if (c.code === 'GRP_DELIVERY_ADRESS') {
              if (
                checkIfOneIsPresent(
                  [
                    'ADDRESS1_DELIVERY',
                    'ADDRESS2_DELIVERY',
                    'ADDRESS3_DELIVERY',
                    'ZIPCODE_DELIVERY',
                    'CITY_DELIVERY',
                    'COUNTRY_DELIVERY',
                    'STATE_DELIVERY',
                  ],
                  fields
                )
              ) {
                shouldCheck = true;
              }
            } else if (c.code === 'GRP_BILLING_ADRESS') {
              if (
                checkIfOneIsPresent(
                  [
                    'ADDRESS1_BILL',
                    'ADDRESS2_BILL',
                    'ADDRESS3_BILL',
                    'ZIP_CODE_BILL',
                    'CITY_BILL',
                    'COUNTRY_BILL',
                    'STATE_BILL',
                  ],
                  fields
                )
              ) {
                shouldCheck = true;
              }
            }
          }

          if (shouldCheck) {
            c.checked = true;
            this.toggleCheckbox(c);
          }
        });
    },

    async loadModels() {
      if (this.selectedPartner && this.selectedPartner.id) {
        if (this.canShowForm) {
          this.resetCheckboxes();
        }

        const models = await reportModels(this.selectedPartner.id);

        this.reportModels = [
          { label: 'Customisé', value: 'NONE', data: { fields: [] } },
          ...models.map(m => ({ label: m.modelType, value: m.modelType, data: m })),
        ];
        this.reportModel = 'NONE';
      }
    },

    removeItem(checkbox) {
      checkbox.checked = false;
      this.selectedItems = this.selectedItems.filter(i => i.label !== checkbox.label);
      this.reportModel = 'NONE';
    },
    toggleCheckbox(checkbox) {
      if (checkbox.checked) {
        this.selectedItems.push(checkbox);
      } else {
        this.selectedItems = this.selectedItems.filter(i => i.label !== checkbox.label);
      }
    },
    selectOrRemove(checkbox) {
      this.reportModel = 'NONE';
      this.toggleCheckbox(checkbox);
    },
    async onSaveReport() {
      const params = {
        columns: this.selectedItems,
        notification: this.shouldNotify,
        mailingListId: this.notifList,
        frequency: this.reportFrequency,
        exportFormat: this.fileFormat,
        generationDate: this.generationDate,
        name: this.name,
        isDisabled: !this.isActive,
      };

      if (this.selectedPartner) {
        params.partyId = this.selectedPartner.id;
      }

      let response;

      if (this.content) {
        response = await updateReport({
          id: this.content.id,
          ...params,
        });
      } else {
        response = await createReport(params);
      }

      if (response.errors && response.errors.length) {
        let errorMessage =
          response.errors[0].extensions.name === 'AlreadyExists'
            ? this.$t('getreport.errors.AlreadyExists')
            : this.$t('genericErrorMessage');
        this.flashMessage({ level: 'danger', message: errorMessage });
      } else {
        this.flashMessage({ level: 'success', message: this.$t('genericSuccessMessage') });
        this.closePanel({ resetSearch: true });
      }
    },

    resetCheckboxes() {
      this.selectedItems = [];
      this.groups = [
        {
          title: this.$t('getreport.creation.groups.technicalInfos'),
          checkboxes: [
            { code: 'ICCID', label: 'ICCID', checked: false },
            { code: 'IMSI', label: 'IMSI', checked: false },
            {
              code: 'MSISDN',
              label: 'MSISDN',
              checked: false,
            },
            {
              code: 'AMSISDN',
              label: 'A-MSISDN',
              checked: false,
              canShow: () => {
                if (this.userIsOperator) return true;
                return !!get(this.partnerForOptionCheck, 'data.flagMsisdnA');
              },
            },
            { code: 'IMEI', label: 'IMEI', checked: false },
            {
              code: 'GRP_DEVICE_INFO',
              label: this.$t('getreport.creation.groups.checkboxes.deviceInfo'),
              checked: false,
              canShow: () => {
                if (this.userIsOperator) return true;
                return get(this.partnerForOptionCheck, 'data.partyType') === 'CUSTOMER';
              },
            },
            {
              code: 'SIMCARD_TYPE',
              label: this.$t('getadmin.users.filters.typeSIMCard'),
              checked: false,
            },
            { code: 'GRP_CUSTOM_FIELDS', label: this.$t('common.customFields'), checked: false },
            {
              code: 'GRP_SPECIFIC_FIELDS',
              label: this.$t('getadmin.customize.specificFields'),
              checked: false,
            },
            {
              code: 'LINE_STATUS',
              label: this.$t('getparc.lineDetail.lineStatus'),
              checked: false,
            },
            {
              code: 'NETWORK_STATUS',
              label: this.$t('filters.lines.networkStatus'),
              checked: false,
            },
            {
              code: 'PIN2',
              label: this.$t('getreport.creation.groups.checkboxes.pin2'),
              checked: false,
            },
            {
              code: 'PUK1',
              label: this.$t('getreport.creation.groups.checkboxes.puk'),
              checked: false,
            },
            {
              code: 'AP_ID',
              label: this.$t('getreport.creation.groups.checkboxes.accessPointId'),
              checked: false,
            },
            {
              code: 'ELECTRIC_PROFILE',
              label: this.$t('getreport.creation.groups.checkboxes.electricProfile'),
              checked: false,
            },
            {
              code: 'GRAPHIC_PROFILE',
              label: this.$t('getreport.creation.groups.checkboxes.graphicProfile'),
              checked: false,
            },
            {
              code: 'HARDWARE_TYPE',
              label: this.$t('getreport.creation.groups.checkboxes.hardwareType'),
              checked: false,
              canShow: () => {
                if (this.userIsOperator) return true;
                return get(this.partnerForOptionCheck, 'data.partyType') === 'MVNO';
              },
            },
            {
              code: 'MODULE_NUMBER',
              label: this.$t('getreport.creation.groups.checkboxes.MODULE_NUMBER'),
              checked: false,
            },
            {
              code: 'PREACTIVATION_DATE',
              label: this.$t('getreport.creation.groups.checkboxes.PREACTIVATION_DATE'),
              checked: false,
            },
            {
              code: 'ACTIVATION_DATE',
              label: this.$t('getreport.creation.groups.checkboxes.ACTIVATION_DATE'),
              checked: false,
            },
            {
              code: 'LAST_CHANGE_STATUS_DATE',
              label: this.$t('getreport.creation.groups.checkboxes.LAST_CHANGE_STATUS_DATE'),
              checked: false,
            },
            {
              code: 'FIXED_IP_ADDRESSES',
              label: this.$t('getreport.creation.groups.checkboxes.LAST_CHANGE_STATUS_DATE'),
              checked: false,
              canShow: () => {
                if (this.userIsMVNO) return false;
                if (this.userIsOperator) return true;
                return get(this.partnerForOptionCheck, 'data.partyType') === 'CUSTOMER';
              },
            },
            {
              code: 'FLAT_END_DATE',
              label: this.$t('getreport.creation.groups.checkboxes.FLAT_END_DATE'),
              checked: false,
              canShow: () => {
                if (this.userIsOperator) return true;
                return get(this.partnerForOptionCheck, 'data.partyType') === 'MVNO';
              },
            },
          ],
        },
        {
          title: this.$t('getreport.creation.groups.dualSimInfos'),

          canShow: () => {
            return this.havePermission('getParc', 'manage_dual');
          },
          isDisabled: () => this.noPartnerSelected,

          checkboxes: [
            { code: 'DUAL_ICCID', label: 'Dual ICCID', checked: false },
            { code: 'DUAL_MSISDN', label: 'Dual MSISDN', checked: false },
            { code: 'DUAL_IMSI', label: 'Dual IMSI', checked: false },
          ],
        },

        {
          title: this.$t('getreport.creation.groups.commercialInfos'),

          checkboxes: [
            {
              code: 'OFFER_NAME',
              label: this.$t('getreport.creation.groups.checkboxes.OFFER_NAME'),
              checked: false,
            },
            {
              code: 'GRP_SERVICES_APN',
              label: this.$t('getreport.creation.groups.checkboxes.GRP_SERVICES_APN'),
              checked: false,
              isDisabled: () => this.noPartnerSelected,
            },
            {
              code: 'CUSTOMER_ACCOUNT_NAME',
              label: this.$t('getreport.creation.groups.checkboxes.CUSTOMER_ACCOUNT_NAME'),
              checked: false,
            },
            {
              code: 'CUSTOMER_ACCOUNT_CODE',
              label: 'Code du compte de facturation',
              checked: false,
            },
            {
              code: 'PARTNER_NAME',
              label: this.$t('getreport.creation.groups.checkboxes.PARTNER_NAME'),
              checked: false,
            },
            {
              code: 'PARTNER_CODE',
              label: this.$t('getreport.creation.groups.checkboxes.PARTNER_CODE'),
              checked: false,
            },
            { code: this.endDateOf.code, label: this.endDateOf.name, checked: false },
            {
              code: 'COMMERCIAL_STATUS',
              label: this.$t('filters.lines.commercialStatus'),
              checked: false,
            },
            {
              code: 'BILLING_STATUS',
              label: this.$t('filters.lines.billingStatus'),
              checked: false,
            },
          ],
        },

        {
          title: this.$t('getreport.creation.groups.orderInfos'),

          checkboxes: [
            { code: 'ORDER_ID', label: this.$t('filters.idOrder'), checked: false },
            {
              code: 'ORDER_PARTNER_NAME',
              label: this.$t('getreport.creation.groups.checkboxes.ORDER_PARTNER_NAME'),
              checked: false,
            },
            {
              code: 'ORDER_PARTNER_CODE',
              label: this.$t('getreport.creation.groups.checkboxes.ORDER_PARTNER_CODE'),
              checked: false,
            },
            {
              code: 'CLIENT_REFERENCE',
              label: this.$t('orders.detail.referenceClient'),
              checked: false,
            },
            {
              code: 'GRP_PREACTIVATE_ACTIVATE',
              label: this.$t('getreport.creation.groups.checkboxes.GRP_PREACTIVATE_ACTIVATE'),
              checked: false,
            },
            {
              code: 'ORDER_OFFER',
              label: this.$t('getreport.creation.groups.checkboxes.ORDER_OFFER'),
              checked: false,
            },
            { code: 'ORDER_DATE', label: this.$t('filters.orderDate'), checked: false },
            {
              code: 'ORDER_USER_NAME',
              label: this.$t('getreport.creation.groups.checkboxes.ORDER_USER_NAME'),

              checked: false,
            },
            { code: 'ORDER_STATUS', label: this.$t('filters.orderStatus'), checked: false },
            {
              code: 'ORDER_STATUS_DATE',
              label: this.$t('getreport.creation.groups.checkboxes.ORDER_STATUS_DATE'),

              checked: false,
            },
            {
              code: 'GRP_DELIVERY_CONTACT',
              label: this.$t('getreport.creation.groups.checkboxes.GRP_DELIVERY_CONTACT'),
              checked: false,
            },
            { code: 'ORDER_COMPANY', label: this.$t('col.company'), checked: false },
            {
              code: 'GRP_DELIVERY_ADRESS',
              label: this.$t('orders.new.deliveryStep.form.deliveryAddress'),
              checked: false,
            },
            {
              code: 'GRP_BILLING_ADRESS',
              label: this.$t('getreport.creation.groups.checkboxes.GRP_BILLING_ADRESS'),
              checked: false,
            },
            {
              code: 'CONTRACT_REFERENCE',
              label: this.$t('getreport.creation.groups.checkboxes.CONTRACT_REFERENCE'),
              checked: false,
            },
            {
              code: 'ORDER_QUANTITY',
              label: this.$t('getreport.creation.groups.checkboxes.ORDER_QUANTITY'),
              checked: false,
            },
            {
              code: 'IMPORTED_QUANTITY',
              label: this.$t('getreport.creation.groups.checkboxes.IMPORTED_QUANTITY'),
              checked: false,
            },
            {
              code: 'ORDER_BIL_CODE',
              label: this.$t('getreport.creation.groups.checkboxes.ORDER_BIL_CODE'),
              checked: false,
            },
            {
              code: 'ORDER_BIL_NAME',
              label: this.$t('getreport.creation.groups.checkboxes.ORDER_BIL_NAME'),
              checked: false,
            },
          ],
        },

        {
          title: this.$t('getreport.creation.groups.consommation'),

          checkboxes: [
            {
              code: 'CUMULATED_UL_VOLUME',
              label: this.$t('getreport.creation.groups.checkboxes.CUMULATED_UL_VOLUME'),
              checked: false,
            },
            {
              code: 'CUMULATED_DL_VOLUME',
              label: this.$t('getreport.creation.groups.checkboxes.CUMULATED_DL_VOLUME'),
              checked: false,
            },
            {
              code: 'CUMULATED_SMS_VOLUME',
              label: this.$t('getreport.creation.groups.checkboxes.CUMULATED_SMS_VOLUME'),
              checked: false,
            },
            {
              code: 'CUMULATED_VOICE_VOLUME',
              label: this.$t('getreport.creation.groups.checkboxes.CUMULATED_VOICE_VOLUME'),
              checked: false,
            },
          ],
        },

        {
          title: this.$t('getreport.creation.groups.lastUsageInfos'),

          canShow: () => {
            return this.havePermission('consumption', 'last_usage');
          },
          isDisabled: () => this.noPartnerSelected,

          checkboxes: [
            {
              code: 'LAST_CONNECTION_STATUS',
              label: this.$t('getparc.lineDetail.tab2.lineAnalysisTitles.lastConnectionStatus'),
              checked: false,
            },
            {
              code: 'LAST_CONNECTION_START_DATE',
              label: this.$t('getreport.creation.groups.checkboxes.LAST_CONNECTION_START_DATE'),
              checked: false,
            },
            {
              code: 'LAST_CONNECTION_END_DATE',
              label: this.$t('getreport.creation.groups.checkboxes.LAST_CONNECTION_END_DATE'),
              checked: false,
            },
            {
              code: 'LAST_CONNECTION_CLOSING_REASON',
              label: this.$t('getreport.creation.groups.checkboxes.LAST_CONNECTION_CLOSING_REASON'),
              checked: false,
            },
            {
              code: 'LAST_CONNECTION_UPLOAD',
              label: this.$t('getreport.creation.groups.checkboxes.LAST_CONNECTION_UPLOAD'),
              checked: false,
            },
            {
              code: 'LAST_CONNECTION_DOWNLOAD',
              label: this.$t('getreport.creation.groups.checkboxes.LAST_CONNECTION_DOWNLOAD'),
              checked: false,
            },
            {
              code: 'LAST_SMS_DATE',
              label: this.$t('getreport.creation.groups.checkboxes.LAST_SMS_DATE'),
              checked: false,
            },
            {
              code: 'LAST_SMS_DIRECTION',
              label: this.$t('getreport.creation.groups.checkboxes.LAST_SMS_DIRECTION'),
              checked: false,
            },
            {
              code: 'LAST_VOICE_DATE',
              label: this.$t('getreport.creation.groups.checkboxes.LAST_VOICE_DATE'),
              checked: false,
            },
            {
              code: 'LAST_VOICE_DURATION',
              label: this.$t('getreport.creation.groups.checkboxes.LAST_VOICE_DURATION'),
              checked: false,
            },
            {
              code: 'LAST_VOICE_DIRECTION',
              label: this.$t('getreport.creation.groups.checkboxes.LAST_VOICE_DIRECTION'),
              checked: false,
            },
            {
              code: 'LAST_CONNECTION_IP_ADDRESS_TYPE',
              label: this.$t(
                'getreport.creation.groups.checkboxes.LAST_CONNECTION_IP_ADDRESS_TYPE'
              ),
              checked: false,
            },
            {
              code: 'LAST_CONNECTION_IP_V4_ADDRESS',
              label: this.$t('getreport.creation.groups.checkboxes.LAST_CONNECTION_IP_V4_ADDRESS'),
              checked: false,
            },
            {
              code: 'LAST_CONNECTION_IP_V6_ADDRESS',
              label: this.$t('getreport.creation.groups.checkboxes.LAST_CONNECTION_IP_V6_ADDRESS'),
              checked: false,
            },
            { code: 'LAST_CONNECTION_APN', label: 'APN', checked: false },
            { code: 'LAST_USAGE_COUNTRY', label: this.$t('filters.country'), checked: false },
            {
              code: 'LAST_USAGE_OPERATOR',
              label: this.$t(
                'getparc.lineDetail.tab2.supervisionContent.dataConsumptionPerDayColumns.operator'
              ),
              checked: false,
            },
            {
              code: 'LAST_USAGE_ZIP_CODE',
              label: this.$t('filters.postalCode'),
              checked: false,
              canShow: () => {
                if (this.userIsOperator) return true;
                return !!get(this.partnerForOptionCheck, 'data.optionViewCellId');
              },
            },
            {
              code: 'LAST_USAGE_CITY',
              label: this.$t('filters.city'),
              checked: false,
              canShow: () => {
                if (this.userIsOperator) return true;
                return !!get(this.partnerForOptionCheck, 'data.optionViewCellId');
              },
            },
            {
              code: 'LAST_USAGE_CELL_ID',
              label: this.$t('getreport.creation.groups.checkboxes.LAST_USAGE_CELL_ID'),
              checked: false,
              canShow: () => {
                if (this.userIsOperator) return true;
                return !!get(this.partnerForOptionCheck, 'data.optionViewCellId');
              },
            },
            {
              code: 'LAST_USAGE_COORDINATES',
              label: this.$t('getparc.lineDetail.tab2.lineAnalysisContent.geographicalCoordinates'),
              checked: false,
            },
            {
              code: 'LAST_USAGE_DATE',
              label: this.$t('getreport.creation.groups.checkboxes.LAST_USAGE_DATE'),
              checked: false,
            },
            { code: 'LAST_USAGE_TYPE', label: this.$t('filters.usageType'), checked: false },
            {
              code: 'LAST_USAGE_DETAILS',
              label: this.$t('getreport.creation.groups.checkboxes.LAST_USAGE_DETAILS'),
              checked: false,
            },
            { code: 'LAST_PLMN', label: 'PLMN', checked: false },
            {
              code: 'LAST_OPERATOR_REAL_PLMN',
              label: this.$t('getreport.creation.groups.checkboxes.LAST_OPERATOR_REAL_PLMN'),
              checked: false,
            },
            {
              code: 'LAST_TYPE_APPEL',
              label: this.$t('getreport.creation.groups.checkboxes.LAST_TYPE_APPEL'),
              checked: false,
            },
            {
              code: 'LAST_USAGE_IMEI',
              label: this.$t('getreport.creation.groups.checkboxes.LAST_USAGE_IMEI'),
              checked: false,
            },
            {
              code: 'LAST_USAGE_OFFER_CODE',
              label: this.$t('getreport.creation.groups.checkboxes.LAST_USAGE_OFFER_CODE'),
              checked: false,
            },
            {
              code: 'LAST_TICKET_GENERATION',
              label: this.$t('getreport.creation.groups.checkboxes.LAST_TICKET_GENERATION'),
              checked: false,
            },
          ],
        },
        // {
        //   title: 'Informations eSIM',
        //   checkboxes: [
        //     { code: 'ESIM_PROFILE_STATE', label: 'Etat du   profil eSIM', checked: false },
        //     {
        //       code: 'ESIM_LAST_PROFILE_STATE',
        //       label: 'Etat du   dernier profil eSIM',
        //       checked: false,
        //     },
        //     {
        //       code: 'ESIM_LAST_RESYNCHRONISATION_DATE',
        //       label: 'Date de la dernière resynchronisation',
        //       checked: false,
        //     },
        //     {
        //       code: 'ESIM_LAST_MODIFICATION_DATE',
        //       label: 'Date de   la dernière modification',
        //       checked: false,
        //     },
        //   ],
        // },
      ];
    },
  },

  computed: {
    ...mapGetters([
      'userIsPartner',
      'userInfos',
      'userIsMultiPartner',
      'userIsOperator',
      'havePermission',
      'userIsMVNO',
    ]),

    dateLabel() {
      if (this.reportFrequency === 'ONCE') {
        return 'getreport.creation.dateForOneItem';
      }
      return 'getreport.creation.dateGenerated';
    },

    partnerForOptionCheck() {
      if (this.selectedPartner) {
        return this.selectedPartner;
      }
      if (this.userIsMultiPartner) {
        return this.userInfos.partners[0];
      }

      return undefined;
    },

    noPartnerSelected() {
      return !this.selectedPartner || !this.selectedPartner.id;
    },

    baseNumber() {
      if (this.userIsPartner) return 0;

      return 1;
    },
    canSave() {
      let mailingListValid = true;
      if (!this.content && this.shouldNotify) {
        mailingListValid = !!this.notifList;
      }

      const canSave =
        !!this.fileFormat &&
        !!this.name &&
        !!this.generationDate &&
        mailingListValid &&
        this.selectedItems.length > 0;

      if (this.userIsMultiPartner) {
        return canSave;
      }

      if (this.userIsOperator) {
        return canSave;
      }

      return !!this.partnerForOptionCheck && canSave;
    },
    mailingLists() {
      if (!this.partnerForOptionCheck) return [];
      if (this.userIsOperator) return true;
      const mailingLists = get(this.partnerForOptionCheck, 'data.mailingLists', []);
      return mailingLists.map(m => ({ label: m.name, value: m.id }));
    },
  },
};
</script>

<style lang="scss" scoped>
.btn-link {
  &:hover {
    text-decoration: none;
  }
}
.checkbox-groups {
  .foldable-block.is-open {
    & /deep/ .title,
    & /deep/ a i {
      color: $secondary;
    }
  }
}
.creationContainer {
  display: flex;
  flex-flow: column nowrap;
  height: 100%;

  .panelContent {
    flex-grow: 1;
    height: 80%;

    display: flex;
    flex-flow: row nowrap;

    .checkBoxesContainer {
      width: 70%;
      background: white;
      overflow-y: auto;
      overflow-x: hidden;
      padding: 1rem;
    }

    .fieldsRecap {
      width: 30%;
      background: #f1f1f1;
      overflow: auto;
      padding: 1rem;

      h5 {
        font-weight: 400;
        padding: 1rem;
      }
    }
  }

  .fileInfo {
    padding: 1rem;
    height: 6rem;
    background: white;
    border-top: 1px solid $medium-gray;

    .fileInfoContainer {
      display: flex;
      justify-content: space-between;

      div {
        flex-basis: 15rem;
      }
    }
  }
}

.report-field {
  width: 15rem;
}

.mailing-list {
  flex-grow: 1;
  span {
    padding-top: 0;
    padding-left: 1rem;
    padding-right: 1rem;
    flex-basis: 18rem;
    text-align: end;
  }
}

.checkboxes-container {
  display: flex;
  flex-wrap: wrap;
  width: 100%;
  .item {
    flex-basis: 50%;
  }
}
</style>
