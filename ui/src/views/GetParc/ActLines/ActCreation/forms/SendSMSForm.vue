<template>
  <ActFormContainer
    exclude-default-fields
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
          :maxlength="160"
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
    <div slot="bottom">
      <div class="row">
        <div class="col">
          <UiDate @change="onSmsDateChange" :value="smsDate" fixed class="d-block">
            <i slot="icon" class="select-icon ic-Flag-Icon" />
          </UiDate>
        </div>
        <div class="col">
          <button
            @click="onValidate"
            :disabled="!acceptConditions"
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
          <i class="ic-Info-Icon" /> {{ $t('getparc.actCreation.sendSMS.nbCharacters') }}:
          {{ texMessage.length }}
        </li>
        <li><i class="ic-Info-Icon" /> Nombre de SMS par message: 0</li>
      </ul>
    </div>
  </ActFormContainer>
</template>

<script>
import ActFormContainer from './parts/ActFormContainer';
import UiApiAutocomplete from '@/components/ui/UiApiAutocomplete';
import UiCheckbox from '@/components/ui/Checkbox';
import UiDate from '@/components/ui/UiDate2';
import { mapState, mapGetters, mapMutations } from 'vuex';
import get from 'lodash.get';
import { sendSMS } from '@/api/actCreation';
import moment from 'moment';

export default {
  components: {
    ActFormContainer,
    UiApiAutocomplete,
    UiCheckbox,
    UiDate,
  },
  mounted() {
    this.smsDate = moment().format('DD-MM-YYYY');
  },

  computed: {
    ...mapState('actLines', ['selectedLinesForActCreation', 'actCreationPrerequisites']),
    ...mapGetters('actLines', ['appliedFilters']),

    shortCodes() {
      const shortCodesStr = get(this.actCreationPrerequisites, 'partner.shortCodes');
      if (!shortCodesStr || shortCodesStr.length === 0) {
        return [];
      }
      const splitted = shortCodesStr.split(';');
      return splitted.map(s => {
        return {
          id: s,
          label: s,
        };
      });
    },
  },

  data() {
    return {
      selectedShortCode: undefined,
      texMessage: '',
      acceptConditions: false,
      smsDate: undefined,
      errors: {
        shortCode: undefined,
      },
    };
  },
  methods: {
    ...mapMutations(['flashMessage']),
    ...mapMutations('actLines', ['setActToCreate', 'setActCreationPrerequisites']),
    onSmsDateChange(value) {
      this.smsDate = value;
    },
    async onValidate() {
      if (this.checkErrors()) return;

      const response = await sendSMS(this.appliedFilters, this.selectedLinesForActCreation, {
        dueDate: this.smsDate,
        partyId: this.actCreationPrerequisites.partner.id,
        texMessage: this.texMessage,
        numberOfSMS: 0,
        shortCode: this.selectedShortCode.label,
      });

      if (!response) {
        this.flashMessage({ level: 'danger', message: 'Erreur inconnue' });
      }

      if (response) {
        if (response.errors) {
          response.errors.forEach(e => {
            this.flashMessage({ level: 'danger', message: e.description });
          });
        } else {
          const successMessage = this.successMessage
            ? this.$t(this.successMessage)
            : 'Opération effectuée avec succès';
          this.flashMessage({ level: 'success', message: successMessage });

          // sortir du mode création acte
          this.setActToCreate(null);
          this.setActCreationPrerequisites(null);
          this.setSelectedLinesForActCreation([]);
        }
      }
    },
    checkErrors() {
      if (!this.selectedShortCode) {
        this.errors.shortCode = 'errors.mandatory';
        return true;
      }
      return false;
    },
  },
};
</script>

<style lang="scss" scoped></style>
