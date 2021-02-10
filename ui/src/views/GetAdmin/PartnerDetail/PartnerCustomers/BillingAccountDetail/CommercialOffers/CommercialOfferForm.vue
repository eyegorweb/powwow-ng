<template>
  <div>
    <div class="row">
      <div class="col-2">
        <UiButton
          variant="outline-primary"
          class="mb-4"
          @click="
            $router.push({
              name: 'getAdminPartnerDetails.customerList.detail.commercialOffers.list',
              params: {
                id: $route.params.id,
                billingAccountCode: $route.params.billingAccountCode,
              },
            })
          "
        >
          Retour à la liste
        </UiButton>
      </div>
      <div class="col-10">
        <h4 class="pt-2 text-primary text-uppercase">
          {{
            $t(
              initOffer
                ? 'getadmin.partnerDetail.mb.commercialOffers.modificationTitle'
                : 'getadmin.partnerDetail.mb.commercialOffers.creationTitle'
            )
          }}
        </h4>
      </div>
    </div>

    <ContentBlock no-handle>
      <template slot="title">{{ $t('getadmin.partnerDetail.mb.commercialOffer') }}</template>
      <template slot="content">
        <div class="row">
          <div class="col-md-6">
            <FormControl label="getadmin.partnerDetail.mb.commercialOffers.catalogOffer" bold-label>
              <div v-if="initOffer">{{ $loGet(initOffer, 'marketingOffer.description') }}</div>
              <div v-else>
                <OfferCombo v-model="selectedCatalogOffer" preselect-first />
              </div>
            </FormControl>
          </div>
        </div>
        <template v-if="form.code">
          <div class="row">
            <div class="col">
              <div class="form-group">
                <label class="font-weight-bold">{{
                  $t('getadmin.partnerDetail.mb.commercialOffers.code')
                }}</label>
                <div>{{ form.code }}</div>
              </div>
            </div>
            <div class="col">
              <div class="form-group">
                <label class="font-weight-bold">{{
                  $t('getadmin.partnerDetail.mb.commercialOffers.name')
                }}</label>
                <div>{{ form.name }}</div>
              </div>
            </div>
          </div>
          <div class="row">
            <div class="col">
              <div class="form-group">
                <label class="font-weight-bold">{{
                  $t('getadmin.partnerDetail.mb.commercialOffers.rateplan')
                }}</label>
                <div>{{ form.rateplan }}</div>
              </div>
            </div>
            <div class="col">
              <div class="form-group">
                <label class="font-weight-bold">{{
                  $t('getadmin.partnerDetail.mb.commercialOffers.york')
                }}</label>
                <div>{{ form.yorkCommunity || '-' }}</div>
              </div>
            </div>
          </div>
          <div class="row">
            <div class="col">
              <div class="form-group">
                <label class="font-weight-bold">{{
                  $t('getadmin.partnerDetail.mb.commercialOffers.duration')
                }}</label>
                <div>{{ form.commitmentDuration }}</div>
              </div>
            </div>
            <div class="col">
              <div class="form-group">
                <label class="font-weight-bold">{{
                  $t('getadmin.partnerDetail.mb.commercialOffers.suspensionPeriod')
                }}</label>
                <div>{{ form.allowedSuspensionDuration }}</div>
              </div>
            </div>
          </div>
        </template>
      </template>
    </ContentBlock>

    <ContentBlock v-if="form && form.packages && form.packages.length" no-handle>
      <template slot="title">{{ $t('getreport.dashboard.legends.contract') }}</template>
      <template slot="content">
        <div class="row">
          <div class="col">
            <PackagesTable :offer-packages="form.packages" />
          </div>
        </div>
      </template>
    </ContentBlock>

    <ContentBlock v-if="form && form.discounts && form.discounts.length" no-handle>
      <template slot="title">Remises</template>
      <template slot="content">
        <DiscountFields :dicounts="form.discounts" :disabled="disabled" />
      </template>
    </ContentBlock>

    <ContentBlock v-if="services" no-handle>
      <template slot="title">{{ $t('common.services') }}</template>
      <template slot="content">
        <ServicesBlock :services="services" no-click />
      </template>
    </ContentBlock>

    <div v-if="!disabled" class="row mb-3 mt-3">
      <div class="col-md-12">
        <UiButton variant="secondary" class="float-right" @click="saveOffer()">
          {{ $t('save') }}
        </UiButton>
      </div>
    </div>
  </div>
</template>

<script>
import UiButton from '@/components/ui/Button';
import FormControl from '@/components/ui/FormControl';
import PackagesTable from './PackagesTable';
import OfferCombo from '@/components/CustomComboxes/OfferCombo.vue';
import ContentBlock from '@/views/GetParc/LineDetail/ContentBlock';
import ServicesBlock from '@/components/Services/ServicesBlock.vue';
import { getMarketingOfferServices } from '@/components/Services/utils.js';
import DiscountFields from './DiscountFields';
import { fetchOfferGroupById } from '@/api/offers';

export default {
  components: {
    DiscountFields,
    UiButton,
    FormControl,
    PackagesTable,
    OfferCombo,
    ContentBlock,
    ServicesBlock,
  },
  data() {
    return {
      initOffer: undefined,
      disabled: false,
      selectedCatalogOffer: undefined,
      test: true,
      services: undefined,
      form: {
        code: undefined,
        name: undefined,
        yorkCommunity: undefined,
        rateplan: undefined,
        commitmentDuration: undefined,
        allowedSuspensionDuration: undefined,
        discount: undefined,
        subscriptionDiscount: undefined,
        franceVoiceDiscount: undefined,
        europeVoiceDiscount: undefined,
        franceSMSDiscount: undefined,
        europeSMSDiscount: undefined,
        franceDataDiscount: undefined,
        discounts: undefined,
        packages: undefined,
      },
    };
  },

  watch: {
    selectedCatalogOffer(newValue) {
      if (newValue && newValue.meta) {
        this.prefillWithSelectedOffer(newValue.meta);
      }
    },
  },

  async mounted() {
    await this.loadCommercialInfoToEdit();
    this.prefillForm();
  },

  methods: {
    async loadCommercialInfoToEdit() {
      if (this.$route.params.comOfferId) {
        this.initOffer = await fetchOfferGroupById(
          this.$route.params.comOfferId,
          this.$route.params.id
        );
      }
    },
    prefillForm() {
      if (this.initOffer) {
        this.form.code = this.initOffer.code;
        this.form.name = this.initOffer.description;
        this.form.rateplan = this.$loGet(this.initOffer, 'marketingOffer.billingOfferCode');
        this.form.yorkCommunity = this.$loGet(this.initOffer, 'marketingOffer.yorkCommunity');
        this.form.commitmentDuration = this.$loGet(
          this.initOffer,
          'marketingOffer.commitmentDuration'
        );

        this.form.allowedSuspensionDuration = this.$loGet(
          this.initOffer,
          'marketingOffer.allowedSuspensionDuration'
        );

        this.services = getMarketingOfferServices(this.initOffer.marketingOffer);
        this.form.discounts = this.initOffer.offerGroupDiscounts || [];
        this.form.packages = this.initOffer.offerGroupPackages || [];
      }
    },
    prefillWithSelectedOffer(offer) {
      this.form.code = offer.code;
      this.form.name = offer.description;
      this.form.rateplan = offer.billingOfferCode;
      this.form.yorkCommunity = offer.yorkCommunity;
      this.form.packages = this.$loGet(offer, 'initialOffer.offerPackages');
      this.form.discounts = this.$loGet(offer, 'initialOffer.offerDiscounts');
      this.services = getMarketingOfferServices(offer.initialOffer);
    },
    saveOffer() {
      console.log('Offer save');
    },
  },
};
</script>

<style lang="scss" scoped></style>
