<template>
  <div class="accountdetail">
    <div class="accountdetail-generalInfos">
      <h3>{{ $t('getadmin.partnerDetail.generalInformations') }}</h3>
      <div class="accountdetail-generalInfos-bloc">
        <div class="accountdetail-generalInfos-bloc-details">
          <div class="accountdetail-generalInfos-box">
            <h4>{{ $t('getadmin.partnerDetail.created') }} :</h4>
            <p>{{ getFromContent('auditable.created') }}</p>
          </div>
          <div class="accountdetail-generalInfos-box">
            <h4>{{ $t('getadmin.partnerDetail.partyGroup') }} :</h4>
            <p>{{ getFromContent('partyGroups[0].name') }}</p>
          </div>
          <div class="accountdetail-generalInfos-box">
            <h4>{{ $t('getadmin.partnerDetail.lastModification') }} :</h4>
            <p>{{ getFromContent('auditable.updated') }}</p>
          </div>
          <div class="accountdetail-generalInfos-box">
            <h4>{{ $t('partnerType') }} :</h4>
            <p>{{ getFromContent('partyType') }}</p>
          </div>
        </div>
        <div class="accountdetail-generalInfos-input accountdetail-bloc">
          <div class="accountdetail-generalInfos-input-img"></div>
          <div class="accountdetail-generalInfos-input-txt">
            <div class="accountdetail-generalInfos-input-txt-flexHalf">
              <FormControl big label="getadmin.partnerDetail.code" v-model="form.code" />
              <FormControl big label="getadmin.partnerDetail.bscs" v-model="form.bscs" />
            </div>
            <div class="accountdetail-generalInfos-input-txt-flexHalf">
              <FormControl
                big
                label="getadmin.partnerDetail.preActOffer"
                v-model="form.preActOffer"
              />
              <FormControl big label="getadmin.partnerDetail.preActGDM" v-model="form.preActGDM" />
            </div>
            <FormControl big label="getadmin.partnerDetail.workflow" v-model="form.workflow" />
            <FormControl
              big
              label="getadmin.partnerDetail.portabilityCode"
              v-model="form.portabilityCode"
            />
          </div>
        </div>
      </div>
    </div>
    <div class="accountdetail-legalInfos">
      <h3>{{ $t('getadmin.partnerDetail.legalInformations') }}</h3>

      <div class="accountdetail-bloc">
        <div class="accountdetail-legalInfos-img">
          <!-- <h4>Logotype :</h4>
          <img src="" alt="" />
          <label for="changeLogotype">Changer l'image</label>
          <input type="file" name="changeLogotype" id="changeLogotype" />-->
        </div>
        <div class="accountdetail-legalInfos-txt">
          <FormControl big label="getadmin.partnerDetail.partnerName" v-model="form.partnerName" />
          <FormControl big label="getadmin.partnerDetail.siren" v-model="form.siren" />
          <div class="accountdetail-legalInfos-txt-flex">
            <FormControl big label="getadmin.partnerDetail.naf" v-model="form.naf" />
            <FormControl big label="getadmin.partnerDetail.tva" v-model="form.tva" />
          </div>
        </div>
      </div>
    </div>
    <div class="accountdetail-legalInfos">
      <h3>{{ $t('getadmin.partnerDetail.contract') }}</h3>

      <div class="accountdetail-bloc">
        <div class="accountdetail-legalInfos-img"></div>
        <div class="accountdetail-legalInfos-txt">
          <FormControl
            big
            label="getadmin.partnerDetail.contractReference"
            v-model="form.contractReference"
          />
          <div class="accountdetail-legalInfos-txt-flexHalf">
            <div class="accountdetail-input-date">
              <label>{{ $t('getadmin.partnerDetail.contractDate') }}</label>
              <UiDate
                @change="onContractDateChange"
                :value="form.contractDate"
                :error="dateError"
                class="d-block"
                fixed
              >
                <i slot="icon" class="select-icon ic-Flag-Icon" />
              </UiDate>
            </div>

            <div class="accountdetail-input-date">
              <label>{{ $t('getadmin.partnerDetail.contractExpiration') }}</label>
              <UiDate
                @change="onContractExpirationChange"
                :value="form.contractExpiration"
                :error="dateError"
                class="d-block"
                fixed
              >
                <i slot="icon" class="select-icon ic-Flag-Icon" />
              </UiDate>
            </div>
          </div>
          <FormControl
            big
            label="getadmin.partnerDetail.salesEngineer"
            v-model="form.salesEngineer"
          />
          <FormControl
            big
            label="getadmin.partnerDetail.commercialName"
            v-model="form.commercialName"
          />
          <FormControl
            big
            label="getadmin.partnerDetail.commercialEmail"
            v-model="form.commercialEmail"
          />
        </div>
      </div>
    </div>
    <div class="accountdetail-contact">
      <h3>{{ $t('getadmin.partnerDetail.contactDetail') }}</h3>

      <div class="accountdetail-bloc">
        <div class="accountdetail-contact-img"></div>
        <div class="accountdetail-contact-txt">
          <div class="accountdetail-contact-txt-flexHalf">
            <FormControl big label="getadmin.partnerDetail.tel" v-model="form.phone" />
            <FormControl big label="getadmin.partnerDetail.fax" v-model="form.fax" />
          </div>
          <FormControl big label="getadmin.partnerDetail.address" v-model="form.address" />
          <FormControl big label="getadmin.partnerDetail.address2" v-model="form.address2" />
          <div class="accountdetail-contact-txt-flex">
            <FormControl big label="getadmin.partnerDetail.zipCode" v-model="form.zipCode" />
            <FormControl big label="getadmin.partnerDetail.city" v-model="form.city" />
          </div>
          <div class="accountdetail-contact-txt-flex">
            <FormControl big label="getadmin.partnerDetail.state" v-model="form.state" />
            <FormControl big label="getadmin.partnerDetail.country" v-model="form.country" />
          </div>
          <Button :variant="'primary'" @click="save">
            {{
            $t('getadmin.partnerDetail.update')
            }}
          </Button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapMutations } from 'vuex';
import FormControl from '@/components/ui/FormControl';
import Button from '@/components/ui/Button';
import { fetchAccountDetail, updatePartyDetail, fetchPartyDetail } from '@/api/partners.js';
import get from 'lodash.get';
import UiDate from '@/components/ui/UiDate';

export default {
  props: {
    partner: Object,
  },

  components: {
    FormControl,
    Button,
    UiDate,
  },

  data() {
    return {
      accountDetail: Object,
      partyDetail: Object,
      form: {
        partnerName: undefined,
        siren: undefined,
        naf: undefined,
        tva: undefined,
        phone: undefined,
        fax: undefined,
        address: undefined,
        address2: undefined,
        zipCode: undefined,
        city: undefined,
        state: undefined,
        country: undefined,
        contractDate: undefined,
        contractExpiration: undefined,
        code: undefined,
        bscs: undefined,
        preActOffer: undefined,
        preActGDM: undefined,
        portabilityCode: undefined,
        contractReference: undefined,
        salesEngineer: undefined,
        commercialName: undefined,
        commercialEmail: undefined,
        workflow: undefined,
      },
      actDate: null,
      dateError: null,
    };
  },

  async mounted() {
    this.accountDetail = await fetchAccountDetail(this.partner.id);
    this.partnerDetail = await fetchPartyDetail(this.partner.id);

    if (this.accountDetail) {
      this.form.partnerName = this.accountDetail.name;
      this.form.siren = this.accountDetail.siren;
      this.form.naf = this.accountDetail.naf;
      this.form.code = this.accountDetail.code;
      this.form.bscs = this.partnerDetail.party.bscsRootAccount;
      this.form.contractReference = this.accountDetail.contractReference;
      this.form.preActOffer = this.partnerDetail.party.defaultPreactivationOfferCode;
      this.form.preActGDM = this.partnerDetail.party.preactivationName;
      this.form.portabilityCode = this.partnerDetail.party.portabilityCode;
      this.form.salesEngineer = this.partnerDetail.party.salesEngineer;
      this.form.commercialName = this.partnerDetail.party.commercialName;
      this.form.commercialEmail = this.partnerDetail.party.commercialEmail;
      this.form.workflow = this.partnerDetail.party.defaultWorkflowCode;
      this.form.phone = this.accountDetail.contactInformation.phone;
      this.form.fax = this.accountDetail.contactInformation.fax;
      this.form.address = this.accountDetail.address.address1;
      this.form.address2 = this.accountDetail.address.address2;
      this.form.city = this.accountDetail.address.city;
      this.form.zipCode = this.accountDetail.address.zipCode;
      this.form.state = this.accountDetail.address.state;
      this.form.country = this.accountDetail.address.country;
      this.form.contractDate = this.partnerDetail.party.contractDate;
      this.form.contractExpiration = this.partnerDetail.party.contractExpiration;
    }
  },

  methods: {
    ...mapMutations(['flashMessage']),

    getFromContent(path, defaultValue = '-') {
      return get(this.accountDetail, path, defaultValue);
    },

    onContractDateChange(value) {
      this.form.contractDate = value;
    },

    onContractExpirationChange(value) {
      this.form.contractExpiration = value;
    },

    async save() {
      const params = {
        id: this.partner.id,
        partyType: this.accountDetail.partyType || '',
        partnerName: this.form.partnerName || '',
        siren: this.form.siren || '',
        naf: this.form.naf || '',
        code: this.form.code || '',
        phone: this.form.phone || '',
        fax: this.form.fax || '',
        address: this.form.address || '',
        address2: this.form.address2 || '',
        city: this.form.city || '',
        zipCode: this.form.zipCode || '',
        state: this.form.state || '',
        country: this.form.country || '',
        bscsRootAccount: this.form.bscs || '',
        contractReference: this.form.contractReference || '',
        defaultPreactivationOfferCode: this.form.preActOffer || '',
        preactivationName: this.form.preActGDM || '',
        portabilityCode: this.form.portabilityCode || '',
        salesEngineer: this.form.salesEngineer || '',
        commercialName: this.form.commercialName || '',
        commercialEmail: this.form.commercialEmail || '',
        defaultWorkflowCode: this.form.workflow || '',
        contractDate: '"' + this.form.contractDate + '"' || '',
        contractExpiration: '"' + this.form.contractExpiration + '"' || '',
      };

      let response;

      response = await updatePartyDetail(params);
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
.accountdetail {
  h3 {
    font-size: 16px;
    text-transform: uppercase;
    color: $primary;
  }

  &-input {
    &-date {
      width: 48%;
      margin-bottom: 15px;

      label {
        font-size: 14px;
        color: #454545;
        font-weight: 600;
      }

      .d-block {
        width: 100%;
      }
    }
  }
  &-bloc {
    display: flex;
    background-color: white;
    width: 100%;
    padding: 20px;
    box-sizing: border-box;
    margin: 20px 0 30px 0;
  }

  &-generalInfos {
    &-bloc {
      background-color: white;
      width: 100%;
      padding: 20px;
      box-sizing: border-box;
      margin: 20px 0 30px 0;

      &-details {
        display: flex;
        justify-content: center;
        border-bottom: 1px #a7a7a7 dashed;
      }
    }

    &-box {
      width: 25%;
      text-align: left;

      h4 {
        font-size: 12px;
        color: #7d7d7d;
      }
    }
  }

  &-legalInfos,
  &-contact,
  &-generalInfos-input {
    h4 {
      font-size: 14px;
      color: #454545;
      font-weight: 600;
    }

    button {
      float: right;
      width: 100%;
      max-width: 220px;
    }

    &-img {
      width: 30%;

      input {
        visibility: hidden;
      }

      label {
        width: 100%;
        font-size: 12px;
        text-decoration: underline;
        text-align: center;
        color: $secondary;
      }
    }

    &-txt {
      width: 70%;
      max-width: 450px;

      &-flex {
        display: flex;

        .form-group {
          &:first-child {
            width: 35%;
            margin-right: 15px;
          }
        }
      }

      &-flexHalf {
        display: flex;
        justify-content: space-between;

        .form-group {
          &:first-child {
            margin-right: 15px;
          }
        }
      }

      .form-group {
        font-size: 14px;
        color: #454545;
        font-weight: 600;
      }
    }
  }
}
</style>

<style lang="scss">
.accountdetail-legalInfos,
.accountdetail-contact {
  h4 {
    font-size: 14px;
    color: #454545;
    font-weight: 600;
  }

  button {
    float: right;
    width: 100%;
    max-width: 250px;
  }
}
</style>
