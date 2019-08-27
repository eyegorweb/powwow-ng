<template>
  <div>
    <draggable handle=".handle">
      <transition-group>
        <ContentBlock :key="'block1'">
          <template slot="title">{{
            $t('getparc.lineDetail.tab2.supervisionContent.dataConsumptionPerDay')
          }}</template>
          <template slot="content">
            <div class="d-flex justify-content-end align-items-center">
              {{ $t('display') }}:
              <Toggle @update="updateContentType" :values="toggleValues" class="pl-2"></Toggle>
            </div>
          </template>
        </ContentBlock>
      </transition-group>
    </draggable>
  </div>
</template>

<script>
import ContentBlock from '@/views/GetParc/LineDetail/ContentBlock';
import draggable from 'vuedraggable';
import Toggle from '@/components/ui/UiToggle2';

export default {
  components: {
    draggable,
    ContentBlock,
    Toggle,
  },
  data() {
    return {
      contentType: 'table',
      toggleValues: [
        {
          id: 'graph',
          label: 'getparc.lineDetail.tab2.lineAnalysisContent.toggle.graph',
        },
        {
          id: 'table',
          label: 'getparc.lineDetail.tab2.lineAnalysisContent.toggle.table',
          default: true,
        },
      ],
    };
  },
  props: {
    content: Object,
  },
  methods: {
    updateContentType(newVal) {
      this.contentType = newVal.id;
    },
  },
};
</script>

<style lang="scss" scoped></style>
