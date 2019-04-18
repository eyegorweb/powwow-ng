<template>
  <div class="panel-vertical-container">
    <div class="main-content data-detail-container">
      <div class="overview-container m-3 bg-white">
        <div class="overview-item">
          <h4 class="font-weight-normal text-uppercase">{{ $t('orders.detail.information') }}</h4>
        </div>
        <div class="overview-item">
          <StepperNonLinear
            v-if="statusStepperIndex"
            :stepper-data="steps"
            :current-index="statusStepperIndex"
          />
        </div>
        <div class="overview-item">
          <h6>{{ $t('getparc.history.details.massActionDetail') }} :</h6>
          <p v-html="detail"></p>
        </div>
        <div class="overview-item">
          <h6>{{ $t('getparc.history.details.quantityTargeted') }} :</h6>
          <p>{{ content.targetActionNumber }} {{ $t('getparc.history.details.lines') }}</p>
        </div>
        <div class="overview-item">
          <h6>{{ $t('getparc.history.details.quantityFailed') }} :</h6>
          <p>{{ content.errorActionNumber > 0 ? content.errorActionNumber : '-' }}</p>
        </div>
        <div class="overview-item">
          <h6>{{ $t('getparc.history.details.quantityInProgress') }} :</h6>
          <p>{{ content.inProgressActionNumber > 0 ? content.inProgressActionNumber : '-' }}</p>
        </div>
        <div class="overview-item">
          <h6>{{ $t('getparc.history.details.quantityTerminated') }} :</h6>
          <p>{{ content.completedActionNumber > 0 ? content.completedActionNumber : '-' }}</p>
        </div>
        <div class="overview-item">
          <h6>{{ $t('getparc.history.details.massActionDateCreated') }} :</h6>
          <p>{{ content.created }}</p>
        </div>
        <div class="overview-item">
          <h6>{{ $t('getparc.history.details.massActionDateStarted') }} :</h6>
          <p>{{ content.dueDate }}</p>
        </div>
        <div class="overview-item">
          <h6>{{ $t('getparc.history.details.massActionDateEnded') }} :</h6>
          <p>{{ content.endDate }}</p>
        </div>
      </div>

      <div class="overview-container m-3 bg-white">
        <div class="overview-item">
          <h4 class="font-weight-normal text-uppercase">{{ $t('col.partner') }}</h4>
        </div>
        <div class="overview-item">
          <h6>{{ $t('getparc.history.details.name') }} :</h6>
          <p>SCHINDLER</p>
        </div>
        <div class="overview-item">
          <h6>{{ $t('getparc.history.details.creator') }} :</h6>
          <p>Julian Le Calvez</p>
        </div>
        <div class="overview-item">
          <h6>{{ $t('getparc.history.details.creatorMail') }} :</h6>
          <p>julian.lecalvez@schindler-france.com</p>
        </div>
      </div>
    </div>
    <div class="footer-back">
      <div class="action-buttons">
        <div>
          <UiButton variant="import" block>{{ $t('getparc.history.details.EXPORT_ACT') }}</UiButton>
        </div>
        <div>
          <UiButton variant="primary" block @click="$router.push({ name: 'actDetail' })">
            {{ $t('getparc.history.details.RESULT') }}
          </UiButton>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import StepperNonLinear from '@/components/ui/StepperNonLinear';
import UiButton from '@/components/ui/Button';

export default {
  props: {
    content: {
      type: Object,
    },
  },
  data() {
    return {
      confirmationStepper: {
        data: [
          {
            code: 'CREATED',
            label: this.$t('getparc.history.details.actStatuses.CREATED'),
            date: this.content.created,
            index: 0,
          },
          {
            code: 'IN_PROGRESS',
            label: this.$t('getparc.history.details.actStatuses.STARTED'),
            date: this.content.dueDate,
            index: 1,
          },
          {
            code: 'TERMINATED',
            label: this.$t('getparc.history.details.actStatuses.TERMINATED'),
            date: this.content.endDate,
            index: 2,
          },
        ],
      },
      cancelStepper: {
        data: [
          {
            code: 'CREATED',
            label: this.$t('getparc.history.details.actStatuses.CREATED'),
            date: this.content.created,
            index: 0,
          },
          {
            code: 'CANCELLED',
            label: this.$t('getparc.history.details.actStatuses.STARTED'),
            date: '',
            index: 1,
          },
        ],
      },
      actStatus: this.content.status,
    };
  },
  methods: {},
  computed: {
    detail() {
      const actionType = this.content.actionType;
      let currentDetail = ``;
      switch (actionType) {
        case 'ACTIVATION':
          currentDetail = `${this.$t('getparc.history.details.offer')}: ${this.content.offerName} `;
          break;
        case 'PREACTIVATION_ACTIVATION':
          currentDetail = `${this.$t('getparc.history.details.offer')}: ${this.content.offerName} `;
          break;
        case 'SERVICE_CHANGE':
          currentDetail = `${this.$t('getparc.history.details.SERVICE_CHANGE.ADDED')}: ${
            this.content.addedServices
          } <br> ${this.$t('getparc.history.details.SERVICE_CHANGE.REMOVED')}: ${
            this.content.removeServices
          }`;
          break;
        case 'STATUS_CHANGE':
          currentDetail = `${this.$t('getparc.history.details.newStatus')}: ${
            this.content.transitionName
          } `;
          break;
        // TODO: manque: résiliation/changement de statut / trasnfert / champs libres
        case 'CHANGE_CUSTOMER_ACCOUNT':
          currentDetail = `${this.$t('getparc.history.details.changeCf')}: ${
            this.content.destinationCustomerAccountCode
          } `;
          break;
        case 'CHANGE_OFFER':
          currentDetail = `${this.$t('getparc.history.details.newOffer')}: ${
            this.content.offerName
          } `;
          break;
        case 'SEND_SMS':
          currentDetail = `Message: ${this.content.message} <br> Shortcode: ${
            this.content.shortCode
          } `;
          break;
      }
      return currentDetail;
    },
    steps() {
      // Example
      let stepper;
      switch (this.actStatus) {
        case 'WAITING':
          stepper = this.confirmationStepper;
          break;
        case 'IN_PROGRESS':
          stepper = this.confirmationStepper;
          break;
        case 'IN_ERROR':
          stepper = [];
          break;
        case 'TERMINATED':
          stepper = this.confirmationStepper;
          break;
        case 'CANCELLED':
          stepper = this.cancelStepper;
          break;
      }
      return stepper;
    },
    statusStepperIndex() {
      // Example
      let stepperIndex;
      switch (this.actStatus) {
        case 'WAITING':
          stepperIndex = 0;
          break;
        case 'IN_PROGRESS':
          stepperIndex = 1;
          break;
        case 'IN_ERROR':
          stepperIndex = undefined;
          break;
        case 'TERMINATED':
          stepperIndex = 2;
          break;
        case 'CANCELLED':
          stepperIndex = 1;
          break;
      }
      return stepperIndex;
    },
  },

  components: {
    StepperNonLinear,
    UiButton,
  },
};
</script>

<style lang="scss" scoped>
$fontSize: 0.8rem;
.main-content {
  padding-bottom: 4vh;
}
.footer-back {
  padding: 0 1.25rem;
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
</style>
