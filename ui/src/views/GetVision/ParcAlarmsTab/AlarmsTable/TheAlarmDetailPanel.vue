<template>
  <BaseDetailPanelContent>
    <div class="overview-container m-3 bg-white">
      <div class="overview-item">
        <h4 class="font-weight-normal text-uppercase">{{ $t('orders.detail.information') }}</h4>
      </div>
      <div class="overview-item mock-value">
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
        <p>{{ content.type }}</p>
      </div>
      <div class="overview-item mr-5">
        <h6>{{ $t('getvsion.filters.ALARMS_OFFER') }}:</h6>
        <p>{{ content.alarmScope }}</p>
      </div>
      <div class="overview-item mr-5 mock-value">
        <h6>{{ $t('getparc.history.details.quantityTargeted') }}:</h6>
        <p>18</p>
      </div>
      <div class="overview-item mr-5">
        <h6>{{ $t('getvsion.table.thresholds') }}:</h6>
        <Thresholds :alarm="content" />
      </div>
      <div class="overview-item mr-5">
        <h6>{{ $t('getparc.lineDetail.alarms.observationCycle') }}:</h6>
        <p>{{ content.observationCycle }}</p>
      </div>
      <div class="overview-item mr-5 mock-value">
        <h6>{{ $t('filters.lines.activationDate') }}:</h6>
        <p>01/01/2020</p>
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
    <div slot="footer" class="action-buttons">
      <div>
        <UiButton variant="import" block>{{ $t('getvsion.detail-panel.change-alarm') }}</UiButton>
      </div>
      <div>
        <UiButton variant="primary" block>{{
          $t('getvsion.detail-panel.triggered-events')
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
  data() {
    return {
      steps: {
        data: [
          {
            code: 'NOT_VALIDATED',
            label: this.$t('getvsion.detail-panel.stepper.created'),
            date: null,
            index: 0,
          },
          {
            code: 'VALIDATED',
            label: this.$t('getparc.actLines.simStatuses.ACTIVATED'),
            date: null,
            index: 1,
          },
        ],
      },
      statusStepperIndex: 1,
    };
  },
  computed: {
    ...mapGetters(['userIsPartner']),
  },
};
</script>

<style lang="scss" scoped></style>
