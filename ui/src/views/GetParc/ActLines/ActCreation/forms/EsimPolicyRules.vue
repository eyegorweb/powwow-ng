<template>
  <ActFormContainer
    :validate-fn="doRequest"
    :confirm-label="'getsim.actions.VALIDATE'"
    :disabled-notification-check="false"
    class="policyRules"
  >
    <label class="policyRules-label">{{ $t('subject') }}</label>
    <UiInput v-model="subject" :value="subject" class="policyRules-input" disabled />
    <div class="policyRules-box">
      <label class="policyRules-label">Action</label>
      <TwoValuesToggle v-model="action" :label-on="'DELETE'" :label-off="'DISABLE'" />
    </div>
    <div class="policyRules-box">
      <label class="policyRules-label">Qualification</label>
      <TwoValuesToggle
        v-model="qualification"
        :label-on="'NOT_ALLOWED'"
        :label-off="'AUTO_DELETE'"
      />
    </div>
    <div slot="messages" class="text-info">
      <div v-if="requestErrors && requestErrors.length">
        <h6 class="text-danger">{{ $t('errors.all') }}</h6>
        <ul class="text-danger list-unstyled">
          <li v-for="error in requestErrors" :key="error.message">{{ error.message }}</li>
        </ul>
      </div>
    </div>
  </ActFormContainer>
</template>

<script>
import ActFormContainer from './parts/ActFormContainer2';
import { mapState } from 'vuex';

// Composants
import UiInput from '@/components/ui/UiInput';
import TwoValuesToggle from '@/components/ui/TwoValuesToggle.vue';

// Api
import { updatePolicyRules } from '@/api/esim';

export default {
  components: {
    ActFormContainer,
    TwoValuesToggle,
    UiInput,
  },

  computed: {
    ...mapState('actLines', ['selectedLinesForActCreation', 'actCreationPrerequisites']),
  },

  data() {
    return {
      subject: 'PROFILE',
      action: false,
      qualification: false,
      requestErrors: [],
    };
  },

  mounted() {},

  methods: {
    async doRequest(contextValues) {
      let req = {
        action: this.action ? 'DELETE' : 'DISABLE',
        qualification: this.qualification ? 'NOT_ALLOWED' : 'AUTO_DELETE',
      };
      let selectedLinesId = [];
      if (this.selectedLinesForActCreation) {
        selectedLinesId = this.selectedLinesForActCreation.map((e) => e.id);
      }

      const response = await updatePolicyRules(
        this.actCreationPrerequisites.partner.id,
        selectedLinesId,
        contextValues.actDate,
        contextValues.notificationCheck,
        this.subject,
        req.action,
        req.qualification
      );
      if (response.errors && response.errors.length) {
        response.errors.forEach((r) => {
          if (r.extensions && r.extensions.error) {
            if (r.extensions.error === 'MassActionLimit') {
              const count = r.extensions && r.extensions.limit ? r.extensions.limit : '';
              const messageErrorMaxLine = this.$t(
                'getparc.actCreation.report.FILE_MAX_LINE_NUMBER_INVALID',
                {
                  count,
                }
              );
              this.requestErrors = [
                {
                  message: messageErrorMaxLine,
                },
              ];
            } else {
              this.requestErrors = [
                {
                  message: r.message,
                },
              ];
            }
          }
        });
        return {
          errors: response.errors,
          validationError: {
            validated: response.validated,
            tempDataUuid: response.tempDataUuid,
          },
        };
      }
      return response;
    },
  },
};
</script>

<style lang="scss" scoped>
.policyRules {
  &-input {
    display: block;
  }

  &-label {
    width: 10rem;
    font-weight: bold;
  }

  &-box {
    margin: 1rem 0;
  }
}
</style>
