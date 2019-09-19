<template>
  <div>
    <draggable handle=".handle">
      <transition-group>
        <ContentBlock :key="'block1'">
          <template slot="title">
            <span class="mock-value">
              {{ $t('getparc.lineDetail.tab2.supervisionContent.dataConsumptionPerDay') }}
            </span>
          </template>
          <template slot="content">
            <TableGraphicContentBlock starting="graph">
              <div class="mt-2" slot="graph">
                <DataGraph />
              </div>
              <div slot="table">
                <DataConsumptionTable></DataConsumptionTable>
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
              <div slot="table">
                <SMSTable :sim-id="content.id" />
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
              <div slot="table">voice table</div>
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
import DataConsumptionTable from './DataConsumptionTable';
import DataGraph from './DataGraph';
import SMSGraph from './SMSGraph';
import VoiceGraph from './VoiceGraph';
import SMSTable from './SMSTable';

export default {
  components: {
    draggable,
    ContentBlock,
    TableGraphicContentBlock,
    DataConsumptionTable,
    DataGraph,
    SMSGraph,
    SMSTable,
    VoiceGraph,
  },

  props: {
    content: Object,
  },
};
</script>

<style lang="scss" scoped></style>
