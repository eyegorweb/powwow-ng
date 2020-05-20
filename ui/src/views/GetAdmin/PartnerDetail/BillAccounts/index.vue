<template>
  <div>
    <DataTable
      :columns.sync="columns"
      :rows="rows || []"
      :order-by.sync="orderBy"
      v-if="!showDetail"
    ></DataTable>
    <div class="row" v-if="showDetail">
      <div class="col-md-3">
        <ul class="list-group">
          <li class="list-group-item">
            <a href="#" @click="showDetail = false">{{ $t('getadmin.partnerDetail.backToCF') }}</a>
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
                label="Blocage des actes de gestion"
                :editable="true"
                v-model="form.actBlock"
              />
            </div>
          </div>
          <h3>{{ $t('getadmin.partnerDetail.contactDetail') }}</h3>
          <div class="billAccounts-bloc">
            <div class="billAccounts-bloc-content">
              <FormControl label="getadmin.partnerDetail.address" v-model="form.address" />
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
              <Button :variant="'primary'" @click="save">{{ $t('getadmin.partnerDetail.update') }}</Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import { mapMutations } from 'vuex';
import {
  fetchCustomerAccounts,
  getCustomerAccount,
  updateCustomerAccount,
} from '@/api/partners.js';
import DataTable from '@/components/DataTable/DataTable';
import BillAccountStatusCell from './BillAccountStatusCell';
import FormControl from '@/components/ui/FormControl';
import Button from '@/components/ui/Button';
import UiToggle from '@/components/ui/UiToggle';
import { fetchDeliveryCountries } from '@/api/filters';
import UiApiAutocomplete from '@/components/ui/UiApiAutocomplete';

export default {
  props: {
    partner: {
      type: Object,
    },
  },
  components: {
    DataTable,
    FormControl,
    Button,
    UiToggle,
    UiApiAutocomplete,
  },

  async mounted() {
    this.accounts = await fetchCustomerAccounts(this.partner.id);
    this.refreshTable();
  },

  data() {
    return {
      accounts: undefined,
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
        zipCode: undefined,
        city: undefined,
        state: undefined,
        country: undefined,
      },
      columns: [
        {
          id: 1,
          label: this.$t('common.code'),
          name: 'code',
          orderable: true,
          visible: true,
          format: {
            type: 'LinkBtn',
            onClick: async code => {
              this.account = await getCustomerAccount(code);
              this.form.code = this.account[0].code;
              this.form.label = this.account[0].name;
              this.form.company = this.account[0].company;
              this.form.actBlock = this.account[0].massActionsDisabled;
              this.form.address = this.account[0].address.address1;
              this.form.zipCode = this.account[0].address.zipCode;
              this.form.city = this.account[0].address.city;
              this.form.state = this.account[0].address.state;
              this.form.country = this.account[0].address.country;
              this.showDetail = true;
            },
          },
        },
        {
          id: 2,
          label: this.$t('col.label'),
          name: 'name',
          orderable: true,
          visible: true,
        },
        {
          id: 3,
          label: this.$t('col.company'),
          name: 'company',
          orderable: true,
          visible: true,
        },
        {
          id: 4,
          label: this.$t('col.status'),
          name: 'status',
          orderable: true,
          visible: true,
          format: {
            component: BillAccountStatusCell,
          },
        },
        {
          id: 5,
          label: this.$t('col.creationDate'),
          name: 'created',
          orderable: true,
          visible: true,
        },
      ],
      rows: [],
      orderBy: {
        key: 'code',
        direction: 'DESC',
      },
    };
  },

  methods: {
    ...mapMutations(['flashMessage']),

    async save() {
      const params = {
        id: this.account[0].id,
        code: this.form.code,
        label: this.form.label,
        company: this.form.company,
        address: this.form.address,
        actBlock: this.form.actBlock,
        zipCode: this.form.zipCode,
        city: this.form.city,
        state: this.form.state,
        country: this.form.country,
      };

      let response;

      response = await updateCustomerAccount(params);
      if (!response && response.errors && response.errors.length) {
        this.flashMessage({ level: 'danger', message: this.$t('genericErrorMessage') });
      } else {
        this.flashMessage({ level: 'success', message: this.$t('genericSuccessMessage') });
      }
    },

    refreshTable() {
      this.rows = this.accounts.map(l => ({
        code: l.code,
        name: l.name,
        company: l.company,
        status: l.status,
        created: l.auditable.created,
      }));
    },
  },
  async created() {
    const countries = await fetchDeliveryCountries(this.$i18n.locale);
    this.countries = countries.map(c => ({
      ...c,
      label: c.name,
      value: c.code,
    }));
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
