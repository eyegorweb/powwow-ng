<template>
  <div>
    <draggable handle=".handle">
      <transition-group>
        <ContentBlock :key="'block1'">
          <template slot="title">{{
            $t('getparc.lineDetail.tabServices.optionalServices')
          }}</template>
          <template slot="content">
            <div>contenu ici</div>
          </template>
        </ContentBlock>
        <ContentBlock :key="'block2'">
          <template slot="title">{{ $t('getparc.lineDetail.tabServices.services') }}</template>
          <template slot="content"></template>
        </ContentBlock>
        <ContentBlock :key="'block3'">
          <template slot="title">{{ $t('getparc.lineDetail.tabServices.ipAdress') }}</template>
          <template slot="content">
            <div>contenu ici</div>
          </template>
        </ContentBlock>
      </transition-group>
    </draggable>
  </div>
</template>

<script>
import ContentBlock from '@/views/GetParc/LineDetail/ContentBlock';
import draggable from 'vuedraggable';

export default {
  components: {
    draggable,
    ContentBlock,
  },
  props: {
    content: Object,
  },
};
</script>

<style lang="scss" scoped></style>
