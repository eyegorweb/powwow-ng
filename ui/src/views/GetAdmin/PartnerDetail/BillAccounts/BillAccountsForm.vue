<template>
  <div class="row">
    <div class="col-md-3">
      <ul class="list-group">
        <li class="list-group-item">
          <router-link
            :to="{
              name: 'getAdminPartnerDetails.billingAccounts.list',
              params: {
                id: $route.params.id,
                customerAccountCode: $route.params.customerAccountCode,
              },
            }"
            >{{ $t('getadmin.partnerDetail.backToCF') }}</router-link
          >
        </li>
      </ul>
    </div>
    <div class="col-md-9">
      <div class="billAccounts">
        <h3>{{ $t('getadmin.partners.accountDetail') }}</h3>
        <div class="billAccounts-bloc">
          <div class="billAccounts-bloc-content">
            <div class="billAccounts-bloc-content-flex">
              <FormControl label="getadmin.partnerDetail.code" v-model="form.code" />
              <FormControl label="getadmin.partnerDetail.label" v-model="form.label" />
            </div>

            <FormControl label="getadmin.partnerDetail.company" v-model="form.company" />
            <UiToggle
              v-if="havePermission('party', 'update_customer_account')"
              :label="$t('getadmin.partnerDetail.actBlock')"
              :editable="true"
              v-model="form.actBlock"
            />
          </div>
        </div>
        <h3>{{ $t('getadmin.partnerDetail.contactDetail') }}</h3>
        <div class="billAccounts-bloc">
          <div class="billAccounts-bloc-content">
            <FormControl label="getadmin.partnerDetail.address" v-model="form.address" />
            <FormControl label="getadmin.partnerDetail.address2" v-model="form.address2" />
            <div class="billAccounts-bloc-content-flex">
              <FormControl label="getadmin.partnerDetail.zipCode" v-model="form.zipCode" />
              <FormControl label="getadmin.partnerDetail.city" v-model="form.city" />
            </div>
            <div class="billAccounts-bloc-content-flex">
              <FormControl label="getadmin.partnerDetail.state" v-model="form.state" />
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
            <Button
              v-if="havePermission('party', 'update_customer_account')"
              :variant="'primary'"
              @click="save"
              >{{ $t('getadmin.partnerDetail.update') }}</Button
            >
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import FormControl from '@/components/ui/FormControl';
import Button from '@/components/ui/Button';
import UiToggle from '@/components/ui/UiToggle';
import UiApiAutocomplete from '@/components/ui/UiApiAutocomplete';
import { mapGetters, mapMutations } from 'vuex';
import { getCustomerAccount, updateCustomerAccount } from '@/api/partners.js';
import { fetchDeliveryCountries } from '@/api/filters';

export default {
  components: {
    FormControl,
    Button,
    UiToggle,
    UiApiAutocomplete,
  },

  data() {
    return {
      account: undefined,
      lines: undefined,
      showDetail: false,
      countries: [],
      errors: {},
      form: {
        code: undefined,
        label: undefined,
        company: undefined,
        address: undefined,
        address2: undefined,
        zipCode: undefined,
        city: undefined,
        state: undefined,
        country: undefined,
      },
    };
  },

  computed: {
    ...mapGetters(['havePermission']),
  },

  async mounted() {
    await this.refreshCountries();
    await this.fillForm();
  },

  methods: {
    ...mapMutations(['flashMessage']),
    async refreshCountries() {
      const countries = await fetchDeliveryCountries(this.$i18n.locale);
      this.countries = countries.map((c) => ({
        ...c,
        label: c.name,
        value: c.code,
      }));
    },
    async fillForm() {
      if (this.$route.params.customerAccountCode) {
        this.account = await getCustomerAccount(this.$route.params.customerAccountCode);
        this.form.code = this.account[0].code;
        this.form.label = this.account[0].name;
        this.form.company = this.account[0].company;
        this.form.actBlock = this.account[0].massActionsDisabled;
        this.form.address = this.account[0].address.address1;
        this.form.address2 = this.account[0].address.address2;
        this.form.zipCode = this.account[0].address.zipCode;
        this.form.city = this.account[0].address.city;
        this.form.state = this.account[0].address.state;
        this.form.country = this.getCountryData(this.account[0].address.country);
      }
    },
    getCountryData(countryCode) {
      if (countryCode === 'null' || !countryCode) {
        return '';
      } else {
        let foundCountry = this.countries.find((c) => c.code === countryCode);
        if (!foundCountry) {
          foundCountry = this.countries.find((c) => c.name === countryCode);
        }

        if (foundCountry) {
          return foundCountry.name;
        }
        return '';
      }
    },
    async save() {
      const params = {
        id: this.account[0].id,
        code: this.form.code,
        label: this.form.label,
        company: this.form.company,
        address: this.form.address,
        address2: this.form.address2,
        actBlock: this.form.actBlock,
        zipCode: this.form.zipCode,
        city: this.form.city,
        state: this.form.state,
        country: this.countries.find((c) => c.name === this.form.country).code || '',
      };

      let response;

      response = await updateCustomerAccount(params);
      if (!response && response.errors && response.errors.length) {
        this.flashMessage({ level: 'danger', message: this.$t('genericErrorMessage') });
      } else {
        this.flashMessage({ level: 'success', message: this.$t('genericSuccessMessage') });
      }
    },
  },
};
</script>

<style lang="scss" scoped>
.billAccounts {
  h3 {
    font-size: 16px;
    text-transform: uppercase;
    color: $primary;
  }

  &-bloc {
    display: flex;
    background-color: white;
    width: 100%;
    padding: 20px;
    box-sizing: border-box;
    margin: 20px 0 30px 0;
    justify-content: center;

    .btn-primary {
      float: right;
      padding: 10px 80px;
    }

    &-content {
      width: 100%;
      max-width: 450px;

      &-flex {
        display: flex;
        justify-content: space-between;
        .form-group {
          &:first-child {
            width: 38%;
          }
          &:last-child {
            width: 58%;
          }
        }
      }
    }
  }
}
</style>

<style lang="scss">
.billAccounts {
  &-bloc {
    .btn-primary {
      float: right;
      padding: 10px 80px;
    }
  }
}
</style>
