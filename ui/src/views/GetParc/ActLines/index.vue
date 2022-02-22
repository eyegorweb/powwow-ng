@<template>
  <div class="mt-4">
    <div class="row mb-4">
      <div class="col-md-9">
        <h4>
          <strong>GetParc</strong>
          - {{ $t('getparc.management-lines') }}
          <Tooltip direction="right">{{ $t('getparc.tooltip-title-text') }}</Tooltip>
        </h4>
      </div>
      <div class="col-md-3" v-if="userIsBO">
        <UiButton variant="accent" block class="float-right" @click="openCreateSimCardsPanel()">{{
          $t('getparc.lines-sim-import')
        }}</UiButton>
      </div>
    </div>
    <div class="row mb-5" v-if="canShowCarousel">
      <div class="col-md-12">
        <ActionCarousel
          v-if="!isFetchingPartnerOptions && optionsPartner.offerChange !== undefined"
          title="getparc.actLines.chooseAct"
          :actions="carouselItems"
          @itemClick="onCarouselItemClick"
        />
      </div>
    </div>

    <ActCreationPrerequisites
      v-if="!transferSim && creationMode"
      :act="actToCreate"
      @toggle="onToggleChange"
    />

    <div class="row">
      <div class="col-md-3">
        <Indicators
          v-if="indicators"
          :meta="indicators"
          :applied-filters-value="appliedFiltersValue"
          :on-click="onClick"
          :disable-click="!!creationMode"
          precalculated
        />
        <br />
        <FilterBar v-if="!transferSim" :creation-mode="!!creationMode" />
      </div>
      <template v-if="withCustomFormBehavior">
        <PairingByFileFormContainer
          v-if="actToCreate.id === 'PAIRING'"
          :act-to-create="actToCreate"
          :act-creation-prerequisites="actCreationPrerequisites"
          :applied-filters="appliedFilters"
        />
      </template>
      <template v-else>
        <TransferSim v-if="transferSim" class="col-md-9" />
        <div class="col-md-9 extra-bottom-margin" v-if="!transferSim">
          <Title
            num="1"
            v-if="creationMode && actCreationPrerequisites && useFileImportAsInput"
            title="getparc.actLines.idType"
            :color="actToCreate.color"
            :uppercase="true"
          />

          <div
            v-if="creationMode && actCreationPrerequisites && useFileImportAsInput"
            class="actBox"
          >
            <UiSelect
              class="pb-3 d-block"
              v-model="selectedIdType"
              :options="optionsIdType"
              :placeholder="$t('filters.lines.fromFile.id-type-placeholder')"
              :arrow-blue="true"
            />
            <Toggle :values="toggleCustomFieldsValues" @update="customFieldTypeToggle = $event" />
          </div>

          <Title
            :num="DropZoneTitleNumber"
            v-if="canShowDropZoneFile"
            title="getparc.actLines.step1File"
            :color="actToCreate.color"
            :uppercase="true"
          />
          <DropZone v-if="canShowDropZoneFile" v-model="selectedFile" class="dropZone" />

          <Title
            num="1"
            v-if="
              creationMode &&
                actCreationPrerequisites &&
                !actToCreate.containFile &&
                !useFileImportAsInput
            "
            title="getparc.actLines.step1Title"
            :color="actToCreate.color"
            :uppercase="true"
          />
          <LinesTable
            v-if="canShowTable && canMounTable && !useFileImportAsInput"
            :creation-mode="canShowForm"
            :act-to-create="actToCreate"
            :widget-init-search-by-id="$route.params.idFilters"
            :query-filters-from-order="$route.params.queryFilters"
            @noResults="checkTableResult"
          >
            <template v-if="canShowForm" slot="title">
              {{
                $t('getparc.actLines.selected', {
                  total: $formatLargeNumber(totalSelected),
                })
              }}
            </template>
          </LinesTable>
          <template v-if="actToCreate">
            <Title
              :num="ActFormTitleNumber"
              v-if="canShowForm || useFileImportAsInput"
              :title="actToCreate.stepTitle"
              :color="actToCreate.color"
              :uppercase="true"
            />
            <ActCreationActForm
              v-if="canShowForm || useFileImportAsInput"
              :act="actToCreate"
              :key="actToCreateFormVersionChange"
              :use-file-import-as-input="useFileImportAsInput"
              :file-import-as-input-context="fileImportAsInputContext"
            />
          </template>
        </div>
      </template>
    </div>
  </div>
</template>

<script>
import Tooltip from '@/components/ui/Tooltip';
import FilterBar from './FilterBar';
import LinesTable from './LinesTable';
import TransferSim from './ActCreation/forms/TransferSim';
import Title from './Title';
import UiButton from '@/components/ui/Button';
import ActCreationPrerequisites from './ActCreation/Prerequisites';
import ActCreationActForm from './ActCreation/ActForm';
import ActionCarousel from './ActionCarousel';
import Indicators from '@/components/Indicators';
import DropZone from '@/components/ui/DropZone';
import UiSelect from '@/components/ui/UiSelect';
import { fetchOffers } from '@/api/offers.js';
import { mapState, mapActions, mapMutations, mapGetters } from 'vuex';
import { getPartyOptions } from '@/api/partners.js';
import Toggle from '@/components/ui/UiToggle2';

import carouselItems from './carouselItems';

import PairingByFileFormContainer from '@/views/GetParc/ActLines/ActCreation/formContainers/PairingByFileFormContainer.vue';

import { fetchSingleIndicator } from '@/api/linesActions';
import { isFeatureAvailable } from '@/api/partners';

export default {
  components: {
    Tooltip,
    Toggle,
    FilterBar,
    LinesTable,
    UiSelect,
    TransferSim,
    ActionCarousel,
    Indicators,
    ActCreationPrerequisites,
    ActCreationActForm,
    Title,
    DropZone,
    UiButton,
    PairingByFileFormContainer,
  },
  data() {
    return {
      isFetchingPartnerOptions: true,
      canMounTable: true,
      prereqSet: false,
      indicators: undefined,
      tableIsEmpty: true,
      prevRoute: undefined,
      transferSim: false,
      DropZoneTitleNumber: '1',
      ActFormTitleNumber: '2',
      file: undefined,
      useFileImportAsInput: false,
      customFieldTypeToggle: undefined,
      optionsPartner: {
        offerChange: undefined,
      },
      selectedIdType: undefined,
      toggleCustomFieldsValues: [
        {
          id: 'CustomFields',
          label: 'common.customFields',
        },
        {
          id: 'SpecificFields',
          label: 'specificFields',
        },
      ],
      optionsIdType: [
        {
          code: 'c1',
          label: 'ICCID',
          value: 'UPDATE_FIELD_BY_ICCID',
        },
        {
          code: 'c2',
          label: 'MSISDN',
          value: 'UPDATE_FIELD_BY_MSISDN',
        },
        {
          code: 'c3',
          label: 'IMSI',
          value: 'UPDATE_FIELD_BY_IMSI',
        },
        {
          code: 'c4',
          label: 'IMEI',
          value: 'UPDATE_FIELD_BY_IMEI',
        },
      ],
      // Pour recréer le composant ActForm à chaque changement des prérequis
      actToCreateFormVersionChange: 0,
      lvFeature: false,
    };
  },

  computed: {
    ...mapState('userContext', ['contextPartnersType', 'contextPartners']),
    ...mapState('actLines', [
      'currentFilters',
      'actCreationPrerequisites',
      'selectedFileForActCreation',
      'selectedLinesForActCreation',
      'formVersion',
      'searchingById',
    ]),
    ...mapGetters('actLines', ['appliedFilters', 'linesActionsResponse']),
    ...mapGetters(['userIsPartner', 'singlePartner']),
    ...mapGetters([
      'userIsPartner',
      'userInfos',
      'userIsBO',
      'userIsMVNO',
      'havePermission',
      'userIsMultiCustomer',
      'userHaveEsimEnabled',
      'userIsM2MLight',
    ]),
    ...mapState({
      actToCreate: (state) => state.actLines.actToCreate,
    }),
    appliedFiltersValue() {
      let partners = [];
      let partnersFilter = this.appliedFilters.find((e) => e.id === 'filters.partners');
      if (partnersFilter) {
        partners = partnersFilter.values.map((p) => p.id);
      }
      return partners;
    },

    withCustomFormBehavior() {
      if (this.actCreationPrerequisites && this.actToCreate) {
        const isPairing = !!['PAIRING'].find((i) => i === this.actToCreate.id);
        return isPairing && this.$loGet(this.actCreationPrerequisites, 'filePairing');
      }
      return false;
    },

    canShowDropZoneFile() {
      return (
        this.creationMode &&
        this.actCreationPrerequisites &&
        (this.actToCreate.containFile || this.useFileImportAsInput)
      );
    },

    fileImportAsInputContext() {
      return {
        selectedIdType: this.selectedIdType,
        selectedFile: this.selectedFile,
        customFieldTypeToggle: this.$loGet(this.customFieldTypeToggle, 'id'),
      };
    },

    totalSelected() {
      const responseTotal = this.linesActionsResponse ? this.linesActionsResponse.total : 0;
      return this.selectedLinesForActCreation.length || responseTotal;
    },

    carouselItems() {
      // esimAct: true,
      let itemsToReturn;
      if (this.userIsPartner || this.userInfos.type === 'PARTNER_GROUP') {
        itemsToReturn = carouselItems
          .filter((i) => {
            return !i.boOnly;
          })
          .filter((i) => {
            if (i.hideForMVNO) {
              return !this.userIsMVNO;
            }
            return true;
          })
          .filter((i) => {
            if (i.hideForMultiCustomer) {
              return !this.userIsMultiCustomer;
            }
            return true;
          })
          .filter((i) => {
            if (i.permission) {
              return this.havePermission(i.permission.domain, i.permission.action);
            }
            return true;
          })
          .filter((i) => {
            if (this.userIsM2MLight) {
              if (
                i.title === 'getparc.actCreation.carouselItem.CUSTOM_FIELDS' ||
                i.title === 'getparc.actCreation.carouselItem.SUSPEND' ||
                i.title === 'getparc.actCreation.carouselItem.REACTIVATE' ||
                i.title === 'getparc.actCreation.carouselItem.RECHARGE_LINES'
              ) {
                return true;
              }
              return false;
            }
            return true;
          })
          .filter((i) => {
            if (i.title === 'getparc.actCreation.carouselItem.CHANGE_OFFER') {
              return this.optionsPartner.offerChange;
            }
            return true;
          });
      } else {
        itemsToReturn = carouselItems.filter((i) => {
          if (i.permission) {
            return this.havePermission(i.permission.domain, i.permission.action);
          }
          return true;
        });
      }

      if (!this.userHaveEsimEnabled) {
        return this.configureDisableConstraint(itemsToReturn.filter((i) => !i.esimAct));
      }

      return this.configureDisableConstraint(
        itemsToReturn.filter((i) => {
          if (i.partnerFeature === 'LV') {
            return this.lvFeature;
          }
          return true;
        })
      );
    },
    canShowForm() {
      const actWithFileUpload = this.creationMode && this.creationMode.containFile;
      let resultsConstraint = actWithFileUpload || !this.tableIsEmpty;

      return this.creationMode && this.actCreationPrerequisites && resultsConstraint;
    },

    canShowCarousel() {
      return this.carouselItems.length > 0;
    },

    selectedFile: {
      get() {
        return this.selectedFileForActCreation;
      },
      set(newFile) {
        this.setSelectedFileForActCreation(newFile);
        this.file = newFile;
      },
    },
    creationMode() {
      return this.actToCreate;
    },
    canShowTable() {
      if (this.actToCreate) {
        if (this.actToCreate.containFile) {
          if (this.actCreationPrerequisites) {
            return false;
          } else {
            return true;
          }
        }
      }
      return true;
    },
  },
  beforeRouteEnter(to, from, next) {
    next((vm) => {
      vm.prevRoute = from.name;
      vm.initAfterRouteIsSet();
    });
  },
  async mounted() {
    this.setupIndicators();
    this.setActToCreate(null);
    this.fetchPartnerOptions();
    await this.fetchPartyFeatures();
    this.isFetchingPartnerOptions = false;

    /**
     * la recherche n'est pas réinitialisée au retour de la page de détails, du coup on doit mettre la bonne valeur dans cette variable.
     */
    if (this.$route.params && this.$route.params.fromDetail) {
      this.tableIsEmpty = false;
    }
  },
  methods: {
    ...mapActions('actLines', ['initFilterForContext', 'mergeCurrentFiltersWith']),
    ...mapMutations('actLines', [
      'setCurrentFilters',
      'applyFilters',
      'setActToCreate',
      'setActCreationPrerequisites',
      'setSelectedLinesForActCreation',
      'setSelectedFileForActCreation',
      'setPageLimit',
      'setRouteParamsFilters',
      'resetAfterFilterClear',
      'resetState',
    ]),
    ...mapMutations(['openPanel']),
    async fetchPartyFeatures() {
      this.lvFeature = await isFeatureAvailable('LV');
    },
    configureDisableConstraint(carouselInputItems) {
      let response;
      let partnerFilter = this.appliedFilters.find((e) => e.id === 'filters.partners');
      if (this.singlePartner) {
        response = fetchOffers('', [{ id: this.singlePartner.id }], {
          page: 0,
          limit: 20,
          customerAccountCode:
            this.actCreationPrerequisites &&
            this.actCreationPrerequisites.billingAccount &&
            this.actCreationPrerequisites.billingAccount.code
              ? this.actCreationPrerequisites.billingAccount.code
              : undefined,
        });
      } else if (
        this.userIsBO &&
        partnerFilter &&
        partnerFilter.values &&
        partnerFilter.values.length === 1
      ) {
        response = fetchOffers('', [{ id: partnerFilter.values[0].id }], {
          page: 0,
          limit: 20,
          customerAccountCode:
            this.actCreationPrerequisites &&
            this.actCreationPrerequisites.billingAccount &&
            this.actCreationPrerequisites.billingAccount.code
              ? this.actCreationPrerequisites.billingAccount.code
              : undefined,
        });
      }

      carouselInputItems.map((item) => {
        if (item.id === 'CHANGE_OFFER') {
          item.isDisable = () => {
            if ((response && response.length <= 1) || !this.optionsPartner.offerChange) {
              return true;
            }
            return false;
          };
        }
      });
      return carouselInputItems;
    },
    onToggleChange(newToggleValue) {
      this.useFileImportAsInput = newToggleValue === 'byImport';

      if (this.useFileImportAsInput) {
        this.DropZoneTitleNumber = '2';
        this.ActFormTitleNumber = '3';
      }
    },

    async fetchPartnerOptions() {
      let response;
      if (this.userIsPartner || this.userInfos.type === 'PARTNER_GROUP') {
        response = await getPartyOptions(this.userInfos.partners[0].id);
        this.optionsPartner.offerChange = response ? response.offerChangeEnabled : true;
      } else {
        this.optionsPartner.offerChange = true;
        response = undefined;
      }
      return this.optionsPartner.offerChange;
    },

    setupIndicators() {
      this.indicators = [
        {
          name: 'notProcessedResiliations',
          labelKey: 'indicators.getparc.lines.cancellation',
          color: 'text-danger',
          clickable: false,
          total: '-',
          roles: ['BO'],
          filters: [
            {
              id: 'filters.lines.commercialStatus',
              values: [
                {
                  id: 'demandeDeResiliation',
                  label: this.$t('getparc.actLines.commercialStatuses.demandeDeResiliation'),
                },
              ],
            },
            {
              id: 'filters.lines.terminationValidated',
              value: true,
            },
          ],
          fetchKey: 'ACT_TERMINATION_NOT_PROCESSED',
          fetch: async (indicator, contextFilters) => {
            return await fetchSingleIndicator(indicator.filters, contextFilters);
          },
        },
        {
          name: 'simCardsInStock',
          labelKey: 'indicators.getparc.lines.availableSIMCards',
          color: 'text-success',
          clickable: true,
          total: '-',
          roles: ['PARTNER'],
          filters: [
            {
              id: 'filters.lines.SIMCardStatus',
              values: [
                {
                  id: 'NOT_PREACTIVATED',
                  label: 'Non préactivée',
                },
              ],
            },
          ],
          fetchKey: 'SIM_NOT_PREACTIVATED',
          fetch: async (indicator, contextFilters) => {
            return await fetchSingleIndicator(indicator.filters, contextFilters);
          },
        },
        {
          name: 'allocatedSIMCards',
          labelKey: 'indicators.getparc.lines.allocatedSIMCards',
          color: 'text-success',
          clickable: true,
          total: '-',
          roles: ['PARTNER'],
          filters: [
            {
              id: 'filters.lines.SIMCardStatus',
              values: [
                {
                  id: 'PREACTIVATED',
                  label: 'Préactivée',
                },
              ],
            },
          ],
          fetchKey: 'SIM_PREACTIVATED',

          fetch: async (indicator, contextFilters) => {
            return await fetchSingleIndicator(indicator.filters, contextFilters);
          },
        },
        {
          name: 'activatedSIMCards',
          labelKey: 'indicators.getparc.lines.activatedSIMCards',
          color: 'text-success',
          clickable: true,
          total: '-',
          roles: ['PARTNER'],
          filters: [
            {
              id: 'filters.lines.SIMCardStatus',
              values: [
                {
                  id: 'ACTIVATED',
                  label: 'Activé',
                },
              ],
            },
          ],
          fetchKey: 'SIM_ACTIVATED',
          fetch: async (indicator, contextFilters) => {
            return await fetchSingleIndicator(indicator.filters, contextFilters);
          },
        },
        {
          name: 'suspended',
          labelKey: 'indicators.getparc.lines.suspended',
          color: 'text-warning',
          clickable: true,
          total: '-',
          roles: ['BO', 'PARTNER'],
          filters: [
            {
              id: 'filters.lines.SIMCardStatus',
              values: [
                {
                  id: 'SUSPENDED',
                  label: 'Suspendue',
                },
              ],
            },
          ],
          fetchKey: 'SIM_SUSPENDED',
          fetch: async (indicator, contextFilters) => {
            return await fetchSingleIndicator(indicator.filters, contextFilters);
          },
        },
        {
          name: 'traffic',
          labelKey: 'indicators.getparc.lines.traffic',
          color: 'text-warning',
          clickable: true,
          total: '-',
          roles: ['BO'],
          filters: [
            {
              id: 'filters.lines.traffic',
              values: [
                {
                  id: 'lineTrafficState',
                  label: 'Oui',
                },
              ],
            },
          ],
          fetchKey: 'SIM_TRAFFICKING',
          fetch: async (indicator, contextFilters) => {
            return await fetchSingleIndicator(indicator.filters, contextFilters);
          },
        },
        /*
        // Reporté
        {
          name: 'validation',
          labelKey: 'indicators.getparc.lines.validation',
          filters: [],
        },
        //*/
      ];
    },

    initAfterRouteIsSet() {
      // Ne pas réinitialiser la barre de filtres si on reviens du détail d'une ligne
      if (this.prevRoute && this.prevRoute.includes('lineDetail') && this.linesActionsResponse) {
        return;
      }
      if (this.$route.params && this.$route.params.queryFilters) {
        this.setRouteParamsFilters(this.$route.params.queryFilters);
      }
      this.initFilterForContext();
    },

    checkTableResult(result) {
      this.tableIsEmpty = result;
    },

    onCarouselItemClick(item) {
      let isSelected = false;
      let newSelectionState = true;

      if (item.stepTitle === 'getparc.actCreation.carouselItem.SIM_TRANSFER' && !this.transferSim) {
        this.transferSim = true;
      } else {
        this.transferSim = false;
      }

      if (this.actToCreate) {
        isSelected = this.actToCreate.title === item.title;
        newSelectionState = !isSelected;
        // fix transfer sim error
        // if (this.actToCreate.title === 'getparc.actCreation.carouselItem.SIM_TRANSFER') {
        //   this.transferSim = false;
        // }
      }

      if (newSelectionState) {
        // déjà en mode création, sur un autre acte
        if (this.creationMode) {
          this.setActCreationPrerequisites(null);
          this.useFileImportAsInput = false;
          this.setSelectedLinesForActCreation([]);
        }

        if (item.filters) {
          this.$nextTick(() => {
            this.setActToCreate(item);
            this.mergeCurrentFiltersWith(item.filters);
          });
        }
      } else {
        this.setPageLimit(20);
        this.setActToCreate(null);
        this.setActCreationPrerequisites(null);
        this.useFileImportAsInput = false;
        this.setSelectedLinesForActCreation([]);
      }
    },

    onClick(indicator) {
      if (!indicator.overrideClick) {
        this.setCurrentFiltersForIndicator(indicator);
      }
    },

    setCurrentFiltersForIndicator(indicator) {
      this.setCurrentFilters([...indicator.filters]);
      this.applyFilters();
    },

    onPrereqSet() {
      this.prereqSet = true;
    },

    openCreateSimCardsPanel() {
      this.openPanel({
        title: this.$t('getparc.lines-sim-import'),
        panelId: 'getparc.lines-sim-import',
        wide: false,
        backdrop: true,
        ignoreClickAway: true,
      });
    },
  },

  watch: {
    formVersion() {
      this.useFileImportAsInput = false;
      this.canMounTable = false;
      this.$nextTick(() => {
        this.canMounTable = true;
      });
    },
    currentFilters(currentFilters) {
      const haveValues = !!currentFilters.find((filter) => {
        return (
          (filter.values && filter.values.length) ||
          filter.value ||
          filter.startDate ||
          filter.endDate ||
          filter.from ||
          filter.to
        );
      });
      const havePartners = this.contextPartners.map((p) => p.id);

      if (!haveValues && !this.searchingById && !havePartners) {
        this.resetAfterFilterClear();
      }
    },

    contextPartnersType() {
      this.initFilterForContext();
    },
    contextPartners() {
      this.initFilterForContext();
    },
    actToCreate(newValue, oldValue) {
      if (!newValue && oldValue) {
        this.resetState();
      }
      this.actToCreateFormVersionChange += 1;
    },
    actCreationPrerequisites() {
      this.actToCreateFormVersionChange += 1;
    },
  },
};
</script>

<style lang="scss" scoped>
::v-deep .step-title .text {
  padding-left: 5px;
  font-size: 16px;
  font-weight: bold;
}
.dropZone {
  margin-bottom: 3rem;
}

.actBox {
  background: white;
  padding: 2rem;
  box-sizing: border-box;
  display: flex;
  align-items: center;
  margin-bottom: 3rem;

  div {
    width: 50%;
    margin-right: 2rem;
  }
}

.extra-bottom-margin {
  margin-bottom: 5rem;
}
</style>
