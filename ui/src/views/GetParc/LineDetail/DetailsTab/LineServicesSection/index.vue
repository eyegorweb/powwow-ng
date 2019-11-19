<template>
  <div>
    <draggable handle=".handle">
      <transition-group>
        <ff-wip :key="'ffblock1'">
          <ContentBlock :key="'block1'">
            <template slot="title">
              {{ $t('getparc.lineDetail.tabServices.optionalServices') }}
            </template>
            <template slot="content">
              <div>contenu ici</div>
            </template>
          </ContentBlock>
        </ff-wip>

        <ContentBlock :key="'block2'">
          <template slot="title">{{ $t('getparc.lineDetail.tabServices.services') }}</template>
          <template slot="content">
            <ServicesBlock v-if="services" :services="services" @change="onServiceChange" />
          </template>
        </ContentBlock>

        <ff-wip :key="'ffblock3'">
          <ContentBlock :key="'block3'">
            <template slot="title">{{ $t('getparc.lineDetail.tabServices.ipAdress') }}</template>
            <template slot="content">
              <div>contenu ici</div>
            </template>
          </ContentBlock>
        </ff-wip>
      </transition-group>
    </draggable>
  </div>
</template>

<script>
import ContentBlock from '@/views/GetParc/LineDetail/ContentBlock';
import draggable from 'vuedraggable';
import ServicesBlock from '@/components/Services/ServicesBlock.vue';
import { getOfferServices } from '@/components/Services/utils.js';
import { fetchLineServices } from '@/api/linesActions.js';

export default {
  components: {
    draggable,
    ContentBlock,
    ServicesBlock,
  },
  props: {
    content: Object,
  },
  data() {
    return {
      services: undefined,
    };
  },
  async mounted() {
    const services = await fetchLineServices(this.content.id);
    this.services = getOfferServices(services);
  },
  methods: {
    onServiceChange(selectedServices) {
      this.services = [...selectedServices.services, selectedServices.dataService];
    },
  },
};
</script>

<style lang="scss" scoped></style>
