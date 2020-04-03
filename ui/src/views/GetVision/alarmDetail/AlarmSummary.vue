<template>
  <div class="bg-white p-4 rounded">
    <h6 class="title">détail de l'alarme</h6>

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
            <p>{{ content.type }}</p>
          </div>
          <div class="item">
            <h6>{{ $t('getvsion.filters.ALARMS_OFFER') }}:</h6>
            <p>{{ content.alarmScope }}</p>
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
                <p>{{ content.observationCycle }}</p>
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
</style>
