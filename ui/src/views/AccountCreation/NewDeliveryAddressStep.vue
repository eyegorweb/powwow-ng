<template>
  <LoaderContainer :is-loading="isLoading">
    <div slot="on-loading">
      <ModalSkeleton :is-loading="isLoading" />
    </div>
    <div class="form-container">
      <form @submit.prevent="onSubmitAddress">
        <div class="form-content">
          <h2 v-if="!addressEdit" class="panel-title text-center mt-2">
            {{ $t('orders.choose-delivery') }}
          </h2>
          <h2 v-else class="panel-title text-center mt-2">{{ $t('orders.modify-delivery') }}</h2>
          <div :class="{ error: !!errors.title }">
            <div class="d-flex">
              <label class="radio-container mr-3">
                {{ $t('common.MR') }}
                <input name="title" type="radio" value="MR" v-model="form.title" />
                <span class="checkmark" />
              </label>
              <label class="radio-container">
                {{ $t('common.MRS') }}
                <input name="title" type="radio" value="MRS" v-model="form.title" />
                <span class="checkmark" />
              </label>
            </div>
            <div v-if="!!errors.title" class="error-text">{{ $t(errors.title) }}</div>
          </div>
          <FormControl
            label="orders.new.deliveryStep.form.lastname"
            v-model="form.lastName"
            :error="errors.lastName"
          />
          <FormControl
            label="orders.new.deliveryStep.form.firstname"
            v-model="form.firstName"
            :error="errors.firstName"
          />
          <div class="row">
            <div class="col">
              <FormControl
                label="orders.new.deliveryStep.form.phone"
                v-model="form.phone"
                :error="errors.phone"
                :max-size="20"
              />
            </div>
            <div class="col">
              <FormControl
                label="orders.new.deliveryStep.form.email"
                input-type="email"
                v-model="form.email"
                :error="errors.email"
              />
            </div>
          </div>
          <FormControl
            label="orders.new.deliveryStep.form.company"
            v-model="form.company"
            :error="errors.company"
          />
          <label data-v-4eacd3ee>{{ $t('orders.new.deliveryStep.form.address') }}</label>
          <UiApiAutocomplete
            :api-method="searchAddress"
            no-filter-on-result
            v-model="selectedAddress"
            :error="errors.address"
            no-icon
          />

          <div class="row">
            <div class="col">
              <FormControl
                label="orders.new.deliveryStep.form.zipcode"
                input-type="text"
                v-model="form.zipCode"
                :error="errors.zipCode"
              />
            </div>
            <div class="col">
              <FormControl
                label="orders.new.deliveryStep.form.city"
                v-model="form.city"
                :error="errors.city"
              />
            </div>
            <div class="col">
              <div class="form-group">
                <label>{{ $t('orders.new.deliveryStep.form.country') }}</label>
                <div>
                  <UiApiAutocomplete
                    :items="countries"
                    v-model="form.country"
                    :error="errors.country"
                    display-results-while-empty
                  />
                </div>
              </div>
            </div>
          </div>
          <!-- <div class="form-group">
            <label>{{ $t('orders.new.deliveryStep.form.delivery') }}</label>
            <input class="form-control mb-1" v-model="form.extraInfos" disabled />
            <input class="form-control" v-model="form.extraInfos2" disabled />
          </div> -->
        </div>
        <div class="form-bottom">
          <div class="row">
            <div class="col">
              <button
                type="button"
                class="btn btn-outline-primary btn-block"
                @click="$emit('cancel')"
              >
                {{ $t('orders.new.deliveryStep.form.cancel') }}
              </button>
            </div>
            <div class="col">
              <button v-if="!addressEdit" class="btn btn-primary btn-block" :disabled="!canSave">
                {{ $t('orders.new.deliveryStep.form.add') }}
              </button>
              <button v-else class="btn btn-primary btn-block" :disabled="!canEdit">
                {{ $t('orders.new.deliveryStep.form.modify') }}
              </button>
            </div>
          </div>
        </div>
      </form>
    </div>
  </LoaderContainer>
</template>

<script>
import FormControl from '@/components/ui/FormControl';
import UiApiAutocomplete from '@/components/ui/UiApiAutocomplete';
import LoaderContainer from '@/components/LoaderContainer';
import ModalSkeleton from '@/components/ui/skeletons/ModalSkeleton';
import { searchAddress, fetchCountries } from '@/api/address';
import uuid from 'uuid/v1';

export default {
  components: {
    FormControl,
    UiApiAutocomplete,
    LoaderContainer,
    ModalSkeleton,
  },
  props: {
    addressEdit: {
      type: Object,
      required: false,
    },
  },
  data() {
    return {
      isLoading: false,
      selectedAddress: {},
      countries: [],
      form: {
        id: uuid(),
        firstName: '',
        lastName: '',
        phone: '',
        email: '',
        company: '',
        address: '',
        zipCode: '',
        city: '',
        country: '',
        extraInfos: '',
        extraInfos2: '',
        title: '',
      },
      errors: {},
    };
  },

  computed: {
    requiredFields() {
      const requiredFields = [
        'title',
        'firstName',
        'lastName',
        'phone',
        'company',
        'address',
        'zipCode',
        'city',
        'country',
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
            return !this.form.country.data;
          }
        }
        return !this.form[f];
      });
    },
    canEdit() {
      return this.checkForErrors();
    },
    canSave() {
      return this.requiredFields.length === 0;
    },
  },

  methods: {
    searchAddress,
    onSubmitAddress() {
      this.isLoading = true;
      if (this.addressEdit) {
        this.$emit('saved', this.form);
      } else {
        this.$emit('add', this.form);
      }
      this.isLoading = false;
    },
    /**
     * Return true when no error is found
     */
    checkForErrors() {
      const fieldsWithErrors = this.requiredFields;
      this.errors = fieldsWithErrors.reduce((all, field) => {
        all[field] = 'errors.mandatory';
        return all;
      }, {});

      return fieldsWithErrors.length === 0;
    },
  },

  async mounted() {
    const countries = await fetchCountries();
    this.countries = countries.map((c) => ({
      id: c.codeIso3,
      label: c.name,
      data: c,
    }));

    if (this.addressEdit) {
      this.form.id = this.addressEdit.id;
      this.form.firstName = this.addressEdit.firstName;
      this.form.lastName = this.addressEdit.lastName;
      this.form.title = this.addressEdit.title;
      this.form.phone = this.addressEdit.phone;
      this.form.email = this.addressEdit.email ? this.addressEdit.email : '';
      this.form.company = this.addressEdit.company || this.addressEdit.companyName;
      this.form.address = this.addressEdit.address;
      this.selectedAddress = { label: this.addressEdit.address };
      this.form.zipCode = this.addressEdit.zipCode;
      this.form.city = this.addressEdit.city;
      this.form.country = this.countries.find((c) => c.label === this.addressEdit.country.label);
      this.form.extraInfos = this.addressEdit.extraInfos ? this.addressEdit.extraInfos : '';
      this.form.extraInfos2 = this.addressEdit.extraInfos2 ? this.addressEdit.extraInfos2 : '';
    }
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
        this.form.address = address.label;
        this.form.zipCode = address.postcode;
        this.form.city = address.city;
        this.form.country = this.countries.find((c) => c.data.code === 'fr');
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
.form-container {
  display: flex;
  flex-direction: column;
  div.form-content {
    flex: 1;
    max-height: 75vh;
    overflow-y: auto;
    overflow-x: hidden;
    padding-left: 5px;
    padding-right: 5px;
  }
}

@media screen and (max-height: 768px) {
  .form-container {
    div.form-content {
      max-height: 75vh;
    }
  }
}
@media screen and (min-height: 769px) {
  .form-container {
    div.form-content {
      max-height: 81vh;
    }
  }
}

.radio-container {
  display: block;
  position: relative;
  padding-left: 35px;
  cursor: pointer;
  font-size: 1rem;
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

.error {
  .checkmark {
    border: 1px solid $orange;
  }
  .error-text {
    color: $orange;
  }
}

::v-deep fieldset.form-group {
  margin-bottom: 0;
}
</style>
