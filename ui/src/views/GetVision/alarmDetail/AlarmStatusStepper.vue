<template>
  <div>
    <StepperNonLinear v-if="steps" :stepper-data="steps" :current-index="statusStepperIndex" />
  </div>
</template>

<script>
import StepperNonLinear from '@/components/ui/StepperNonLinear';

export default {
  components: {
    StepperNonLinear,
  },

  props: {
    content: Object,
  },

  data() {
    return {
      steps: undefined,
      statusStepperIndex: undefined,
    };
  },

  computed: {
    status() {
      // Note : svp ne mettez pas d'expressions ternaires ici, on veux garder ce bout de code lisible autant que possible.

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
  },

  mounted() {
    const steps = [
      {
        code: 'NOT_VALIDATED',
        label: this.$t('getvsion.detail-panel.stepper.created'),
        date: this.content.auditable.created,
        index: 0,
      },
    ];

    if (this.status === 'disabled') {
      let date = this.$loGet(this.content, 'auditable.created');
      if (this.$loGet(this.content, 'auditable.updated')) {
        date = this.$loGet(this.content, 'auditable.updated');
      }
      steps.push({
        code: 'disabled',
        label: this.$t('getvsion.alarm.statuses.disabled'),
        date,
        index: 1,
      });
    } else {
      if (this.status === 'activated') {
        steps.push({
          code: 'VALIDATED',
          label: this.$t('getparc.actLines.simStatuses.ACTIVATED'),
          date: this.$loGet(this.content, 'startDate'),
          index: 1,
        });
      }
    }

    this.statusStepperIndex = steps.length - 1;

    this.steps = {
      data: steps,
    };
  },
};
</script>

<style></style>
