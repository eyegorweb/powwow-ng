<template>
  <div class="panel-vertical-container">
    <div class="main-content data-detail-container">
      <div class="overview-container m-3 bg-white">
        <div class="overview-item">
          <h4 class="font-weight-normal text-uppercase">{{ $t('orders.detail.information') }}</h4>
        </div>
        <div class="overview-item">
          <StepperNonLinear
            v-if="steps != null"
            :stepper-data="steps"
            :current-index="currentStep"
          />
        </div>
        <div class="overview-item">
          <h6>{{ $t('orders.detail.orderId') }} :</h6>
          <p>#{{ getFromOrder('id') }}</p>
        </div>
        <div class="overview-item">
          <h6>{{ $t('orders.detail.referenceClient') }} :</h6>
          <p>{{ getFromOrder('esimReservationReference') }}</p>
        </div>
        <div class="overview-item">
          <h6>{{ $t('orders.detail.creator') }} :</h6>
          <p class="m-0">
            {{ creatorTitle }}
            {{
              `${getFromOrder('auditable.creator.name.firstName')} ${getFromOrder(
                'auditable.creator.name.lastName'
              )}`
            }}
          </p>
        </div>
        <div class="overview-item">
          <h6>{{ $t('orders.detail.creatorMail') }} :</h6>
          <p>{{ getFromOrder('auditable.creator.email') }}</p>
        </div>
        <div class="overview-item">
          <h6>{{ $t('orders.detail.manageID') }} :</h6>
          <p>{{ getFromOrder('massActionId') }}</p>
        </div>
      </div>

      <div class="overview-container m-3 bg-white">
        <div class="overview-item d-flex">
          <h4 class="align-self-sm-center flex-grow-1 font-weight-normal text-uppercase">
            {{ $t('orders.detail.simCardOffer') }}
          </h4>
        </div>
        <div class="overview-item">
          <h6>{{ $t('type') }} :</h6>
          <p>{{ getFromOrder('simCardType.description') }}</p>
        </div>
        <div class="overview-item">
          <h6>
            <template v-if="simType === 'TAPE'">
              {{ $t('orders.detail.orderedCoilQuantity') }} :
            </template>
            <template v-else> {{ $t('orders.detail.orderedSimQuantity') }} : </template>
          </h6>
          <p>{{ getFromOrder('quantity') }}</p>
        </div>
        <div class="overview-item">
          <h6>{{ $t('action') }} :</h6>
          <p v-if="order.preActivationAsked && order.activationAsked">
            {{ $t('col.preActivationAsked') }} {{ $t('col.activationAsked') }}
          </p>
          <p v-if="order.preActivationAsked && !order.activationAsked">
            {{ $t('col.preActivationAsked') }}
          </p>
          <p v-if="!order.preActivationAsked && order.activationAsked">
            {{ $t('col.activationAsked') }}
          </p>
          <p v-if="!order.preActivationAsked && !order.activationAsked">{{ $t('none') }}</p>
        </div>
        <div class="overview-item">
          <h6>{{ $t('col.offer') }} :</h6>
          <p>{{ getFromOrder('esimReservedMarketingOffer.description') }}</p>
        </div>
        <div class="overview-item">
          <h6>{{ $t('col.appair') }} :</h6>
          <p>{{ getFromOrder('pairingAsked') ? $t('common.YES') : $t('common.NO') }}</p>
        </div>
        <div class="overview-item">
          <h6>{{ $t('col.downloadState') }} :</h6>
          <p>
            {{
              getFromOrder('downloadState') == 'ENABLED'
                ? $t('filters.active')
                : $t('filters.disable')
            }}
          </p>
        </div>
      </div>

      <div class="overview-container m-3 bg-white">
        <div class="overview-item">
          <h4 class="font-weight-normal text-uppercase">{{ $t('col.partner') }}</h4>
        </div>
        <div class="overview-item">
          <h6>{{ $t('common.code') }} :</h6>
          <p>{{ getFromOrder('party.code') }}</p>
        </div>
        <div class="overview-item">
          <h6>{{ $t('orders.new.deliveryStep.form.lastname') }}</h6>
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
          <p>{{ getFromOrder('customerAccount.address.address1') }}</p>
          <p v-if="getFromOrder('customerAccount.address.address2')">
            {{ getFromOrder('customerAccount.address.address2') }}
          </p>
          <p v-if="getFromOrder('customerAccount.address.address3')">
            {{ getFromOrder('customerAccount.address.address3') }}
          </p>
          <p v-if="getFromOrder('customerAccount.address.city')">
            {{ getFromOrder('customerAccount.address.zipCode') }} -
            {{ getFromOrder('customerAccount.address.city') }}
          </p>
          <p v-if="getFromOrder('address.countryName')">
            {{ getFromOrder('customerAccount.address.countryName') }}
          </p>
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
    <div class="footer-back">
      <GetSimOrderDetailsButtons :order="order" />
    </div>
  </div>
</template>

<script>
import StepperNonLinear from '@/components/ui/StepperNonLinear';
import GetSimOrderDetailsButtons from './GetSimOrderDetailsButtons';
import get from 'lodash.get';
import { mapMutations } from 'vuex';
import { mapGetters } from 'vuex';

export default {
  data() {
    return {
      orderData: undefined,
      confirmationStepper: [],
      steps: {
        data: [
          {
            code: 'IN_PROGRESS',
            label: 'En cours',
            index: 0,
          },
          {
            code: 'TERMINATED',
            label: 'Terminée',
            index: 1,
          },
        ],
      },
    };
  },

  mounted() {},

  props: {
    order: Object,
  },

  methods: {
    ...mapMutations(['switchPanel']),

    getFromOrder(path, defaultValue = '') {
      const value = get(this.order, path, defaultValue);
      return value !== null ? value : '';
    },

    close() {
      if (this.order.isNew) this.order.isNew = false;
    },
  },

  computed: {
    ...mapGetters(['userIsBO']),
    creatorTitle() {
      const title = this.getFromOrder('auditable.creator.name.title');
      if (!title) return '';
      return this.$t('common.' + title);
    },
    currentStep() {
      if (!this.steps || !this.steps.data || !this.order.status) return;
      const res = this.steps.data.find(c => c.code === this.order.status);

      if (res) return res.index;
      return null;
    },
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
    simType() {
      return this.order ? this.order.simcardType : undefined;
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
  padding-bottom: 4vh;
}

.panel-vertical-container {
  overflow-y: scroll;
  padding-bottom: 100px;
}

.footer-back {
  position: absolute;
  width: 100%;
  bottom: 0;
  background: white;
  padding: 10px;
  box-shadow: 1px -8px 18px -9px rgba(0, 0, 0, 0.27);
}
.data-detail-container {
  $loader-size: 1.5em;
  $check-height: $loader-size/2;
  $check-width: $check-height/2;
  $check-left: $loader-size/6;
  $check-thickness: 2px;
  $check-color: $success;

  .overview-container {
    padding: 1rem 2rem;
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
}
</style>
