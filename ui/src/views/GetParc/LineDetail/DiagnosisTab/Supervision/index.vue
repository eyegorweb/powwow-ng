<template>
  <div>
    <draggable handle=".handle">
      <transition-group>
        <ConsoDataFlows :content="content" :key="'block1'" />
        <ContentBlock :key="'block0'">
          <template slot="title">{{
            $t('getparc.lineDetail.tab2.supervisionContent.sms')
          }}</template>
          <template v-if="canExportSMS" slot="topRight">
            <ExportButton :export-fn="getSMSExportFn()">
              <span slot="title">{{
                $t('getparc.lineDetail.tab2.supervisionContent.exportSMSConsumption')
              }}</span>
            </ExportButton>
          </template>
          <template slot="content">
            <TableGraphicContentBlock starting="graph">
              <div class="mt-2" slot="graph">
                <keep-alive>
                  <SMSGraph :sim-id="content.id" @haveContent="canExportSMS = false" />
                </keep-alive>
              </div>
              <div slot="table" class="mt-3">
                <keep-alive>
                  <SMSTable :simcard="content" @haveContent="canExportSMS = true" />
                </keep-alive>
              </div>
            </TableGraphicContentBlock>
          </template>
        </ContentBlock>
        <ContentBlock :key="'block3'">
          <template slot="title">{{
            $t('getparc.lineDetail.tab2.supervisionContent.voice')
          }}</template>
          <template v-if="canExportVoice" slot="topRight">
            <ExportButton :export-fn="getVoiceExportFn()">
              <span slot="title">
                {{ $t('getparc.lineDetail.tab2.supervisionContent.exportVoiceConsumption') }}
              </span>
            </ExportButton>
          </template>
          <template slot="content">
            <TableGraphicContentBlock starting="graph">
              <div class="mt-2" slot="graph">
                <keep-alive>
                  <VoiceGraph :sim-id="content.id" @haveContent="canExportVoice = false" />
                </keep-alive>
              </div>
              <div slot="table" class="mt-3">
                <keep-alive>
                  <VoiceTable :simcard="content" @haveContent="canExportVoice = true" />
                </keep-alive>
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
import SMSGraph from './SMSGraph';
import VoiceGraph from './VoiceGraph';
import SMSTable from './SMSTable';
import VoiceTable from './VoiceTable';
import ExportButton from '@/components/ExportButton';

import ConsoDataFlows from './ConsoDataFlows';

import { exportSmsHistory, exportVoiceHistory } from '@/api/consumption';

export default {
  components: {
    ExportButton,
    draggable,
    ContentBlock,
    TableGraphicContentBlock,
    SMSGraph,
    SMSTable,
    VoiceGraph,
    VoiceTable,

    ConsoDataFlows,
  },

  props: {
    content: Object,
  },

  data() {
    return {
      canExportSMS: false,
      canExportVoice: false,
    };
  },

  methods: {
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


<style lang="scss">
.graph-skeleton {
  height: 20rem;
}
</style>
