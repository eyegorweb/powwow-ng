<template>
  <div class="card filter-bar">
    <div class="card-body">
      <h5 class="card-title">{{ $t('filters.title') }}</h5>
      <!-- TODO: a voir si ces computed properties sont toujours d'actualité -->
      <SelectedFilters v-if="canShowSelectedFilter" :current-filters="currentFilters" />
      <draggable>
        <transition-group>
          <!-- NOTE: les keys ne servent à rien s'ils ne peuvent pas être supprimés (eg: v-if, v-for) -->
          <FoldableBlock :title="$t('filters.partners')" key="el1" draggable />
          <FoldableBlock :title="$t('filters.billingAccounts')" key="el2" draggable />
          <FoldableBlock :title="$t('filters.orderStatus')" key="el3" draggable />
          <FoldableBlock :title="$t('filters.orderReference')" key="el4" draggable />
          <FoldableBlock :title="$t('filters.orderDate')" key="el5" draggable />
          <FoldableBlock :title="$t('filters.offer')" key="el6" draggable />
          <FoldableBlock :title="$t('filters.quantity')" key="el7" draggable />
          <FoldableBlock :title="$t('filters.customFields')" key="el8" draggable />
          <FoldableBlock :title="$t('filters.orderCreator')" key="el9" draggable />
          <FoldableBlock :title="$t('filters.active')" key="el10" draggable />
          <FoldableBlock :title="$t('filters.deliveryCountry')" key="el11" draggable />
          <FoldableBlock :title="$t('filters.postalCode')" key="el12" draggable />
          <FoldableBlock :title="$t('filters.city')" key="el13" draggable />
        </transition-group>
      </draggable>
    </div>
  </div>
</template>

<script>
import draggable from 'vuedraggable';
import { mapGetters } from 'vuex';
import FoldableBlock from '@/components/FoldableBlock';
import SelectedFilters from '@/components/filters/selected/SelectedFilters';

export default {
  computed: {
    ...mapGetters(['currentFilters', 'canShowSelectedFilter']),
  },

  components: {
    draggable,
    SelectedFilters,
    FoldableBlock,
  },
};
</script>

<style scoped>
</style>
