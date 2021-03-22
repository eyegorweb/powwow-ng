<template>
  <ContentBlock :key="'block1'">
    <template v-if="flowTypesTabs && flowTypesTabs.length > 1" slot="afterTitle">
      <UiTabs :tabs="flowTypesTabs">
        <template slot-scope="{ tab, index }">
          <UiTab v-if="tab" :is-selected="index === currentFlowType" class="tab-grow">
            <a href="#" @click.prevent="() => (currentFlowType = index)">
              {{ tab.title }}
            </a>
          </UiTab>
        </template>
      </UiTabs>
    </template>
    <template slot="title">{{
      $t('getparc.lineDetail.tab2.supervisionContent.dataConsumptionPerDay')
    }}</template>
    <template v-if="canExportData" slot="topRight">
      <ExportButton :export-fn="getDataExportFn()">
        <span slot="title">{{
          $t('getparc.lineDetail.tab2.supervisionContent.exportDataConsumption')
        }}</span>
      </ExportButton>
    </template>
    <template slot="content">
      <TableGraphicContentBlock starting="graph" :hide-toggles="currentFlowType !== 0">
        <div class="mt-2" slot="graph">
          <template v-if="currentFlowType === 0">
            <keep-alive>
              <DataGraph :sim-id="content.id" @haveContent="canExportData = false" />
            </keep-alive>
          </template>
          <template v-else-if="dataUsageStreams && dataUsageStreams.length">
            <AllStreamsGraph
              v-if="currentFlowType === 1"
              :all-data-usage-streams="dataUsageStreams"
            />
            <template v-else>
              <SingleStreamGraph
                :key="'stream_' + dataUsageStreams[currentFlowType - 2].usageType"
                :data-usage-stream="
                  dataUsageStreams[currentFlowType - 2].splitPDPConnectionHistories
                "
              />
            </template>
          </template>
        </div>
        <div slot="table" class="mt-3">
          <keep-alive>
            <SimDataTable :simcard="content" @haveContent="canExportData = true" />
          </keep-alive>
        </div>
      </TableGraphicContentBlock>
    </template>
  </ContentBlock>
</template>

<script>
import ContentBlock from '@/views/GetParc/LineDetail/ContentBlock';
import UiTabs from '@/components/ui/Tabs';
import UiTab from '@/components/ui/Tab';
import ExportButton from '@/components/ExportButton';
import TableGraphicContentBlock from '@/components/TableGraphicContentBlock';
import SimDataTable from './SimDataTable';
import DataGraph from './DataGraph';
import { exportDataHistory, splitDataConsumptionGraph } from '@/api/consumption';

import AllStreamsGraph from './streamGraphs/AllStreamsGraph.vue';
import SingleStreamGraph from './streamGraphs/SingleStreamGraph.vue';

export default {
  components: {
    ContentBlock,
    UiTabs,
    UiTab,
    ExportButton,
    TableGraphicContentBlock,
    SimDataTable,
    DataGraph,

    AllStreamsGraph,
    SingleStreamGraph,
  },

  props: {
    content: Object,
  },
  data() {
    return {
      currentFlowType: 0,
      flowTypesTabs: undefined,
      canExportData: false,

      dataUsageStreams: undefined,
    };
  },

  async mounted() {
    await this.refreshDatausageStreams();
    this.initFlowTypesToggle();
  },

  methods: {
    async refreshDatausageStreams() {
      this.dataUsageStreams = await splitDataConsumptionGraph(this.content.id);
    },
    getDataExportFn() {
      return async (columns, orderBy, exportFormat) => {
        return await exportDataHistory(this.content.id, exportFormat);
      };
    },
    initFlowTypesToggle() {
      const flowTypes = [
        {
          label: 'classic',
          title: 'Classique',
          default: true,
        },
      ];

      if (this.dataUsageStreams && this.dataUsageStreams.length) {
        flowTypes.push({
          label: 'detailed',
          title: 'Détaillé',
        });
        this.dataUsageStreams.forEach((d) => {
          flowTypes.push({
            label: d.usageType,
            title: d.usageType,
          });
        });
      }

      this.flowTypesTabs = flowTypes;
    },
  },
};
</script>

<style lang="scss" scoped></style>
