<template>
  <div class="step-container">
    <div class="form-container">
      <div class="row mb-3">
        <div class="col">
          <div class="d-flex">
            <label class="radio-container mr-3">
              {{ $t('common.MRS') }}
              <input name="title" type="radio" value="MRS" v-model="form.title" />
              <span class="checkmark" />
            </label>
            <label class="radio-container">
              {{ $t('common.MR') }}
              <input name="title" type="radio" value="MR" v-model="form.title" />
              <span class="checkmark" />
            </label>
          </div>
        </div>
      </div>

      <div class="entries-line formLine">
        <div class="form-entry">
          <FormControl label="digitalOffer.step1.lastName" v-model="form.lastName" />
        </div>
        <div class="form-entry">
          <FormControl label="digitalOffer.step1.firstName" v-model="form.firstName" />
        </div>
      </div>

      <div class="entries-line formLine">
        <div class="form-entry">
          <FormControl label="common.email" v-model="form.email" />
          <span v-if="form.email && !isEmailValid(form.email)" class="error-text">
            {{ $t('errors.password.email-error') }}
          </span>
        </div>

        <div class="form-entry">
          <FormControl label="digitalOffer.step1.phone" v-model="form.phone" />
        </div>
      </div>

      <div class="entries-line">
        <div class="form-entry">
          <FormControl
            label="getadmin.partners.name"
            v-model="form.company"
            :error="businessErrors['PARTY_NAME_ALREADY_EXIST'] || companyInputError"
          />
        </div>
      </div>

      <div class="entries-line">
        <div class="form-group">
          <Toggle
            v-if="toggleValues"
            @update="siretType = $event.id"
            :values="toggleValues"
            no-default
          />
          <FormControl
            v-model="form.siretValue"
            @update:value="onChange"
            @focus="onInputFocus"
            @blur="onInputBlur($event)"
            input-type="number"
            :error="businessErrors['SIRET_ALREADY_EXIST'] || siretInputError"
          />
          <span v-if="!hide && !reachedMaxLength && siretType === 'siret'" class="error-text">
            {{ $t('errors.maxlength') }}
          </span>
        </div>
      </div>

      <div class="entries-line">
        <div class="form-entry">
          <label>{{ $t('digitalOffer.address') }}</label>
          <UiApiAutocomplete :api-method="searchAddress" v-model="selectedAddress" no-icon />
        </div>
      </div>

      <div class="row">
        <div class="col">
          <FormControl
            label="orders.new.deliveryStep.form.zipcode"
            input-type="number"
            v-model="form.zipCode"
          />
        </div>
        <div class="col">
          <FormControl label="filters.city" v-model="form.city" />
        </div>
        <div class="col">
          <div class="form-group">
            <label>{{ $t('orders.new.deliveryStep.form.country') }}</label>
            <div>
              <UiApiAutocomplete
                :items="countries"
                v-model="form.country"
                display-results-while-empty
              />
            </div>
          </div>
        </div>
      </div>

      <div class="form-group">
        <label class="small-label">{{ $t('login') }}</label>
        <UiInput
          v-model="form.login"
          block
          :error="businessErrors['USER_NAME_ALREADY_EXIST'] || loginInputError"
        />
        <!-- <small v-if="fieldErrors && errors.login" class="form-text error-text">{{
          $t('required')
        }}</small> -->
      </div>

      <div class="form-entry"></div>
      <div class="form-entry formLine">
        <input type="password" name="password" class="hidden" autocomplete="off" />
        <FormControl
          class="password"
          label="password"
          input-type="password"
          v-model="form.password"
        />
        <FormControl
          class="password-confirm"
          label="passwordConfirm"
          input-type="password"
          v-model="form.passwordConfirm"
        />
      </div>

      <div v-if="passwordConfirmationErrors" class="entries-line">
        <div class="form-entry">
          <ul class="list-unstyled">
            <li :key="error" v-for="error in passwordConfirmationErrors" class="error-text">
              {{ $t(error) }}
            </li>
          </ul>
        </div>
      </div>
    </div>

    <BottomBar no-prev :can-next="canNext" @next="gotoNext" />
  </div>
</template>

<script>
import BottomBar from './BottomBar.vue';
import FormControl from '@/components/ui/FormControl';
import UiApiAutocomplete from '@/components/ui/UiApiAutocomplete';
import UiInput from '@/components/ui/UiInput';
import Toggle from '@/components/ui/UiToggle2';

import { searchAddress, fetchCountries } from '@/api/address';
import { checkPasswordErrors } from '@/utils.js';
import { validatePartner } from '@/api/digital.js';

export default {
  components: {
    BottomBar,
    FormControl,
    UiApiAutocomplete,
    UiInput,
    Toggle,
  },
  props: {
    synthesis: Object,
  },

  async mounted() {
    // si utilisateur connecté aller directement vers le choix SIM sinon aller à la
    // création de partenaire
    // this.$router.push({ name: 'createAccount.partner' });
    const countries = await fetchCountries();
    this.countries = countries.map((c) => ({
      ...c,
      label: c.name,
      value: c.code,
    }));
  },

  data() {
    return {
      form: {
        id: 1,
        title: undefined,
        company: undefined,
        siretValue: undefined,
        firstName: undefined,
        lastName: undefined,
        zipCode: undefined,
        address: undefined,
        city: undefined,
        country: undefined,
        email: undefined,
        phone: undefined,
        login: undefined,
        password: undefined,
        passwordConfirm: undefined,
      },
      selectedAddress: {},
      countries: [],
      siretLimit: 14,
      reachedMaxLength: false,
      siretType: 'siret',
      toggleValues: [
        {
          id: 'siret',
          label: 'siret-number',
          default: true,
        },
        {
          id: 'tva',
          label: 'tva-number',
          default: false,
        },
      ],
      hide: true,
      inputErrors: [],
    };
  },

  computed: {
    requiredFields() {
      const requiredFields = [
        'title',
        'company',
        'firstName',
        'lastName',
        'address',
        'zipCode',
        'city',
        'country',
        'email',
        'phone',
        'login',
        'password',
      ];

      return requiredFields.filter((f) => {
        // cas spécial pour l'autocomplete, il renvoi un objet {label: ''} si l'input est vide
        if (f === 'address') {
          if (typeof this.form.address === 'object') {
            return !this.form.address.label;
          }
        }
        return !this.form[f];
      });
    },

    passwordConfirmationErrors() {
      if (!this.form.password) return [];
      const errors = checkPasswordErrors(this.form.password, this.form.passwordConfirm);
      return errors;
    },

    hasSiretValue() {
      if (this.siretType === 'siret') {
        return this.reachedMaxLength;
      }
      return true;
    },

    canNext() {
      return (
        this.requiredFields.length === 0 &&
        this.passwordConfirmationErrors.length === 0 &&
        this.hasSiretValue &&
        !!this.businessErrors &&
        !this.businessErrors['PARTY_NAME_ALREADY_EXIST'] &&
        !this.businessErrors['SIRET_ALREADY_EXIST'] &&
        !this.businessErrors['USER_NAME_ALREADY_EXIST']
      );
    },

    businessErrors() {
      let errors = [
        'PARTY_NAME_ALREADY_EXIST', // company
        'SIRET_ALREADY_EXIST',
        'USER_NAME_ALREADY_EXIST', // login
      ];
      let foundErrors = {};
      let previousForm = [];
      if (this.synthesis && this.synthesis.businessErrors) {
        this.synthesis.businessErrors.map((error) => {
          for (const key in error) {
            previousForm.push(error[key]);
          }
        });
      }
      const currentForm = [this.form.company, this.form.siretValue, this.form.login];

      if (this.synthesis && this.synthesis.businessErrors) {
        foundErrors = this.synthesis.businessErrors.reduce(
          (all, e, index) => {
            for (const key in e) {
              if (
                errors.map((err) => err === e[key]) &&
                !!currentForm.find((f) => f === previousForm[index])
              ) {
                all[key] = this.$t('digitalOffer.errors.' + key);
              } else {
                all[key] = '';
              }
            }
            return all;
          },
          {
            USER_NAME_ALREADY_EXIST: '',
            SIRET_ALREADY_EXIST: '',
            PARTY_NAME_ALREADY_EXIST: '',
          }
        );
      }

      return foundErrors;
    },
    companyInputError() {
      return this.inputErrors.find((err) => err.type === 'PARTY_NAME')
        ? this.$t('digitalOffer.errors.PARTY_NAME_ALREADY_EXIST')
        : '';
    },
    siretInputError() {
      return this.inputErrors.find((err) => err.type === 'SIRET')
        ? this.$t('digitalOffer.errors.SIRET_ALREADY_EXIST')
        : '';
    },
    loginInputError() {
      return this.inputErrors.find((err) => err.type === 'USER_NAME')
        ? this.$t('digitalOffer.errors.USER_NAME_ALREADY_EXIST')
        : '';
    },
  },

  methods: {
    searchAddress,
    async gotoNext() {
      this.inputErrors = await this.checkInputErrors();
      if (!this.inputErrors.length) {
        this.$router.push({
          name: 'createAccount.offer',
          params: { step: { creationAccountStep: this.form } },
        });
      }
    },

    isEmailValid(email) {
      var re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
      return re.test(email);
    },

    onChange(value) {
      if (value.length === this.siretLimit) {
        this.reachedMaxLength = true;
      } else {
        this.reachedMaxLength = false;
      }
    },

    onInputBlur() {
      if (this.hasSiretValue) {
        this.hide = true;
      } else {
        this.hide = false;
      }
    },
    onInputFocus() {
      this.hide = false;
    },
    async validatePartner(fields) {
      return await validatePartner(fields);
    },
    async checkInputErrors() {
      const errors = await this.validatePartner([
        { type: 'USER_NAME', value: this.form.login },
        { type: 'PARTY_NAME', value: this.form.company },
        { type: 'SIRET', value: this.form.siretValue },
      ]);
      if (errors.length) {
        return errors.filter((err) => !!err.error);
      }
      return [];
    },
  },

  watch: {
    selectedAddress(address) {
      if (!address) {
        this.form.address = undefined;
        this.form.zipCode = undefined;
        this.form.city = undefined;
        this.form.country = undefined;
        return;
      }
      if (address.city) {
        address.label = address.label.replace(address.postcode, '').replace(address.city, '');
        this.form.address = address.name;
        this.form.zipCode = address.postcode;
        this.form.city = address.city;
        this.form.country = this.countries.find((c) => c.code === 'fr');
      } else {
        if (address.label) {
          this.form.address = address.label;
        } else {
          this.form.address = address;
        }
      }
    },
  },
};
</script>

<style lang="scss" scoped>
.formLine {
  display: flex;
  justify-content: space-between;
  align-items: baseline;

  > div {
    width: 48%;
    .cmp-ui-input {
      width: 100%;
    }
  }
}

.form-container {
  width: 70%;
  margin: 0 auto;
}
</style>
