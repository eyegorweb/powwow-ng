<template>
  <div class="step-container">
    <div class="form-container">
      <div class="row mb-3">
        <div class="col">
          <div class="d-flex">
            <label class="radio-container mr-3">
              {{ $t('common.MRS') }}
              <input name="civility" type="radio" value="MRS" v-model="form.civility" />
              <span class="checkmark" />
            </label>
            <label class="radio-container">
              {{ $t('common.MR') }}
              <input name="civility" type="radio" value="MR" v-model="form.civility" />
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

      <div class="formLine">
        <FormControl label="getadmin.partners.name" v-model="form.companyName" />
        <FormControl
          label="getadmin.cf.filters.siret"
          input-type="number"
          v-model="form.siretValue"
          :max-size="14"
        />
        <span v-if="reachedMaxLength" class="error-text">
          {{ $t('errors.maxlength') }}
        </span>
      </div>

      <div class="entries-line">
        <div class="form-entry">
          <label>{{ $t('getadmin.partnerDetail.address') }}</label>
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
        <UiInput v-model="form.login" block />
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

import { searchAddress, fetchCountries } from '@/api/address';
import { checkPasswordErrors } from '@/utils.js';

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
        civility: undefined,
        companyName: undefined,
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
        // passwordConfirm: undefined,
      },
      selectedAddress: {},
      countries: [],
    };
  },

  computed: {
    requiredFields() {
      const requiredFields = [
        'civility',
        'companyName',
        'siretValue',
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

    reachedMaxLength() {
      const numberValue = this.form && this.form.siretValue ? this.form.siretValue : undefined;
      if (!numberValue) return false;
      return numberValue.toString().length > 14;
    },

    canNext() {
      return (
        this.requiredFields.length === 0 &&
        this.passwordConfirmationErrors.length === 0 &&
        !this.reachedMaxLength
      );
    },
  },

  methods: {
    searchAddress,
    gotoNext() {
      this.$router.push({
        name: 'createAccount.offer',
        params: { step: { creationAccountStep: this.form } },
      });
    },

    isEmailValid(email) {
      var re =
        /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
      return re.test(email);
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
        this.form.address = address.label;
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

  > div {
    width: 48%;
  }
}

.form-container {
  width: 70%;
  margin: 0 auto;
}
</style>
