<template>
  <BaseDetailPanelContent>
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

      <div class="overview-item mr-5">
        <h6>{{ $t('getparc.lineDetail.alarms.id') }}:</h6>
        <p>{{ content.id }}</p>
      </div>
      <div class="overview-item mr-5">
        <h6>{{ $t('getparc.lineDetail.alarms.type') }}:</h6>
        <p>{{ $t('alarms.' + content.type) }}</p>
      </div>
      <div v-if="content.alarmScope" class="overview-item mr-5 alarm-range">
        <h6>{{ $t('getvsion.filters.ALARMS_SCOPE') }}:</h6>
        <p>{{ $t(scopeTradKey) }}</p>
      </div>
      <div v-if="billingAccount" class="overview-item mr-5">
        <h6>{{ $t('common.billingAccount') }}:</h6>
        <p>
          {{ billingAccount }}
        </p>
      </div>
      <div v-if="offer" class="overview-item mr-5">
        <h6>{{ $t('alarms.alarmScope.OFFER') }}:</h6>
        <p>{{ offer }}</p>
      </div>
      <div class="overview-item mr-5">
        <h6>{{ $t('getparc.history.details.quantityTargeted') }}:</h6>
        <a
          style="font-size: 0.8rem"
          v-if="numberOfTargetedLines && !isPoolAlarm"
          href="#"
          @click.prevent="gotoTargetedAlarms()"
          >{{ numberOfTargetedLines }}</a
        >
        <p v-else-if="numberOfTargetedLines && isPoolAlarm">{{ numberOfTargetedLines }}</p>
        <p v-else>-</p>
      </div>

      <div class="overview-item mr-5" v-if="!isPoolAlarm">
        <h6>{{ $t('getvsion.triggered_this_month') }}:</h6>
        <p>{{ nbOfEventsForCurrentMonth + ' ligne(s)' }}</p>
      </div>

      <div class="overview-item mr-5">
        <h6>{{ $t('getvsion.table.thresholds') }}:</h6>
        <Thresholds :alarm="content" />
      </div>
      <div class="overview-item mr-5" v-if="!isPoolAlarm">
        <h6>{{ $t('getparc.lineDetail.alarms.observationCycle') }}:</h6>
        <p>{{ finalTextObservationCycle }}</p>
      </div>
      <div class="overview-item mr-5">
        <h6>{{ $t('filters.lines.activationDate') }}:</h6>
        <p class="text-success">{{ content.startDate || '-' }}</p>
      </div>
    </div>

    <!-- ACCOUNT INFORMATION -->
    <div v-if="!userIsPartner" class="overview-container m-3 bg-white">
      <div class="overview-item">
        <h4 class="font-weight-normal text-uppercase">{{ $t('getvsion.account-info') }}</h4>
      </div>
      <div class="overview-item mr-5 alarm-partner">
        <h6>{{ $t('alarms.alarmScope.PARTY') }}:</h6>
        <p>{{ partner }}</p>
      </div>
    </div>

    <!-- NOTIFICATIONS -->
    <div class="overview-container m-3 bg-white bottom-space">
      <div class="overview-item">
        <h4 class="font-weight-normal text-uppercase">{{ $t('getvsion.notifications') }}</h4>
      </div>
      <div class="overview-item mr-5">
        <h6>{{ $t('getvsion.notify-mail') }}:</h6>
        <p :class="{ 'text-success': content.notifyByEmail }">
          {{ content.notifyByEmail ? 'Oui' : 'Non' }}
        </p>
      </div>

      <div v-if="content.mailingList" class="overview-item mr-5">
        <h6>{{ $t('getvsion.mailing-list') }}:</h6>
        <p>{{ content.mailingList.name }}</p>
      </div>

      <div class="overview-item mr-5">
        <h6>{{ $t('getvsion.notify-ws') }}:</h6>
        <p :class="{ 'text-success': content.notifyByWs }">
          {{ content.notifyByWs ? 'Oui' : 'Non' }}
        </p>
      </div>
    </div>

    <div slot="footer" class="action-buttons">
      <div>
        <UiButton variant="import" @click="editThisAlarm" block>{{
          $t('getvsion.detail-panel.change-alarm')
        }}</UiButton>
      </div>
      <div class="goto-detail-button" v-if="alarmType !== 'OVER_CONSUMPTION_VOLUME_FLOTTE'">
        <UiButton variant="primary" @click="gotoDetail" block>{{
          $t('alarms.MORE_DETAIL')
        }}</UiButton>
      </div>
    </div>
  </BaseDetailPanelContent>
</template>

<script>
import BaseDetailPanelContent from '@/components/BaseDetailPanelContent';
import StepperNonLinear from '@/components/ui/StepperNonLinear';
import Thresholds from '@/components/Thresholds';
import UiButton from '@/components/ui/Button';
import { fetchTriggerHistory } from '@/api/alarms';
import { mapGetters, mapState, mapMutations } from 'vuex';
import { getCurrentMonthName, getMonthString } from '@/utils/date';

export default {
  components: {
    BaseDetailPanelContent,
    StepperNonLinear,
    Thresholds,
    UiButton,
  },
  props: {
    content: Object,
  },
  async mounted() {
    const triggerHistory = await fetchTriggerHistory(this.content.id);

    this.steps = {
      data: [
        {
          code: 'NOT_VALIDATED',
          label: this.$t('getvsion.detail-panel.stepper.created'),
          date: this.content.auditable.created,
          index: 0,
        },
        {
          code: this.statusCode,
          label: this.$t('getvsion.alarm.statuses.' + this.status),
          date: this.statusDate,
          index: 1,
        },
      ],
    };

    this.triggerHistory = triggerHistory;
  },
  data() {
    return {
      steps: {},
      statusStepperIndex: this.content.startDate ? 1 : 0,
      triggerHistory: undefined,
    };
  },
  computed: {
    ...mapGetters(['userIsPartner']),
    ...mapState({
      isOpen: (state) => state.ui.isPanelOpen,
    }),

    scopeTradKey() {
      if (this.content) {
        if (this.content.alarmScope === 'OFFER') {
          return 'alarms.offer_cf';
        }
        return 'alarms.alarmScope.' + this.content.alarmScope;
      }

      return '';
    },

    numberOfTargetedLines() {
      if (this.alarmType === 'OVER_CONSUMPTION_VOLUME_FLOTTE') {
        return this.content.numberLines;
      }
      return this.content.numberOfTargetedLines;
    },

    billingAccount() {
      if (this.alarmType === 'OVER_CONSUMPTION_VOLUME_FLOTTE') {
        return this.content &&
          this.content.offerGroup &&
          this.content.offerGroup.offerInstance &&
          this.content.offerGroup.offerInstance.marketingOffer &&
          this.content.offerGroup.offerInstance.marketingOffer
          ? `${this.content.offerGroup.offerInstance.marketingOffer.code} - ${this.content.offerGroup.offerInstance.marketingOffer.description}`
          : '';
      }
      return this.content && this.content.autoPositionCustAccount
        ? `${this.content.autoPositionCustAccount.code} - ${this.content.autoPositionCustAccount.name}`
        : '';
    },

    offer() {
      if (this.alarmType === 'OVER_CONSUMPTION_VOLUME_FLOTTE') {
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
      if (this.observationCycle === 'CUSTOM' || this.observationCycle === null) {
        if (
          this.alarmType === 'OVER_CONSUMPTION_VOLUME' ||
          this.alarmType === 'UNDER_CONSUMPTION_VOLUME'
        ) {
          if (this.observationDelay !== null) {
            return `${this.$t('alarms.observationCycles.CUSTOM')} : ${
              this.observationDelay
            } ${this.$t('alarms.observationCycles.DAYS')}`;
          }
          return `${this.$t('alarms.observationCycles.CUSTOM')}`;
        }
        return `${this.$t('notAvailableShortCut')}`;
      } else {
        if (
          ['DAILY', 'WEEKLY', 'MONTHLY', 'CUSTOM', 'DAYS'].find((o) => o === this.observationCycle)
        ) {
          return this.$t('alarms.observationCycles.' + this.observationCycle);
        }
        return this.observationCycle;
      }
    },

    nbOfEventsForCurrentMonth() {
      if (this.triggerHistory) {
        const triggerForCurrrentMonth = this.triggerHistory.items.filter(
          (i) => getMonthString(i.emissionDate) === getCurrentMonthName()
        );
        return triggerForCurrrentMonth.length;
      }

      return 0;
    },

    partner() {
      return this.$loGet(this.content, 'party.name', '-');
    },

    alarmType() {
      return this.$loGet(this.content, 'type', '-');
    },

    observationCycle() {
      return this.$loGet(this.content, 'observationCycle', null);
    },
    observationDelay() {
      return this.$loGet(this.content, 'observationDelay', null);
    },

    isPoolAlarm() {
      return ['OVER_CONSUMPTION_VOLUME_FLOTTE'].includes(this.alarmType);
    },

    status() {
      if (this.$loGet(this.content, 'disabled')) {
        return 'disabled';
      } else {
        if (!this.$loGet(this.content, 'startDate')) {
          return 'created';
        } else {
          return 'activated';
        }
      }
    },
    statusDate() {
      if (this.$loGet(this.content, 'disabled')) {
        if (this.$loGet(this.content, 'auditable.updated'))
          return this.$loGet(this.content, 'auditable.updated');

        return this.$loGet(this.content, 'auditable.created');
      } else {
        if (!this.$loGet(this.content, 'startDate')) {
          return this.$loGet(this.content, 'auditable.created');
        } else {
          return this.$loGet(this.content, 'startDate');
        }
      }
    },
    statusCode() {
      if (this.$loGet(this.content, 'disabled')) {
        return 'NOT_VALIDATED';
      } else {
        return 'VALIDATED';
      }
    },
  },

  methods: {
    ...mapMutations(['openPanel']),

    gotoTargetedAlarms() {
      this.$router
        .push({
          name: 'alarmDetail',
          params: { alarmId: this.content.id, tabIndex: 1 },
        })
        .catch(() => {});
    },

    editThisAlarm() {
      if (this.content.type === 'OVER_CONSUMPTION_VOLUME_FLOTTE') {
        this.openDetailPanel();
      } else {
        this.$router
          .push({
            name: 'alarmDetail',
            params: { alarmId: this.content.id, editMode: true, alarmType: this.content.type },
          })
          .catch(() => {});
      }
    },

    gotoDetail() {
      this.$router
        .push({
          name: 'alarmDetail',
          params: { alarmId: this.content.id },
        })
        .catch(() => {});
    },

    openDetailPanel() {
      const openTrigger = () => {
        this.openPanel({
          title: this.$t('getvsion.detail-panel.change-alarm'),
          panelId: 'getvsion.table.create-alarm',
          payload: {
            duplicateFrom: { ...this.content, toModify: true },
          },
          wide: true,
          backdrop: true,
          ignoreClickAway: true,
        });
      };

      /**
       * On veut attendre que le panel existant soit fermé avant de réouvrir un nouveau panel
       */
      if (this.isOpen) {
        setTimeout(openTrigger, 500);
      } else {
        openTrigger();
      }
    },
  },
};
</script>
