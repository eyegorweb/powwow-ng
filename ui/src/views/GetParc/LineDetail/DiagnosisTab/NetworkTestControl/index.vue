<template>
  <ContentBlock>
    <template slot="title">{{ $t('getparc.lineDetail.tab3.controlRequestsTitle') }}</template>
    <template slot="content">
      <PaginatedDataTable :columns="columns" :fetch-data-fn="getFetchDataFn()" :size="0" />
    </template>
  </ContentBlock>
</template>

<script>
import ContentBlock from '@/views/GetParc/LineDetail/ContentBlock';

import PaginatedDataTable from '@/components/DataTable/PaginatedDataTable';
import { col } from '@/components/DataTable/utils';
import { consumptionOnDemand } from '@/api/consumption';

import ObservationRangeCol from './ObservationRangeCol';
import RealConsumtionCol from './RealConsumtionCol';
import StatutCol from './StatutCol';
import DataCol from './DataCol';
import SMSCol from './SMSCol';
import VoiceCol from './VoiceCol';

export default {
  components: {
    PaginatedDataTable,
    ContentBlock,
  },
  props: {
    content: Object,
  },
  methods: {
    getFetchDataFn() {
      return async pageInfo => {
        const response = await consumptionOnDemand(this.content.id, pageInfo);
        return {
          rows: response.consumptionsOnDemands.items,
          total: response.consumptionsOnDemands.total,
        };
      };
    },
  },
  data() {
    return {
      columns: [
        col('Période d’observation', 'id', true, false, { component: ObservationRangeCol }),
        col('Consommation réelle', 'id', true, false, { component: RealConsumtionCol }),
        col('Statut', 'id', true, false, { component: StatutCol }),
        col('DATA', 'id', true, false, { component: DataCol }),
        col('SMS', 'id', true, false, { component: SMSCol }),
        col('Voice', 'id', true, false, { component: VoiceCol }),
      ],
    };
  },
};
</script>

<style lang="scss" scoped></style>
