<template>
  <div class="bg-white p-4 rounded">
    <h6 class="title">{{ $t('getvsion.alarm-detail') }}</h6>

    <div class="row">
      <div class="col">
        <div class="d-flex">
          <div class="item">
            <StepperNonLinear
              v-if="statusStepperIndex != null"
              :stepper-data="steps"
              :current-index="statusStepperIndex"
            />
          </div>
          <div class="item">
            <h6>{{ $t('getparc.history.details.quantityTargeted') }}:</h6>
            <p>{{ content.numberOfTargetedLines }}</p>
          </div>
        </div>
        <hr />

        <div class="d-flex">
          <div class="item">
            <h6>{{ $t('getparc.lineDetail.alarms.type') }}:</h6>
            <p>{{ $t('getparc.lineDetail.alarms.ALARM_TYPE.' + content.type) }}</p>
          </div>
          <div class="item">
            <h6>{{ $t('getvsion.filters.ALARMS_SCOPE') }}:</h6>
            <p>{{ alarmScope }}</p>

            <template v-if="offer">
              <p class="text-small">
                <strong> {{ $t('alarms.alarmScope.OFFER') }} </strong>: {{ offer }}
              </p>
            </template>
            <template v-if="billingAccount">
              <p class="text-small">
                <strong> {{ $t('alarms.alarmScope.CUSTOMER_ACCOUNT') }} </strong>:
                {{ billingAccount }}
              </p>
            </template>
          </div>
        </div>
      </div>
      <div class="col">
        <div class="row">
          <div class="col-md-4">
            <div class="item">
              <h6>{{ $t('getvsion.table.thresholds') }}:</h6>
              <Thresholds :alarm="content" />
            </div>
          </div>
          <div class="col-md-8">
            <div class="d-flex">
              <div class="item">
                <h6>{{ $t('filters.lines.activationDate') }}:</h6>
                <p>{{ content.startDate ? content.startDate : '-' }}</p>
              </div>

              <div class="item">
                <h6>{{ $t('col.partner') }}:</h6>
                <p>{{ get('party.name') }}</p>
              </div>

              <div v-if="content.mailingList" class="item">
                <h6>{{ $t('getvsion.mailing-list') }}:</h6>
                <p>{{ get('mailingList.name') }}</p>
              </div>
            </div>
            <hr />
            <div class="d-flex">
              <div class="item">
                <h6>{{ $t('getparc.lineDetail.alarms.observationCycle') }}:</h6>
                <p>
                  {{ finalTextObservationCycle }}
                </p>
              </div>
              <div class="item">
                <h6>{{ $t('getvsion.notify-mail') }}:</h6>
                <p>{{ content.notifyByEmail ? 'Oui' : 'Non' }}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import StepperNonLinear from '@/components/ui/StepperNonLinear';
import Thresholds from '@/components/Thresholds';
import get from 'lodash.get';

export default {
  components: {
    StepperNonLinear,
    Thresholds,
  },
  props: {
    content: Object,
  },

  methods: {
    get(path) {
      return get(this.content, path);
    },
  },

  mounted() {
    this.steps = {
      data: [
        {
          code: 'NOT_VALIDATED',
          label: this.$t('getvsion.detail-panel.stepper.created'),
          date: this.content.auditable.created,
          index: 0,
        },
        {
          code: 'VALIDATED',
          label: this.$t('getparc.actLines.simStatuses.ACTIVATED'),
          date: this.content.StartDate,
          index: 1,
        },
      ],
    };
  },

  data() {
    return {
      statusStepperIndex: 1,
      steps: {},
    };
  },

  computed: {
    billingAccount() {
      if (this.content && this.content.type === 'OVER_CONSUMPTION_VOLUME_FLOTTE') {
        return this.content &&
          this.content.offerGroup &&
          this.content.offerGroup.offerInstance &&
          this.content.offerGroup.offerInstance.marketingOffer &&
          this.content.offerGroup.offerInstance.marketingOffer
          ? `${this.content.offerGroup.offerInstance.marketingOffer.code} - ${this.content.offerGroup.offerInstance.marketingOffer.description}`
          : '';
      }
      return this.content && this.content.autoPositionCustAccount
        ? `${this.content.autoPositionCustAccount.id} - ${this.content.autoPositionCustAccount.name}`
        : '';
    },

    offer() {
      if (this.content && this.content.type === 'OVER_CONSUMPTION_VOLUME_FLOTTE') {
        return this.content && this.content.offerGroup && this.content.offerGroup.customerAccount
          ? `${this.content.offerGroup.customerAccount.code} - ${this.content.offerGroup.customerAccount.name}`
          : '';
      }
      return this.content &&
        this.content.autoPositionWorkflow &&
        this.content.autoPositionWorkflow.workflowDescription
        ? this.content.autoPositionWorkflow.workflowDescription
        : '';
    },
    finalTextObservationCycle() {
      if (this.content.observationCycle === 'CUSTOM' || this.content.observationCycle === null) {
        if (
          this.content.type === 'OVER_CONSUMPTION_VOLUME' ||
          this.content.type === 'UNDER_CONSUMPTION_VOLUME'
        ) {
          if (this.content.observationDelay !== null) {
            return `${this.$t('alarms.observationCycles.CUSTOM')} : ${
              this.content.observationDelay
            } ${this.$t('alarms.observationCycles.DAYS')}`;
          }
          return `${this.$t('alarms.observationCycles.CUSTOM')}`;
        }
        return `${this.$t('notAvailableShortCut')}`;
      } else {
        if (
          ['DAILY', 'WEEKLY', 'MONTHLY', 'CUSTOM', 'DAYS'].find(
            (o) => o === this.content.observationCycle
          )
        ) {
          return this.$t('alarms.observationCycles.' + this.content.observationCycle);
        }
        return this.observationCycle;
      }
    },
    alarmScope() {
      const alarmScope = this.get('alarmScope');
      return alarmScope ? this.$t('alarms.alarmScope.' + alarmScope) : '-';
    },
  },
};
</script>

<style lang="scss" scoped>
hr {
  border-bottom: 1px dashed #dddddd;
  margin-top: 0;
  margin-bottom: 0.8rem;
}
.item {
  margin-right: 0.5rem;
  flex-grow: 1;
  h6 {
    color: #7d7d7d;
    font-size: 0.8rem;
    font-weight: 400;
  }
}

.title {
  text-transform: uppercase;
  font-size: 1.2rem;
  margin-bottom: 1rem;
}

.text-small {
  font-size: 0.75rem;
}
</style>
