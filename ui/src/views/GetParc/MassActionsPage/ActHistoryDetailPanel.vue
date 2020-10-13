<template>
  <div class="panel-vertical-container">
    <div v-if="!content.row" class="alert" role="alert">
      {{ $t('getparc.history.details.noResult') }}
    </div>
    <div v-else>
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
            <p>{{ getFromContent('info') }}</p>
          </div>
          <div class="overview-item d-flex">
            <div class="flex-grow-1">
              <h6>{{ $t('getparc.history.details.quantityTargeted') }} :</h6>
              <p>
                {{ getFromContent('targetActionNumber') }}
                {{ $t('getparc.history.details.lines') }}
              </p>
            </div>
            <UiButton
              variant="import"
              @click="$router.push({ name: 'actDetail', params: { massActionId: content.row.id } })"
            >
              <span>{{ $t('getparc.history.details.MORE_DETAIL') }}</span>
            </UiButton>
          </div>
          <div class="overview-item">
            <h6>{{ $t('getparc.history.details.quantityFailed') }} :</h6>
            <template v-if="content.row.failedEntitiesNumber > 0">
              <p>
                <button
                  class="btn btn-link btn-select p-0"
                  @click="
                    $router.push({
                      name: 'actDetail',
                      params: { massActionId: content.row.id, index: 0 },
                    })
                  "
                >
                  {{ `${content.row.failedEntitiesNumber} ${$t('getparc.history.details.lines')}` }}
                </button>
              </p>
            </template>
            <template v-else>
              <p>-</p>
            </template>
          </div>
          <div class="overview-item">
            <h6>{{ $t('getparc.history.details.quantityInProgress') }} :</h6>
            <template v-if="content.row.pendingEntitiesNumber > 0">
              <p>
                <button
                  class="btn btn-link btn-select p-0"
                  @click="
                    $router.push({
                      name: 'actDetail',
                      params: { massActionId: content.row.id, index: 1 },
                    })
                  "
                >
                  {{
                    `${content.row.pendingEntitiesNumber} ${$t('getparc.history.details.lines')}`
                  }}
                </button>
              </p>
            </template>
            <template v-else>
              <p>-</p>
            </template>
          </div>
          <div class="overview-item">
            <h6>{{ $t('getparc.history.details.quantityTerminated') }} :</h6>
            <template v-if="content.row.completedEntitiesNumber > 0">
              <p>
                <button
                  class="btn btn-link btn-select p-0"
                  @click="
                    $router.push({
                      name: 'actDetail',
                      params: { massActionId: content.row.id, index: 2 },
                    })
                  "
                >
                  {{
                    `${content.row.completedEntitiesNumber} ${$t('getparc.history.details.lines')}`
                  }}
                </button>
              </p>
            </template>
            <template v-else>
              <p>-</p>
            </template>
          </div>
          <div class="overview-item">
            <h6>{{ $t('getparc.history.details.massActionDateCreated') }} :</h6>
            <p>{{ getFromContent('massAction.created') }}</p>
          </div>
          <div class="overview-item">
            <h6>{{ $t('getparc.history.details.massActionDateStarted') }} :</h6>
            <p>{{ getFromContent('massAction.dueDate') }}</p>
          </div>
          <div class="overview-item">
            <h6>{{ $t('getparc.history.details.massActionDateEnded') }} :</h6>
            <p>{{ getFromContent('massAction.ended') }}</p>
          </div>
        </div>

        <div class="overview-container m-3 bg-white">
          <div class="overview-item">
            <h4 class="font-weight-normal text-uppercase">{{ $t('col.partner') }}</h4>
          </div>
          <div class="overview-item mr-5">
            <h6>{{ $t('getparc.history.details.name') }} :</h6>
            <p>{{ getFromContent('partyName') }}</p>
          </div>
          <div class="overview-item mr-5">
            <h6>{{ $t('getparc.history.details.creator') }} :</h6>
            <p>{{ getFromContent('creatorUsername') }}</p>
          </div>
          <div class="overview-item mr-5">
            <h6>{{ $t('getparc.history.details.creatorMail') }} :</h6>
            <p>{{ getFromContent('creatorEmail') }}</p>
          </div>
        </div>
      </div>
      <div class="footer-back">
        <div class="action-buttons">
          <div>
            <template v-if="!content.row.cancellable">
              <ExportButton
                :export-fn="getExportFn()"
                :columns="columns"
                :order-by="orderBy"
                button-style
              >
                <span slot="title">{{ $t('getparc.history.details.EXPORT_ACT') }}</span>
              </ExportButton>
            </template>
            <template v-else>
              <UiButton variant="accent" block @click="onCancelClick">{{
                $t('getparc.history.actions.CANCEL')
              }}</UiButton>
            </template>
          </div>
          <div>
            <UiButton
              variant="primary"
              block
              @click="
                $router.push({
                  name: 'actDetail',
                  params: { massActionId: content.row.id, actHistoryTableFilters: content.filters },
                })
              "
              >{{ $t('getparc.history.details.RESULT') }}</UiButton
            >
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import StepperNonLinear from '@/components/ui/StepperNonLinear';
import UiButton from '@/components/ui/Button';
import get from 'lodash.get';
import ExportButton from '@/components/ExportButton';
import { exportMassAction, cancelMassAction } from '@/api/massActions';
import DetailsCell from '@/views/GetParc/UnitActionsPage/DetailsCell';
import { mapMutations } from 'vuex';

export default {
  props: {
    content: {
      type: Object,
    },
  },
  mounted() {
    if (this.content) {
      const contentPanel = this.content.row;
      this.actStatus = contentPanel.massAction.status;
      this.confirmationStepper = {
        data: [
          {
            code: 'WAITING',
            label: this.$t('getparc.history.details.actStatuses.CREATED'),
            date: contentPanel.created,
            index: 0,
          },
          {
            code: 'IN_PROGRESS',
            label: this.$t('getparc.history.details.actStatuses.STARTED'),
            date: contentPanel.dueDate,
            index: 1,
          },
          {
            code: 'TERMINATED',
            label: this.$t('getparc.history.details.actStatuses.TERMINATED'),
            date: contentPanel.ended,
            index: 2,
          },
        ],
      };
      this.cancelStepper = {
        data: [
          {
            code: 'WAITING',
            label: this.$t('getparc.history.details.actStatuses.CREATED'),
            date: contentPanel.created,
            index: 0,
          },
          {
            code: 'CANCELLED',
            label: this.$t('getparc.history.details.actStatuses.STARTED'),
            date: '',
            index: 1,
          },
        ],
      };
    }
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
      confirmationStepper: undefined,
      cancelStepper: undefined,
      // actStatus: this.content.massAction.status,
      actStatus: undefined,
    };
  },
  methods: {
    ...mapMutations(['flashMessage', 'closePanel']),

    async onCancelClick() {
      const response = await cancelMassAction(this.content.row.id);

      if (response) {
        this.flashMessage({ level: 'success', message: this.$t('genericSuccessMessage') });
        this.closePanel({ resetSearch: true });
      } else {
        this.flashMessage({ level: 'danger', message: this.$t('genericErrorMessage') });
      }
    },
    getFromContent(path, defaultValue = '') {
      const value = get(this.content.row, path, defaultValue);
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
          this.content.row.id,
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
    ExportButton,
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
        button {
          font-size: $fontSize;
        }
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
