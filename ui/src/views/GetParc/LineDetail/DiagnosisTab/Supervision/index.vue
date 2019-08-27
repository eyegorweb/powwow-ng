<template>
  <div>
    <draggable handle=".handle">
      <transition-group>
        <ContentBlock :key="'block1'">
          <template slot="title">{{
            $t('getparc.lineDetail.tab2.supervisionContent.dataConsumptionPerDay')
          }}</template>
          <template slot="content">
            <TableGraphicContentBlock starting="graph">
              <div class="mt-2" slot="graph"><DataGraph /></div>
              <div slot="table">Table here</div>
            </TableGraphicContentBlock>
          </template>
        </ContentBlock>
        <ContentBlock :key="'block0'">
          <template slot="title">{{
            $t('getparc.lineDetail.tab2.supervisionContent.sms')
          }}</template>
          <template slot="content">
            <TableGraphicContentBlock starting="graph">
              <div class="mt-2" slot="graph">
                Graph SMS
              </div>
              <div slot="table">Table here</div>
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
import DataGraph from './DataGraph';

export default {
  components: {
    draggable,
    ContentBlock,
    TableGraphicContentBlock,
    DataGraph,
  },

  props: {
    content: Object,
  },
};
</script>

<style lang="scss" scoped></style>
