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
      <div v-if="content.alarmScope" class="overview-item mr-5">
        <h6>{{ $t('getvsion.filters.ALARMS_OFFER') }}:</h6>
        <p>{{ $t('alarms.alarmScope.' + content.alarmScope) }}</p>
      </div>
      <div class="overview-item mr-5">
        <h6>{{ $t('getparc.history.details.quantityTargeted') }}:</h6>
        <a
          style="font-size: 0.8rem"
          v-if="content.numberOfTargetedLines"
          href="#"
          @click.prevent="gotoTargetedAlarms()"
          >{{ content.numberOfTargetedLines }}</a
        >
        <p v-else>-</p>
      </div>

      <div v-if="nbOfEventsForCurrentMonth" class="overview-item mr-5">
        <h6>{{ $t('getvsion.triggered_this_month') }}:</h6>
        <p>{{ nbOfEventsForCurrentMonth + ' ligne(s)' }}</p>
      </div>

      <div class="overview-item mr-5">
        <h6>{{ $t('getvsion.table.thresholds') }}:</h6>
        <Thresholds :alarm="content" />
      </div>
      <div class="overview-item mr-5">
        <h6>{{ $t('getparc.lineDetail.alarms.observationCycle') }}:</h6>
        <p>{{ finalTextObservationCycle }}</p>
      </div>
      <div class="overview-item mr-5">
        <h6>{{ $t('filters.lines.activationDate') }}:</h6>
        <p class="text-success">{{ content.startDate || '-' }}</p>
      </div>
    </div>
    <div v-if="userIsPartner" class="overview-container m-3 bg-white">
      <div class="overview-item">
        <h4 class="font-weight-normal text-uppercase">{{ $t('getvsion.account-info') }}</h4>
      </div>
      <div class="overview-item mr-5">
        <h6>{{ $t('col.partner') }}:</h6>
        <p>{{ partner }}</p>
      </div>
    </div>

    <!-- ACCOUNT INFORMATION -->
    <div class="overview-container m-3 bg-white">
      <div class="overview-item">
        <h4 class="font-weight-normal text-uppercase">{{ $t('getvsion.account-info') }}</h4>
      </div>
      <div class="overview-item mr-5">
        <h6>{{ $t('alarms.alarmScope.PARTY') }}:</h6>
        <p>{{ partner }}</p>
      </div>
      <div v-if="content.autoPositionCustAccount" class="overview-item mr-5">
        <h6>{{ $t('common.billingAccount') }}:</h6>
        <p>
          `{{ content.autoPositionCustAccount.id }} - {{ content.autoPositionCustAccount.name }}`
        </p>
      </div>
      <div v-if="content.autoPositionWorkflow" class="overview-item mr-5">
        <h6>{{ $t('alarms.alarmScope.OFFER') }}:</h6>
        <p>{{ content.autoPositionWorkflow.name }}</p>
      </div>
    </div>

    <!-- NOTIFICATIONS -->
    <div class="overview-container m-3 bg-white">
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
      <div>
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
import { mapGetters } from 'vuex';
import { getCurrentMonthName, getMonthString } from '@/utils/date';
import get from 'lodash.get';

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
          code: 'VALIDATED',
          label: this.$t('getparc.actLines.simStatuses.ACTIVATED'),
          date: this.content.StartDate,
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

    finalTextObservationCycle() {
      if (this.content.observationCycle === 'CUSTOM') {
        return `${this.$t('alarms.observationCycles.CUSTOM')} : ${
          this.content.observationDelay
        } ${this.$t('alarms.observationCycles.DAYS')}`;
      } else {
        return this.content.observationCycle;
      }
    },

    nbOfEventsForCurrentMonth() {
      if (this.triggerHistory) {
        const triggerForCurrrentMonth = this.triggerHistory.items.filter(
          i => getMonthString(i.emissionDate) === getCurrentMonthName()
        );
        return triggerForCurrrentMonth.length;
      }

      return undefined;
    },

    partner() {
      return get(this.content, 'party.name', '-');
    },
  },

  methods: {
    gotoTargetedAlarms() {
      this.$router.push({
        name: 'alarmDetail',
        params: { alarmId: this.content.id, tabIndex: 1 },
      });
    },

    editThisAlarm() {
      this.$router.push({
        name: 'alarmDetail',
        params: { alarmId: this.content.id, editMode: true },
      });
    },

    gotoDetail() {
      this.$router.push({
        name: 'alarmDetail',
        params: { alarmId: this.content.id },
      });
    },
  },
};
</script>
