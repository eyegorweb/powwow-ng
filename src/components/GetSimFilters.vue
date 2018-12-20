<template>
  <div class="card filter-bar">
    <div class="card-body">
      <h5 class="card-title">{{ $t('filters.title') }}</h5>
      <draggable>
        <transition-group>
          <FoldableBlock :title="$t('filters.partners')" :key="'el1'" draggable />
          <FoldableBlock :title="$t('filters.billingAccounts')" :key="'el2'" draggable />
          <FoldableBlock :title="$t('filters.orderStatus')" :key="'el3'" draggable>
            <UiCheckbox
              v-for="status in statusResults"
              :checked="status.checked"
              :value="status.label"
              :key="status.id"
            >{{ status.label }}</UiCheckbox>
          </FoldableBlock>
          <FoldableBlock :title="$t('filters.orderReference')" :key="'el4'" draggable />
          <FoldableBlock :title="$t('filters.orderDate')" :key="'el5'" draggable />
          <FoldableBlock :title="$t('filters.offer')" :key="'el6'" draggable />
          <FoldableBlock :title="$t('filters.quantity')" :key="'el7'" draggable />
          <FoldableBlock :title="$t('filters.customFields')" :key="'el8'" draggable />
          <FoldableBlock :title="$t('filters.orderCreator')" :key="'el9'" draggable />
          <FoldableBlock :title="$t('filters.active')" :key="'el10'" draggable />
          <FoldableBlock :title="$t('filters.deliveryCountry')" :key="'el11'" draggable />
          <FoldableBlock :title="$t('filters.postalCode')" :key="'el12'" draggable />
          <FoldableBlock :title="$t('filters.city')" :key="'el13'" draggable />
        </transition-group>
      </draggable>
    </div>
  </div>
</template>

<script>
import draggable from 'vuedraggable';
import UiCheckbox from '@/components/ui/Checkbox';
import FoldableBlock from '@/components/FoldableBlock';
import { fetchOrderStatuses } from '@/api/orderStatuses';

export default {
  components: {
    draggable,
    FoldableBlock,
    UiCheckbox,
  },
  async mounted() {
    this.statusResults = await fetchOrderStatuses();
  },
  data() {
    return {
      statusResults: [],
    };
  },
};
</script>

<style lang="scss" scoped>
</style>
