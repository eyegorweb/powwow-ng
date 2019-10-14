<template>
  <div>
    <draggable handle=".handle">
      <transition-group>
        <ContentBlock :key="'block1'">
          <template slot="title">
            <span>
              {{ $t('getparc.lineDetail.tab2.supervisionContent.dataConsumptionPerDay') }}
            </span>
          </template>
          <template slot="export">
            <ExportButton :export-fn="getExportFn()">
              <span slot="title">{{ $t('getparc.lineDetail.tab2.supervisionContent.export') }}</span>
            </ExportButton>
          </template>
          <template slot="content">
            <TableGraphicContentBlock starting="graph">
              <div class="mt-2" slot="graph">
                <DataGraph :sim-id="content.id" />
              </div>
              <div slot="table" class="mt-3">
                <SimDataTable :simcard="content" />
              </div>
            </TableGraphicContentBlock>
          </template>
        </ContentBlock>
        <ContentBlock :key="'block0'">
          <template slot="title">
            {{ $t('getparc.lineDetail.tab2.supervisionContent.sms') }}
          </template>
          <template slot="content">
            <TableGraphicContentBlock starting="graph">
              <div class="mt-2" slot="graph">
                <SMSGraph :sim-id="content.id" />
              </div>
              <div slot="table" class="mt-3">
                <SMSTable :simcard="content" />
              </div>
            </TableGraphicContentBlock>
          </template>
        </ContentBlock>
        <ContentBlock :key="'block3'">
          <template slot="title">
            {{ $t('getparc.lineDetail.tab2.supervisionContent.voice') }}
          </template>
          <template slot="content">
            <TableGraphicContentBlock starting="graph">
              <div class="mt-2" slot="graph">
                <VoiceGraph :sim-id="content.id" />
              </div>
              <div slot="table" class="mt-3">
                <VoiceTable :simcard="content" />
              </div>
            </TableGraphicContentBlock>
          </template>
        </ContentBlock>
      </transition-group>
    </draggable>
  </div>
</template>

<script>
import ContentBlock from '@/views/GetParc/LineDetail/ContentBlock';
import TableGraphicContentBlock from '@/components/TableGraphicContentBlock';
import draggable from 'vuedraggable';
import SimDataTable from './SimDataTable';
import DataGraph from './DataGraph';
import SMSGraph from './SMSGraph';
import VoiceGraph from './VoiceGraph';
import SMSTable from './SMSTable';
import VoiceTable from './VoiceTable';
import ExportButton from '@/components/ExportButton';
import { exportDataHistory } from '@/api/consumption';

export default {
  components: {
    draggable,
    ContentBlock,
    TableGraphicContentBlock,
    SimDataTable,
    DataGraph,
    SMSGraph,
    SMSTable,
    VoiceGraph,
    VoiceTable,
    ExportButton,
  },

  props: {
    content: Object,
  },

  methods: {
    getExportFn() {
      return async (columns, orderBy, exportFormat) => {
        return await exportDataHistory(this.content.id, exportFormat);
      };
    },
  },
};
</script>

<style lang="scss" scoped></style>
