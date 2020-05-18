<template>
  <div class="panel-vertical-container">
    <div class="main-content data-detail-container">
      <div v-if="order.isNew" class="row shadow alert alert-success p-3 m-3" role="alert">
        <div class="circle-loader load-complete">
          <div class="checked checkmark" />
        </div>
        <div class="ml-3">
          {{ $t('orders.new.message.confirmation') }}
          <br />
          {{ $t('orders.new.message.delivery') }}
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
          <StepperNonLinear
            v-if="statusStepperIndex != null"
            :stepper-data="steps"
            :current-index="statusStepperIndex"
          />
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
          <p>
            <span v-for="(id, index) in massActionsIds" :key="id"
              >{{ index ? ', ' : '' }}{{ id }}</span
            >
          </p>
        </div>
        <div class="overview-item">
          <h6>{{ $t('orders.detail.deliveryNumber') }} :</h6>
          <p>{{ getFromOrder('deliveryNum') }}</p>
        </div>
      </div>

      <div class="overview-container m-3 bg-white">
        <div class="overview-item d-flex">
          <h4 class="align-self-sm-center flex-grow-1 font-weight-normal text-uppercase">
            {{ $t('orders.detail.simCardOffer') }}
          </h4>
          <UiButton
            @click="gotoCorrespondingLines"
            v-if="order.status === 'TERMINATED'"
            variant="import"
            >{{ $t('getsim.actions.SHOW_SIM') }}</UiButton
          >
          <template v-if="userIsBO && order.status === 'CONFIRMED'">
            <UiButton
              v-if="order.importedQuantity < order.quantity"
              @click="openImportSimPanel"
              variant="import"
            >
              <span>{{ $t('getsim.actions.IMPORT_SIM') }}</span>
            </UiButton>
          </template>
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
          <p>{{ getFromOrder('orderedMarketingOffer.description') }}</p>
        </div>
      </div>

      <div class="overview-container m-3 bg-white">
        <div class="overview-item">
          <h4 class="font-weight-normal text-uppercase">
            {{ $t('orders.new.deliveryStep.form.deliveryCoords') }}
          </h4>
        </div>
        <div class="overview-item">
          <h6>{{ $t('orders.new.deliveryStep.form.company') }}</h6>
          <p>{{ getFromOrder('company') }}</p>
        </div>
        <div class="overview-item">
          <h6>{{ $t('col.recipient') }}</h6>
          <p class="m-0">
            {{
              `${getFromOrder('name.title')} ${getFromOrder('name.firstName')} ${getFromOrder(
                'name.lastName'
              )}`
            }}
          </p>
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
          <p>{{ getFromOrder('address.address1') }}</p>
          <p v-if="getFromOrder('address.address2') && getFromOrder('address.address2') !== 'null'">
            {{ getFromOrder('address.address2') }}
          </p>
          <p v-if="getFromOrder('address.address3') && getFromOrder('address.address3') !== 'null'">
            {{ getFromOrder('address.address3') }}
          </p>
          <p v-if="getFromOrder('address.city')">
            {{ getFromOrder('address.zipCode') }} - {{ getFromOrder('address.city') }}
          </p>
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
import UiButton from '@/components/ui/Button';
import { mapMutations } from 'vuex';
import { mapGetters } from 'vuex';

export default {
  data() {
    return {
      orderData: undefined,
      confirmationStepper: [],
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
    };
  },

  mounted() {
    this.confirmationStepper = [
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
        code: this.confirmStep.code,
        label: this.confirmStep.label,
        date: null,
        index: 2,
      },
      {
        code: 'TERMINATED',
        label: this.$t('orders.detail.statuses.TERMINATED'),
        date: null,
        index: 3,
      },
    ];
  },

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
    gotoCorrespondingLines() {
      const queryFilters = [{ id: 'filters.lines.orderID', value: this.order.id }];
      this.$router.push({
        name: 'actLines',
        params: {
          queryFilters,
        },
      });
    },
    openImportSimPanel() {
      this.switchPanel({
        title: this.$t('getsim.actions.IMPORT_SIM'),
        panelId: 'getsim.actions.IMPORT_SIM',
        payload: { order: this.order },
        wide: false,
        backdrop: false,
      });
    },
  },

  computed: {
    ...mapGetters(['userIsBO']),
    creatorTitle() {
      const title = this.getFromOrder('auditable.creator.name.title');
      if (!title) return '';
      return this.$t('common.' + title);
    },
    steps() {
      let stepsToUse;
      if (this.order.status === 'CANCELED') {
        stepsToUse = this.cancelStepper;
      } else {
        stepsToUse = this.confirmationStepper;
      }

      stepsToUse = stepsToUse.map(s => {
        if (!this.order.orderStatusHistories) return;
        const historyEntry = this.order.orderStatusHistories.find(h => h.status === s.code);
        if (historyEntry) {
          s.date = historyEntry.statusDate;
        }
        return s;
      });

      return {
        data: stepsToUse,
      };
    },
    statusStepperIndex() {
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
    massActionsIds() {
      return this.getFromOrder('massActionIds');
    },
    confirmStep() {
      let code, label;
      if (this.order.status === 'CONFIRMED') {
        code = 'CONFIRMED';
        label = this.$t('orders.detail.statuses.CONFIRMED');
      } else if (this.order.status === 'TO_BE_CONFIRMED') {
        code = 'TO_BE_CONFIRMED';
        label = this.$t('col.statuses.TO_BE_CONFIRMED');
      } else if (this.order.status === 'TO_BE_CONFIRMED_BY_BO') {
        code = 'TO_BE_CONFIRMED_BY_BO';
        label = this.$t('col.statuses.TO_BE_CONFIRMED_BY_BO');
      } else {
        // defaults values are 'CONFIRMED'
        code = 'CONFIRMED';
        label = this.$t('orders.detail.statuses.CONFIRMED');
      }
      return { code, label };
    },
  },

  watch: {
    confirmStep(newValue) {
      this.confirmationStepper = [
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
          code: newValue.code,
          label: newValue.label,
          date: null,
          index: 2,
        },
        {
          code: 'TERMINATED',
          label: this.$t('orders.detail.statuses.TERMINATED'),
          date: null,
          index: 3,
        },
      ];
      return this.confirmationStepper;
    },
  },

  components: {
    StepperNonLinear,
    GetSimOrderDetailsButtons,
    UiButton,
  },
};
</script>

<style scoped lang="scss">
$fontSize: 0.8rem;
.main-content {
  padding-bottom: 4vh;
}
.footer-back {
  padding: 0 1.25rem;
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
