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
              <FormControl label="getadmin.partnerDetail.code" v-model="form.code" />
              <FormControl label="getadmin.partnerDetail.bscs" v-model="form.bscs" />
            </div>
            <div class="accountdetail-generalInfos-input-txt-flexHalf">
              <FormControl label="getadmin.partnerDetail.preActOffer" v-model="form.preActOffer" />
              <FormControl label="getadmin.partnerDetail.preActGDM" v-model="form.preActGDM" />
            </div>
            <FormControl label="getadmin.partnerDetail.workflow" v-model="form.workflow" />
            <FormControl
              label="getadmin.partnerDetail.portabilityCode"
              v-model="form.portabilityCode"
            />
          </div>
        </div>
      </div>
    </div>
    <div v-if="canShowLegalInfos" class="accountdetail-legalInfos">
      <h3>{{ $t('getadmin.partnerDetail.legalInformations') }}</h3>

      <div class="accountdetail-bloc">
        <div class="accountdetail-legalInfos-img">
          <h4>Logotype :</h4>
          <div class="previewLogo">
            <div class="imageContainer">
              <img
                v-if="urlLogoPreview"
                :src="urlLogoPreview"
                class="previewLogo-img"
                alt="preview logo image"
              />
              <img v-else src="@/assets/logo_notfound.png" alt="csv" />
              <button
                v-if="urlLogoPreview"
                class="btn btn-sm btn-danger delete"
                @click.prevent="deleteLogo"
              >
                <em slot="icon" class="select-icon ic-Trash-Icon" />
              </button>
            </div>
          </div>
          <div v-if="imgError" class="imgError">
            {{ imgError }}
          </div>
          <label for="changeLogotype" class="changeLogotype">{{
            $t('getadmin.partnerDetail.changeImage')
          }}</label>

          <input
            :key="'logo_' + inputVersion"
            type="file"
            name="changeLogotype"
            id="changeLogotype"
            @change="saveLogo"
          />
        </div>
        <div class="accountdetail-legalInfos-txt">
          <FormControl label="getadmin.partnerDetail.partnerName" v-model="form.partnerName" />
          <FormControl label="getadmin.partnerDetail.siren" v-model="form.siren" />
          <div class="accountdetail-legalInfos-txt-flex">
            <FormControl label="getadmin.partnerDetail.naf" v-model="form.naf" />
            <FormControl label="getadmin.partnerDetail.tva" v-model="form.tva" />
          </div>
        </div>
      </div>
    </div>
    <div class="accountdetail-legalInfos" v-if="userIsBO">
      <h3>{{ $t('getadmin.partnerDetail.contract') }}</h3>

      <div class="accountdetail-bloc">
        <div class="accountdetail-legalInfos-img"></div>
        <div class="accountdetail-legalInfos-txt">
          <FormControl
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
                <em slot="icon" class="select-icon ic-Flag-Icon" />
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
                <em slot="icon" class="select-icon ic-Flag-Icon" />
              </UiDate>
            </div>
          </div>
          <FormControl label="getadmin.partnerDetail.salesEngineer" v-model="form.salesEngineer" />
          <FormControl
            label="getadmin.partnerDetail.commercialName"
            v-model="form.commercialName"
          />
          <FormControl
            label="getadmin.partnerDetail.commercialEmail"
            v-model="form.commercialEmail"
          />
        </div>
      </div>
    </div>
    <div class="accountdetail-contact" v-if="canShowLegalInfos">
      <h3>{{ $t('getadmin.partnerDetail.contactDetail') }}</h3>

      <div class="accountdetail-bloc">
        <div class="accountdetail-contact-img"></div>
        <div class="accountdetail-contact-txt">
          <div class="accountdetail-contact-txt-flexHalf">
            <FormControl label="getadmin.partnerDetail.tel" v-model="form.phone" />
            <FormControl label="getadmin.partnerDetail.fax" v-model="form.fax" />
          </div>
          <FormControl label="getadmin.partnerDetail.address" v-model="form.address" />
          <FormControl label="getadmin.partnerDetail.address2" v-model="form.address2" />
          <div class="accountdetail-contact-txt-flex">
            <FormControl label="getadmin.partnerDetail.zipCode" v-model="form.zipCode" />
            <FormControl label="getadmin.partnerDetail.city" v-model="form.city" />
          </div>
          <div class="accountdetail-contact-txt-flex">
            <FormControl label="getadmin.partnerDetail.state" v-model="form.state" />
            <div>
              <label>{{ $t('getadmin.partnerDetail.country') }}</label>
              <UiApiAutocomplete
                :items="countries"
                v-model="form.country"
                display-results-while-empty
              />
            </div>
          </div>
          <Button
            v-if="havePermission('party', 'update_account_detail')"
            :variant="'primary'"
            class="updateDetail"
            @click="openPopup = true"
            >{{ $t('getadmin.partnerDetail.update') }}</Button
          >
        </div>
      </div>
    </div>
    <Modal v-if="openPopup">
      <div class="text-left" slot="body">
        <p>{{ $t('changePartnerInfosSave') }}</p>
      </div>
      <div slot="footer">
        <button
          class="modal-default-button btn btn-danger btn-sm"
          @click.stop="openPopup = false"
        >
          {{ $t('cancel') }}
        </button>
        <button
          class="modal-default-button btn btn-success btn-sm ml-1"
          @click.stop="save"
        >
          {{ $t('save') }}
        </button>
      </div>
    </Modal>
  </div>
</template>

<script>
import { mapMutations, mapGetters } from 'vuex';
import FormControl from '@/components/ui/FormControl';
import Button from '@/components/ui/Button';
import Modal from '@/components/Modal';
import {
  fetchAccountDetail,
  updatePartyDetail,
  fetchPartyDetail,
  uploadLogo,
  fetchLogo,
  deleteLogo,
} from '@/api/partners.js';
import get from 'lodash.get';
import UiDate from '@/components/ui/UiDate';
import { fetchDeliveryCountries } from '@/api/filters';
import UiApiAutocomplete from '@/components/ui/UiApiAutocomplete';

export default {
  props: {
    partner: Object,
  },

  components: {
    FormControl,
    Button,
    Modal,
    UiDate,
    UiApiAutocomplete,
  },

  data() {
    return {
      accountDetail: Object,
      partyDetail: Object,
      openPopup : false,
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
      urlLogoPreview: undefined,
      imgToUpload: undefined,
      countries: [],
      imgError: undefined,
      inputVersion: 0,
    };
  },

  computed: {
    ...mapGetters(['havePermission']),
    checkCountry() {
      if (this.accountDetail.address.country === 'null' || !this.accountDetail.address.country) {
        return '';
      } else {
        const code = this.countries.find((c) => c.code === this.accountDetail.address.country);
        const name = this.countries.find((c) => c.name === this.accountDetail.address.country);
        if (code) {
          return code.name;
        } else if (name) {
          return name.name;
        }
        return '';
      }
    },

    canShowLegalInfos() {
      return this.partner && this.partner.partyType !== 'MULTI_CUSTOMER';
    },
  },
  async mounted() {
    this.accountDetail = await fetchAccountDetail(this.partner.id);
    this.partnerDetail = await fetchPartyDetail(this.partner.id);
    const countries = await fetchDeliveryCountries(this.$i18n.locale);

    this.countries = countries.map((c) => ({
      ...c,
      label: c.name,
      value: c.code,
    }));

    if (this.accountDetail && this.partner.partyType !== 'MULTI_CUSTOMER') {
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
      this.form.country = this.checkCountry;
      this.form.contractDate = this.partnerDetail.party.contractDate;
      this.form.contractExpiration = this.partnerDetail.party.contractExpiration;
    }

    this.fetchLogo();
  },

  methods: {
    ...mapMutations(['flashMessage', 'confirmAction']),
    ...mapGetters(['userIsPartner', 'userIsBO']),

    resetLogo() {
      this.imgToUpload = undefined;
      this.urlLogoPreview = undefined;
      this.imgError = undefined;
      this.inputVersion++;
    },

    deleteLogo() {
      this.confirmAction({
        message: 'confirmAction',
        actionFn: async () => {
          await deleteLogo(this.partner.id);
          this.resetLogo();
        },
      });
    },

    async fetchLogo() {
      try {
        const response = await fetchLogo(this.partner.id);
        if (response) {
          this.urlLogoPreview = `data:image/png;base64,${response.pictureByte}`;
        }
      } catch {
        this.urlLogoPreview = undefined;
      }
    },

    getFromContent(path, defaultValue = '-') {
      return get(this.accountDetail, path, defaultValue);
    },

    async saveLogo(event) {
      this.imgToUpload = event.target.files[0];
      this.imgError = undefined;

      if (this.imgToUpload) {
        this.imgError = undefined;
        const responseImg = await uploadLogo(this.imgToUpload, this.partner.id);

        if (responseImg) {
          if (responseImg.errors) {
            this.imgError = responseImg.errors.map((e) => e.message).join(';');
          } else {
            this.fetchLogo();
          }
        } else {
          this.imgError = this.$t('getadmin.partnerDetail.uploadImageError');
        }
      }
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
        country: this.countries.find((c) => c.name === this.form.country).code || '',
        bscsRootAccount: this.form.bscs || '',
        contractReference: this.form.contractReference || '',
        defaultPreactivationOfferCode: this.form.preActOffer || '',
        preactivationName: this.form.preActGDM || '',
        portabilityCode: this.form.portabilityCode || '',
        salesEngineer: this.form.salesEngineer || '',
        commercialName: this.form.commercialName || '',
        commercialEmail: this.form.commercialEmail || '',
        defaultWorkflowCode: this.form.workflow || '',
        contractDate: this.form.contractDate ? '"' + this.form.contractDate + '"' : null,
        contractExpiration: this.form.contractExpiration
          ? '"' + this.form.contractExpiration + '"'
          : null,

        tva: this.form.tva || '',
      };

      let response;

      response = await updatePartyDetail(params);

      if (response && response.errors && response.errors.length) {
        // this.flashMessage({ level: 'danger', message: this.$t('genericErrorMessage') });
        response.errors.forEach((e) => {
          this.flashMessage({ level: 'danger', message: e.message });
        });
      } else {
        this.flashMessage({ level: 'success', message: this.$t('genericSuccessMessage') });
      }
      this.openPopup = false;
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

  label {
    font-size: 14px;
    color: #454545;
    font-weight: 600;

    &:hover {
      cursor: pointer;
    }
  }

  &-input {
    &-date {
      width: 48%;
      margin-bottom: 15px;

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

    button.updateDetail {
      float: right;
      width: 100%;
      max-width: 220px;
    }

    &-img {
      width: 30%;

      .previewLogo {
        display: flex;
        justify-content: center;

        &-img {
          width: 7rem;
        }
      }

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
            width: 40%;
            margin-right: 15px;
          }
          &:last-child {
            width: 60%;
          }
        }
      }

      &-flexHalf {
        display: flex;
        justify-content: space-between;

        .form-group {
          width: 50%;

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

.imgError {
  color: $orange;
  font-size: 0.7rem;
  text-align: center;
}
</style>

<style lang="scss" scoped>
.accountdetail-legalInfos,
.accountdetail-contact {
  h4 {
    font-size: 14px;
    color: #454545;
    font-weight: 600;
  }

  button.updateDetail {
    float: right;
    width: 100%;
    max-width: 250px;
  }
}

.position-relative {
  input {
    width: 16rem;
  }
}

.removeLogo {
  color: #ea5b0f;
  display: block;
  padding: 0;
  text-align: center;
  font-size: 0.7rem;
  font-weight: 600;
}

.imageContainer {
  position: relative;
  button.delete {
    position: absolute;
    display: none;
    top: 0;
    right: 0;
  }

  &:hover {
    button.delete {
      display: block;
    }
  }
}
</style>
