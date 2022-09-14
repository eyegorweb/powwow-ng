<template>
  <div>
    <div v-if="paymentErrors.length" class="alert alert-danger ml-2 mr-3 pl-0" role="alert">
      <ul>
        <li v-for="(error, index) in paymentErrors" :key="index">
          {{ $t('digitalOffer.errors.' + error) }}
        </li>
      </ul>
    </div>
    <div class="action-buttons">
      <div v-if="statusIn(['NOT_VALIDATED'])">
        <UiButton variant="accent" block @click="updateStatus('VALIDATED')">{{
          $t('getsim.actions.VALIDATE')
        }}</UiButton>
      </div>
      <template v-if="isM2MLIGHTOrder && statusIn(['WAITING_FOR_PAYMENT'])">
        <div>
          <UiButton
            variant="accent"
            :disabled="!!paymentErrors.length || isLoading"
            block
            @click="orderPublicPayment()"
          >
            <template slot="button" v-if="isLoading">
              {{ $t('processing') }}...
              <CircleLoader />
            </template>
            {{ $t('digitalOffer.doPayment') }}
          </UiButton>
        </div>
        <div>
          <UiButton variant="accent" block @click="waitForConfirmation = true">{{
            $t('getsim.actions.CANCEL')
          }}</UiButton>
        </div>
      </template>
      <div
        v-if="
          userIsBO && statusIn(['VALIDATED', 'CONFIRMATION_IN_PROGRESS', 'TO_BE_CONFIRMED_BY_BO'])
        "
        v-tooltip="isPartyNotValidated ? $t('digitalOffer.validateParty') : undefined"
      >
        <UiButton variant="accent" :disabled="isPartyNotValidated" block @click="confirmOrder()">{{
          $t('getsim.actions.CONFIRM')
        }}</UiButton>
      </div>
      <div v-if="statusIn(['NOT_VALIDATED'])">
        <UiButton variant="accent" block @click="waitForConfirmation = true">{{
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
          ]) && !isM2MLIGHTOrder
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
    <Modal panel-view v-if="waitForConfirmation">
      <div slot="body">
        <LoaderContainer :is-loading="isLoading">
          <div slot="on-loading">
            <ModalSkeleton :is-loading="isLoading" />
          </div>
          <div class="text-danger">
            <i class="ic-Alert-Icon"></i>
            Confirmez-vous l'annulation de la commande ?
            <!-- {{ $t('getparc.actCreation.editCustomFields.confirmationWarning') }} -->
          </div>
        </LoaderContainer>
      </div>
      <div slot="footer">
        <button
          class="modal-default-button btn btn-danger btn-sm"
          :disabled="isLoading"
          @click.stop="waitForConfirmation = false"
        >
          {{ $t('cancel') }}
        </button>
        <button
          class="modal-default-button btn btn-success btn-sm ml-1"
          @click.stop="cancelOrder('CANCELED')"
          :disabled="isLoading"
        >
          {{ $t('confirm') }}
        </button>
        <button class="modal-default-button btn btn-light btn-sm ml-1" disabled v-if="isLoading">
          {{ $t('processing') }}...
          <CircleLoader />
        </button>
      </div>
      <!-- <div slot="footer" class="btn-wrapper">
        <button
          class="modal-default-button btn btn--cancel"
          @click.stop="waitForConfirmation = false"
          :disabled="isLoading"
        >
          {{ $t('cancel') }}
        </button>
        <button
          class="modal-default-button btn ml-1 btn--confirm"
          @click.stop="cancelOrder('CANCELED')"
          :disabled="isLoading"
        >
          {{ $t('confirm') }}
        </button>
      </div> -->
    </Modal>
  </div>
</template>

<script>
import UiButton from '@/components/ui/Button';
import CircleLoader from '@/components/ui/CircleLoader';
import Modal from '@/components/Modal';
import LoaderContainer from '@/components/LoaderContainer';
import ModalSkeleton from '@/components/ui/skeletons/ModalSkeleton';
import { updateOrderStatus, orderPublicPayment } from '@/api/orders';
import { mapGetters, mapMutations } from 'vuex';
import { setTimeout } from 'timers';
import { exportSimCardInstances } from '@/api/linesActions';
import ExportButton from '@/components/ExportButton';
import { redirectTo } from '@/utils';

export default {
  props: {
    order: Object,
  },
  components: {
    UiButton,
    ExportButton,
    CircleLoader,
    Modal,
    LoaderContainer,
    ModalSkeleton,
  },
  data() {
    return {
      orderBy: {
        key: 'id',
        direction: 'DESC',
      },
      response: [],
      isLoading: false,
      waitForConfirmation: false,
    };
  },
  computed: {
    ...mapGetters(['userIsBO', 'havePermission', 'userInfos']),
    isM2MLIGHTOrder() {
      return this.order && this.order.party && this.order.party.partyType === 'M2M_LIGHT';
    },
    isPartyNotValidated() {
      return this.isM2MLIGHTOrder && this.order.party.validationStatus === 'TO_VALIDATE';
    },
    paymentErrors() {
      return this.response && this.response.errors ? this.response.errors : [];
      //   PAYMENT_ERROR - Erreur lors du paiement. Veuillez réessayer.
      //   PAYMENT_INVALID - Vous n'êtes pas autorisé à procéder au paiement
      //   PAYMENT_PAID - La demande est déjà payée
      //   PAYMENT_ONGOING - Un paiement est déjà en cours
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

    async cancelOrder(cancelStatus) {
      const orderData = await updateOrderStatus(this.order.id, cancelStatus);
      this.order.status = orderData.status;
      this.updateOrderInTable(orderData);
      this.refreshIndicators();
      this.waitForConfirmation = false;
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
      this.isLoading = true;
      try {
        this.response = await orderPublicPayment(this.order.id);
        this.isLoading = false;
        // redirection paynum
        if (this.response && this.response.url) {
          this.redirectToPaynum(this.response.url);
        }
      } catch (e) {
        this.isLoading = false;
        console.error('request error from API "doPayment"', e);
      }
    },

    redirectToPaynum(paynumUrl) {
      redirectTo(paynumUrl);
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
