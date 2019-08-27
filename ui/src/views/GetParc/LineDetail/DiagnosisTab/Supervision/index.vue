<template>
  <div>
    <draggable handle=".handle">
      <transition-group>
        <ContentBlock :key="'block1'">
          <template slot="title">
            {{ $t('getparc.lineDetail.tab2.supervisionContent.dataConsumptionPerDay') }}
          </template>
          <template slot="content">
            <TableGraphicContentBlock>
              <div slot="graph">Graphic here</div>
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

export default {
  components: {
    draggable,
    ContentBlock,
    TableGraphicContentBlock,
  },

  props: {
    content: Object,
  },
};
</script>

<style lang="scss" scoped></style>
