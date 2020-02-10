<template>
  <ActFormContainer
    exclude-default-fields
    :validate-fn="onValidate"
    success-message="getparc.actCreation.sendSMS.successMessage"
  >
    <form>
      <span class="font-weight-bold mt-4 mb-4">
        {{ $t('getparc.actCreation.sendSMS.shortCode') }}
      </span>
      <UiApiAutocomplete
        :items="shortCodes"
        v-model="selectedShortCode"
        display-results-while-empty
        :error="errors.shortCode"
      >
        <img style="font-size: 24px" class="arrow" src="@/assets/search.svg" :style="{ left: 0 }" />
      </UiApiAutocomplete>

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
    </form>
    <div slot="bottom" slot-scope="{ containerValidationFn }">
      <div class="row">
        <div class="col">
          <UiDate @change="onSmsDateChange" :value="smsDate" fixed class="d-block">
            <i slot="icon" class="select-icon ic-Flag-Icon" />
          </UiDate>
        </div>
        <div class="col">
          <button
            @click="containerValidationFn"
            :disabled="!applyConditions"
            class="btn btn-primary pl-4 pr-4 pt-2 pb-2"
          >
            {{ $t('set') }}
          </button>
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
    </div>
  </ActFormContainer>
</template>

<script>
import ActFormContainer from './parts/ActFormContainer2';
import UiApiAutocomplete from '@/components/ui/UiApiAutocomplete';
import UiCheckbox from '@/components/ui/Checkbox';
import UiDate from '@/components/ui/UiDate';
import { mapState, mapGetters, mapMutations } from 'vuex';
import get from 'lodash.get';
import { sendSMS, fetchShortCodes } from '@/api/actCreation';
import moment from 'moment';

export default {
  components: {
    ActFormContainer,
    UiApiAutocomplete,
    UiCheckbox,
    UiDate,
  },
  async mounted() {
    this.smsDate = moment().format('DD/MM/YYYY');
    this.shortCodesValues = await this.fetchShortCodes();
  },

  computed: {
    ...mapState('actLines', ['selectedLinesForActCreation', 'actCreationPrerequisites']),
    ...mapGetters('actLines', ['appliedFilters', 'filterCustomFieldsList', 'shortCodesList']),
    ...mapGetters(['userIsPartner', 'userInfos']),

    shortCodes() {
      if (!this.shortCodesValues || this.shortCodesValues.length === 0) {
        return [];
      }
      const splitted = this.shortCodesValues.split(';');
      return splitted.map(s => {
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
    applyConditions() {
      return this.acceptConditions && this.shortCodes && this.shortCodes.length > 0;
    },
  },

  data() {
    return {
      selectedShortCode: undefined,
      texMessage: '',
      acceptConditions: false,
      smsDate: undefined,
      shortCodesValues: undefined,
      errors: {
        shortCode: undefined,
      },
      maxSMSLength: 1071,
      maxSizeBySMS: 160,
    };
  },
  methods: {
    ...mapMutations(['flashMessage']),
    ...mapMutations('actLines', ['setActToCreate', 'setActCreationPrerequisites']),
    onSmsDateChange(value) {
      this.smsDate = value;
    },
    async onValidate(contextValues) {
      return await sendSMS(this.appliedFilters, this.selectedLinesForActCreation, {
        dueDate: this.smsDate,
        partyId: this.actCreationPrerequisites.partner.id,
        texMessage: this.texMessage,
        numberOfSMS: this.numberOfSMS,
        shortCode: this.selectedShortCode.label,
        tempDataUuid: contextValues.tempDataUuid,
      });
    },
    checkErrors() {
      if (!this.selectedShortCode) {
        this.errors.shortCode = 'errors.mandatory';
        return true;
      }
      return false;
    },

    async fetchShortCodes() {
      if (!this.userIsPartner) {
        const shortCodesValues = get(this.actCreationPrerequisites, 'partner.shortCodes');
        return shortCodesValues;
      }
      const partnerId = get(this.userInfos, 'party.id');
      const shortCodes = await fetchShortCodes(partnerId);
      return shortCodes;
    },
  },
};
</script>

<style lang="scss" scoped>
.warning {
  color: $orange;
}
</style>
