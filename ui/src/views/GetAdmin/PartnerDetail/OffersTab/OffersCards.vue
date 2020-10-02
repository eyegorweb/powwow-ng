<template>
  <div>
    <h4 class="text-primary text-uppercase">
      {{ $t('getadmin.partnerDetail.offerFromPanel.availableOffers') }}
    </h4>

    <div class="searchBar">
      <label for>{{ $t('getadmin.partnerDetail.offerFromPanel.offerSearch') }}</label>
      <UiInput
        v-model="searchValue"
        class="d-block"
        :placeholder="$t('getadmin.partnerDetail.offerFromPanel.searchInput')"
      />
    </div>
    <div class="cards">
      <CardsSkeleton v-if="isLoading" />
      <template v-else>
        <CardButton v-if="canShowActions" @click="manageOffers">
          {{ $t('getadmin.partnerDetail.offerFromPanel.offerManagement') }}
        </CardButton>

        <Card v-for="offer in visibleOffers" :key="offer.id" :can-delete="true" :can-modify="false">
          <div class="partnerSimOfferTitle">{{ offer.name }} ({{ offer.code }})</div>

          <div class="info-block mt-1">
            <div class="partnerSimOfferSubTitle">
              {{ $t('getadmin.partnerDetail.offerFromPanel.defaultServices') }}:
            </div>
            <div v-tooltip="offer.defaultServices.join('\n')">
              {{ offer.defaultServices.slice(0, 5).join(', ') }}
              <template v-if="offer.defaultServices.length > 6">
                ...
              </template>
            </div>
          </div>
          <div
            v-if="offer.editableServices && offer.editableServices.length"
            class="info-block mt-1"
          >
            <div class="partnerSimOfferSubTitle">
              {{ $t('getadmin.partnerDetail.offerFromPanel.modifiedServices') }}:
            </div>
            <div v-tooltip="offer.editableServices.join('\n')">
              {{ offer.editableServices.slice(0, 5).join(', ') }}
              <template v-if="offer.editableServices.length > 6">
                ...
              </template>
            </div>
          </div>
          <div slot="buttons">
            <Button
              v-if="canShowActions"
              class="button"
              :variant="'import'"
              @click="deleteOffer(offer)"
              >{{ $t('actions.DISABLE') }}</Button
            >
          </div>
        </Card>
      </template>
    </div>
  </div>
</template>

<script>
import Card from '@/components/Card';
import CardButton from '@/components/CardButton';
import CardsSkeleton from '@/views/GetAdmin/PartnerDetail/CardsSkeleton.vue';
import UiInput from '@/components/ui/UiInput';
import Button from '@/components/ui/Button';

import get from 'lodash.get';
import { mapMutations, mapGetters } from 'vuex';

import { fetchOffers, disableOffer } from '@/api/offers.js';

export default {
  components: {
    CardButton,
    Card,
    CardsSkeleton,
    UiInput,
    Button,
  },

  props: {
    partner: Object,
  },

  data() {
    return {
      isLoading: true,
      offers: [],
      searchValue: null,
      visibleOffers: [],
    };
  },
  watch: {
    searchValue(newValue) {
      if (!newValue) {
        return (this.visibleOffers = [...this.offers]);
      }
      this.visibleOffers = this.offers.filter(o => {
        const isNameValid = o.name && o.name.toLowerCase().indexOf(newValue.toLowerCase()) !== -1;
        const isCodeValid = o.code && o.code.toLowerCase().indexOf(newValue.toLowerCase()) !== -1;

        return isNameValid || isCodeValid;
      });
    },
  },

  async mounted() {
    this.refreshOffers();
  },

  methods: {
    ...mapMutations(['openPanel', 'confirmAction']),

    async refreshOffers() {
      this.isLoading = true;
      this.searchValue = undefined;
      const items = await fetchOffers('', [this.partner], { page: 0, limit: 999 });
      this.offers = items.map(i => {
        const services = get(i, 'initialOffer.marketingServices', []);
        return {
          id: i.id,
          name: i.name,
          code: i.code,
          checked: false,
          editableServices: services.filter(s => s.editable).map(s => s.labelService),
          defaultServices: services.filter(s => !s.optional).map(s => s.labelService),
        };
      });
      this.visibleOffers = [...this.offers];
      this.isLoading = false;
    },
    manageOffers() {
      const doReset = () => {
        this.refreshOffers();
      };
      this.openPanel({
        title: this.$t('getadmin.partnerDetail.offerFromPanel.title'),
        panelId: 'getadmin.partnerDetail.offerFromPanel.title',
        payload: { partner: this.partner, offers: this.offers },
        backdrop: true,
        width: '40rem',
        ignoreClickAway: true,
        onClosePanel(params) {
          if (params && params.resetSearch) {
            doReset();
          }
        },
      });
    },

    deleteOffer(offer) {
      const doReset = () => {
        this.refreshOffers();
      };
      this.confirmAction({
        message: 'confirmAction',
        actionFn: async () => {
          const response = await disableOffer(this.partner.id, offer.id);
          console.log(response);
          doReset();
        },
      });
    },
  },

  computed: {
    ...mapGetters(['userInfos', 'havePermission']),
    canShowActions() {
      return this.havePermission('party', 'update_available_catalog_offers');
    },
  },
};
</script>

<style lang="scss" scoped>
.searchBar {
  width: 49%;
  label {
    font-weight: bold;
    display: block;
  }
}
.cards {
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
}

.info-block {
  font-size: 1rem;

  h5 {
    color: $gray-680;
  }
}

.partnerSimOfferTitle {
  font-size: large;
  font-weight: bold;
}

.partnerSimOfferSubTitle {
  font-weight: bold;
}
</style>
