<template>
  <div class="panel-vertical-container">
    <div class="main-content">
      <div v-if="order.isNew" class="row shadow alert alert-success p-3 m-3" role="alert">
        <div class="circle-loader load-complete">
          <div class="checked checkmark" />
        </div>
        <div class="ml-3">
          {{ $t(('orders.new.message.confirmation')) }}<br>
          {{ $t(('orders.new.message.delivery')) }}
        </div>
        <div class="cross-loader load-complete">
          <a href="#" class="cross" @click.prevent="close" />
        </div>
      </div>
      <div class="overview-container m-3 bg-white">
        <div class="overview-item">
          <h4 class="font-weight-normal text-uppercase">{{ $t('orders.detail.information') }}</h4>
        </div>
        <div class="overview-item">
          <StepperNonLinear v-if="!isCanceled" :stepper-data="steps" :current-index="steps.currentIndex" />
          <StepperNonLinear v-if="isCanceled" :stepper-data="steps" />
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
          <p>{{ getFromOrder('importedQuantity') }}</p>
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
        <div v-for="field in customFields" :key="field.index" class="overview-item">
          <h6>{{ field.label }} :</h6>
          <p>{{ field.value }}</p>
        </div>
      </div>

    </div>
    <div class="footer-bock">
      <GetSimOrderDetailsButtons :order="order" />
    </div>
  </div>
</template>

<script>
import StepperNonLinear from '@/components/ui/StepperNonLinear';
import GetSimOrderDetailsButtons from './GetSimOrderDetailsButtons';
import get from 'lodash.get';
// import moment from 'moment';

export default {
  data() {
    return {
      steps: {
        data: [],
        currentIndex: 0,
      },
      confirmationStepper: [
        {
          code: 'NOT_VALIDATED',
          label: this.$t('orders.detail.statuses.NOT_VALIDATED'),
          date: null,
          index: 0,
        },
        {
          code: 'VALIDATED',
          label: this.$t('orders.detail.statuses.VALIDATED'),
          date: null,
          index: 1,
        },
        {
          code: 'CONFIRMED',
          label: this.$t('orders.detail.statuses.CONFIRMED'),
          date: null,
          index: 2,
        },
        {
          code: 'TERMINATED',
          label: this.$t('orders.detail.statuses.TERMINATED'),
          date: null,
          index: 3,
        },
      ],
      cancelStepper: [
        {
          code: 'NOT_VALIDATED',
          label: this.$t('orders.detail.statuses.NOT_VALIDATED'),
          date: null,
          index: 0,
          statusError: false,
        },
        {
          code: 'CANCELED',
          label: this.$t('orders.detail.statuses.CANCELED'),
          date: null,
          index: 1,
          statusError: true,
        },
      ],
      isCanceled: false,
    };
  },

  props: {
    order: Object,
  },

  mounted() {
    this.displayStepper();
  },

  methods: {
    getFromOrder(path, defaultValue = '') {
      const value = get(this.order, path, defaultValue);
      // lodash.get only applies defaultValue to undefined
      return value == null ? defaultValue : value;
    },

    close() {
      if (this.order.isNew) this.order.isNew = false;
    },

    cancelOrder() {
      if (this.order.status === 'CANCELED') this.isCanceled = true;
      return this.isCanceled;
    },

    displayStepper() {
      const _isCanceled = this.cancelOrder();
      if (_isCanceled) {
        this.cancelStepper.map(o => this.steps.data.push(o));
      } else {
        this.confirmationStepper.map(o => this.steps.data.push(o));
      }
      this.displayStatusIndex();
      this.displayStatusDate();
      return this.steps;
    },

    displayStatusIndex() {
      const { index } = this.steps.data.find(c => c.code === this.order.status);
      this.steps.currentIndex = index;
      return this.steps.currentIndex;
    },

    displayStatusDate() {
      const _isCanceled = this.cancelOrder();

      if (_isCanceled) {
        return this.cancelStepper.filter(c =>
          this.order.orderStatusHistories.filter(o => {
            if (c.code === o.status) {
              c.date = o.statusDate;
            }
            // console.log(moment(c.date).fromNow());
            return c;
          })
        );
      } else {
        return this.confirmationStepper.filter(c =>
          this.order.orderStatusHistories.filter(o => {
            if (c.code === o.status) {
              c.date = o.statusDate;
            }
            // console.log('date', c.date, moment(c.date).fromNow());
            return c;
          })
        );
      }
    },
  },

  computed: {
    customFields() {
      const customFields = this.getFromOrder('customFields');
      if (!customFields) return [];
      let customFieldsArray = [];
      for (let i = 1; i <= 6; i++) {
        const value = customFields['custom' + i];
        const label = this.order.party[`custom${i}FieldLabel`];
        if (value) {
          customFieldsArray.push({
            index: i,
            value,
            label,
          });
        }
      }
      return customFieldsArray;
    },
  },

  components: {
    StepperNonLinear,
    GetSimOrderDetailsButtons,
  },
};
</script>

<style scoped lang="scss">
$fontSize: 0.8rem;
.main-content {
  padding-bottom: 20vh;
}
.data-detail-container {
  $loader-size: 1.5em;
  $check-height: $loader-size/2;
  $check-width: $check-height/2;
  $check-left: $loader-size/6;
  $check-thickness: 2px;
  $check-color: $success;

  .circle-loader {
    border: 3px solid rgba(0, 0, 0, 0.2);
    border-left-color: $secondary;
    position: relative;
    display: inline-block;
    vertical-align: top;
    border-radius: 50%;
    width: $loader-size;
    height: $loader-size;
  }
  .cross-loader {
    position: relative;
    display: inline-block;
    vertical-align: top;
    border-radius: 50%;
    width: 1.5em;
    height: 1.5em;
    position: absolute;
    right: 20px;
  }

  .load-complete {
    border-color: $check-color;
    background-color: transparent;
    border-width: 1px;
    transition: border 500ms ease-out;
  }

  .checkmark {
    display: none;

    &.checked {
      display: block;
    }
    &:after {
      opacity: 1;
      height: $check-height;
      width: $check-width;
      transform-origin: left top;
      border-right: $check-thickness solid $success;
      border-top: $check-thickness solid $success;
      content: '';
      left: $check-left;
      top: $check-height;
      position: absolute;
      transform: scaleX(-1) rotate(135deg);
    }
  }

  .cross {
    $cross-size: $loader-size / 2;

    height: $cross-size;
    width: $cross-size;
    position: absolute;
    right: 0;
    font-size: 24px;
    margin: -0.5rem 0 0 0;

    &:before,
    &:after {
      position: absolute;
      left: 0.55rem;
      top: $cross-size / 2;
      content: ' ';
      height: $cross-size;
      width: 2px;
      background-color: $success;
    }
    &:before {
      transform: rotate(45deg);
    }
    &:after {
      transform: rotate(-45deg);
    }
  }
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
