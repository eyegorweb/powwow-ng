<template>
  <BaseDetailPanelContent>
    <div>
      <HomePanelOption v-for="w in localWidgets" :key="w.id" :title="w.title" v-model="w.checked">
        {{ w.description }}
      </HomePanelOption>
    </div>
    <div slot="footer" class="action-buttons">
      <div>
        <UiButton variant="import" @click="closePanel" block>{{ $t('cancel') }}</UiButton>
      </div>
      <div>
        <UiButton variant="primary" @click="applyWidgets()" block>{{ $t('set') }}</UiButton>
      </div>
    </div>
  </BaseDetailPanelContent>
</template>

<script>
import BaseDetailPanelContent from '@/components/BaseDetailPanelContent';
import UiButton from '@/components/ui/Button';
import HomePanelOption from './HomePanelOption';
import { mapMutations, mapGetters } from 'vuex';
import cloneDeep from 'lodash.clonedeep';

export default {
  components: {
    BaseDetailPanelContent,
    UiButton,
    HomePanelOption,
  },

  props: {
    content: Object,
  },

  mounted() {
    const userIsPartner = this.userIsPartner;

    this.localWidgets = cloneDeep(this.content.homeWidgets).filter(e => {
      if (e.partnerOnly && !userIsPartner) {
        return false;
      }
      return true;
    });
  },
  computed: {
    ...mapGetters(['userIsPartner']),
  },
  methods: {
    ...mapMutations(['setHomeWidgets', 'closePanel']),

    applyWidgets() {
      this.setHomeWidgets(this.localWidgets);
      this.closePanel();
    },
  },
  data() {
    return {
      localWidgets: [],
    };
  },
};
</script>

<style lang="scss" scoped></style>
