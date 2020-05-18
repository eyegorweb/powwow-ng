<template>
  <BaseDetailPanelContent white>
    <div class="form-content m-3">
      <h2 v-if="!addressEdit" class="panel-title text-center mt-2">
        {{ $t('orders.choose-delivery') }}
      </h2>
      <h2 v-else class="panel-title text-center mt-2">{{ $t('orders.modify-delivery') }}</h2>
      <div :class="{ error: !!errors.title }">
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
      <label>{{ $t('orders.new.deliveryStep.form.address') }}</label>
      <UiApiAutocomplete
        :api-method="searchAddress"
        v-model="selectedAddress"
        :error="errors.address"
        no-icon
      />

      <div class="row">
        <div class="col">
          <FormControl
            label="orders.new.deliveryStep.form.zipcode"
            input-type="number"
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
                :error="errors.city"
                display-results-while-empty
              />
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

    <div slot="footer" class="action-buttons">
      <AddCustomFieldActions
        @cancel="closePanel"
        @add-field="onSubmitAddress"
        can-send
        :text="actionLabel"
      />
    </div>
  </BaseDetailPanelContent>
</template>

<script>
import BaseDetailPanelContent from '@/components/BaseDetailPanelContent';
import FormControl from '@/components/ui/FormControl';
import UiApiAutocomplete from '@/components/ui/UiApiAutocomplete';
import AddCustomFieldActions from '@/views/GetSim/CreateOrder/StepSettings/AddCustomFieldActions';
import { searchAddress } from '@/api/address';
import { addPartyShippingAddress, updatePartyShippingAddress } from '@/api/partners';
import { fetchDeliveryCountries } from '@/api/filters';
import { mapMutations } from 'vuex';

export default {
  components: {
    BaseDetailPanelContent,
    FormControl,
    UiApiAutocomplete,
    AddCustomFieldActions,
  },

  props: {
    content: Object,
  },

  data() {
    return {
      partnerId: '',
      addressEdit: undefined,
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
        country: { label: '' },
        extraInfos: '',
        extraInfos2: '',
        title: '',
      },
      errors: {},
      inEditMode: false,
    };
  },

  mounted() {
    this.partnerId = this.content.partnerId;
    if (this.content && this.content.modifyDA) {
      this.addressEdit = this.content.modifyDA;
      this.inEditMode = this.content.inEditMode;
    }
  },

  computed: {
    actionLabel() {
      return this.inEditMode ? this.$t('getadmin.partnerDetail.update') : this.$t('save');
    },
  },

  methods: {
    ...mapMutations(['flashMessage', 'closePanel']),

    searchAddress,
    async onSubmitAddress() {
      let response;
      const canSave = this.checkForErrors();
      if (!canSave) return;

      if (this.addressEdit) {
        response = await updatePartyShippingAddress(this.form, this.addressEdit.id);
      } else {
        response = await addPartyShippingAddress(this.form, this.partnerId);
      }

      if (!response) {
        this.flashMessage({ level: 'danger', message: this.$t('genericErrorMessage') });
      } else {
        this.flashMessage({ level: 'success', message: this.$t('genericSuccessMessage') });
        this.closePanel();
      }
    },
    /**
     * Return true when no error is found
     */
    checkForErrors() {
      const requiredFields = [
        'title',
        'firstName',
        'lastName',
        'phone',
        // 'email',
        'company',
        'address',
        'zipCode',
        'city',
        'country',
      ];

      const fieldsWithErrors = requiredFields.filter(f => {
        // cas spécial pour l'autocomplete, il renvoi un objet {label: ''} si l'input est vide
        if (f === 'address') {
          if (typeof this.form.address === 'object') {
            return !this.form.address.label;
          }
        }
        return !this.form[f];
      });
      this.errors = fieldsWithErrors.reduce((all, field) => {
        all[field] = 'errors.mandatory';
        return all;
      }, {});
      if (this.form.address.length > 35) {
        this.errors['address'] = 'errors.limitAddress';
        fieldsWithErrors.push('address');
      }
      return fieldsWithErrors.length === 0;
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
      this.form.email = this.addressEdit.contactInformation.email
        ? this.addressEdit.contactInformation.email
        : '';
      this.form.company = this.addressEdit.company;
      this.form.address = this.addressEdit.address.address1;
      this.selectedAddress = { label: this.addressEdit.address.address1 };
      this.form.zipCode = this.addressEdit.address.zipCode;
      this.form.city = this.addressEdit.address.city;
      this.form.country = this.countries.find(
        c =>
          c.name === this.addressEdit.address.country || c.code === this.addressEdit.address.country
      );
      this.form.extraInfos = this.addressEdit.address.address2
        ? this.addressEdit.address.address2
        : '';
      this.form.extraInfos2 = this.addressEdit.address.address3
        ? this.addressEdit.address.address3
        : '';
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

<style lang="scss" scoped></style>
