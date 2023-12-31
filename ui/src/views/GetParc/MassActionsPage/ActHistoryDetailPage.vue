<template>
  <div class="main-content data-detail-container">
    <div class="overview-container m-3 bg-white">
      <div class="d-flex header">
        <div class="flex-grow-1 mb-3">
          <h4 class="detail-title">{{ $t('getparc.history.details.detailTitle') }}</h4>
        </div>
        <div class="d-flex">
          <div v-if="content.cancellable" class="mr-2">
            <UiButton variant="danger" block @click="onCancelClick">{{
              $t('getparc.history.actions.CANCEL')
            }}</UiButton>
          </div>
          <div>
            <ExportButton
              :export-fn="getExportFn()"
              :columns="columns"
              :order-by="orderBy"
              button-style
            >
              <span slot="title">{{
                $t('getparc.history.details.EXPORT_LINES', { total: $formatLargeNumber(total) })
              }}</span>
            </ExportButton>
          </div>
        </div>
      </div>

      <div class="d-flex">
        <div class="flex-fill">
          <div class="overview-item mr-5">
            <StepperNonLinear
              v-if="statusStepperIndex"
              :stepper-data="steps"
              :current-index="statusStepperIndex"
            />
          </div>
          <div class="overview-item mr-5">
            <h6>{{ $t('getparc.history.details.massActionDateCreated') }} :</h6>
            <p>{{ $loGet(content, 'massAction.created', '-') }}</p>
          </div>
          <div class="overview-item mr-5">
            <h6>{{ $t('getparc.history.details.massActionDateStarted') }} :</h6>
            <p>{{ $loGet(content, 'massAction.dueDate', '-') }}</p>
          </div>
          <div class="overview-item mr-5">
            <h6>{{ $t('getparc.history.details.massActionDateEnded') }} :</h6>
            <p>{{ $loGet(content, 'massAction.ended', '-') }}</p>
          </div>
        </div>

        <div class="flex-fill">
          <div class="overview-item mr-5">
            <h6>{{ $t('getparc.history.details.massActionDetail') }} :</h6>
            <p>{{ $loGet(content, 'info', '-') }}</p>
          </div>
          <div class="overview-item mr-5">
            <h6>{{ $t('getparc.history.details.name') }} :</h6>
            <p>{{ $loGet(content, 'partyName', '-') }}</p>
          </div>
          <div class="overview-item mr-5">
            <h6>{{ $t('getparc.history.details.creator') }} :</h6>
            <p>{{ $loGet(content, 'creatorUsername', '-') }}</p>
          </div>
          <div class="overview-item mr-5">
            <h6>{{ $t('getparc.history.details.creatorMail') }} :</h6>
            <p>{{ $loGet(content, 'creatorEmail', '-') }}</p>
          </div>
        </div>

        <div class="flex-fill">
          <div class="overview-item">
            <h6>{{ $t('getparc.history.details.quantityTargeted') }} :</h6>
            <p>
              {{ getFromContent('targetActionNumber') }}
              {{ $t('getparc.history.details.lines') }}
            </p>
          </div>
          <div class="overview-item">
            <h6>{{ $t('getparc.history.details.quantityFailed') }} :</h6>
            <p>
              {{
                content.failedEntitiesNumber > 0
                  ? `${content.failedEntitiesNumber} ${$t('getparc.history.details.lines')}`
                  : '-'
              }}
            </p>
          </div>
          <div class="overview-item">
            <h6>{{ $t('getparc.history.details.quantityInProgress') }} :</h6>
            <p>
              {{
                content.pendingEntitiesNumber > 0
                  ? `${content.pendingEntitiesNumber} ${$t('getparc.history.details.lines')}`
                  : '-'
              }}
            </p>
          </div>
          <div class="overview-item">
            <h6>{{ $t('getparc.history.details.quantityTerminated') }} :</h6>
            <p>
              {{
                content.completedEntitiesNumber > 0
                  ? `${content.completedEntitiesNumber} ${$t('getparc.history.details.lines')}`
                  : '-'
              }}
            </p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import StepperNonLinear from '@/components/ui/StepperNonLinear';
import get from 'lodash.get';
import ExportButton from '@/components/ExportButton';
import { exportMassAction, cancelMassAction } from '@/api/massActions';
import DetailsCell from '@/views/GetParc/UnitActionsPage/DetailsCell';
import UiButton from '@/components/ui/Button';
import { mapMutations } from 'vuex';

export default {
  components: {
    StepperNonLinear,
    ExportButton,
    UiButton,
  },
  props: {
    content: {
      type: Object,
    },
  },
  mounted() {
    this.confirmationStepper.data[0].date = this.createdDate;
    this.confirmationStepper.data[1].date = this.dueDate;
    this.confirmationStepper.data[2].date = this.endedDate;
    this.cancelStepper.data[0].date = this.createdDate;
  },
  data() {
    return {
      orderBy: {
        key: 'id',
        direction: 'DESC',
      },
      columns: [
        {
          id: 1,
          label: this.$t('getparc.actDetail.col.id'),
          name: 'id',
          orderable: true,
          visible: true,
          // exportId: 'UNKNOWN',
        },
        {
          id: 2,
          label: this.$t('getparc.actDetail.col.details'),
          name: 'ICCID',
          orderable: true,
          visible: true,
          format: {
            component: DetailsCell,
          },
        },
        {
          id: 3,
          label: this.$t('getparc.actDetail.col.msisdn'),
          name: 'msisdn',
          orderable: true,
          visible: true,
          exportId: 'MSISDN',
        },
        {
          id: 4,
          label: this.$t('getparc.actDetail.col.iccid'),
          name: 'ICCID',
          orderable: true,
          visible: true,
          exportId: 'ICCID',
        },

        {
          id: 5,
          label: this.$t('getparc.actDetail.col.actState'),
          name: 'status',
          orderable: true,
          visible: true,
          exportId: 'UNIT_ACTION_STATUS',
        },
        {
          id: 6,
          label: this.$t('getparc.actDetail.col.failDate'),
          name: 'statusDate',
          orderable: true,
          visible: true,
          // exportId: 'UNKNOWN',
        },
        {
          id: 7,
          label: this.$t('getparc.actDetail.col.failReason'),
          name: 'error_reason',
          orderable: true,
          visible: false,
          // exportId: 'UNKNOWN',
        },
        {
          id: 8,
          label: this.$t('getparc.actDetail.col.imsi'),
          name: 'imsi',
          orderable: true,
          visible: false,
          // exportId: 'UNKNOWN',
        },
        {
          id: 9,
          label: this.$t('getparc.actDetail.col.constructor'),
          name: 'manufacturer',
          orderable: true,
          visible: false,
          exportId: 'DEVICE_MANUFACTURER',
        },
        {
          id: 10,
          label: this.$t('getparc.actDetail.col.commercialRef'),
          name: 'deviceReference',
          orderable: true,
          visible: false,
          exportId: 'DEVICE_REFERENCE',
        },
        {
          id: 11,
          label: this.$t('getparc.actDetail.col.imei'),
          name: 'imei',
          orderable: true,
          visible: false,
          exportId: 'IMEI',
        },
      ],
      confirmationStepper: {
        data: [
          {
            code: 'WAITING',
            label: this.$t('getparc.history.details.actStatuses.CREATED'),
            date: undefined,
            index: 0,
          },
          {
            code: 'IN_PROGRESS',
            label: this.$t('getparc.history.details.actStatuses.STARTED'),
            date: undefined,
            index: 1,
          },
          {
            code: 'TERMINATED',
            label: this.$t('getparc.history.details.actStatuses.TERMINATED'),
            date: undefined,
            index: 2,
          },
        ],
      },
      cancelStepper: {
        data: [
          {
            code: 'WAITING',
            label: this.$t('getparc.history.details.actStatuses.CREATED'),
            date: undefined,
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
    };
  },

  methods: {
    ...mapMutations(['confirmAction']),
    onCancelClick() {
      const doReset = () => {
        this.$emit('cancelled');
      };
      this.confirmAction({
        message: 'confirmAction',
        actionFn: async () => {
          await cancelMassAction(this.content.massAction.id);
          doReset();
        },
      });
    },
    getFromContent(path, defaultValue = '') {
      const value = get(this.content, path, defaultValue);
      return value !== null ? value : '';
    },
    generateNewStatus(transitionName) {
      if (transitionName.includes('suspendre')) {
        return this.$t('getparc.history.details.CHANGE_STATUS.suspended');
      } else if (transitionName.includes('reactiver')) {
        return this.$t('getparc.history.details.CHANGE_STATUS.reactivated');
      } else if (transitionName.includes('activer')) {
        return this.$t('getparc.history.details.CHANGE_STATUS.activated');
      } else if (transitionName.includes('resilier')) {
        return this.$t('getparc.history.details.CHANGE_STATUS.terminated');
      } else {
        return transitionName;
      }
    },
    getExportFn() {
      return async (columnsParam, orderBy, exportFormat, asyncExportRequest) => {
        return await exportMassAction(
          this.content.massAction.id,
          ['WAITING', 'SENT', 'IN_PROGRESS', 'OK', 'KO', 'REPLAYED', 'CANCELLED'],
          'NONE',
          [
            'MASS_ACTION_ID',
            'MASS_ACTION_INFO',
            'UNIT_ACTION_ID',
            'UNIT_ACTION_TYPE',
            'UNIT_ACTION_INFO',
            'ICCID',
            'UNIT_ACTION_STATUS',
            'UNIT_ACTION_START_DATE',
            'UNIT_ACTION_END_DATE',
            'UNIT_ACTION_STATUS_DATE',
            'UNIT_ACTION_STATUS_ERROR',
            'MSISDN',
            'DEVICE_MANUFACTURER',
            'DEVICE_REFERENCE',
            'IMEI',
            'LOGIN',
            'PREACTIVATION_DATE',
            'ACTIVATION_DATE',
          ],
          exportFormat,
          asyncExportRequest
        );
      };
    },
  },

  computed: {
    steps() {
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
    total() {
      return this.content ? this.content.targetActionNumber : 0;
    },
    actStatus() {
      return this.content ? this.content.statusCode : '';
    },
    createdDate() {
      return this.content ? this.content.massAction.created : '';
    },
    dueDate() {
      return this.content ? this.content.massAction.dueDate : '';
    },
    endedDate() {
      return this.content ? this.content.massAction.endDate : '';
    },
  },
};
</script>

<style lang="scss" scoped>
$fontSize: 0.8rem;
.main-content {
  padding-bottom: 4vh;
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
    .detail-title {
      text-transform: uppercase;
      font-size: 1rem;
      line-height: 3rem;
      font-weight: 600;
    }
    .overview-item {
      padding: 7px 10px 7px 0;
      border-bottom: 1px dashed $medium-gray;
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
