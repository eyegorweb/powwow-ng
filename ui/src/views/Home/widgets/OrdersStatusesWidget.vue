<template>
  <WidgetBloc :widget="widget" @seeMore="onSeeMore" no-padding>
    <div class="pl-3 pr-3 pb-0">
      <OrderStatusesIndicators no-borders small @click="onIndicatorClick" />
      <permission domain="getSim" action="create">
        <UiButton
          v-if="userIsPartner"
          variant="accent"
          block
          class="float-right"
          @click="createOrder"
          >{{ $t('getsim.order-sim') }}</UiButton
        >
      </permission>
    </div>
  </WidgetBloc>
</template>

<script>
import UiButton from '@/components/ui/Button';

import WidgetBloc from './WidgetBloc';
import OrderStatusesIndicators from './OrderStatusesIndicators';
import { mapGetters } from 'vuex';

export default {
  components: {
    WidgetBloc,
    OrderStatusesIndicators,
    UiButton,
  },
  props: {
    widget: Object,
    contextFilters: Array,
  },
  computed: {
    ...mapGetters(['userIsPartner', 'userIsM2MLight']),
  },
  methods: {
    onIndicatorClick(indicator) {
      this.$router
        .push({
          name: 'orders.search',
          params: {
            queryFilters: [...indicator.filters, ...this.contextFilters],
          },
        })
        .catch(() => {});
    },
    onSeeMore() {
      if (this.userIsM2MLight) {
        this.$pushAnalytics({ event: 'm2m.seeMore', widget: 'Statut des commandes - OD' });
      } else {
        this.$pushAnalytics({ event: 'm2m.seeMore', widget: 'Statut des commandes' });
      }
      this.$router
        .push({
          name: 'orders.search',
          params: {
            queryFilters: [
              ...this.contextFilters,
              {
                id: 'filters.orderStatus',
                values: [
                  {
                    id: 'NOT_VALIDATED',
                    label: 'Non validée',
                  },
                  {
                    id: 'VALIDATED',
                    label: 'Validée',
                  },
                  {
                    id: 'TO_BE_CONFIRMED_BY_BO',
                    label: 'À confirmer par le BO',
                  },
                  {
                    id: 'TO_BE_CONFIRMED',
                    label: 'À confirmer',
                  },
                  {
                    id: 'CONFIRMATION_IN_PROGRESS',
                    label: 'En cours de confirmation',
                  },
                  {
                    id: 'CONFIRMED',
                    label: 'Confirmée',
                  },
                  {
                    id: 'FAILED',
                    label: 'Échouée',
                  },
                  {
                    id: 'CANCELED',
                    label: 'Annulée',
                  },
                ],
              },
            ],
          },
        })
        .catch(() => {});
    },
    createOrder() {
      this.$pushAnalytics({ event: 'm2m.createOrder', widget: 'Statut des commandes' });
      this.$router
        .push({
          name: 'orders.search',
          params: {
            createOrder: true,
          },
        })
        .catch(() => {});
    },
  },
};
</script>

<style lang="scss" scoped></style>
