<template>
  <div>
    <draggable handle=".handle">
      <transition-group>
        <ContentBlock :key="'block1'">
          <template
            slot="title"
          >{{ $t('getparc.lineDetail.tab2.supervisionContent.dataConsumptionPerDay') }}</template>
          <template v-if="canExportData" slot="topRight">
            <ExportButton :export-fn="getDataExportFn()">
              <span
                slot="title"
              >{{ $t('getparc.lineDetail.tab2.supervisionContent.exportDataConsumption') }}</span>
            </ExportButton>
          </template>
          <template slot="content">
            <TableGraphicContentBlock starting="graph">
              <div class="mt-2" slot="graph">
                <DataGraph :sim-id="content.id" @haveContent="canExportData = false" />
              </div>
              <div slot="table" class="mt-3">
                <SimDataTable :simcard="content" @haveContent="canExportData = true" />
              </div>
            </TableGraphicContentBlock>
          </template>
        </ContentBlock>
        <ContentBlock :key="'block0'">
          <template slot="title">{{ $t('getparc.lineDetail.tab2.supervisionContent.sms') }}</template>
          <template v-if="canExportSMS" slot="topRight">
            <ExportButton :export-fn="getSMSExportFn()">
              <span
                slot="title"
              >{{ $t('getparc.lineDetail.tab2.supervisionContent.exportSMSConsumption') }}</span>
            </ExportButton>
          </template>
          <template slot="content">
            <TableGraphicContentBlock starting="graph">
              <div class="mt-2" slot="graph">
                <SMSGraph :sim-id="content.id" @haveContent="canExportSMS = false" />
              </div>
              <div slot="table" class="mt-3">
                <SMSTable :simcard="content" @haveContent="canExportSMS = true" />
              </div>
            </TableGraphicContentBlock>
          </template>
        </ContentBlock>
        <ContentBlock :key="'block3'">
          <template slot="title">{{ $t('getparc.lineDetail.tab2.supervisionContent.voice') }}</template>
          <template v-if="canExportVoice" slot="topRight">
            <ExportButton :export-fn="getVoiceExportFn()">
              <span slot="title">
                {{
                $t('getparc.lineDetail.tab2.supervisionContent.exportVoiceConsumption')
                }}
              </span>
            </ExportButton>
          </template>
          <template slot="content">
            <TableGraphicContentBlock starting="graph">
              <div class="mt-2" slot="graph">
                <VoiceGraph :sim-id="content.id" @haveContent="canExportVoice = false" />
              </div>
              <div slot="table" class="mt-3">
                <VoiceTable :simcard="content" @haveContent="canExportVoice = true" />
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

import { exportSmsHistory, exportDataHistory, exportVoiceHistory } from '@/api/consumption';

export default {
  components: {
    ExportButton,
    draggable,
    ContentBlock,
    TableGraphicContentBlock,
    SimDataTable,
    DataGraph,
    SMSGraph,
    SMSTable,
    VoiceGraph,
    VoiceTable,
  },

  props: {
    content: Object,
  },

  data() {
    return {
      canExportData: false,
      canExportSMS: false,
      canExportVoice: false,
    };
  },

  methods: {
    getDataExportFn() {
      return async (columns, orderBy, exportFormat) => {
        return await exportDataHistory(this.content.id, exportFormat);
      };
    },
    getSMSExportFn() {
      return async (columns, orderBy, exportFormat) => {
        return await exportSmsHistory(this.content.id, exportFormat);
      };
    },
    getVoiceExportFn() {
      return async (columns, orderBy, exportFormat) => {
        return await exportVoiceHistory(this.content.id, exportFormat);
      };
    },
  },
};
</script>

<style lang="scss" scoped></style>
