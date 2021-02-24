<template>
  <CommercialOfferFormSkeleton v-if="isLoading" />
  <div v-else>
    <div class="row">
      <div class="col-2">
        <UiButton variant="outline-primary" class="mb-4" @click="goBack()">
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

    <template v-if="canShowForm">
      <ContentBlock no-handle>
        <template slot="title">{{ $t('getadmin.partnerDetail.mb.details') }}</template>
        <template slot="content">
          <div class="row">
            <div class="col-md-6">
              <FormControl
                label="getadmin.partnerDetail.mb.commercialOffers.catalogOffer"
                bold-label
              >
                <div v-if="initOffer">{{ $loGet(initOffer, 'marketingOffer.description') }}</div>
                <div v-else>
                  <OfferCombo
                    v-model="selectedCatalogOffer"
                    :filters="workflowFilters"
                    preselect-first
                  />
                </div>
              </FormControl>
            </div>
          </div>
          <template v-if="form.code">
            <div class="row" v-if="initOffer">
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
            <div v-if="initOffer && initOffer.auditable" class="row">
              <div class="col">
                <div class="form-group">
                  <label class="font-weight-bold">{{ $t('getparc.history.col.created') }}</label>
                  <div>{{ initOffer.auditable.created }}</div>
                </div>
              </div>
              <div class="col">
                <div class="form-group">
                  <label class="font-weight-bold">{{
                    $t('getadmin.partnerDetail.mb.commercialOffers.edited')
                  }}</label>
                  <div>{{ initOffer.auditable.updated }}</div>
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
              <PackagesTable :offer-packages="form.packages" @change="setPackagesValues($event)" />
            </div>
          </div>
        </template>
      </ContentBlock>

      <ContentBlock v-if="form && form.discounts && form.discounts.length" no-handle>
        <template slot="title">Remises</template>
        <template slot="content">
          <DiscountFields
            :dicounts="form.discounts"
            :disabled="disabled"
            @change="setDiscountValues($event)"
          />
        </template>
      </ContentBlock>

      <ContentBlock v-if="form && form.ranges && form.ranges.length" no-handle>
        <template slot="title">{{ $t('getadmin.partnerDetail.mb.ranges') }}</template>
        <template slot="content">
          <div class="row">
            <div class="col">
              <RangesTable :offer-ranges="form.ranges" @change="setRangesValues($event)" />
            </div>
          </div>
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
          <UiButton
            variant="secondary"
            class="float-right"
            @click="saveOffer()"
            :disabled="isSaving || !formIsValid"
          >
            {{ $t('save') }}
          </UiButton>
        </div>
      </div>
    </template>
  </div>
</template>

<script>
import UiButton from '@/components/ui/Button';
import FormControl from '@/components/ui/FormControl';
import PackagesTable from './PackagesTable';
import RangesTable from './RangesTable';
import CommercialOfferFormSkeleton from './CommercialOfferFormSkeleton';
import OfferCombo from '@/components/CustomComboxes/OfferCombo.vue';
import ContentBlock from '@/views/GetParc/LineDetail/ContentBlock';
import ServicesBlock from '@/components/Services/ServicesBlock.vue';
import { getMarketingOfferServices } from '@/components/Services/utils.js';
import DiscountFields from './DiscountFields';
import { fetchOfferGroupById, createCommercialOffer, updateCommercialOffer } from '@/api/offers';
import { mapMutations } from 'vuex';

export default {
  components: {
    DiscountFields,
    UiButton,
    FormControl,
    PackagesTable,
    RangesTable,
    OfferCombo,
    ContentBlock,
    ServicesBlock,
    CommercialOfferFormSkeleton,
  },
  data() {
    return {
      isLoading: false,
      canShowForm: false,
      isSaving: false,
      initOffer: undefined,
      disabled: false,
      selectedCatalogOffer: undefined,
      test: true,
      services: undefined,
      isDiscountsValid: false,
      isPackagesValid: false,
      isRangesValid: false,
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
        ranges: undefined,
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

  computed: {
    formIsValid() {
      return this.isDiscountsValid && this.isPackagesValid && this.isRangesValid;
    },
    workflowFilters() {
      return {
        catalogOfferOnly: true,
        partyId: {
          in: [parseInt(this.$route.params.id)],
        },
      };
    },
  },

  async mounted() {
    await this.loadCommercialInfoToEdit();
    this.fillFormForUpdate();
  },

  methods: {
    ...mapMutations(['flashMessage']),
    setDiscountValues(values) {
      const isValid = () => {
        if (values && values.length) {
          const validDiscounts = values.filter(d => {
            if (d.discountValue && d.lowerBound !== undefined && d.upperBound !== undefined) {
              const val = parseFloat(d.discountValue);
              return val >= d.lowerBound && val <= d.upperBound;
            }
            return false;
          });
          return validDiscounts.length === values.length;
        }
        return false;
      };
      this.isDiscountsValid = isValid();
      this.form.discounts = values;
    },
    setPackagesValues(values) {
      const isValid = () => {
        if (values && values.length) {
          const validPackages = values.filter(d => {
            if (
              d.discount !== null &&
              d.discount !== undefined &&
              d.lowerBound !== undefined &&
              d.lowerBound !== null &&
              d.upperBound !== undefined &&
              d.upperBound !== null
            ) {
              const val = parseFloat(d.discount);
              return val >= d.lowerBound && val <= d.upperBound;
            }
            return false;
          });
          const packagesWithBounds = values.filter(
            p => p.lowerBound !== undefined && p.lowerBound !== null
          ).length;
          return validPackages.length === packagesWithBounds;
        }
        return true;
      };
      this.isPackagesValid = isValid();
      this.form.packages = values;
    },
    setRangesValues(values) {
      const isValid = () => {
        if (values && values.length) {
          const validranges = values.filter(d => {
            if (
              d.discountValue &&
              d.discountValue.length &&
              d.lowerBound !== undefined &&
              d.upperBound !== undefined
            ) {
              const val = parseFloat(d.discountValue);
              return val >= d.lowerBound && val <= d.upperBound;
            }
            return false;
          });
          const rangesWithBounds = values.filter(
            p => p.lowerBound !== undefined && p.lowerBound !== null
          ).length;
          return validranges.length === rangesWithBounds;
        }
        return true;
      };
      this.isRangesValid = isValid();
      this.form.ranges = values;
    },
    goBack() {
      this.$router.push({
        name: 'getAdminPartnerDetails.customerList.detail.commercialOffers.list',
        params: {
          id: this.$route.params.id,
          billingAccountId: this.$route.params.billingAccountId,
        },
      });
    },
    async loadCommercialInfoToEdit() {
      if (this.$route.params.comOfferId) {
        this.isLoading = true;
        this.initOffer = await fetchOfferGroupById(this.$route.params.comOfferId);
        this.isLoading = false;
      }
    },
    fillFormForUpdate() {
      if (this.initOffer) {
        this.form.id = this.initOffer.id;
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
        this.setPackagesValues(this.initOffer.offerGroupPackages || []);
        this.setDiscountValues(this.initOffer.offerGroupDiscounts || []);
        this.setRangesValues(this.initOffer.offerGroupRanges || []);
      }
      this.canShowForm = true;
    },
    prefillWithSelectedOffer(offer) {
      this.form.id = this.$loGet(offer, 'initialOffer.id');
      this.form.code = offer.code;
      this.form.name = offer.description;
      this.form.rateplan = offer.billingOfferCode;
      this.form.yorkCommunity = offer.yorkCommunity;
      this.setPackagesValues(this.$loGet(offer, 'initialOffer.offerPackages', []));
      this.setDiscountValues(this.$loGet(offer, 'initialOffer.offerDiscounts', []));
      this.setRangesValues(this.$loGet(offer, 'initialOffer.offerRanges', []));

      this.services = getMarketingOfferServices(offer.initialOffer);

      // partie package
      // remises non gérées en attente de l'api ( upper lower bounds)
    },

    async saveOffer() {
      if (this.initOffer) {
        this.updateOffer();
      } else {
        this.saveNewOffer();
      }
    },
    async updateOffer() {
      if (!this.formIsValid) return;

      const dataToSave = {
        commercialOfferCode: this.form.code,
      };

      const packagesWithBounds = this.form.packages.filter(
        p => p.lowerBound !== undefined && p.lowerBound !== null
      ).length;

      let offerPackages = undefined;

      if (packagesWithBounds > 0) {
        if (this.form.packages && this.form.packages.length) {
          offerPackages = this.form.packages
            .filter(d => d.discount)
            .map(d => ({
              type: d.usageType,
              discountValue: parseFloat(d.discount),
            }));
        }
      }

      const rangesWithBounds = this.form.ranges.filter(
        p => p.lowerBound !== undefined && p.lowerBound !== null
      ).length;

      let levelDefinitions = undefined;

      if (rangesWithBounds > 0) {
        if (this.form.ranges && this.form.ranges.length) {
          levelDefinitions = this.form.ranges
            .filter(d => d.discountValue)
            .map(d => ({
              discountValue: parseFloat(d.discountValue),
            }));
        }
      }

      let discountDefinitions = undefined;

      if (this.form.discounts && this.form.discounts.length) {
        discountDefinitions = this.form.discounts.map(d => ({
          name: d.code,
          value: d.value,
        }));
      }

      if (discountDefinitions) {
        if (!dataToSave.commercialOfferParameter) {
          dataToSave.commercialOfferParameter = {};
        }
        dataToSave.commercialOfferParameter.discountDefinitions = discountDefinitions;
      }

      if (offerPackages) {
        if (!dataToSave.commercialOfferParameter) {
          dataToSave.commercialOfferParameter = {};
        }
        dataToSave.commercialOfferParameter.offerPackages = offerPackages;
      }

      if (levelDefinitions) {
        if (!dataToSave.commercialOfferParameter) {
          dataToSave.commercialOfferParameter = {};
        }
        dataToSave.commercialOfferParameter.levelDefinitions = levelDefinitions;
      }

      this.isSaving = true;
      const response = await updateCommercialOffer(dataToSave);
      this.isSaving = false;

      if (response) {
        this.flashMessage({ level: 'success', message: this.$t('genericSuccessMessage') });
        this.goBack();
      } else {
        this.flashMessage({ level: 'danger', message: this.$t('genericErrorMessage') });
      }
    },
    async saveNewOffer() {
      if (!this.formIsValid) return;

      let discountDefinitions = undefined;

      if (this.form.discounts && this.form.discounts.length) {
        discountDefinitions = this.form.discounts.map(d => ({
          name: d.code,
          value: d.value,
        }));
      }

      let offerPackages = undefined;
      if (this.form.packages.filter(p => p.lowerBound !== undefined).length > 0) {
        if (this.form.packages && this.form.packages.length) {
          offerPackages = this.form.packages
            .filter(d => d.discount)
            .map(d => ({
              type: d.usageType,
              discountValue: parseFloat(d.discount),
            }));
        }
      }

      const rangesWithBounds = this.form.ranges.filter(
        p => p.lowerBound !== undefined && p.lowerBound !== null
      ).length;

      let levelDefinitions = undefined;

      if (rangesWithBounds > 0) {
        if (this.form.ranges && this.form.ranges.length) {
          levelDefinitions = this.form.ranges
            .filter(d => d.discountValue)
            .map(d => ({
              discountValue: parseFloat(d.discountValue),
            }));
        }
      }

      const dataToSave = {
        marketingOfferId: this.form.id,
        customerAccountId: this.$route.params.billingAccountId,
      };

      if (discountDefinitions) {
        if (!dataToSave.commercialOfferParameter) {
          dataToSave.commercialOfferParameter = {};
        }
        dataToSave.commercialOfferParameter.discountDefinitions = discountDefinitions;
      }

      if (offerPackages) {
        if (!dataToSave.commercialOfferParameter) {
          dataToSave.commercialOfferParameter = {};
        }
        dataToSave.commercialOfferParameter.offerPackages = offerPackages;
      }

      if (levelDefinitions) {
        if (!dataToSave.commercialOfferParameter) {
          dataToSave.commercialOfferParameter = {};
        }
        dataToSave.commercialOfferParameter.levelDefinitions = levelDefinitions;
      }

      this.isSaving = true;
      const response = await createCommercialOffer(dataToSave);
      this.isSaving = false;

      if (response) {
        this.flashMessage({ level: 'success', message: this.$t('genericSuccessMessage') });
        this.goBack();
      } else {
        this.flashMessage({ level: 'danger', message: this.$t('genericErrorMessage') });
      }
    },
  },
};
</script>

<style lang="scss" scoped></style>
