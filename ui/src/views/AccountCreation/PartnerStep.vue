<template>
  <div class="step-container">
    <div class="form-container">
      <div class="container-flags">
        <div class="allRequired">{{ $t('allRequired') }}</div>
        <div class="lang-flags">
          <a
            href="#"
            @click.prevent="() => changeAppLanguage('fr')"
            :class="{ active: $i18n.locale === 'fr' }"
            class="flag"
          >
            <img src="@/assets/fr.png" />
          </a>
          <a
            href="#"
            @click.prevent="() => changeAppLanguage('en')"
            :class="{ active: $i18n.locale === 'en' }"
            class="flag"
          >
            <img src="@/assets/en.png" />
          </a>
        </div>
      </div>
      <div class="row mb-3">
        <div class="col">
          <label>{{ $t('civility') }}</label>
          <div class="d-flex" :class="{ error: civilityError }">
            <label class="radio-container mr-3">
              {{ $t('common.MRS') }}
              <input name="title" type="radio" value="MRS" v-model="form.title" />
              <span class="checkmark" />
            </label>
            <label class="radio-container" :class="{ error: civilityError }">
              {{ $t('common.MR') }}
              <input name="title" type="radio" value="MR" v-model="form.title" />
              <span class="checkmark" />
            </label>
          </div>
          <small v-if="civilityError" class="form-text error-text">{{ $t('required') }}</small>
        </div>
      </div>

      <div class="entries-line formLine">
        <div class="form-entry">
          <FormControl
            label="digitalOffer.step1.lastName"
            v-model="form.lastName"
            :max-size="100"
            :class="{ error: lastNameError }"
            :required="lastNameError"
          />
        </div>
        <div class="form-entry">
          <FormControl
            label="digitalOffer.step1.firstName"
            v-model="form.firstName"
            :max-size="100"
            :class="{ error: firstNameError }"
            :required="firstNameError"
          />
        </div>
      </div>

      <div class="entries-line formLine">
        <div class="form-entry">
          <FormControl
            label="common.email"
            v-model="form.email"
            :max-size="100"
            :class="{ error: emailError }"
            :required="emailError"
          />
          <span v-if="form.email && !isEmailValid(form.email)" class="error-text">
            {{ $t('errors.password.email-error') }}
          </span>
        </div>

        <div class="form-entry">
          <FormControl
            label="digitalOffer.step1.phone"
            v-model="form.phone"
            :error="businessErrors['PHONE_NUMBER_INVALID'] || phoneInputError"
            :max-size="20"
            :class="{ error: phoneError }"
            :required="phoneError"
          />
        </div>
      </div>

      <div class="entries-line">
        <div class="form-entry">
          <FormControl
            label="getadmin.partners.name"
            :max-size="50"
            v-model="form.company"
            :error="businessErrors['PARTY_NAME_ALREADY_EXIST'] || companyInputError"
            :class="{ error: companyError }"
            :required="companyError"
          />
        </div>
      </div>

      <div class="entries-line">
        <div class="form-group" :class="{ error: siretNumberError }">
          <FormControl
            v-model="form.siretValue"
            label="siret-number"
            @update:value="onChange"
            @focus="onInputFocus"
            @blur="onInputBlur($event)"
            input-type="number"
            :error="businessErrors['SIRET_ALREADY_EXIST'] || siretInputError"
            :required="siretNumberError"
            :max-value="14"
          />
          <span v-if="!hide && !reachedMaxLength" class="error-text">
            {{ $t('errors.maxlength') }}
          </span>
        </div>
        <div class="form-group" :class="{ error: tvaNumberError }">
          <FormControl
            v-model="form.tvaValue"
            label="tva-number"
            :max-size="50"
            :error="businessErrors['INTRA_COMMUNITY_VAT_ALREADY_EXIST'] || tvaInputError"
            :required="tvaNumberError"
          />
        </div>
      </div>

      <div class="entries-line">
        <div class="form-entry">
          <label :class="{ error: addressError }">{{ $t('digitalOffer.address') }}</label>
          <UiApiAutocomplete
            :api-method="searchAddress"
            no-filter-on-result
            :max-size="35"
            v-model="selectedAddress"
            :class="{ error: addressError }"
            no-icon
          />
        </div>
      </div>

      <div class="row">
        <div class="col">
          <FormControl
            label="orders.new.deliveryStep.form.zipcode"
            v-model="form.zipCode"
            :max-size="15"
            :class="{ error: zipCodeError }"
            :required="zipCodeError"
          />
        </div>
        <div class="col">
          <FormControl
            label="filters.city"
            v-model="form.city"
            :max-size="50"
            :class="{ error: cityError }"
            :required="cityError"
          />
        </div>
        <div class="col">
          <div class="form-group" :class="{ error: countryError }">
            <label>{{ $t('orders.new.deliveryStep.form.country') }}</label>
            <div>
              <UiApiAutocomplete
                :items="countries"
                :max-size="50"
                v-model="form.country"
                display-results-while-empty
              />
            </div>
          </div>
        </div>
      </div>

      <div class="form-group">
        <label class="small-label" :class="{ error: loginError }">{{ $t('loginWanted') }} </label>
        <UiInput
          v-model="form.login"
          :max-size="50"
          block
          :error="businessErrors['USER_NAME_ALREADY_EXIST'] || loginInputError"
          :class="{ error: loginError }"
        />
        <small v-if="loginError" class="form-text error-text">{{ $t('required') }}</small>
      </div>
    </div>

    <BottomBar no-prev :can-next="true" @next="gotoNext" />
  </div>
</template>

<script>
import BottomBar from './BottomBar.vue';
import FormControl from '@/components/ui/FormControl';
import UiApiAutocomplete from '@/components/ui/UiApiAutocomplete';
import UiInput from '@/components/ui/UiInput';
import { searchAddress, fetchCountries } from '@/api/address';
import { validatePartner } from '@/api/digital.js';
import $i18n from '@/i18n';
import moment from 'moment';
//
// Waiting for Richard HALLIER to active recaptcha because of proxy issue
// import { VueReCaptcha } from 'vue-recaptcha-v3'
//

// Vue.use(VueReCaptcha, { siteKey: '6Le7k9AdAAAAAEj45cN9qj3XV6UyuPcD70GsoF2B' })

export default {
  components: {
    BottomBar,
    FormControl,
    UiApiAutocomplete,
    UiInput,
  },
  props: {
    synthesis: Object,
  },

  async mounted() {
    // si utilisateur connecté aller directement vers le choix SIM sinon aller à la
    // création de partenaire
    // this.$router.push({ name: 'createAccount.partner' });
    // this.recaptcha()
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
        tvaValue: undefined,
        firstName: undefined,
        lastName: undefined,
        zipCode: undefined,
        address: undefined,
        city: undefined,
        country: undefined,
        email: undefined,
        phone: undefined,
        login: undefined,
        language: 'fr',
      },
      // FormChecker
      companyError: undefined,
      firstNameError: undefined,
      lastNameError: undefined,
      zipCodeError: undefined,
      addressError: undefined,
      cityError: undefined,
      countryError: undefined,
      emailError: undefined,
      phoneError: undefined,
      loginError: undefined,
      civilityError: undefined,
      siretNumberError: undefined,
      tvaNumberError: undefined,

      selectedAddress: {},
      countries: [],
      siretLimit: 14,
      reachedMaxLength: false,
      hide: true,
      inputErrors: [],
      // captchaOk: false,
    };
  },

  computed: {
    requiredFields() {
      let requiredFields = [
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
      ];

      return requiredFields.filter((f) => {
        // cas spécial pour l'autocomplete, il renvoi un objet {label: ''} si l'input est vide
        if (f === 'address') {
          if (typeof this.form.address === 'object') {
            return !this.form.address.label;
          }
        }
        if (f === 'country') {
          if (typeof this.form.country === 'object') {
            return !this.form.country.code;
          }
        }
        return !this.form[f];
      });
    },

    hasSiretValue() {
      return this.reachedMaxLength;
    },

    businessErrors() {
      let errors = [
        'PARTY_NAME_ALREADY_EXIST', // company
        'SIRET_ALREADY_EXIST',
        'INTRA_COMMUNITY_VAT_MANDATORY',
        'INTRA_COMMUNITY_VAT_ALREADY_EXIST',
        'USER_NAME_ALREADY_EXIST', // login
        'PHONE_NUMBER_INVALID',
      ];
      let foundErrors = {};
      let previousForm = [];
      if (this.synthesis && this.synthesis.businessErrors) {
        for (const key in this.synthesis.businessErrors) {
          previousForm.push(this.synthesis.businessErrors[key]);
        }
      }
      const currentForm = [
        this.form.company,
        this.form.siretValue,
        this.form.tvaValue,
        this.form.login,
      ];

      let errorValueAlreadyExists = previousForm.filter((pf) =>
        currentForm.find((cf) => cf === pf)
      );

      for (const key in this.synthesis.businessErrors) {
        if (
          errors.map((err) => err === this.synthesis.businessErrors[key]) &&
          errorValueAlreadyExists
        ) {
          foundErrors[key] = this.$t('digitalOffer.errors.' + key);
        } else {
          foundErrors[key] = '';
        }
      }

      return foundErrors;
    },
    companyInputError() {
      return this.inputErrors.find((err) => err.type === 'PARTY_NAME')
        ? this.$t('digitalOffer.errors.PARTY_NAME_ALREADY_EXIST')
        : '';
    },
    siretInputError() {
      return this.inputErrors.find((err) => err.type === 'SIRET') && this.form.siretValue
        ? this.$t('digitalOffer.errors.SIRET_ALREADY_EXIST')
        : '';
    },
    tvaInputError() {
      return this.inputErrors.find((err) => err.type === 'VAT') && this.form.tvaValue
        ? this.$t('digitalOffer.errors.INTRA_COMMUNITY_VAT_ALREADY_EXIST')
        : '';
    },
    loginInputError() {
      return this.inputErrors.find((err) => err.type === 'USER_NAME')
        ? this.$t('digitalOffer.errors.USER_NAME_ALREADY_EXIST')
        : '';
    },
    phoneInputError() {
      return this.inputErrors.find((err) => err.type === 'PHONE_FORMAT')
        ? this.$t('digitalOffer.errors.PHONE_NUMBER_INVALID')
        : '';
    },
  },

  methods: {
    searchAddress,
    changeAppLanguage(lang) {
      $i18n.locale = lang;
      if (lang === 'en') {
        moment.locale('en-sg');
      } else {
        moment.locale('fr');
      }
      this.form.language = lang;
    },
    checkFieldFormError(field) {
      return !!Object.keys(this.form).find((key) => key === field && !this.form[key]);
    },
    async gotoNext() {
      const isRequired = this.validateInputForm();
      if (!isRequired) {
        this.inputErrors = await this.checkInputErrors();
        if (!this.inputErrors.length) {
          this.$router.push({
            name: 'createAccount.offer',
            params: { step: { creationAccountStep: this.form } },
          });
        }
      }
    },
    validateInputForm() {
      const countryCode = this.$loGet(this.form, 'country.code', 'fr');
      this.companyError = this.checkFieldFormError('company');
      this.firstNameError = this.checkFieldFormError('firstName');
      this.lastNameError = this.checkFieldFormError('lastName');
      this.zipCodeError = this.checkFieldFormError('zipCode');
      this.addressError = !this.addressError ? this.checkFieldFormError('address') : true;
      this.emailError = this.checkFieldFormError('email');
      this.phoneError = this.checkFieldFormError('phone');
      this.cityError = this.checkFieldFormError('city');
      this.countryError = this.checkFieldFormError('country');
      this.loginError = this.checkFieldFormError('login');
      this.civilityError = this.checkFieldFormError('title');
      this.siretNumberError = this.checkFieldFormError('siretValue') && countryCode === 'fr';
      this.tvaNumberError = this.checkFieldFormError('tvaValue');

      return (
        this.companyError ||
        this.firstNameError ||
        this.lastNameError ||
        this.zipCodeError ||
        this.addressError ||
        this.emailError ||
        this.phoneError ||
        this.cityError ||
        this.countryError ||
        this.loginError ||
        this.civilityError ||
        this.siretNumberError ||
        this.tvaNumberError
      );
    },
    // async recaptcha() {
    //   await this.$recaptchaLoaded()
    //   const token = await this.$recaptcha('login').then((token) => {
    //     this.captchaOk = true;
    //   })

    //   // Do stuff with the received token.
    // },

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
      let objErrorsToChcek = [
        { type: 'USER_NAME', value: this.form.login },
        { type: 'PARTY_NAME', value: this.form.company },
        { type: 'PHONE_FORMAT', value: this.form.phone },
        { type: 'SIRET', value: this.form.siretValue },
        { type: 'VAT', value: this.form.tvaValue },
      ];
      const errors = await this.validatePartner(objErrorsToChcek);
      if (errors.length) {
        return errors.filter((err) => !!err.error);
      }
      return [];
    },
  },

  watch: {
    'form.phone'(phone) {
      const regex = /^(?:[0-9] ?){6,16}[0-9]$/;
      return !regex.test(phone) ? this.phoneError = true : this.phoneError = false;
    },
    'form.address'(value) {
      const regex = /CEDEX|cedex/g;
      return !regex.test(value) ? this.addressError = false : this.addressError = true;
    },
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
.error {
  border-color: $orange;
}
.d-flex.error {
  color: $orange;
}
.container-flags {
  position: relative;
  overflow: hidden;
  .allRequired {
    font-size: 14px;
    margin-bottom: 1.5rem;
    color: red;
    float: left;
  }
  .lang-flags {
    float: right;
    margin-top: 7px;
    > a {
      margin-left: 1em;
      margin-right: 0;
    }
  }
}

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

  @media screen and (max-width: 900px) {
    width: 90%;
  }
}
</style>
