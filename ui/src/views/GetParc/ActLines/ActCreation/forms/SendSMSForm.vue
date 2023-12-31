<template>
  <ActFormContainer
    :validate-fn="onValidate"
    :prevent-send="!canSend"
    success-message="getparc.actCreation.sendSMS.successMessage"
  >
    <template v-if="partner">
      <div>
        <span class="font-weight-bold mt-4 mb-4">
          {{ $t('getparc.actCreation.sendSMS.shortCode') }}
        </span>
        <UiApiAutocomplete
          :items="shortCodes"
          v-model="selectedShortCode"
          display-results-while-empty
          :error="errors.shortCode"
        >
          <img
            style="font-size: 24px"
            class="arrow"
            src="@/assets/search.svg"
            alt="search"
            :style="{ left: 0 }"
          />
        </UiApiAutocomplete>
        <span v-if="!shortCodesValues" class="text-warning">
          <em class="ic-Alert-Icon" />
          {{ $t('getparc.actCreation.sendSMS.errorMessage') }}
        </span>

        <div class="form-group">
          <label class="font-weight-bold" for="message">
            {{ $t('getparc.actCreation.sendSMS.message') }}
          </label>
          <textarea
            v-model="texMessage"
            :maxlength="maxSMSLength"
            class="form-control"
            id="message"
            rows="3"
          ></textarea>
        </div>

        <div class="row">
          <div class="col d-flex">
            <UiCheckbox v-model="acceptConditions" />
            <span>{{ $t('getparc.actCreation.sendSMS.acceptConditions') }}</span>
          </div>
        </div>
      </div>
      <div slot="messages">
        <ul class="list-unstyled">
          <li>
            <i class="ic-Info-Icon" />
            {{ $t('getparc.actCreation.sendSMS.nbCharacters') }}:
            {{ texMessage.length }}
          </li>
          <li>
            <i class="ic-Info-Icon" /> {{ $t('getparc.lineDetail.consummated.nbOfSMS') }}:
            {{ numberOfSMS }}
          </li>
          <li v-if="reachMaxLength" class="warning">
            <span>
              <i class="ic-Alert-Icon"></i>
              {{ $t('reachMaxLength') }}.
            </span>
          </li>
        </ul>

        <div slot="messages" class="text-info">
          <div v-if="exceptionError">
            <h6 class="text-danger">{{ $t('errors.all') }}</h6>
            <div class="text-danger">
              {{ exceptionError }}
            </div>
          </div>
        </div>
      </div>
    </template>
  </ActFormContainer>
</template>

<script>
import ActFormContainer from './parts/ActFormContainer2';
import UiApiAutocomplete from '@/components/ui/UiApiAutocomplete';
import UiCheckbox from '@/components/ui/Checkbox';
import { mapState, mapGetters, mapMutations } from 'vuex';
import get from 'lodash.get';
import { sendSMS, fetchShortCodes } from '@/api/actCreation';
import { searchLineById } from '@/api/linesActions';
import { formatBackErrors } from '@/utils/errors';

export default {
  components: {
    ActFormContainer,
    UiApiAutocomplete,
    UiCheckbox,
  },
  async mounted() {
    await this.loadSingleLineInfo();
    this.shortCodesValues = await this.fetchShortCodes();
  },

  computed: {
    ...mapState('actLines', ['selectedLinesForActCreation', 'actCreationPrerequisites']),
    ...mapGetters('actLines', ['appliedFilters', 'filterCustomFieldsList', 'linesActionsResponse']),
    ...mapGetters(['userIsPartner', 'userInfos']),
    partner() {
      if (this.actCreationPrerequisites.searchById) {
        if (this.singleLineFound) {
          return this.singleLineFound.party;
        }
      }
      return this.actCreationPrerequisites.partner;
    },
    shortCodes() {
      if (!this.shortCodesValues || this.shortCodesValues.length === 0) {
        return [];
      }
      const splitted = this.shortCodesValues.split(';');
      return splitted.map((s) => {
        return {
          id: s,
          label: s,
        };
      });
    },
    numberOfSMS() {
      return this.texMessage && this.texMessage.length
        ? Math.ceil(this.texMessage.length / this.maxSizeBySMS)
        : 0;
    },
    reachMaxLength() {
      return this.texMessage && this.texMessage.length
        ? this.texMessage.length === this.maxSMSLength
        : false;
    },
    canSend() {
      return (
        this.acceptConditions &&
        this.shortCodes &&
        this.shortCodes.length > 0 &&
        this.selectedShortCode &&
        this.selectedShortCode.highlighted
      );
    },
  },
  data() {
    return {
      selectedShortCode: undefined,
      texMessage: '',
      acceptConditions: false,
      shortCodesValues: undefined,
      errors: {
        shortCode: undefined,
      },
      maxSMSLength: 1071,
      maxSizeBySMS: 160,
      singleLineFound: undefined,
      exceptionError: undefined,
    };
  },
  methods: {
    ...mapMutations(['flashMessage']),
    ...mapMutations('actLines', ['setActToCreate', 'setActCreationPrerequisites']),
    async loadSingleLineInfo() {
      if (
        this.actCreationPrerequisites.searchById &&
        this.linesActionsResponse &&
        this.linesActionsResponse.total === 1
      ) {
        const lineInTable = this.linesActionsResponse.items[0];
        this.singleLineFound = await searchLineById(lineInTable.id);
      }
    },
    async onValidate(contextValues) {
      const response = await sendSMS(this.appliedFilters, this.selectedLinesForActCreation, {
        dueDate: contextValues.actDate,
        notifEmail: contextValues.notificationCheck,
        partyId: this.actCreationPrerequisites.partner.id,
        texMessage: this.texMessage,
        numberOfSMS: this.numberOfSMS,
        shortCode: this.selectedShortCode.label,
        tempDataUuid: contextValues.tempDataUuid,
      });
      if (response.errors && response.errors.length) {
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
    checkErrors() {
      if (!this.selectedShortCode) {
        this.errors.shortCode = 'errors.mandatory';
        return true;
      }
      return false;
    },

    async fetchShortCodes() {
      let partnerId = get(this.userInfos, 'partners[0].id');

      if (!this.userIsPartner) {
        partnerId =
          this.$loGet(this.singleLineFound, 'party.id') ||
          this.$loGet(this.actCreationPrerequisites, 'partner.id');
      }

      return fetchShortCodes(partnerId);
    },
  },
};
</script>

<style lang="scss" scoped>
.warning {
  color: $orange;
}
</style>
