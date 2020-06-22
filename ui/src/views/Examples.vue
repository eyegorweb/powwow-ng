<template>
  <div class="home">
    <div class="mb-4">
      <SearchTranslationKey />

      <button
        class="btn btn-warning"
        @click="
          () => startDownload('http://localhost:8080/api/files/2_orders_4149662630723304519.csv')
        "
      >
        Download URI
      </button>

      <button class="btn btn-primary" @click="freezeFilterSelection">Freeze</button>

      <FilterBar
        v-if="filters"
        :filter-components="filters"
        always-show-button
        :disabled="!canFilter"
        :default-values="defaultValues"
        :frozen-values="fronzenValues"
        @currentFiltersChange="onCurrentChange"
      />
    </div>
  </div>
</template>

<script>
// Composant sandbox, ne pas faire de review, c'est du jetable :)

import SearchTranslationKey from '@/components/utils/SearchTranslationKey';
import FilterBar from '@/components/Filters/TableWithFilter/FilterBar.vue';
import MultiCustomerPartnerFilter from '@/views/GetVision/monitoring/filters/MultiCustomerPartnerFilter.vue';
import OfferFilter from '@/views/GetVision/monitoring/filters/OfferFilter';

import { mapMutations } from 'vuex';
import cloneDeep from 'lodash.clonedeep';

export default {
  name: 'Home',
  components: {
    SearchTranslationKey,
    FilterBar,
  },
  mounted() {},
  data() {
    return {
      fronzenValues: [],
      currentFilters: [],
      filters: [
        {
          title: 'getadmin.users.filters.partners',
          component: MultiCustomerPartnerFilter,
          isHidden: () => {
            return !!this.fronzenValues.find(v => v.id === 'getadmin.users.filters.partners');
          },
          onChange(chosenValue, clearFilter) {
            clearFilter('filters.offers');
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
        {
          title: 'filters.offers',
          component: OfferFilter,
          isHidden: () => {
            return !!this.fronzenValues.find(v => v.id === 'filters.offers');
          },
          onChange(chosenValue) {
            return {
              id: 'filters.offers',
              value: chosenValue ? chosenValue.label : '',
              data: chosenValue,
            };
          },
        },
      ],
      canFilter: true,
      defaultValues: [
        {
          id: 'getadmin.users.filters.partners',
          value: 'A_MULTIPLE 1',
          data: {
            id: 101,
            label: 'A_MULTIPLE 1',
            data: {
              id: 101,
              code: 'A_MULTIPLE',
              name: 'A_MULTIPLE 1',
              orderNumberRequired: false,
              shortCodes: null,
              partyType: 'MULTI_CUSTOMER',
              flagMsisdnA: false,
              optionViewCellId: null,
            },
            highlighted: 'A_MULTIPLE 1',
          },
        },
        {
          id: 'filters.offers',
          value: 'TEST_PALIER_EU',
          data: {
            key: '08f8e230-afc8-11ea-8df4-c3c3823a05e6',
            id: 'TEST_PALIER_EU',
            label: 'TEST_PALIER_EU',
            meta: {
              id: 61,
              code: 'TEST_PALIER_EU',
              name: 'TEST_PALIER_EU',
              workflowDescription: 'TEST_PALIER_EU',
              rCard: true,
              initialOffer: {
                id: 183,
                code: 'TEST_PALIER_EU',
                description: 'TEST PALIER EU',
                marketingServices: [
                  {
                    labelService: 'Voix entrante',
                    code: 'INCOMING_VOICE',
                    activated: true,
                    editable: false,
                    optional: false,
                    parameters: [null],
                  },
                  {
                    labelService: 'Voix sortante',
                    code: 'OUTGOING_VOICE',
                    activated: true,
                    editable: false,
                    optional: false,
                    parameters: [null],
                  },
                  {
                    labelService: 'SMS entrant',
                    code: 'INCOMING_SMS',
                    activated: true,
                    editable: false,
                    optional: false,
                    parameters: [null],
                  },
                  {
                    labelService: 'SMS sortant',
                    code: 'OUTGOING_SMS',
                    activated: true,
                    editable: false,
                    optional: false,
                    parameters: [null],
                  },
                  {
                    labelService: 'Numéro data csd',
                    code: 'DATA_CSD_NUMBER',
                    activated: false,
                    editable: false,
                    optional: false,
                    parameters: [null],
                  },
                  {
                    labelService: 'Data csd entrante',
                    code: 'INCOMING_DATA_CSD',
                    activated: true,
                    editable: false,
                    optional: false,
                    parameters: [null],
                  },
                  {
                    labelService: 'Roaming',
                    code: 'ROAMING',
                    activated: true,
                    editable: false,
                    optional: false,
                    parameters: [null],
                  },
                  {
                    labelService: 'Data csd sortante',
                    code: 'OUTGOING_DATA_CSD',
                    activated: true,
                    editable: false,
                    optional: false,
                    parameters: [null],
                  },
                  {
                    labelService: 'Data',
                    code: 'DATA',
                    activated: false,
                    editable: false,
                    optional: false,
                    parameters: [
                      {
                        activated: false,
                        name: 'testrnis1.fr',
                        code: 'APN_BARRING',
                        editable: false,
                      },
                    ],
                  },
                ],
              },
            },
            highlighted: 'TEST_PALIER_EU',
          },
        },
      ],
    };
  },
  methods: {
    ...mapMutations(['openPanel', 'startDownload']),

    openDemoPanel() {
      this.openPanel({
        title: this.$t('getadmin.partnerDetail.userForm.title'),
        panelId: 'getadmin.partnerDetail.userForm.title',
        backdrop: true,
        width: '40rem',
        ignoreClickAway: true,
      });
    },

    freezeFilterSelection() {
      this.fronzenValues = cloneDeep(this.currentFilters);
    },
    onCurrentChange(currentFilters) {
      this.currentFilters = cloneDeep(currentFilters);
    },
  },
};
</script>
