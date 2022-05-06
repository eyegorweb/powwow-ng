<template>
    <div>
          <FoldableBlock
            v-if="!userIsPartner && keyName === 'el1'"
            :title="$t('filters.partners')"
            :key="'el1'"
            draggable
          >
            <ActHistoryPartnersFilter />
          </FoldableBlock>
          <FoldableBlock :title="$t('filters.userCreator')" :key="'el2'" draggable v-if="keyName === 'el2'">
            <OrderCreatorFilter
              :selected-partners-values="selectedPartnersValues"
              :selected-order-creator-values="selectedOrderCreatorValues"
              @setOrderCreatorFilter="setOrderCreatorFilter"
            />
          </FoldableBlock>
          <FoldableBlock :title="$t('filters.actTypes')" :key="'el3'" draggable v-if="keyName === 'el3'">
            <ManagementActTypesFilter />
          </FoldableBlock>
          <FoldableBlock :title="$t('filters.actDateCreation')" :key="'el4'" draggable v-if="keyName === 'el4'">
            <DateCreation />
          </FoldableBlock>
          <FoldableBlock :title="$t('filters.actDateStart')" :key="'el5'" draggable v-if="keyName === 'el5'">
            <DateStart />
          </FoldableBlock>
          <FoldableBlock :title="$t('filters.actDateEnd')" :key="'el6'" draggable v-if="keyName === 'el6'">
            <DateEnd />
          </FoldableBlock>
          <FoldableBlock v-if="!userIsMVNO && keyName === 'el7'" :title="$t('filters.services')" :key="'el7'" draggable >
            <ManagementActionServices />
          </FoldableBlock>
          <FoldableBlock :title="$t('filters.actStatus')" :key="'el8'" draggable v-if="keyName === 'el8'">
            <ManagementActStatusFilter />
          </FoldableBlock>
          <FoldableBlock :title="$t('filters.lines.error')" :key="'el9'" draggable v-if="keyName === 'el9'">
            <ActLinesErrorFilter />
          </FoldableBlock>
    </div>
</template>

<script>
import FoldableBlock from '@/components/FoldableBlock'; 
import { mapGetters, mapMutations, mapActions } from 'vuex';
import ActHistoryPartnersFilter from './ActHistoryPartnersFilter';
import ManagementActTypesFilter from './ManagementActTypesFilter';
import ManagementActStatusFilter from './ManagementActStatusFilter';
import ManagementActionServices from './ManagementActionServices';
import ActLinesErrorFilter from './ActLinesErrorFilter';
import OrderCreatorFilter from '@/components/Filters/OrderCreatorFilter';
import DateCreation from './DateCreation';
import DateStart from './DateStart';
import DateEnd from './DateEnd';

export default {
  components: {
    FoldableBlock,
    ActHistoryPartnersFilter,
    OrderCreatorFilter,
    ManagementActTypesFilter,
    DateCreation,
    DateStart,
    DateEnd,
    ManagementActStatusFilter,
    ManagementActionServices,
    ActLinesErrorFilter,
  },

  props: {
    keyName: {
      type: String,
      default: undefined,
    },
  },

  computed: {      
    ...mapGetters(['userIsPartner', 'userIsMVNO']),
        ...mapGetters('actHistory', [
      'canShowSelectedFilter',
      'selectedPartnersValues',
      'selectedOrderCreatorValues',
    ]),
  },

  methods: {      
    ...mapMutations('actHistory', ['setOrderCreatorFilter', 'selectErrorFilter']),
  },
}
</script>