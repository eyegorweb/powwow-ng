<template>
  <div class="row">
    <div class="col-md-8">
      <div class="s-container">
        <div :key="service.name" v-for="service in barringServices" class="service">
          <BarringServiceToggle
            :code="service.code"
            :catalog-offer="offer"
            :instance-offer="{}"
            :label="'services.' + service.name"
            @change="service.checked = $event"
          />
        </div>
      </div>
    </div>
    <div class="col-md-4">
      <DataServiceToggle :catalog-offer="offer" :instance-offer="{}" />
    </div>
  </div>
</template>

<style lang="scss" scoped>
.s-container {
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
}
.service {
  flex-basis: 45%;
  margin-bottom: 1.5rem;
}
</style>

<script>
import BarringServiceToggle from '@/components/Services/BarringServiceToggle';
import DataServiceToggle from '@/components/Services/DataServiceToggle';

export default {
  props: {
    content: Object,
  },

  components: {
    BarringServiceToggle,
    DataServiceToggle,
  },

  data() {
    return {
      barringServices: [
        {
          name: 'VOIX_ENTRANTE',
          code: '2175',
          checked: false,
        },
        {
          name: 'VOIX_SORTANTE',
          code: '2023',
          checked: false,
        },
        {
          name: 'SMS_ENTRANT',
          code: '2171',
          checked: false,
        },
        {
          name: 'SMS_SORTANT',
          code: '2174',
          checked: false,
        },
        {
          name: 'NUMERO_DATA_CSD',
          code: '2188',
          checked: false,
        },
        {
          name: 'DATA_CSD_ENTRANTE',
          code: '2172',
          checked: false,
        },
        {
          name: 'DATA_CSD_SORTANTE',
          code: '2173',
          checked: false,
        },
      ],
      offer: {
        id: '3',
        code: 'OFFRE_TEST',
        workflowDescription: 'Catalog Test',
        initialOffer: {
          id: '116',
          code: 'CATALOG_TEST',
          nonSystemServiceGroupList: [
            {
              id: '23',
              system: false,
              type: 'INCLUSIVE',
              code: 'MVNO_REPONDEUR',
              standardAndSemiGlobalCatalogServiceGroups: [
                {
                  id: '68',
                  activatedByDefault: false,
                  partyAccess: true,
                  catalogService: {
                    code: '1147',
                  },
                  catalogServiceParameters: [],
                },
                {
                  id: '69',
                  activatedByDefault: false,
                  partyAccess: true,
                  catalogService: {
                    code: '1247',
                  },
                  catalogServiceParameters: [],
                },
              ],
            },
            {
              id: '18',
              system: false,
              type: 'EXCLUSIVE',
              code: 'GRP_ROAMING',
              standardAndSemiGlobalCatalogServiceGroups: [
                {
                  id: '53',
                  activatedByDefault: true,
                  partyAccess: true,
                  catalogService: {
                    code: '15',
                  },
                  catalogServiceParameters: [],
                },
                {
                  id: '54',
                  activatedByDefault: false,
                  partyAccess: true,
                  catalogService: {
                    code: '77',
                  },
                  catalogServiceParameters: [],
                },
              ],
            },
            {
              id: '26',
              system: false,
              type: 'INCLUSIVE',
              code: 'SG_TEST_ALL',
              standardAndSemiGlobalCatalogServiceGroups: [
                {
                  id: '82',
                  activatedByDefault: true,
                  partyAccess: false,
                  catalogService: {
                    code: '1290',
                  },
                  catalogServiceParameters: [],
                },
                {
                  id: '84',
                  activatedByDefault: false,
                  partyAccess: true,
                  catalogService: {
                    code: '9004',
                  },
                  catalogServiceParameters: [],
                },
              ],
            },
            {
              id: '24',
              system: false,
              type: 'INCLUSIVE',
              code: 'SG_TEST_INCLUSIVE',
              standardAndSemiGlobalCatalogServiceGroups: [
                {
                  id: '70',
                  activatedByDefault: false,
                  partyAccess: true,
                  catalogService: {
                    code: '2',
                  },
                  catalogServiceParameters: [],
                },
                {
                  id: '71',
                  activatedByDefault: false,
                  partyAccess: false,
                  catalogService: {
                    code: '9',
                  },
                  catalogServiceParameters: [],
                },
                {
                  id: '72',
                  activatedByDefault: true,
                  partyAccess: false,
                  catalogService: {
                    code: '878',
                  },
                  catalogServiceParameters: [
                    {
                      id: '9',
                      setOnActivation: true,
                      defaultValue: 'manaty1.fr',
                      label: 'apn manaty 1',
                      partyAccess: false,
                      serviceParameter: {
                        id: '2',
                        code: 'APN1',
                        name: 'apn manaty 1 old',
                      },
                    },
                    {
                      id: '10',
                      setOnActivation: true,
                      defaultValue: 'manaty2.fr',
                      label: 'apn manaty 2',
                      partyAccess: true,
                      serviceParameter: {
                        id: '3',
                        code: 'APN2',
                        name: 'nocapn lib 2',
                      },
                    },
                    {
                      id: '11',
                      setOnActivation: false,
                      defaultValue: 'manaty3.fr',
                      label: 'apn manaty 3',
                      partyAccess: true,
                      serviceParameter: {
                        id: '4',
                        code: 'APN3',
                        name: 'apn manaty 3',
                      },
                    },
                  ],
                },
                {
                  id: '73',
                  activatedByDefault: true,
                  partyAccess: true,
                  catalogService: {
                    code: '18',
                  },
                  catalogServiceParameters: [],
                },
                {
                  id: '74',
                  activatedByDefault: false,
                  partyAccess: true,
                  catalogService: {
                    code: '107',
                  },
                  catalogServiceParameters: [],
                },
                {
                  id: '75',
                  activatedByDefault: false,
                  partyAccess: false,
                  catalogService: {
                    code: '799',
                  },
                  catalogServiceParameters: [],
                },
                {
                  id: '76',
                  activatedByDefault: true,
                  partyAccess: true,
                  catalogService: {
                    code: '10',
                  },
                  catalogServiceParameters: [],
                },
                {
                  id: '77',
                  activatedByDefault: true,
                  partyAccess: false,
                  catalogService: {
                    code: '1168',
                  },
                  catalogServiceParameters: [],
                },
                {
                  id: '78',
                  activatedByDefault: true,
                  partyAccess: true,
                  catalogService: {
                    code: 'X',
                  },
                  catalogServiceParameters: [],
                },
              ],
            },
          ],
        },
        rCard: false,
        label: 'Catalog Test',
        value: 'OFFRE_TEST',
      },
    };
  },
};
</script>
