<template>
  <div class="new-order-synthesis">
    <h6>{{ $t('orders.new.synthesis') }}</h6>
    <div>
      <GetSimCreateOrderPanelSynthesisItem v-for="item in synthesis" :key="item.id" :item="item" />
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex';
import GetSimCreateOrderPanelSynthesisItem from './GetSimCreateOrderPanelSynthesisItem';

export default {
  components: {
    GetSimCreateOrderPanelSynthesisItem,
  },
  computed: {
    ...mapGetters(['synthesis']),
  },
};
</script>

<style scoped lang="scss">
.new-order-synthesis {
  padding: 1em !important;
  h6 {
    margin-bottom: 2em;
  }
}
</style>
