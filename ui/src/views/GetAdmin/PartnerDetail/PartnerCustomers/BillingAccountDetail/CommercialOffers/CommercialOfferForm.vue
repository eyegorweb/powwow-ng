<template>
  <div>
    <div class="row">
      <div class="col-2">
        <UiButton variant="outline-primary" class="mb-4" @click="$emit('back')">
          <i class="ic-Pin-Icon"></i>
          Retour à la liste
        </UiButton>
      </div>
      <div class="col-10">
        <h4 class="pt-2 text-primary text-uppercase">Création d'offre commerciale</h4>
      </div>
    </div>

    <div class="bg-white mb-2 p-4 rounded">
      <div class="row">
        <div class="col-md-6">
          <FormControl label="getadmin.partnerDetail.mb.commercialOffers.catalogOffer">
            <div>
              <CatalogOfferCombo v-model="selectedCatalogOffer" />
            </div>
          </FormControl>
        </div>
      </div>
      <div class="row">
        <div class="col">
          <FormControl
            label="getadmin.partnerDetail.mb.commercialOffers.code"
            v-model="form.code"
          />
        </div>
        <div class="col">
          <FormControl
            label="getadmin.partnerDetail.mb.commercialOffers.name"
            v-model="form.name"
          />
        </div>
      </div>
      <div class="row">
        <div class="col">
          <FormControl
            label="getadmin.partnerDetail.mb.commercialOffers.rateplan"
            v-model="form.rateplan"
          />
        </div>
        <div class="col">
          <FormControl
            label="getadmin.partnerDetail.mb.commercialOffers.york"
            v-model="form.york"
          />
        </div>
      </div>
    </div>
    <div class="bg-white mb-2 p-4 rounded">
      <div class="row">
        <div class="col">
          <FormControl
            label="getadmin.partnerDetail.mb.commercialOffers.duration"
            v-model="form.duration"
          />
        </div>
        <div class="col">
          <FormControl
            label="getadmin.partnerDetail.mb.commercialOffers.suspensionPeriod"
            v-model="form.suspensionPeriod"
          />
        </div>
      </div>
      <div class="row">
        <div class="col">
          <PackagesTable />
        </div>
      </div>
    </div>

    <div class="bg-white mb-2 p-4 rounded">
      <div class="row">
        <div class="col">
          <FormControl
            input-type="number"
            label="getadmin.partnerDetail.mb.commercialOffers.subscriptionDiscount"
            v-model="form.subscriptionDiscount"
          />
        </div>
        <div class="col">
          <FormControl
            input-type="number"
            label="getadmin.partnerDetail.mb.commercialOffers.franceVoiceDiscount"
            v-model="form.franceVoiceDiscount"
          />
        </div>
      </div>

      <div class="row">
        <div class="col">
          <FormControl
            input-type="number"
            label="getadmin.partnerDetail.mb.commercialOffers.europeVoiceDiscount"
            v-model="form.europeVoiceDiscount"
          />
        </div>
        <div class="col">
          <FormControl
            input-type="number"
            label="getadmin.partnerDetail.mb.commercialOffers.franceSMSDiscount"
            v-model="form.franceSMSDiscount"
          />
        </div>
      </div>
      <div class="row">
        <div class="col">
          <FormControl
            input-type="number"
            label="getadmin.partnerDetail.mb.commercialOffers.europeSMSDiscount"
            v-model="form.europeSMSDiscount"
          />
        </div>
        <div class="col">
          <FormControl
            input-type="number"
            label="getadmin.partnerDetail.mb.commercialOffers.franceDataDiscount"
            v-model="form.franceDataDiscount"
          />
        </div>
      </div>
    </div>

    <div class="bg-white mb-2 p-4 rounded">
      <CommercialOffersServices />
    </div>

    <div class="row mb-3 mt-3">
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
import CatalogOfferCombo from './CatalogOfferCombo';
import PackagesTable from './PackagesTable';
import CommercialOffersServices from './CommercialOffersServices';

export default {
  components: {
    UiButton,
    FormControl,
    CatalogOfferCombo,
    PackagesTable,
    CommercialOffersServices,
  },
  data() {
    return {
      selectedCatalogOffer: undefined,
      form: {
        code: undefined,
        name: undefined,
        york: undefined,
        rateplan: undefined,
        duration: undefined,
        suspensionPeriod: undefined,
        discount: undefined,
        subscriptionDiscount: undefined,
        franceVoiceDiscount: undefined,
        europeVoiceDiscount: undefined,
        franceSMSDiscount: undefined,
        europeSMSDiscount: undefined,
        franceDataDiscount: undefined,
      },
    };
  },

  methods: {
    saveOffer() {
      console.log('Offer save');
    },
  },
};
</script>

<style lang="scss" scoped></style>
