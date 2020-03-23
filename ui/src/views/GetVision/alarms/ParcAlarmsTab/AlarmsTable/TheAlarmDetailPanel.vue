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
      <div class="overview-item mr-5">
        <h6>{{ $t('getvsion.filters.ALARMS_OFFER') }}:</h6>
        <p>{{ $t('alarms.alarmScope.' + content.alarmScope) }}</p>
      </div>
      <div class="overview-item mr-5">
        <h6>{{ $t('getparc.history.details.quantityTargeted') }}:</h6>
        <a
          style="font-size:0.8rem"
          v-if="content.numberOfTargetedLines"
          href="#"
          @click.prevent="gotoTargetedAlarms()"
        >{{ content.numberOfTargetedLines }}</a>
        <p v-else>-</p>
      </div>

      <div class="overview-item mr-5">
        <h6>{{ $t('getvsion.table.thresholds') }}:</h6>
        <Thresholds :alarm="content" />
      </div>
      <div class="overview-item mr-5">
        <h6>{{ $t('getparc.lineDetail.alarms.observationCycle') }}:</h6>
        <p>{{ content.observationCycle }}</p>
      </div>
      <div class="overview-item mr-5">
        <h6>{{ $t('filters.lines.activationDate') }}:</h6>
        <p>{{ content.startDate ? content.startDate : '-' }}</p>
      </div>
    </div>
    <div v-if="userIsPartner" class="overview-container m-3 bg-white">
      <div class="overview-item">
        <h4 class="font-weight-normal text-uppercase">{{ $t('getvsion.account-info') }}</h4>
      </div>
      <div class="overview-item mr-5">
        <h6>{{ $t('col.partner') }}:</h6>
        <p>{{ content.party.name }}</p>
      </div>
    </div>
    <div class="overview-container m-3 bg-white">
      <div class="overview-item">
        <h4 class="font-weight-normal text-uppercase">{{ $t('getvsion.notifications') }}</h4>
      </div>
      <div class="overview-item mr-5">
        <h6>{{ $t('getvsion.notify-mail') }}:</h6>
        <p>{{ content.notifyByEmail ? 'Oui' : 'Non' }}</p>
      </div>
      <div v-if="content.mailingList" class="overview-item mr-5">
        <h6>{{ $t('getvsion.mailing-list') }}:</h6>
        <p>{{ content.mailingList.name }}</p>
      </div>
      <div class="overview-item mr-5">
        <h6>{{ $t('getvsion.notify-ws') }}:</h6>
        <p>{{ content.notifyByWs ? 'Oui' : 'Non' }}</p>
      </div>
    </div>
    <ff-wip>
      <div slot="footer" class="action-buttons">
        <div>
          <UiButton variant="import" block>{{ $t('getvsion.detail-panel.change-alarm') }}</UiButton>
        </div>
        <div>
          <UiButton variant="primary" block>{{ $t('getvsion.detail-panel.triggered-events') }}</UiButton>
        </div>
      </div>
    </ff-wip>
  </BaseDetailPanelContent>
</template>

<script>
import BaseDetailPanelContent from '@/components/BaseDetailPanelContent';
import StepperNonLinear from '@/components/ui/StepperNonLinear';
import Thresholds from '@/components/Thresholds';
import UiButton from '@/components/ui/Button';
import { mapGetters } from 'vuex';

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
      steps: {},
      statusStepperIndex: this.content.startDate ? 1 : 0,
    };
  },
  computed: {
    ...mapGetters(['userIsPartner']),
  },

  methods: {
    gotoTargetedAlarms() {
      this.$router.push({
        name: 'alarmDetail',
        params: { alarmId: this.content.id, tabIndex: 1 },
      });
    },
  },
};
</script>
