<template>
  <div class="step-container">
    <div class="form-container">
      <div class="allRequired">{{ $t('allRequired') }}</div>
      <div class="row mb-3">
        <div class="col" :class="{ error: civilityError }">
          <label>{{ $t('civility') }}</label>
          <div class="d-flex">
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
        </div>
      </div>

      <div class="entries-line formLine">
        <div class="form-entry">
          <FormControl
            label="digitalOffer.step1.lastName"
            v-model="form.lastName"
            :max-size="100"
            :class="{ error: lastNameError }"
          />
        </div>
        <div class="form-entry">
          <FormControl
            label="digitalOffer.step1.firstName"
            v-model="form.firstName"
            :max-size="100"
            :class="{ error: firstNameError }"
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
          />
        </div>
      </div>

      <div class="entries-line">
        <div class="form-group" :class="{ error: companyNumberError }">
          <Toggle
            v-if="toggleValues"
            @update="siretType = $event.id"
            :values="toggleValues"
            no-default
          />
          <template v-if="siretType === 'siret'">
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
          </template>
          <template v-else>
            <FormControl v-model="form.siretValue" :max-size="50" />
          </template>
        </div>
      </div>

      <div class="entries-line">
        <div class="form-entry">
          <label :class="{ error: addressError }">{{ $t('digitalOffer.address') }}</label>
          <UiApiAutocomplete
            :api-method="searchAddress"
            :max-size="80"
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
          />
        </div>
        <div class="col">
          <FormControl
            label="filters.city"
            v-model="form.city"
            :max-size="50"
            :class="{ error: cityError }"
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
        <label class="small-label" :class="{ error: loginError }">{{ $t('login') }} </label>
        <UiInput
          v-model="form.login"
          :max-size="50"
          block
          :error="businessErrors['USER_NAME_ALREADY_EXIST'] || loginInputError"
          :class="{ error: loginError }"
        />
      </div>

      <div class="form-entry"></div>
      <div class="form-entry formLine">
        <input type="password" name="password" class="hidden" autocomplete="off" />
        <FormControl
          class="password"
          label="password"
          input-type="password"
          v-model="form.password"
          :class="{ error: passwordError }"
          :max-size="50"
        />
        <FormControl
          class="password-confirm"
          label="passwordConfirm"
          input-type="password"
          v-model="form.passwordConfirm"
          :class="{ error: passwordConfirmError }"
          :max-size="50"
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

    <BottomBar no-prev :can-next="true" @next="gotoNext" />
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
    Toggle,
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
        password: undefined,
      },
      // FormChecker
      formErrorCheck: false,
      passwordConfirm: undefined,
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
      companyNumberError: undefined,
      passwordConfirmError: undefined,
      passwordError: undefined,

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
        'password',
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

<<<<<<< HEAD
=======
    canNext() {
      return (
        this.requiredFields.length === 0 &&
        this.passwordConfirmationErrors.length === 0 &&
        this.hasSiretValue &&
        !!this.businessErrors &&
        !this.businessErrors['PARTY_NAME_ALREADY_EXIST'] &&
        !this.businessErrors['SIRET_ALREADY_EXIST'] &&
        !this.businessErrors['USER_NAME_ALREADY_EXIST'] &&
        !this.businessErrors['PHONE_NUMBER_INVALID']
        // this.captchaOk
      );
    },

>>>>>>> 60455554f (fix: [3107] Création d'une commande Offre digitale.)
    businessErrors() {
      let errors = [
        'PARTY_NAME_ALREADY_EXIST', // company
        'SIRET_ALREADY_EXIST',
        'USER_NAME_ALREADY_EXIST', // login
        'PHONE_NUMBER_INVALID',
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
            PHONE_NUMBER_INVALID: '',
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
    phoneInputError() {
      return this.inputErrors.find((err) => err.type === 'PHONE_FORMAT')
        ? this.$t('digitalOffer.errors.PHONE_NUMBER_INVALID')
        : '';
    },
  },

  methods: {
    searchAddress,
    async gotoNext() {
      console.log("pouet");
      this.formErrorChecker()
      if(!this.formErrorCheck) {
        this.inputErrors = await this.checkInputErrors();
      }
      if (!this.inputErrors.length && !this.formErrorCheck) {
        this.$router.push({
          name: 'createAccount.offer',
          params: { step: { creationAccountStep: this.form } },
        });
      }
    },
    formErrorChecker() {
        this.companyError = this.form.company ? false : true;
        this.firstNameError = this.form.firstName ? false : true;
        this.lastNameError = this.form.lastName ? false : true;
        this.zipCodeError = this.form.zipCode ? false : true;
        this.addressError = this.form.address ? false : true;
        this.emailError = this.form.email ? false : true;
        this.phoneError = this.form.phone ? false : true;
        this.cityError = this.form.city ? false : true;
        this.countryError = this.form.country ? false : true;
        this.loginError = this.form.login ? false : true;
        this.civilityError = this.form.title ? false : true;
        this.companyNumberError = this.form.tvaValue || this.form.siretValue ? false : true;
        this.passwordConfirmError = this.form.password ? false : true;
        this.passwordError = this.form.password ? false : true;

        if(!this.form.company || !this.form.firstName || !this.form.lastName ||
        !this.form.zipCode || !this.form.address || !this.form.city ||
        !this.form.country || !this.form.email || !this.form.phone
        || !this.form.login || !this.form.title)
        {
          this.formErrorCheck = true;
        }
        else {
          this.formErrorCheck = false;
        }
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
      ];
      if (this.siretType === 'siret') {
        objErrorsToChcek = [...objErrorsToChcek, { type: 'SIRET', value: this.form.siretValue }];
      }
      const errors = await this.validatePartner(objErrorsToChcek);
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
.error {
  color: red;
}
.allRequired {
  font-size: 14px;
  font-weight: bold;
  margin-bottom: 1.5rem;
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
}
</style>
