<template>
  <div class="row mt-4 mb-4">
    <div :key="'bar_' + currentUsage" class="col-3">
      <MonitoringIndicators
        v-if="currentUsage !== 'ALARMS'"
        :can-refresh="canShowIndicators"
        :applied-filters="appliedFilters"
        :usage="currentUsage"
        @click="onIndicatorClick"
      />
      <FilterBar
        v-if="currentUsage !== 'ALARMS' && filters"
        :filter-components="filters"
        :disabled="!canFilter"
        :default-values="defaultValues"
        :frozen-values="frozenValues"
        :always-show-button="alwaysShowButton"
        @applyFilters="doSearch"
        @currentFiltersChange="onCurrentChange"
      />
    </div>
    <div class="col-9">
      <div class="bg-white p-3">
        <div class="row">
          <div class="col-7">
            <div class="row">
              <div class="col">
                <label class="font-weight-bold">{{ $t('getvsion.supervisionType') }}</label>
                <template v-if="getToggleSingleValue">
                  <div class="col">
                    {{ getToggleSingleValue }}
                  </div>
                </template>
                <template v-else>
                  <Toggle
                    v-if="toggleValues"
                    @update="onUsageChange"
                    :values="toggleValues"
                    block
                    class="pl-2"
                  />
                </template>
              </div>
            </div>
            <div v-if="canShowWorldGraphBtn" class="row mt-2 pl-2">
              <div class="col">
                <UiButton variant="outline-primary" class="mb-4" @click="showWorldM2MGraphs">
                  {{ $t('getvsion.graph-world') }}
                </UiButton>
              </div>
            </div>
          </div>
          <div class="col-5">
            <MapLegend :usage="currentUsage" />
          </div>
        </div>
      </div>

      <div :key="'content_' + currentUsage" class="mt-3 mb-3">
        <template v-if="cockpitMarkerToDetail && appliedFilters">
          <div>
            <CockpitDetails
              :marker-data="cockpitMarkerToDetail"
              :applied-filters="appliedFilters"
              :default-tab-num="cockpitMarkerToDetail.type === 'ALERT' ? 1 : 0"
              @tabchange="onTabChange"
              @gotomap="gotoCockpitMap"
            />
          </div>
        </template>
        <div :class="{ hidden: !!cockpitMarkerToDetail }">
          <SupervisionMap
            :visible="!refreshLinesFn"
            :applied-filters="appliedFilters"
            :usage="currentUsage"
            @activeClick="onActiveClick"
            @passiveClick="onPassiveClick"
            @cockpitClick="onCockpitClick"
            @centeredCountry="lastCenteredCountry = $event"
          />
          <SupervisionTable
            v-if="refreshLinesFn"
            :refresh-lines-fn="refreshLinesFn"
            :indicator-total="indicatorTotal"
            :filters-for-export="filtersForExport"
            @gotomap="gotoUsageMap"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import FilterBar from '@/components/Filters/TableWithFilter/FilterBar.vue';
import MultiCustomerPartnerFilter from './filters/MultiCustomerPartnerFilter.vue';
import OfferFilter from './filters/OfferFilter';
import Toggle from '@/components/ui/UiToggle2';
import FileFilter from './filters/FileFilter';
import PartnerGroupChoice from './filters/PartnerGroupChoice';
import LocalisationFilter from './filters/LocalisationFilter';
import CountryFilter from './filters/CountryFilter';
import StatusesFilter from './filters/StatusesFilter';
import TypesFilter from './filters/TypesFilter';
import LabelFilter from './filters/LabelFilter';
import IdentifierFilter from './filters/IdentifierFilter';
import UiButton from '@/components/ui/Button';

import DateRangeFilter from './filters/DateRangeFilter';
import MapLegend from './MapLegend';
import MonitoringIndicators from './MonitoringIndicators';
import cloneDeep from 'lodash.clonedeep';

import SupervisionMap from './SupervisionMap';
import SupervisionTable from './SupervisionTable';
import CockpitDetails from './CockpitDetails';

import { fetchLinesForCounter, fetchLinesForMarker } from '@/api/supervision.js';

import { mapGetters } from 'vuex';

import { fetchDeliveryCountries } from '@/api/filters';
import { delay } from '@/api/utils.js';
import differencewith from 'lodash.differencewith';

export default {
  components: {
    FilterBar,
    Toggle,
    MapLegend,
    MonitoringIndicators,
    SupervisionMap,
    SupervisionTable,
    CockpitDetails,
    UiButton,
  },
  computed: {
    ...mapGetters([
      'userIsBO',
      'userIsGroupAccount',
      'userPartyGroup',
      'userIsPartner',
      'singlePartner',
      'havePermission',
    ]),
    canFilter() {
      return !this.refreshLinesFn;
    },
    canShowWorldGraphBtn() {
      if (this.currentUsage !== 'COCKPIT') return false;

      if (this.appliedFilters && this.appliedFilters.length > 0) {
        return !!this.appliedFilters.find((a) => a.id === 'getadmin.users.filters.partners');
      }

      return false;
    },
    getToggleSingleValue() {
      let value = undefined;
      if (this.toggleValues && this.toggleValues.length === 1) {
        this.toggleValues.forEach((val) => {
          value = this.$t(val.label);
          this.updateCurrentUsage(val.id);
        });
      }
      return value;
    },
  },
  data() {
    return {
      filters: undefined,
      filtersForExport: undefined,
      toggleValues: undefined,
      currentUsage: 'ALL',
      appliedFilters: undefined,
      refreshLinesFn: undefined,
      indicatorTotal: undefined,
      canShowIndicators: false,
      cockpitMarkerToDetail: undefined,
      defaultValues: [],
      currentFilters: [],
      frozenValues: [],
      isFrozen: false,
      isCockpitClick: false,
      currentTab: 'graphs',
      lastCenteredCountry: undefined,
      alwaysShowButton: true,

      // Garder les valeurs déjà utilisée dans d'autres usages
      allUsagesPreviousFilters: [],
      currentUsagePrevFilters: undefined,

      commonFilters: {
        partnerGroup: {
          title: 'getadmin.users.filters.partnerGroup',
          component: PartnerGroupChoice,
          isHidden: () => {
            if (!this.havePermission('getVision', 'filter_domain')) {
              return true;
            }
            return this.isFrozen;
          },
          onChange(chosen, clearFilter) {
            clearFilter('getadmin.users.filters.partners');
            clearFilter('filters.offers');
            if (!chosen || !chosen.value) {
              return {
                id: 'getadmin.users.filters.partnerGroup',
                value: '', // pour supprimer ce choix des filtres séléctionnés
              };
            } else {
              return {
                id: 'getadmin.users.filters.partnerGroup',
                value: chosen.label,
                data: chosen,
              };
            }
          },
        },
        partners: {
          title: 'getadmin.users.filters.partners',
          component: MultiCustomerPartnerFilter,
          isHidden: () => {
            if (!this.userIsPartner && this.isCockpitClick) {
              return false;
            }
            // change here
            // return this.isFrozen;
          },
          onChange(chosenValue, clearFilter) {
            if (!chosenValue) clearFilter('filters.offers');
            return {
              id: 'getadmin.users.filters.partners',
              value: chosenValue ? chosenValue.label : '',
              data: chosenValue,
            };
          },
          onRemove(clearFilter) {
            clearFilter('filters.offers');
          },
        },
        offers: {
          title: 'filters.offers',
          component: OfferFilter,
          isHidden: () => {
            if (this.isCockpitClick) {
              return false;
            }
            // change here
            // return this.isFrozen;
          },
          onChange(chosenValue) {
            return {
              id: 'filters.offers',
              value: chosenValue ? chosenValue.label : '',
              data: chosenValue,
            };
          },
        },
      },
    };
  },

  watch: {
    cockpitMarkerToDetail(value) {
      if (value) {
        // TODO: mettre en place la condition quand on vient de l'événement du bouton Graphe monde
        // if (value.world && !value.type) {
        //   this.currentTab = 'graphs';
        // }
        if (value.type === 'ALERT') {
          this.currentTab = 'alerts';
        } else {
          this.currentTab = 'graphs';
        }
        this.refreshCockpitFilters();
      }
    },
    currentUsage(value) {
      this.appliedFilters = undefined;
      this.currentUsagePrevFilters = undefined;
      this.refreshLinesFn = undefined;
      this.indicatorTotal = undefined;
      this.canShowIndicators = true;
      this.cockpitMarkerToDetail = undefined;
      this.isFrozen = false;
      this.frozenValues = [];
      this.currentFilters = [];
      this.currentTab = 'graphs';

      if (value === 'COCKPIT') {
        this.currentTab = 'alerts';
        this.refreshCockpitFilters();
        this.setupDefaultValues();
      } else {
        this.filters = this.getUsageFilters();
        this.setupDefaultValues();
      }
    },
  },

  mounted() {
    this.filters = this.getUsageFilters();

    const toggleValues = [];

    if (this.havePermission('getVision', 'read')) {
      toggleValues.push(
        {
          id: 'ALL',
          label: 'getvsion.allUsages',
          default: this.value === 'ALL',
        },
        {
          id: 'DATA',
          label: 'getvsion.dataUsage',
          default: this.value === 'DATA',
        }
      );
    }

    if (
      this.havePermission('getVision', 'service_state') ||
      this.havePermission('getVision', 'service_state_roaming')
    ) {
      toggleValues.push({
        id: 'COCKPIT',
        label: 'getvsion.m2mCockpit',
        default: this.value === 'COCKPIT',
      });
    }
    if (this.havePermission('getVision', 'alarm')) {
      toggleValues.push({
        id: 'ALARMS',
        label: 'getvsion.alarms',
        default: this.value === 'ALARMS',
      });
    }

    this.toggleValues = toggleValues;
  },

  methods: {
    // Permet de mémoriser les valeurs des filtres modifiées
    // afin de les propager sur les autres onglets
    setupDefaultValues() {
      this.defaultValues = this.allUsagesPreviousFilters.filter((f) => {
        return !!this.filters.find((ff) => ff.title === f.id);
      });
      // On mémorise le filtre à fixer en cas de changement d'usage et d'onglet Graphiques/alertes
      // On doit ignorer les valeurs fixées des filtres non communs aux écrans
      let excludedIds = [{ id: 'status' }, { id: 'types' }, { id: 'col.label' }];
      // Ne pas intégrer la valeur du filtre pays pour le graphe monde uniquement
      if (this.cockpitMarkerToDetail && this.cockpitMarkerToDetail.world) {
        excludedIds.push({ id: 'filters.country' });
      }
      this.frozenValues = differencewith(this.defaultValues, excludedIds, (a, b) => a.id === b.id);
      // On doit aussi ignorer les valeurs par défaut issues des filtres non communs aux écrans
      this.defaultValues = differencewith(this.frozenValues, excludedIds, (a, b) => a.id === b.id);
    },

    showWorldM2MGraphs() {
      this.cockpitMarkerToDetail = { world: true, type: undefined };
      this.refreshCockpitFilters();

      // timer pour se caler juste après le delay de la fonction freezeFilterSelection
      setTimeout(() => {
        this.freezeFilterSelection({ world: true });
      });

      this.doSearch([...this.appliedFilters]);

      this.setupDefaultValues();
    },

    onTabChange(tab) {
      this.currentTab = tab.label;
      this.filters = undefined;
      setTimeout(() => {
        this.refreshCockpitFilters();
        this.setupDefaultValues();
      });
    },

    refreshCockpitFilters() {
      this.filters = this.getCockpitFilters();
    },

    onUsageChange(usage) {
      this.updateCurrentUsage(usage.id);
      this.alwaysShowButton = true;
    },
    updateCurrentUsage(id) {
      this.currentUsage = id;
    },

    async preselectCountry(payload) {
      const { marker } = payload;

      if (typeof marker.data.locationCode === 'string') {
        const foundCountry = await fetchDeliveryCountries(this.$i18n.locale, {
          codeIso3: { eq: marker.data.locationCode },
        });

        if (foundCountry && foundCountry.length) {
          const filterEntry = {
            id: 'filters.country',
            value: foundCountry[0].name,
            data: foundCountry[0],
          };

          return filterEntry;
        }
      }
    },

    async freezeFilterSelection(payload) {
      this.isFrozen = true;

      let countryFilter;
      // Filtre pays non disponible pour Graphe monde donc on détecte si on vient de Graphe monde {world: true} ou pas
      if (!payload.world) {
        countryFilter = await this.preselectCountry(payload);
      }
      let frozenValues;
      if (!this.frozenValues.length) {
        frozenValues = cloneDeep(this.currentFilters);
      } else {
        frozenValues = this.frozenValues;
      }

      if (countryFilter) {
        frozenValues = frozenValues.filter((f) => f.id !== 'filters.country');

        frozenValues.push(countryFilter);
      }

      // On mémorise le filtre à fixer en cas de changement d'usage et d'onglet Graphiques/alertes
      // On doit ignorer les filtres non communs aux écrans
      this.frozenValues = frozenValues;

      const oldFilters = this.filters;

      this.filters = undefined;

      await delay(20);

      this.filters = oldFilters;
      return this.filters;
    },

    doSearch(appliedFilters) {
      this.appliedFilters = cloneDeep(appliedFilters);

      this.manageDeletionFromAppliedFilters();
      this.currentUsagePrevFilters = this.appliedFilters; // utilisé pour détecter le supression de filtre dans le future
      this.savePrevFilterValues();

      this.canShowIndicators = true;
    },
    manageDeletionFromAppliedFilters() {
      if (!this.currentUsagePrevFilters) return;
      if (!this.allUsagesPreviousFilters) return;

      for (const prevFilter of this.currentUsagePrevFilters) {
        const corresponding = this.appliedFilters.find((f) => f.id === prevFilter.id);
        if (!corresponding || !corresponding.data) {
          // was there, but not anymore, so delete it from allIsagePrevFilters
          this.allUsagesPreviousFilters = this.allUsagesPreviousFilters.filter(
            (f) => f.id !== prevFilter.id
          );
        }
      }
    },
    savePrevFilterValues() {
      let allUsagesPreviousFilters = this.allUsagesPreviousFilters || [];

      for (const appliedFilter of this.appliedFilters) {
        // gerer la suppression
        const correspondingInAllUsageIndex = this.allUsagesPreviousFilters.findIndex(
          (f) => f.id === appliedFilter.id
        );
        if (correspondingInAllUsageIndex > -1) {
          this.allUsagesPreviousFilters[correspondingInAllUsageIndex] = appliedFilter;
        } else {
          allUsagesPreviousFilters.push(appliedFilter);
        }
      }
      this.allUsagesPreviousFilters = allUsagesPreviousFilters;
    },

    onCurrentChange(currentFilters) {
      this.currentFilters = cloneDeep(currentFilters);
    },

    getCockpitFilters() {
      const currentVisibleFilters = [];
      if (this.havePermission('getVision', 'filter_domain')) {
        currentVisibleFilters.push(this.commonFilters.partnerGroup);
      }

      if (!this.userIsPartner) {
        currentVisibleFilters.push(this.commonFilters.partners);
      }

      currentVisibleFilters.push(this.commonFilters.offers);
      // Attention, on ne doit pas afficher le filtre pays pour le graphe monde
      currentVisibleFilters.push({
        title: 'filters.country',
        component: CountryFilter,
        isHidden: () => {
          return this.isFrozen;
        },
        onChange(chosenValue) {
          let country = chosenValue ? chosenValue.label : undefined;
          if (!country) {
            country = '';
          }
          return {
            id: 'filters.country',
            value: country,
            data: chosenValue,
          };
        },
      });

      // Filtres pour sous-onglets Graphiques et Aertes
      if (this.cockpitMarkerToDetail) {
        if (this.currentTab === 'alerts') {
          const createComboFilter = (name, component) => {
            currentVisibleFilters.push({
              title: name,
              component,
              onChange(chosen) {
                if (!chosen || !chosen.value) {
                  return {
                    id: name,
                    value: '', // pour supprimer ce choix des filtres séléctionnés
                  };
                } else {
                  return {
                    id: name,
                    value: chosen.label,
                    data: chosen,
                  };
                }
              },
            });
          };
          createComboFilter('status', StatusesFilter);
          createComboFilter('types', TypesFilter);
          createComboFilter('col.label', LabelFilter);
          currentVisibleFilters.push({
            title: 'common.period',
            component: DateRangeFilter,
            onChange(chosen) {
              return {
                id: 'common.period',
                startDate: chosen.startDate,
                endDate: chosen.endDate,
                data: chosen,
              };
            },
          });
        } else {
          // Ce cas est nécessaire, lorsque nous provenons de la route créée par le bouton Graphe Monde
          // il nous faut ajouter ce filtre pour l'afficher et le combiner avec les filtres Partenaire et Offre
          currentVisibleFilters.push({
            title: 'common.period',
            component: DateRangeFilter,
            onChange(chosen) {
              return {
                id: 'common.period',
                startDate: chosen.startDate,
                endDate: chosen.endDate,
                data: chosen,
              };
            },
          });
        }

        if (
          this.appliedFilters &&
          this.appliedFilters.length &&
          !this.appliedFilters.find((f) => f.id === 'getadmin.users.filters.partners')
        ) {
          const partnerFilter = currentVisibleFilters.find(
            (c) => c.title === 'getadmin.users.filters.partners'
          );
          if (partnerFilter) {
            partnerFilter.isHidden = false;
          }
        }
      }

      return currentVisibleFilters;
    },

    getUsageFilters() {
      const currentVisibleFilters = [
        {
          title: 'getvsion.monitoring.filterByFile',
          component: FileFilter,
          onChange(chosenValue) {
            return {
              id: 'getvsion.monitoring.filterByFile',
              value: chosenValue.file.name,
              data: chosenValue,
            };
          },
        },
      ];
      if (this.havePermission('getVision', 'filter_domain')) {
        currentVisibleFilters.push(this.commonFilters.partnerGroup);
      }

      // if (this.userIsBO || this.userIsGroupAccount || this.userPartyGroup) {
      if (!this.userIsPartner) {
        currentVisibleFilters.push(this.commonFilters.partners);
      } else {
        this.defaultValues = [
          {
            id: 'getadmin.users.filters.partners',
            value: this.singlePartner ? this.singlePartner.name : '',
            data: this.singlePartner,
            hidden: true,
          },
        ];
      }

      currentVisibleFilters.push(this.commonFilters.offers);

      currentVisibleFilters.push(
        {
          title: 'filters.zone',
          component: LocalisationFilter,
          onChange(chosenValue) {
            const zone = chosenValue.zone.label;
            const country = chosenValue.country ? chosenValue.country.label : undefined;
            const zipCode = chosenValue.zipCode ? chosenValue.zipCode : undefined;

            const labels = [{ id: zone, label: `Zone: ${zone}` }];
            if (country) labels.push({ id: country, label: `Pays: ${country}` });
            if (zipCode) labels.push({ id: zipCode, label: `Code postal: ${zipCode}` });
            return {
              id: 'filters.zone',
              values: labels,
              data: chosenValue,
            };
          },
        },
        {
          title: 'common.identifier',
          component: IdentifierFilter,
          onChange(chosenValue) {
            const labels = [];

            if (chosenValue.imei) {
              labels.push({
                id: 'getparc.actDetail.col.imei',
                label: `IMEI : ${chosenValue.imei}`,
              });
            }
            if (chosenValue.msisdn) {
              labels.push({
                id: 'getparc.actDetail.col.msisdn',
                label: `MSISDN : ${chosenValue.msisdn}`,
              });
            }

            return {
              id: 'common.identifier',
              data: chosenValue,
              values: labels,
            };
          },
        }
      );

      return currentVisibleFilters;
    },

    onIndicatorClick(payload) {
      const { indicator, total } = payload;
      const usageType = this.currentUsage;
      const counter = indicator.counter;
      this.indicatorTotal = total;

      this.refreshLinesFn = undefined;
      this.filtersForExport = undefined;

      let partyId = undefined,
        tempDataUuid = undefined;

      let filters = {
        counter,
        usageType,
      };
      const formattedAppliedFilters = filterFormatter(this.appliedFilters || []);
      if (formattedAppliedFilters && formattedAppliedFilters.partyId) {
        partyId = formattedAppliedFilters.partyId;
        filters = { ...filters, partyId };
      }
      if (formattedAppliedFilters && formattedAppliedFilters.tempDataUuid) {
        tempDataUuid = formattedAppliedFilters.tempDataUuid;
        filters = { ...filters, tempDataUuid };
      }
      this.filtersForExport = { ...filters };

      setTimeout(() => {
        this.refreshLinesFn = async (pagination, sorting) => {
          const items = await fetchLinesForCounter(this.filtersForExport, pagination, sorting);
          if (items && items.errors) {
            return { errors: items.errors };
          }
          return {
            items,
          };
        };
      });
    },

    onActiveClick(payload) {
      this.onMarkerClick(payload, 'ACTIVE');
      this.indicatorTotal = payload.marker.activeCount;
      this.alwaysShowButton = false;
      this.defaultValues = [...this.frozenValues];
      this.frozenValues = [];
    },

    onPassiveClick(payload) {
      this.onMarkerClick(payload, 'PASSIVE');
      this.indicatorTotal = payload.marker.passiveCount;
      this.alwaysShowButton = false;
      this.defaultValues = [...this.frozenValues];
      this.frozenValues = [];
    },

    getFiltersForExport(clickedMarkerData, activityType) {
      const { marker, locationType } = clickedMarkerData;
      const formattedAppliedFilters = filterFormatter(this.appliedFilters || []);

      const filters = {
        usageType: this.currentUsage,
        activityType,
        ...formattedAppliedFilters,
      };

      filters.locationCodes = [marker.data.locationCode];
      return { ...filters, locationType };
    },

    onMarkerClick(payload, activityType) {
      this.filtersForExport = this.getFiltersForExport(payload, activityType);

      this.refreshLinesFn = async (pagination, sorting) => {
        this.filtersForExport = this.getFiltersForExport(payload, activityType);
        const filtersForapi = { ...this.filtersForExport };
        delete filtersForapi.locationType;

        let locationType = this.filtersForExport.locationType;

        if (this.lastCenteredCountry === 'US') {
          filtersForapi.iso3CountryCode = 'USA';
        }

        return fetchLinesForMarker(locationType, filtersForapi, pagination, sorting);
      };
    },

    gotoUsageMap() {
      this.refreshLinesFn = undefined;
      this.isFrozen = false;
      this.frozenValues = [];
      this.alwaysShowButton = true;
    },

    onCockpitClick(payload) {
      this.cockpitMarkerToDetail = payload;
      this.isCockpitClick = true;
      this.freezeFilterSelection(payload);
      this.defaultValues = [...this.frozenValues];
      this.frozenValues = [];
    },

    gotoCockpitMap() {
      this.isFrozen = false;
      this.defaultValues = [...this.frozenValues];
      this.frozenValues = [];
      this.cockpitMarkerToDetail = undefined;

      // on réinitialise les filtres...
      this.filters = undefined;
      // ...avant de leur réaffecter des valeurs
      setTimeout(() => {
        this.refreshCockpitFilters();
      });
      // ... on met un timer pour être sûr que filters ait eu le temps d'avoir les valeurs
      setTimeout(() => {
        this.setupDefaultValues();
      }, 50);
    },
  },
};

export function filterFormatter(appliedFilters) {
  if (!appliedFilters) return {};

  return appliedFilters.reduce((filters, item) => {
    try {
      if (item.id === 'getadmin.users.filters.partners' && item.data) {
        filters.partyId = item.data.id;
      }

      if (item.id === 'getvsion.monitoring.filterByFile' && item.data) {
        filters.tempDataUuid = item.data.tempDataUuid;
      }

      if (item.id === 'filters.offers' && item.data) {
        filters.offerCode = item.data.id;
      }

      if (item.id === 'getadmin.users.filters.partnerGroup' && item.data) {
        filters.partiesDomain = item.data.value;
      }

      if (item.id === 'common.identifier' && item.data) {
        if (item.data.imei) {
          filters.imei = '' + item.data.imei;
        }

        if (item.data.msisdn) {
          filters.msisdn = '' + item.data.msisdn;
        }
      }

      if (item.id === 'filters.zone' && item.data) {
        if (item.data.zone.value === 'world') {
          if (item.data.country) {
            filters.iso3CountryCode = item.data.country.codeIso3;
          }
        } else {
          if (item.data.zipCode) {
            filters.zipCode = item.data.zipCode;
            filters.iso3CountryCode = 'FRA';
          }
        }
      }
    } catch (e) {
      console.error(e);
    }
    return filters;
  }, {});
}
</script>

<style lang="scss" scoped></style>
