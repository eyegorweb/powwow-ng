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
          <h6>{{ $t('orders.detail.packageNum') }} :</h6>
          <p>
            <a :href="packNumLink" target="_blank" class="m-0">
              {{ getFromOrder('packageNum') }}
            </a>
          </p>
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
              v-if="havePermission('getSim', 'import') && order.importedQuantity < order.quantity"
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
          <h6>
            <template v-if="simType === 'TAPE'">
              {{ $t('orders.detail.orderedCoilQuantity') }} :
            </template>
            <template v-else> {{ $t('orders.detail.orderedSimQuantity') }} : </template>
          </h6>
          <p>{{ getFromOrder('quantity') }}</p>
        </div>
        <div class="overview-item">
          <h6>{{ $t('orders.detail.importedSimQuantity') }} :</h6>
          <p>{{ getFromOrder('importedQuantity') }}</p>
        </div>
        <div class="overview-item" v-if="!isM2MLIGHTOrder">
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
          <p v-if="getFromOrder('address.countryName')">
            {{ getFromOrder('address.countryName') }}
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
        <div class="overview-item" v-if="!isM2MLIGHTOrder">
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
          <p>
            <template v-if="getFromOrder('customerAccount.address.zipCode')"
              >{{ getFromOrder('customerAccount.address.zipCode') }} -</template
            >
            <template v-if="getFromOrder('customerAccount.address.city')">{{
              getFromOrder('customerAccount.address.city')
            }}</template>
          </p>
          <p v-if="getFromOrder('address.countryName')">
            {{ getFromOrder('customerAccount.address.countryName') }}
          </p>
        </div>
      </div>

      <div class="overview-container m-3 bg-white bottom-space" v-if="!isM2MLIGHTOrder">
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

const chronopostLink = 'https://www.chronopost.fr/tracking-no-cms/suivi-page?listeNumerosLT=';

export default {
  data() {
    return {
      packNumLink: '',
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
      koStepper: [
        {
          code: 'NOT_VALIDATED',
          label: this.$t('orders.detail.statuses.NOT_VALIDATED'),
          date: null,
          index: 0,
          statusError: false,
        },
        {
          code: 'FAILED',
          label: this.$t('orders.detail.statuses.KO'),
          date: null,
          index: 1,
          statusError: true,
        },
      ],
    };
  },

  mounted() {
    if (this.isM2MLIGHTOrder) {
      // see docs ticket https://m2m-gitlab.by-docapost.com/powwow-ng/backlog/-/issues/3072
      this.confirmationStepper = [
        {
          code: this.saveStep.code,
          label: this.saveStep.label,
          date: null,
          index: 0,
        },
        {
          code: this.paymentStep.code,
          label: this.paymentStep.label,
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
    } else {
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
    }
    this.packNumLink = chronopostLink + this.getFromOrder('packageNum');
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
      const queryFilters = [{ id: 'filters.lines.orderID', value: `${this.order.id}` }];
      this.$router
        .push({
          name: 'actLines',
          params: {
            queryFilters,
          },
        })
        .catch(() => {});
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
    ...mapGetters(['userIsBO', 'userInfos', 'havePermission']),
    isM2MLIGHTOrder() {
      return this.order && this.order.party && this.order.party.partyType === 'M2M_LIGHT';
    },
    creatorTitle() {
      const title = this.getFromOrder('auditable.creator.name.title');
      if (!title) return '';
      return this.$t('common.' + title);
    },
    steps() {
      let stepsToUse;
      if (this.order.status === 'CANCELED') {
        stepsToUse = this.cancelStepper;
      } else if (this.order.status === 'FAILED') {
        stepsToUse = this.koStepper;
      } else {
        stepsToUse = this.confirmationStepper;
      }
      if (!this.isM2MLIGHTOrder) {
        stepsToUse = stepsToUse.map((s) => {
          if (!this.order.orderStatusHistories) return;
          // on matche entre le statut de la commande et le statut identique dans l'historique des statuts
          const historyEntry = this.order.orderStatusHistories.find((h) => h.status === s.code);
          // Pour les commandes classiques, on récupère le statut de la commande et on matche ce statut avec l'historique des statuts
          if (historyEntry) {
            // on ajoute la date issue de l'historique des statuts
            s.date = historyEntry.statusDate;
          }
          return s;
        });
      } else {
        stepsToUse = stepsToUse.map((s) => {
          if (!this.order.orderStatusHistories) return;
          const historyEntry = this.order.orderStatusHistories.find((h) => h.status === s.code);
          if (historyEntry) {
            if (
              (this.order.status === 'WAITING_FOR_PAYMENT' &&
                historyEntry.status === 'WAITING_FOR_PAYMENT') ||
              (this.order.status === 'TO_BE_CONFIRMED' &&
                historyEntry.status === 'TO_BE_CONFIRMED') ||
              (this.order.status === 'TO_BE_CONFIRMED_BY_BO' &&
                historyEntry.status === 'TO_BE_CONFIRMED_BY_BO') ||
              (this.order.status === 'CONFIRMATION_IN_PROGRESS' &&
                historyEntry.status === 'CONFIRMATION_IN_PROGRESS')
            ) {
              s.date = null;
            } else {
              s.date = historyEntry.statusDate;
            }
          }
          return s;
        });
      }

      return {
        data: stepsToUse,
      };
    },
    statusStepperIndex() {
      if (!this.steps || !this.steps.data || !this.order.status) return;
      const res = this.steps.data.find((c) => c.code === this.order.status);
      if (res) {
        // cas spécifique pour les Offres Digitales
        if (this.order.status === 'WAITING_FOR_PAYMENT') {
          res.index = 0;
        } else if (
          this.isM2MLIGHTOrder &&
          (this.order.status === 'TO_BE_CONFIRMED' ||
            this.order.status === 'TO_BE_CONFIRMED_BY_BO' ||
            this.order.status === 'CONFIRMATION_IN_PROGRESS')
        ) {
          res.index = 1;
        }
        return res.index;
      } else {
        return null;
      }
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
    saveStep() {
      let code, label;
      if (this.order.status === 'NOT_VALIDATED') {
        code = 'NOT_VALIDATED';
        label = this.$t('orders.detail.statuses.SAVED');
      } else if (this.order.status === 'VALIDATED') {
        code = 'VALIDATED';
        label = this.$t('orders.detail.statuses.SAVED');
      } else {
        // defaults values are 'NOT_VALIDATED'
        code = 'NOT_VALIDATED';
        label = this.$t('orders.detail.statuses.SAVED');
      }
      return { code, label };
    },
    confirmStep() {
      let code, label;
      if (!this.isM2MLIGHTOrder) {
        if (this.order.status === 'CONFIRMED') {
          code = 'CONFIRMED';
          label = this.$t('orders.detail.statuses.CONFIRMED');
        } else if (this.order.status === 'TO_BE_CONFIRMED') {
          code = 'TO_BE_CONFIRMED';
          label = this.$t('col.statuses.TO_BE_CONFIRMED');
        } else if (this.order.status === 'TO_BE_CONFIRMED_BY_BO') {
          code = 'TO_BE_CONFIRMED_BY_BO';
          label = this.$t('col.statuses.TO_BE_CONFIRMED_BY_BO');
        } else if (this.order.status === 'CONFIRMATION_IN_PROGRESS') {
          code = 'CONFIRMATION_IN_PROGRESS';
          label = this.$t('orders.detail.statuses.CONFIRMATION_IN_PROGRESS');
        } else {
          // defaults values are 'CONFIRMED'
          code = 'CONFIRMED';
          label = this.$t('orders.detail.statuses.CONFIRMED');
        }
      } else {
        if (this.order.status === 'CONFIRMED') {
          code = 'CONFIRMED';
          label = this.$t('orders.detail.statuses.VALIDATED');
        } else if (this.order.status === 'TERMINATED') {
          code = 'CONFIRMED';
          label = this.$t('orders.detail.statuses.VALIDATED');
        } else if (this.order.status === 'TO_BE_CONFIRMED') {
          code = 'TO_BE_CONFIRMED';
          label = this.$t('orders.detail.statuses.VALIDATION');
        } else if (this.order.status === 'TO_BE_CONFIRMED_BY_BO') {
          code = 'TO_BE_CONFIRMED_BY_BO';
          label = this.$t('orders.detail.statuses.VALIDATION');
        } else if (this.order.status === 'CONFIRMATION_IN_PROGRESS') {
          code = 'CONFIRMATION_IN_PROGRESS';
          label = this.$t('orders.detail.statuses.VALIDATION');
        } else {
          // defaults values are 'TO_BE_CONFIRMED'
          code = 'TO_BE_CONFIRMED';
          label = this.$t('orders.detail.statuses.VALIDATION');
        }
      }
      return { code, label };
    },
    paymentStep() {
      let code, label;
      if (this.order.status === 'WAITING_FOR_PAYMENT') {
        code = 'WAITING_FOR_PAYMENT';
        label = this.$t('orders.detail.statuses.WAITING_FOR_PAYMENT');
      } else if (
        this.order.status === 'CONFIRMED' ||
        this.order.status === 'TO_BE_CONFIRMED' ||
        this.order.status === 'TO_BE_CONFIRMED_BY_BO' ||
        this.order.status === 'CONFIRMATION_IN_PROGRESS' ||
        this.order.status === 'TERMINATED'
      ) {
        code = 'WAITING_FOR_PAYMENT';
        label = this.$t('orders.detail.statuses.PAYMENT_MADE');
      } else {
        // defaults values are 'WAITING_FOR_PAYMENT'
        code = 'WAITING_FOR_PAYMENT';
        label = this.$t('orders.detail.statuses.WAITING_FOR_PAYMENT');
      }
      return { code, label };
    },
    simType() {
      return this.order ? this.order.simcardType : undefined;
    },
  },

  watch: {
    confirmStep(newValue) {
      if (this.isM2MLIGHTOrder) {
        // see docs ticket https://m2m-gitlab.by-docapost.com/powwow-ng/backlog/-/issues/3072
        this.confirmationStepper = [
          {
            code: this.saveStep.code,
            label: this.saveStep.label,
            date: null,
            index: 0,
          },
          {
            code: this.paymentStep.code,
            label: this.paymentStep.label,
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
      } else {
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
      }

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
