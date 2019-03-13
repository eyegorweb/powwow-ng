<template>
  <div class="form-container">
    <form @submit.prevent="onSubmitAddress">
      <div class="form-content">
        <h2 v-if="!addressEdit" class="panel-title text-center mt-2">
          {{ $t('orders.choose-delivery') }}
        </h2>
        <h2 v-else class="panel-title text-center mt-2">{{ $t('orders.modify-delivery') }}</h2>
        <div class="d-flex">
          <label class="radio-container mr-3"
            >{{ $t('common.MR') }}
            <input name="civility" type="radio" value="MR" v-model="form.title" required />
            <span class="checkmark" />
          </label>
          <label class="radio-container"
            >{{ $t('common.MRS') }}
            <input name="civility" type="radio" value="MRS" v-model="form.title" required />
            <span class="checkmark" />
          </label>
        </div>
        <FormControl
          label="orders.new.deliveryStep.form.lastname"
          v-model="form.lastName"
          :error="errors.lastName"
          required
        />
        <FormControl
          label="orders.new.deliveryStep.form.firstname"
          v-model="form.firstName"
          :error="errors.firstName"
          required
        />
        <div class="row">
          <div class="col">
            <FormControl
              label="orders.new.deliveryStep.form.phone"
              v-model="form.phone"
              :error="errors.phone"
              required
              :max-size="20"
            />
          </div>
          <div class="col">
            <FormControl
              label="orders.new.deliveryStep.form.email"
              input-type="email"
              v-model="form.email"
              :error="errors.email"
              required
            />
          </div>
        </div>
        <FormControl
          label="orders.new.deliveryStep.form.company"
          v-model="form.company"
          :error="errors.company"
          required
        />
        <label data-v-4eacd3ee="">{{ $t('orders.new.deliveryStep.form.address') }}</label>
        <UiApiAutocomplete :api-method="searchAddress" v-model="selectedAddress" no-icon />

        <div class="row">
          <div class="col">
            <FormControl
              label="orders.new.deliveryStep.form.zipcode"
              input-type="number"
              v-model="form.zipCode"
              :error="errors.zipCode"
              required
            />
          </div>
          <div class="col">
            <FormControl
              label="orders.new.deliveryStep.form.city"
              v-model="form.city"
              :error="errors.city"
              required
            />
          </div>
          <div class="col">
            <div class="form-group">
              <label>{{ $t('orders.new.deliveryStep.form.country') }}</label>
              <div>
                <UiSelect placeholder="" v-model="form.country" :options="countries" />
              </div>
            </div>
          </div>
        </div>
        <div class="form-group">
          <label>{{ $t('orders.new.deliveryStep.form.delivery') }}</label>
          <input class="form-control mb-1" v-model="form.extraInfos" disabled />
          <input class="form-control" v-model="form.extraInfos2" disabled />
        </div>
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
            <button v-if="!addressEdit" class="btn btn-primary btn-block">
              {{ $t('orders.new.deliveryStep.form.add') }}
            </button>
            <button v-else class="btn btn-primary btn-block">
              {{ $t('orders.new.deliveryStep.form.modify') }}
            </button>
          </div>
        </div>
      </div>
    </form>
  </div>
</template>

<script>
import FormControl from '@/components/ui/FormControl';
import UiApiAutocomplete from '@/components/ui/UiApiAutocomplete';
import { searchAddress } from '@/api/address';
import { addPartyShippingAddress } from '@/api/partners';
import { updatePartyShippingAddress } from '@/api/partners';
import { fetchDeliveryCountries } from '@/api/filters';
import UiSelect from '@/components/ui/UiSelect';

export default {
  components: {
    FormControl,
    UiApiAutocomplete,
    UiSelect,
  },
  props: {
    partnerId: {
      type: String,
    },
    shippingAddressId: String,
    addressEdit: {
      type: Object,
      required: false,
    },
  },
  data() {
    return {
      selectedAddress: {},
      countries: [],
      form: {
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

  methods: {
    searchAddress,
    async onSubmitAddress() {
      let savedId;
      if (this.addressEdit) {
        savedId = await updatePartyShippingAddress(this.form, this.addressEdit.id);
      } else {
        savedId = await addPartyShippingAddress(this.form, this.partnerId);
      }
      this.$emit('saved', savedId.id);
    },
  },

  async created() {
    const countries = await fetchDeliveryCountries(this.$i18n.locale);
    this.countries = countries.map(c => ({
      ...c,
      label: c.name,
      value: c.code,
    }));

    if (this.addressEdit) {
      this.form.firstName = this.addressEdit.name.firstName;
      this.form.lastName = this.addressEdit.name.lastName;
      this.form.title = this.addressEdit.name.title;
      this.form.phone = this.addressEdit.contactInformation.phone;
      this.form.email = this.addressEdit.contactInformation.email;
      this.form.company = this.addressEdit.company;
      this.form.address = this.addressEdit.address.address1;
      this.selectedAddress = { label: this.addressEdit.address.address1 };
      this.form.zipCode = this.addressEdit.address.zipCode;
      this.form.city = this.addressEdit.address.city;
      this.form.country = this.addressEdit.address.country;
      this.form.extraInfos = this.addressEdit.address.address2;
      this.form.extraInfos2 = this.addressEdit.address.address3;
    }
  },

  watch: {
    selectedAddress(address) {
      if (address.city) {
        this.form.address = address.label;
        this.form.zipCode = address.postcode;
        this.form.city = address.city;
        this.form.country = 'FR';
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
</style>
