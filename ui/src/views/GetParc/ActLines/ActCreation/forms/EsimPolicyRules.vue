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
      <div v-if="exceptionError">
        <h6 class="text-danger">{{ $t('errors.all') }}</h6>
        <div class="text-danger">
          {{ exceptionError }}
        </div>
      </div>
    </div>
  </ActFormContainer>
</template>

<script>
import ActFormContainer from './parts/ActFormContainer2';
import { mapState } from 'vuex';
import { formatBackErrors } from '@/utils/errors';

// Composants
import UiInput from '@/components/ui/UiInput';
import TwoValuesToggle from '@/components/ui/TwoValuesToggle.vue';

// Api
import { updatePolicyRules } from '@/api/esim';
import { searchLineById } from '@/api/linesActions';

export default {
  components: {
    ActFormContainer,
    TwoValuesToggle,
    UiInput,
  },

  computed: {
    ...mapState('actLines', [
      'selectedLinesForActCreation',
      'actCreationPrerequisites',
      'linesActionsResponse',
    ]),
    partnerId() {
      if (this.actCreationPrerequisites.searchById) {
        if (this.singleLineFound) {
          return this.$loGet(this.singleLineFound, 'party.id');
        }
      }
      return this.$loGet(this.actCreationPrerequisites, 'partner.id');
    },
  },

  data() {
    return {
      subject: 'PROFILE',
      action: false,
      qualification: false,
      exceptionError: undefined,
      singleLineFound: undefined,
    };
  },

  async mounted() {
    await this.loadSingleLineInfo();
  },

  methods: {
    async loadSingleLineInfo() {
      if (
        this.actCreationPrerequisites.searchById &&
        this.linesActionsResponse &&
        this.linesActionsResponse.total === 1
      ) {
        const lineInTable = this.linesActionsResponse.items[0];
        if (lineInTable) {
          this.singleLineFound = await searchLineById(lineInTable.id);
        }
      }
    },
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
        this.partnerId,
        selectedLinesId,
        contextValues.actDate,
        contextValues.notificationCheck,
        this.subject,
        req.action,
        req.qualification
      );
      if (response && response.errors && response.errors.length) {
        let errorMessage = '',
          massActionLimitError = '',
          count;
        const formatted = formatBackErrors(response.errors)
          .map((e) => e.errors)
          .flat();
        formatted.forEach((e) => {
          if (e.key === 'limit') {
            count = e.value;
          }
          if (e.key === 'error') {
            massActionLimitError = `${e.key}.${e.value}`;
          } else {
            errorMessage = `${e.key}: ${e.value}`;
          }
        });
        if (massActionLimitError) {
          this.exceptionError = `${this.$t(
            'getparc.actCreation.report.errors.' + massActionLimitError,
            {
              count,
            }
          )}`;
        } else {
          this.exceptionError = errorMessage;
        }

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
