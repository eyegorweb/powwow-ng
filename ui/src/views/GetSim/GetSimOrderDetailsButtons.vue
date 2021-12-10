<template>
  <div class="action-buttons">
    <div v-if="statusIn(['NOT_VALIDATED'])">
      <UiButton variant="accent" block @click="updateStatus('VALIDATED')">{{
        $t('getsim.actions.VALIDATE')
      }}</UiButton>
    </div>
    <div v-if="userIsM2M_LIGHT && statusIn(['WAITING_FOR_PAYMENT'])">
      <UiButton variant="accent" block @click="orderPublicPayment()">
        {{ $t('digitalOffer.doPayment') }}
      </UiButton>
    </div>
    <div v-if="userIsM2M_LIGHT && statusIn(['WAITING_FOR_PAYMENT'])">
      <UiButton variant="accent" block @click="updateStatus('CANCELED')">{{
        $t('getsim.actions.CANCEL')
      }}</UiButton>
    </div>
    <div
      v-if="
        userIsBO && statusIn(['VALIDATED', 'CONFIRMATION_IN_PROGRESS', 'TO_BE_CONFIRMED_BY_BO'])
      "
    >
      <UiButton variant="accent" block @click="confirmOrder()">{{
        $t('getsim.actions.CONFIRM')
      }}</UiButton>
    </div>
    <div v-if="statusIn(['NOT_VALIDATED'])">
      <UiButton variant="accent" block @click="updateStatus('CANCELED')">{{
        $t('getsim.actions.CANCEL')
      }}</UiButton>
    </div>
    <div v-if="order.status == 'TERMINATED'">
      <ExportButton
        :export-fn="getExportFn()"
        :columns="[]"
        :order-by="orderBy"
        class="exportButton"
      >
        <span slot="title">{{ $t('getsim.actions.EXPORT') }}</span>
      </ExportButton>
    </div>
    <div
      v-if="
        statusIn([
          'VALIDATED',
          'CONFIRMATION_IN_PROGRESS',
          'TO_BE_CONFIRMED',
          'TO_BE_CONFIRMED_BY_BO',
          'CONFIRMED',
        ])
      "
    >
      <UiButton
        variant="accent"
        block
        @click="openOrderPanel"
        v-if="havePermission('getSim', 'create')"
        >{{ $t('getsim.actions.DUPLICATE') }}</UiButton
      >
    </div>
  </div>
</template>

<script>
import UiButton from '@/components/ui/Button';
import { updateOrderStatus, orderPublicPayment } from '@/api/orders';
import { mapGetters, mapMutations } from 'vuex';
import { setTimeout } from 'timers';
import { exportSimCardInstances } from '@/api/linesActions';
import ExportButton from '@/components/ExportButton';

export default {
  props: {
    order: Object,
  },
  components: {
    UiButton,
    ExportButton,
  },
  data() {
    return {
      orderBy: {
        key: 'id',
        direction: 'DESC',
      },
    };
  },
  computed: {
    ...mapGetters(['userIsBO', 'havePermission', 'userInfos']),
    userIsM2M_LIGHT() {
      return (
        !this.userIsBO &&
        this.userInfos &&
        this.userInfos.roles &&
        this.userInfos.roles[0].name === 'M2M_LIGHT_NOT_VALIDATED'
      );
    },
  },

  methods: {
    ...mapMutations(['openPanel', 'closePanel']),
    ...mapMutations('getsim', ['refreshIndicators', 'updateOrderInTable']),

    getExportFn() {
      return async (columns, orderBy, exportFormat, asyncExportRequest, exportAll) => {
        let columnsToUse = [
          'LINE_ICCID',
          'PARTY_ID',
          'LINE_MSISDN',
          'LINE_IMSI',
          'LINE_SIM_STATUS',
          'LINE_COMMERCIAL_DATE',
          'LINE_COMMERCIAL_STATUS',
          'LINE_OFFER',
          'LINE_AMSISDN',
          'LINE_MANUFACTURER',
          'LINE_DEVICE_REFERENCE',
          'LINE_ACTIVATION_DATE',
          'BILLING_ACCOUNT',
          'LAST_COUNTRY',
          'LINE_CUSTOM_FIELD1',
          'LINE_CUSTOM_FIELD2',
          'LINE_CUSTOM_FIELD3',
          'LINE_CUSTOM_FIELD4',
          'LINE_CUSTOM_FIELD5',
          'LINE_CUSTOM_FIELD6',
        ];
        if (this.havePermission('getVision', 'read')) {
          columnsToUse.push('LAST_COUNTRY');
        }
        let orderToUse = { direction: 'DESC', key: 'id' };
        let filtersToUse = [{ id: 'filters.lines.orderID', value: this.order.id }];
        return await exportSimCardInstances(
          columnsToUse,
          orderToUse,
          exportFormat,
          filtersToUse,
          asyncExportRequest,
          exportAll,
          'CLASSIC'
        );
      };
    },

    async updateStatus(newStatus) {
      const orderData = await updateOrderStatus(this.order.id, newStatus);
      this.order.status = orderData.status;
      this.updateOrderInTable(orderData);
      this.refreshIndicators();
    },

    async confirmOrder() {
      switch (this.order.status) {
        case 'TO_BE_CONFIRMED_BY_BO': {
          const orderData = await updateOrderStatus(this.order.id, 'TO_BE_CONFIRMED');
          this.order.status = orderData.status;
          this.updateOrderInTable(orderData);
          break;
        }

        case 'CONFIRMATION_IN_PROGRESS':
        case 'VALIDATED': {
          const orderData = await updateOrderStatus(this.order.id, 'CONFIRMED');
          this.order.status = orderData.status;
          this.updateOrderInTable(orderData);
          break;
        }
      }
    },

    async orderPublicPayment() {
      return await orderPublicPayment(this.order.id);
    },

    checkPaymentErrors() {
      // PAYMENT_ERROR - Erreur lors du paiement. Veuillez réessayer.
      // PAYMENT_INVALID - Vous n'êtes pas autorisé à procéder au paiement
      // PAYMENT_PAID - La demande est déjà payée
      // PAYMENT_ONGOING - Un paiement est déjà en cours
    },

    statusIn(statuses) {
      return statuses.find((s) => s === this.order.status);
    },
    openOrderPanel() {
      this.closePanel();
      const title = this.$t('getsim.order-sim');
      const openTrigger = () => {
        this.openPanel({
          title,
          panelId: 'getsim.order-sim',
          wide: true,
          backdrop: true,
          payload: this.order,
          ignoreClickAway: true,
        });
      };
      setTimeout(() => {
        openTrigger();
      }, 500);
    },
  },
};
</script>

<style lang="scss" scoped>
.exportButton {
  width: 100%;
  text-align: center;
  background: #c8007b;
  color: white;
  border-radius: 5px;
  display: flex;
  justify-content: center;

  button {
    width: 100%;

    span {
      color: white;
      text-align: center;
    }
  }
}
.action-buttons {
  display: flex;
  justify-content: space-between;
  padding-right: 10px;
  div {
    flex: 1;
    padding-left: 10px;
    padding-right: 10px;
  }
  button {
    padding: 0;
  }
}

.small-button {
  font-size: 0.9rem;
}
</style>
