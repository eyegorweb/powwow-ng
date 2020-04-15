<template>
  <div class="creationContainer">
    <div class="panelContent">
      <div class="checkBoxesContainer">
        <template v-if="!userIsPartner">
          <SectionTitle :num="1">{{ $t('getparc.history.col.partyId') }}</SectionTitle>

          <PartnerCombo :value.sync="selectedPartner" include-mailing-lists />
        </template>

        <SectionTitle :num="baseNumber + 1">Choisir les informations</SectionTitle>
        <p>
          Choisissez dans les rubriques suivantes les informations de ligne que vous souhaitez faire
          apparaître dans votre rapport personnalisé. Vous pourrez ainsi filtrer et trier ces
          informations dans votre tableur préféré.
        </p>

        <div v-if="reportModels" class="mt-4 mb-2">
          <h6>à partir d'un modèle du rapport</h6>
          <UiSelect class="report-field" v-model="reportModel" :options="reportModels" block />
        </div>

        <div class="checkbox-groups" v-if="groups">
          <FoldableBlock :title="group.title" :key="group.title" v-for="group in groups">
            <div class="bg-white p-3 bordered checkboxes-container">
              <div
                :key="checkbox.label"
                v-for="checkbox in group.checkboxes"
                class="d-flex pt-3 item"
              >
                <UiCheckbox v-model="checkbox.checked" @change="() => selectOrRemove(checkbox)" />
                <span>{{ checkbox.label }}</span>
              </div>
            </div>
          </FoldableBlock>
        </div>

        <SectionTitle :num="baseNumber + 2">Récurrence et date</SectionTitle>
        <div class="mb-2">
          <h6>Générer un rapport</h6>
          <Toggle
            v-if="reportFrequency"
            @update="reportFrequency = $event.id"
            :values="reportFrequencyChoices"
            class="pl-2"
          />
        </div>
        <div class="mt-4 mb-2">
          <h6>Date de génération</h6>
          <UiDate
            time-picker
            @change="newVal => (generationDate = newVal)"
            :value="generationDate"
            :error="dateError ? 'errors.mandatory' : undefined"
            class="d-block report-field"
          >
            <i slot="icon" class="select-icon ic-Flag-Icon" />
          </UiDate>
        </div>

        <SectionTitle :num="baseNumber + 3">Notification</SectionTitle>

        <div class="row">
          <div class="col">
            <div class="d-flex pt-3">
              <UiCheckbox v-model="shouldNotify" />
              <span>{{ $t('mailNotification') }}</span>
            </div>
          </div>
          <div class="col">
            <div class="d-flex mailing-list">
              <span class="pt-3">Liste de diffusion</span>
              <UiSelect class="report-field" v-model="notifList" :options="mailingLists" block />
            </div>
          </div>
        </div>
      </div>
      <div class="fieldsRecap">
        <h5>Données du rapport</h5>
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
          <h6>Générer un rapport</h6>
          <UiInput v-model="name" :disabled="!!content" class="d-block" />
        </div>
        <div>
          <h6>Format de ficher</h6>
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

import { createReport, updateReport } from '@/api/reportCreation.js';
import { mapMutations, mapGetters } from 'vuex';

import { fetchpartnerById } from '@/api/partners.js';

import { reportModels } from '@/api/reportCreation.js';

import PartnerCombo from '@/components/CustomComboxes/PartnerCombo.vue';

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

  async mounted() {
    this.resetCheckboxes();

    let partnerID;

    if (this.content) {
      this.preloadCheckBoxes(this.content.fields.split(','));
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
      this.notifList = this.content.mailingList ? this.content.mailingList.id : undefined;

      this.fileFormat = this.content.exportFormat;

      partnerID = this.content.party.id;
    } else if (this.userIsPartner) {
      partnerID = this.userInfos.partners[0].id;
    }

    if (partnerID) {
      const selectedPartner = await fetchpartnerById(partnerID, {
        includeMailingLists: true,
      });
      this.selectedPartner = {
        id: selectedPartner.id,
        label: selectedPartner.name,
        data: selectedPartner,
      };
    }

    await this.loadModels();

    this.canShowForm = true;
  },

  watch: {
    reportModel(newValue) {
      const report = this.reportModels.find(r => r.value === newValue);

      this.preloadCheckBoxes(report.data.fields);
    },
    async selectedPartner() {
      await this.loadModels();
    },
  },

  methods: {
    ...mapMutations(['flashMessage', 'closePanel']),

    preloadCheckBoxes(fields) {
      this.resetCheckboxes();

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
        const models = await reportModels(this.selectedPartner.id);

        this.reportModels = [
          { label: 'Customisé', value: 'NONE' },
          ...models.map(m => ({ label: m.modelType, value: m.modelType, data: m })),
        ];
      }
    },

    removeItem(checkbox) {
      checkbox.checked = false;
      this.selectedItems = this.selectedItems.filter(i => i.label !== checkbox.label);
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
        partyId: this.selectedPartner.id,
        name: this.name,
      };

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
        this.flashMessage({ level: 'danger', message: this.$t('genericErrorMessage') });
      } else {
        this.flashMessage({ level: 'success', message: this.$t('genericSuccessMessage') });
      }

      this.closePanel({ resetSearch: true });
    },

    resetCheckboxes() {
      this.selectedItems = [];
      this.groups = [
        {
          title: 'Informations techniques',
          checkboxes: [
            { code: 'ICCID', label: 'ICCID', checked: false },
            { code: 'IMSI', label: 'IMSI', checked: false },
            { code: 'MSISDN', label: 'MSISDN', checked: false },
            { code: 'AMSISDN', label: 'A-MSISDN', checked: false },
            { code: 'IMEI', label: 'IMEI', checked: false },
            { code: 'GRP_DEVICE_INFO', label: 'Matériel et constructeur', checked: false },
            { code: 'SIMCARD_TYPE', label: 'Type de carte SIM', checked: false },
            { code: 'GRP_CUSTOM_FIELDS', label: 'Champs libres', checked: false },
            { code: 'GRP_SPECIFIC_FIELDS', label: 'Champs spécifiques', checked: false },
            { code: 'LINE_STATUS', label: 'Statut de la ligne', checked: false },
            { code: 'NETWORK_STATUS', label: 'Statut réseau', checked: false },
            { code: 'PIN2', label: 'Code PIN2', checked: false },
            { code: 'PUK1', label: 'Codes PUK', checked: false },
            { code: 'AP_ID', label: 'Identifiant point d’accès', checked: false },
            { code: 'ELECTRIC_PROFILE', label: 'Profil électrique', checked: false },
            { code: 'GRAPHIC_PROFILE', label: 'Profile graphique', checked: false },
            { code: 'HARDWARE_TYPE', label: 'Type de hardware', checked: false },
            { code: 'MODULE_NUMBER', label: 'Numéro de module', checked: false },
            { code: 'PREACTIVATION_DATE', label: 'Date de préactivation', checked: false },
            { code: 'ACTIVATION_DATE', label: 'Date d’activation', checked: false },
            {
              code: 'LAST_CHANGE_STATUS_DATE',
              label: 'Date de dernier changement de statut',
              checked: false,
            },
            { code: 'FIXED_IP_ADDRESSES', label: 'Adresse ip fixe', checked: false },
            { code: 'FLAT_END_DATE', label: "Date de changement d'offre MVNO", checked: false },
          ],
        },
        {
          title: 'Informations Dual SIM',
          checkboxes: [
            { code: 'DUAL_ICCID', label: 'Dual ICCID', checked: false },
            { code: 'DUAL_MSISDN', label: 'Dual MSISDN', checked: false },
            { code: 'DUAL_IMSI', label: 'Dual IMSI', checked: false },
          ],
        },

        {
          title: 'Informations commerciales',
          checkboxes: [
            { code: 'OFFER_NAME', label: 'Nom de l’offre', checked: false },
            { code: 'GRP_SERVICES_APN', label: 'Services de la ligne et APN', checked: false },
            {
              code: 'CUSTOMER_ACCOUNT_NAME',
              label: 'Nom du compte de facturation',
              checked: false,
            },
            {
              code: 'CUSTOMER_ACCOUNT_CODE',
              label: 'Code du compte de facturation',
              checked: false,
            },
            { code: 'PARTNER_NAME', label: 'Nom du partenaire', checked: false },
            { code: 'PARTNER_CODE', label: 'Code du partenaire', checked: false },
            { code: 'COMMITMENT_END_DATE', label: 'Date de fin d’engagement', checked: false },
            { code: 'COMMERCIAL_STATUS', label: 'Statut commercial ', checked: false },
            { code: 'BILLING_STATUS', label: 'Statut de facturation', checked: false },
          ],
        },

        {
          title: 'Informations de la commande',
          checkboxes: [
            { code: 'ORDER_ID', label: 'ID de commande', checked: false },
            {
              code: 'ORDER_PARTNER_NAME',
              label: 'Nom du partenaire de la commande ',
              checked: false,
            },
            {
              code: 'ORDER_PARTNER_CODE',
              label: 'Code du partenaire de la commande',
              checked: false,
            },
            { code: 'CLIENT_REFERENCE', label: 'Référence client', checked: false },
            {
              code: 'GRP_PREACTIVATE_ACTIVATE',
              label: 'Pré-Activation / Activation',
              checked: false,
            },
            { code: 'ORDER_OFFER', label: 'Offre de la commande', checked: false },
            { code: 'ORDER_DATE', label: 'Date de la commande ', checked: false },
            { code: 'ORDER_USER_NAME', label: 'Créateur de la commande', checked: false },
            { code: 'ORDER_STATUS', label: 'Statut de la commande', checked: false },
            { code: 'ORDER_STATUS_DATE', label: 'Date du statut', checked: false },
            { code: 'GRP_DELIVERY_CONTACT', label: 'Contact de livraison', checked: false },
            { code: 'ORDER_COMPANY', label: 'Société', checked: false },
            { code: 'GRP_DELIVERY_ADRESS', label: 'Adresse de livraison', checked: false },
            { code: 'GRP_BILLING_ADRESS', label: 'Adresse de facturation', checked: false },
            { code: 'CONTRACT_REFERENCE', label: 'Référence contrat ', checked: false },
            { code: 'ORDER_QUANTITY', label: 'Quantité de SIM commandées ', checked: false },
            { code: 'IMPORTED_QUANTITY', label: 'Quantité de SIM importées', checked: false },
            {
              code: 'ORDER_BIL_CODE',
              label: 'Code du compte de facturation de la commande',
              checked: false,
            },
            {
              code: 'ORDER_BIL_NAME',
              label: 'Nom du compte de facturation de la commande ',
              checked: false,
            },
          ],
        },

        {
          title: 'Consommation',
          checkboxes: [
            {
              code: 'CUMULATED_UL_VOLUME',
              label: 'Encours Data montant (mensuel)',
              checked: false,
            },
            {
              code: 'CUMULATED_DL_VOLUME',
              label: 'Encours Data descendant (mensuel)',
              checked: false,
            },
            { code: 'CUMULATED_SMS_VOLUME', label: 'Encours SMS (mensuel)', checked: false },
            { code: 'CUMULATED_VOICE_VOLUME', label: 'Encours Voix (mensuel)', checked: false },
          ],
        },

        {
          title: 'Informations dernier usage',
          checkboxes: [
            {
              code: 'LAST_CONNECTION_STATUS',
              label: 'Statut de la dernière connexion',
              checked: false,
            },
            {
              code: 'LAST_CONNECTION_START_DATE',
              label: 'Début de la dernière connexion',
              checked: false,
            },
            {
              code: 'LAST_CONNECTION_END_DATE',
              label: 'Fin de la dernière connexion',
              checked: false,
            },
            {
              code: 'LAST_CONNECTION_CLOSING_REASON',
              label: 'Motif de fermeture de la connexion ',
              checked: false,
            },
            {
              code: 'LAST_CONNECTION_UPLOAD',
              label: 'Volume montant de la dernière connexion',
              checked: false,
            },
            {
              code: 'LAST_CONNECTION_DOWNLOAD',
              label: 'Volume descendant de la dernière connexion',
              checked: false,
            },
            { code: 'LAST_SMS_DATE', label: 'Date du dernier SMS', checked: false },
            { code: 'LAST_SMS_DIRECTION', label: 'Direction du dernier SMS', checked: false },
            {
              code: 'LAST_VOICE_DATE',
              label: 'Date de la dernière communication voix',
              checked: false,
            },
            {
              code: 'LAST_VOICE_DURATION',
              label: 'Durée de la dernière communication voix',
              checked: false,
            },
            {
              code: 'LAST_VOICE_DIRECTION',
              label: 'Direction de la dernière communication voix ',
              checked: false,
            },
            { code: 'LAST_CONNECTION_IP_ADDRESS_TYPE', label: 'Type adresse IP', checked: false },
            { code: 'LAST_CONNECTION_IP_V4_ADDRESS', label: 'Adresse IP V4', checked: false },
            { code: 'LAST_CONNECTION_IP_V6_ADDRESS', label: 'Adresse IP V6', checked: false },
            { code: 'LAST_CONNECTION_APN', label: 'APN', checked: false },
            { code: 'LAST_USAGE_COUNTRY', label: 'Pays', checked: false },
            { code: 'LAST_USAGE_OPERATOR', label: 'Opérateur ', checked: false },
            { code: 'LAST_USAGE_ZIP_CODE', label: 'Code postal', checked: false },
            { code: 'LAST_USAGE_CITY', label: 'Ville', checked: false },
            { code: 'LAST_USAGE_CELL_ID', label: 'Id de cellule', checked: false },
            { code: 'LAST_USAGE_COORDINATES', label: 'Coordonnées géographiques ', checked: false },
            { code: 'LAST_USAGE_DATE', label: 'Date de dernière localisation', checked: false },
            { code: 'LAST_USAGE_TYPE', label: "Type d'usage", checked: false },
            { code: 'LAST_USAGE_DETAILS', label: 'Détail', checked: false },
            { code: 'LAST_PLMN', label: 'PLMN', checked: false },
            { code: 'LAST_OPERATOR_REAL_PLMN', label: 'PLMN réel ', checked: false },
            { code: 'LAST_TYPE_APPEL', label: 'Type appel', checked: false },
            { code: 'LAST_USAGE_IMEI', label: 'IMEI du dernier usage', checked: false },
            {
              code: 'LAST_USAGE_OFFER_CODE',
              label: 'Code offre du dernier usage ',
              checked: false,
            },
            { code: 'LAST_TICKET_GENERATION', label: 'Génération du ticket', checked: false },
          ],
        },
      ];
    },
  },

  computed: {
    ...mapGetters(['userIsPartner', 'userInfos']),

    baseNumber() {
      if (this.userIsPartner) return 0;

      return 1;
    },
    canSave() {
      let mailingListValid = true;
      if (!this.content && this.shouldNotify) {
        mailingListValid = !!this.notifList;
      }

      return (
        !!this.selectedPartner &&
        !!this.fileFormat &&
        !!this.name &&
        !!this.generationDate &&
        mailingListValid
      );
    },
    mailingLists() {
      if (!this.selectedPartner) return [];
      const mailingLists = get(this.selectedPartner, 'data.mailingLists', []);
      return mailingLists.map(m => ({ label: m.name, value: m.id }));
    },
  },

  data() {
    return {
      canShowForm: false,
      selectedItems: [],
      generationDate: undefined,
      dateError: false,
      shouldNotify: false,
      reportFrequency: 'ONCE',
      name: undefined,
      selectedPartner: undefined,
      fileFormat: undefined,
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
          label: 'Une seule fois',
        },
        {
          id: 'DAILY',
          label: 'Journalier',
        },
        {
          id: 'WEEKLY',
          label: 'Hebdomadaire',
        },
        {
          id: 'MONTHLY',
          label: 'Mensuel',
        },
      ],

      reportModel: 'NONE',
      reportModels: undefined,

      notifList: undefined,

      groups: undefined,
    };
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
