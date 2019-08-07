<template>
  <div>
    <draggable handle=".handle">
      <transition-group>
        <ContentBlock :key="'block1'">
          <template slot="title">
            {{ $t('getparc.lineDetail.tabServices.optionalServices') }}
          </template>
          <template slot="content">
            <div>contenu ici</div>
          </template>
        </ContentBlock>
        <ContentBlock :key="'block2'">
          <template slot="title">{{ $t('getparc.lineDetail.tabServices.services') }}</template>
          <template slot="content">
            <ServicesBlock :content="content" />
          </template>
        </ContentBlock>
        <ContentBlock :key="'block3'">
          <template slot="title">{{ $t('getparc.lineDetail.tabServices.ipAdress') }}</template>
          <template slot="content">
            <div>contenu ici</div>
          </template>
        </ContentBlock>
      </transition-group>
    </draggable>
  </div>
</template>

<script>
import ContentBlock from '@/views/GetParc/LineDetail/ContentBlock';
import draggable from 'vuedraggable';
import ServicesBlock from './ServicesBlock';

export default {
  components: {
    draggable,
    ContentBlock,
    ServicesBlock,
  },
  props: {
    content: Object,
  },
  data() {
    return {
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

<style lang="scss" scoped></style>
