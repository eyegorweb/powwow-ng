<template>
  <BaseDetailPanelContent white>
    <div class="m-3">
      <div class="labels-container mb-4">
        <div class="overview-item">
          <h6>Créé le :</h6>
          <p class="mock-value">13/01/2020 11:11:11</p>
        </div>
        <div class="overview-item">
          <h6>Dernière modification le :</h6>
          <p class="mock-value">13/01/2020 11:11:11</p>
        </div>
        <div v-if="company" class="overview-item">
          <h6>établissement :</h6>
          <p class="mock-value">{{ company }}</p>
        </div>
      </div>

      <div>
        <div class="row mb-3">
          <div class="col">
            <div class="d-flex">
              <label class="radio-container mr-3">
                {{ $t('common.MR') }}
                <input name="civility" type="radio" value="MR" v-model="form.title" />
                <span class="checkmark" />
              </label>
              <label class="radio-container">
                {{ $t('common.MRS') }}
                <input name="civility" type="radio" value="MRS" v-model="form.title" />
                <span class="checkmark" />
              </label>
            </div>
          </div>
        </div>

        <div class="entries-line">
          <div class="form-entry">
            <FormControl big label="common.firstName" v-model="form.firstName" />
          </div>
          <div class="form-entry pl-2">
            <FormControl big label="common.lastName" v-model="form.lastName" />
          </div>
        </div>

        <div class="entries-line">
          <div class="form-entry">
            <FormControl big label="users.function" v-model="form.function" />
          </div>
        </div>

        <div class="entries-line">
          <div class="form-entry">
            <FormControl big label="users.phone" v-model="form.phone" />
          </div>
          <div class="form-entry pl-2">
            <FormControl big label="users.mobile" v-model="form.mobile" />
          </div>
        </div>

        <div class="entries-line">
          <div class="form-entry">
            <FormControl big label="common.email" v-model="form.email" />
          </div>
        </div>

        <div class="entries-line">
          <div class="form-entry">
            <h5>Adresse</h5>
            <AdressComponent big v-model="selectedAddress" />
          </div>
        </div>

        <div class="entries-line">
          <div class="form-entry">
            <FormControl big label="filters.city" v-model="form.city" />
          </div>
          <div class="form-entry pl-2">
            <FormControl
              big
              label="orders.new.deliveryStep.form.zipcode"
              input-type="number"
              v-model="form.zipCode"
            />
          </div>
        </div>

        <div class="entries-line">
          <div class="form-entry">
            <FormControl big label="filters.state" v-model="form.state" />
          </div>
          <div class="form-entry pl-2">
            <h5>{{ $t('orders.new.deliveryStep.form.country') }}</h5>
            <UiApiAutocomplete
              :items="countries"
              v-model="form.country"
              display-results-while-empty
              big
            />
          </div>
        </div>
      </div>
    </div>
    <div slot="footer" class="action-buttons">
      <div>
        <UiButton variant="import" block>{{ $t('cancel') }}</UiButton>
      </div>
      <div>
        <UiButton :disabled="!canSave" variant="primary" @click="save" block>{{
          $t('save')
        }}</UiButton>
      </div>
    </div>
  </BaseDetailPanelContent>
</template>

<script>
import BaseDetailPanelContent from '@/components/BaseDetailPanelContent';
import UiButton from '@/components/ui/Button';
import FormControl from '@/components/ui/FormControl';
import AdressComponent from '@/components/AdressComponent.vue';
import UiApiAutocomplete from '@/components/ui/UiApiAutocomplete';

import { fetchDeliveryCountries } from '@/api/filters';
import { editAdministrator } from '@/api/partners.js';
import { mapMutations } from 'vuex';

import get from 'lodash.get';

export default {
  components: {
    BaseDetailPanelContent,
    UiButton,
    AdressComponent,
    FormControl,
    UiApiAutocomplete,
  },
  props: {
    content: Object,
  },
  data() {
    return {
      company: undefined,
      form: {
        title: undefined,
        firstName: undefined,
        lastName: undefined,
        zipCode: undefined,
        city: undefined,
        country: undefined,
        function: undefined,
        email: undefined,
        state: undefined,
        phone: undefined,
        mobile: undefined,
      },

      selectedAddress: {},

      countries: [],
    };
  },

  computed: {
    canSave() {
      const missingFields = ['title', 'firstName', 'email', 'city', 'zipCode', 'country'].filter(
        field => !this.form[field]
      );

      const isAdressValid = this.selectedAddress && this.selectedAddress.label;

      return !missingFields.length && isAdressValid;
    },
  },

  methods: {
    ...mapMutations(['flashMessage', 'closePanel']),
    async save() {
      const adminType = get(this.content, 'adminType', 'PRIMARY');
      const response = await editAdministrator(adminType, {
        partyId: this.content.partnerId,
        company: this.company,
        firstName: this.form.firstName,
        lastName: this.form.lastName,
        email: this.form.email,
        function: this.form.function,
        language: { type: 'enum', value: 'fr' },
        title: { type: 'enum', value: this.form.title },
        contactInformation: {
          email: this.form.email,
          phone: this.form.phone,
          mobile: this.form.mobile,
        },
        address: {
          address1: this.selectedAddress.label,
          zipCode: this.form.zipCode,
          city: this.form.city,
          country: this.form.country.value,
          state: this.form.state,
        },
      });

      if (!response) {
        this.flashMessage({ level: 'danger', message: this.$t('genericErrorMessage') });
      } else {
        this.flashMessage({ level: 'success', message: this.$t('genericSuccessMessage') });

        this.closePanel({ resetSearch: true });
      }
    },
  },

  async mounted() {
    const countries = await fetchDeliveryCountries(this.$i18n.locale);
    this.countries = countries.map(c => ({
      ...c,
      label: c.name,
      value: c.code,
    }));

    if (this.content) {
      this.form.title = get(this.content, 'name.title');
      this.form.firstName = get(this.content, 'name.firstName');
      this.form.lastName = get(this.content, 'name.lastName');
      this.form.email = get(this.content, 'contactInformation.email');
      this.form.phone = get(this.content, 'contactInformation.phone');
      this.form.mobile = get(this.content, 'contactInformation.mobile');
      this.form.function = get(this.content, 'function');
      this.selectedAddress = { label: get(this.content, 'address.address1') };

      this.form.zipCode = get(this.content, 'address.zipCode');
      this.form.city = get(this.content, 'address.city');

      this.form.country = this.countries.find(
        c =>
          c.name === get(this.content, 'address.country') ||
          c.code === get(this.content, 'address.country')
      );

      this.company = get(this.content, 'company');
    }
  },

  watch: {
    selectedAddress(address) {
      if (address.city) {
        this.form.address = address.label;
        this.form.zipCode = address.postcode;
        this.form.city = address.city;
        this.form.country = this.countries.find(c => c.code === 'fr');
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
.form-input {
  font-size: 1.5rem !important;
}

.form-entry {
  flex-grow: 1;

  h5 {
    font-size: 1rem;
    color: $dark-gray;
  }
}

.overview-item {
  flex-grow: 1;
}

.entries-line {
  display: flex;
  justify-content: space-between;
}
.labels-container {
  display: flex;
  border-bottom: 1px dashed $medium-gray;
  .overview-item {
    border: none !important;
  }
}

.radio-container {
  display: block;
  position: relative;
  padding-left: 35px;
  cursor: pointer;
  font-size: 1.3rem;
  padding-top: 0.3rem;
  user-select: none;
  input {
    position: absolute;
    opacity: 0;
    cursor: pointer;
  }
}

.checkmark {
  position: absolute;
  top: 0;
  left: 0;
  height: 25px;
  width: 25px;
  border-radius: 50%;
  border: 1px solid $gray-400;
}

.radio-container {
  input:checked ~ .checkmark {
    background-color: white;
    border: 1px solid $secondary;
  }
}

.checkmark:after {
  content: '';
  position: absolute;
  display: none;
}

.radio-container {
  input:checked ~ .checkmark:after {
    display: block;
  }
  .checkmark:after {
    top: 5px;
    left: 5px;
    width: 13px;
    height: 13px;
    border-radius: 50%;
    background: $secondary;
  }
}
</style>
