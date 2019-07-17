<template>
  <div>
    <draggable handle=".handle">
      <transition-group>
        <ContentBlock :key="'block1'">
          <template slot="title">
            {{ $t('getparc.lineDetail.tabServices.optionalServices') }}
          </template>
          <template slot="content">
            Contenu ici
          </template>
        </ContentBlock>
        <ContentBlock :key="'block2'">
          <template slot="title">
            {{ $t('getparc.lineDetail.tabServices.services') }}
          </template>
          <template slot="content">
            <ServicesBlock :content="content" />
          </template>
        </ContentBlock>
        <ContentBlock :key="'block3'">
          <template slot="title">
            {{ $t('getparc.lineDetail.tabServices.ipAdress') }}
          </template>
          <template slot="content">
            Contenu ici
          </template>
        </ContentBlock>
      </transition-group>
    </draggable>
  </div>
</template>

<script>
import ContentBlock from '@/views/GetParc/LineDetail/ContentBlock';
import draggable from 'vuedraggable';
import ServicesBlock from './ServicesBlock';

export default {
  components: {
    draggable,
    ContentBlock,
    ServicesBlock,
  },
  props: {
    content: Object,
  },
};
</script>

<style lang="scss" scoped></style>
