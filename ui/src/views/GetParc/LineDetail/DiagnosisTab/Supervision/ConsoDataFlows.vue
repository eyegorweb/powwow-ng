<template>
  <ContentBlock :key="'block1'">
    <template v-if="flowTypesTabs && flowTypesTabs.length > 1" slot="afterTitle">
      <UiTabs :tabs="flowTypesTabs">
        <template slot-scope="{ tab }">
          <UiTab v-if="tab" :is-selected="tab.id === currentFlowType" class="tab-grow">
            <a href="#" @click.prevent="() => (currentFlowType = tab.id)">
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
      <TableGraphicContentBlock starting="graph" :hide-toggles="false">
        <div class="mt-2" slot="graph">
          <template v-if="currentFlowType === 0">
            <keep-alive>
              <DataGraph :sim-id="content.id" @haveContent="canExportData = false" />
            </keep-alive>
          </template>
          <template v-else-if="dataUsageStreams && dataUsageStreams.length">
            <AllStreamsGraph
              v-if="currentFlowType === -1"
              :all-data-usage-streams="dataUsageStreams"
            />
            <template v-else>
              <SingleStreamGraph
                :key="'currentFlowType_' + currentFlowType"
                :data-usage-stream="
                  dataUsageStreams.filter((e) => e.streamId == currentFlowType)[0]
                    .splitPDPConnectionHistories
                "
              />
            </template>
          </template>
        </div>
        <div slot="table" class="mt-3">
          <template v-if="currentFlowType === 0">
            <SimDataTable :simcard="content" @haveContent="canExportData = true" />
          </template>
          <template v-else-if="renderComponent">
            <SimSplittedDataTable
              :simcard="content"
              :stream-id="currentFlowType === -1 ? null : currentFlowType"
              @currentFlowTypeChanged="forceRerender()"
            />
          </template>
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
import SimSplittedDataTable from './SimSplittedDataTable.vue';

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
    SimSplittedDataTable,
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
      renderComponent: true,
    };
  },

  async mounted() {
    await this.refreshDatausageStreams();
    this.initFlowTypesToggle();
  },

  methods: {
    forceRerender() {
      // Remove my-component from the DOM
      this.renderComponent = false;

      this.$nextTick(() => {
        // Add the component back in
        this.renderComponent = true;
      });
    },
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
          id: 0,
          label: 'classic',
          title: 'Classique',
          default: true,
        },
      ];

      if (this.dataUsageStreams && this.dataUsageStreams.length) {
        flowTypes.push({
          id: -1,
          label: 'detailed',
          title: 'Détaillé',
        });
        this.dataUsageStreams.forEach((d) => {
          flowTypes.push({
            id: d.streamId,
            label: d.stream,
            title: d.stream,
          });
        });
      }

      this.flowTypesTabs = flowTypes;
    },
  },
};
</script>

<style lang="scss" scoped>
.tab-grow {
  flex-grow: 1;
}

.tab-label {
  &:not(.is-selected) {
    background: $medium-gray;
  }
  margin-left: 1px;
  margin-right: 1px;
}
</style>
