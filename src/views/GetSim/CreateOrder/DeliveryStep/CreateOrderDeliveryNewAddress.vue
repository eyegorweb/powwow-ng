<template>
  <div class="form-container">
    <form @submit.prevent="onSubmitAddress">

      <div class="form-content">
        <h2 class="panel-title text-center mt-2">{{ $t('orders.choose-delivery') }}</h2>
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
              input-type="tel"
              v-model="form.phone"
              :error="errors.phone"
              required
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
              <select class="form-control">
                <option value="fr">Fr</option>
              </select>
            </div>
          </div>
        </div>
        <div class="form-group">
          <label>{{ $t('orders.new.deliveryStep.form.delivery') }}</label>
          <input class="form-control mb-1" v-model="form.extraInfos">
          <input class="form-control" v-model="form.extraInfos2">
        </div>
      </div>
      <div class="form-bottom">
        <div class="row">
          <div class="col">
            <button type="button" class="btn btn-outline-primary btn-block" @click="$emit('cancel')">
              {{ $t('orders.new.deliveryStep.form.cancel') }}
            </button>
          </div>
          <div class="col">
            <button
              class="btn btn-primary btn-block"
            >
              {{ $t('orders.new.deliveryStep.form.add') }}
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

export default {
  components: {
    FormControl,
    UiApiAutocomplete,
  },
  props: {
    partnerId: {
      type: String,
    },
  },
  data() {
    return {
      selectedAddress: {},
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
      },
      errors: {},
    };
  },

  methods: {
    searchAddress,
    async onSubmitAddress() {
      await addPartyShippingAddress(this.form, this.partnerId);
      this.$emit('saved');
    },
  },

  watch: {
    selectedAddress(address) {
      if (address.city) {
        this.form.address = address.label;
        this.form.zipCode = address.postcode;
        this.form.city = address.city;
      } else {
        this.form.address = address.label;
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
    overflow-y: scroll;
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
</style>
