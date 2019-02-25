<template>
  <div class="data-detail-container">
    <div class="overview-container m-3 bg-white">
      <div class="overview-item">
        <h4 class="font-weight-normal text-uppercase">{{ $t('orders.detail.information') }}</h4>
      </div>
      <div class="overview-item">
        <h6>{{ $t('orders.detail.orderId') }} :</h6>
        <p>#{{ getFromOrder('id') }}</p>
      </div>
      <div class="overview-item">
        <h6>{{ $t('orders.detail.referenceClient') }} :</h6>
        <p>{{ getFromOrder('externalId') }}</p>
      </div>
      <div class="overview-item">
        <h6>{{ $t('orders.detail.creationDateOrder') }} :</h6>
        <p>{{ getFromOrder('creationDate') }}</p>
      </div>
      <div class="overview-item">
        <h6>{{ $t('orders.detail.creator') }} :</h6>
        <p
          class="m-0"
        >{{ `${getFromOrder('auditable.creator.name.title')} ${getFromOrder('auditable.creator.name.firstName')} ${getFromOrder('auditable.creator.name.lastName')}` }}</p>
      </div>
      <div class="overview-item">
        <h6>{{ $t('orders.detail.creatorMail') }} :</h6>
        <p>{{ getFromOrder('contactInformation.email') }}</p>
      </div>
      <div class="overview-item">
        <h6>{{ $t('orders.detail.manageID') }} :</h6>
        <p>{{ getFromOrder('massActionIds') }}</p>
      </div>
      <div class="overview-item">
        <h6>{{ $t('orders.detail.deliveryNumber') }} :</h6>
        <p>{{ getFromOrder('deliveryNum') }}</p>
      </div>
    </div>

    <div class="overview-container m-3 bg-white">
      <div class="overview-item">
        <h4 class="font-weight-normal text-uppercase">{{ $t('orders.detail.simCardOffer') }}</h4>
      </div>
      <div class="overview-item">
        <h6>{{ $t('type') }} :</h6>
        <p>{{ getFromOrder('orderedSIMCard.description') }}</p>
      </div>
      <div class="overview-item">
        <h6>{{ $t('orders.detail.orderedQuantity') }} :</h6>
        <p>{{ getFromOrder('quantity') }}</p>
      </div>
      <div class="overview-item">
        <h6>{{ $t('orders.detail.importedQuantity') }} :</h6>
        <p>{{ getFromOrder('countSimCardInstance') }}</p>
      </div>
      <div class="overview-item">
        <h6>{{ $t('action') }} :</h6>
        <p
          v-if="order.preActivationAsked && order.activationAsked"
        >{{ $t('col.preActivationAsked') }} {{ $t('col.activationAsked') }}</p>
        <p
          v-if="order.preActivationAsked && !order.activationAsked"
        >{{ $t('col.preActivationAsked') }}</p>
        <p v-if="!order.preActivationAsked && order.activationAsked">{{ $t('col.activationAsked') }}</p>
        <p v-if="!order.preActivationAsked && !order.activationAsked">{{ $t('none') }}</p>
      </div>
      <div class="overview-item">
        <h6>{{ $t('col.offer') }} :</h6>
        <p>{{ getFromOrder('singleProduct.description') }}</p>
      </div>
    </div>

    <div class="overview-container m-3 bg-white">
      <div class="overview-item">
        <h4
          class="font-weight-normal text-uppercase"
        >{{ $t('orders.new.deliveryStep.form.deliveryCoords') }}</h4>
      </div>
      <div class="overview-item">
        <h6>{{ $t('orders.new.deliveryStep.form.company') }}</h6>
        <p>{{ getFromOrder('company') }}</p>
      </div>
      <div class="overview-item">
        <h6>{{ $t('col.recipient') }}</h6>
        <p
          class="m-0"
        >{{ `${getFromOrder('name.title')} ${getFromOrder('name.firstName')} ${getFromOrder('name.lastName')}` }}</p>
      </div>
      <div class="overview-item">
        <h6>{{ $t('orders.new.deliveryStep.form.email') }}</h6>
        <p>{{ getFromOrder('contactInformation.email') }}</p>
      </div>
      <div class="overview-item">
        <h6>{{ $t('orders.new.deliveryStep.form.phone') }}</h6>
        <p>{{ getFromOrder('contactInformation.phone') }}</p>
      </div>
      <div class="overview-item">
        <h6>{{ $t('orders.new.deliveryStep.form.deliveryAddress') }}</h6>
        <p>{{ getFromOrder('address') }}</p>
      </div>
    </div>

    <div class="overview-container m-3 bg-white">
      <div class="overview-item">
        <h4 class="font-weight-normal text-uppercase">{{ $t('col.partner') }}</h4>
      </div>
      <div class="overview-item">
        <h6>Code :</h6>
        <p>{{ getFromOrder('party.code') }}</p>
      </div>
      <div class="overview-item">
        <h6>{{ $t('orders.new.deliveryStep.form.firstname') }}</h6>
        <p>{{ getFromOrder('party.name') }}</p>
      </div>
      <div class="overview-item">
        <h6>{{ $t('orders.detail.contractReference') }} :</h6>
        <p>{{ getFromOrder('party.contractReference') }}</p>
      </div>
    </div>

    <div class="overview-container m-3 bg-white">
      <div class="overview-item">
        <h4 class="font-weight-normal text-uppercase">{{ $t('common.billingAccount') }}</h4>
      </div>
      <div class="overview-item">
        <h6>{{ $t('common.code') }} :</h6>
        <p>{{ getFromOrder('customerAccount.code') }}</p>
      </div>
      <div class="overview-item">
        <h6>{{ $t('orders.new.deliveryStep.form.address') }}</h6>
        <p>{{ getFromOrder('customerAccount.address') }}</p>
      </div>
    </div>

    <div class="overview-container m-3 bg-white">
      <div class="overview-item">
        <h4 class="font-weight-normal text-uppercase">{{ $t('orders.new.settings') }}</h4>
      </div>
      <div class="overview-item">
        <h6>{{ $t('customFields.customFieldN', ['1']) }} :</h6>
        <p>{{ getFromOrder('customFields') }}</p>
      </div>
      <div class="overview-item">
        <h6>{{ $t('customFields.customFieldN', ['2']) }} :</h6>
        <p>{{ getFromOrder('customFields') }}</p>
      </div>
    </div>

    <UiButton variant="accent" block>{{ $t('orders.validate-order') }}</UiButton>
  </div>
</template>

<script>
import UiButton from '@/components/ui/Button';
import get from 'lodash.get';

export default {
  props: {
    order: Object,
  },

  methods: {
    getFromOrder(path, defaultValue = '') {
      const value = get(this.order, path, defaultValue);
      // lodash.get only applies defaultValue to undefined
      return value == null ? defaultValue : value;
    },
  },

  components: {
    UiButton,
  },
};
</script>

<style scoped lang="scss">
$fontSize: 0.8rem;
.data-detail-container {
  overflow-y: auto;
  height: 100%;
}
.overview-container {
  padding: 2rem;
  .overview-item {
    padding: 7px 10px 7px 0;
    border-bottom: 1px dashed $medium-gray;
    &:first-child {
      border-bottom: none;
    }
    &:last-child {
      border-bottom: none;
    }

    h4 {
      font-size: 0.875rem;
    }

    h6 {
      color: $gray-680;
      font-size: $fontSize;
      font-weight: 500;
    }

    p {
      font-size: $fontSize;
      margin: 0;
    }

    div {
      font-size: $fontSize;
    }
  }
}
</style>
