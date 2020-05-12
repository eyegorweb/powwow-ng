<template>
  <div>
    <h4 class="text-primary text-uppercase">Offres disponibles pour cette entité</h4>

    <div class="searchBar">
      <label for>Rechercher une Offre</label>
      <UiInput v-model="searchValue" class="d-block" placeholder="Saisir un nom ou un code" />
    </div>
    <div class="cards">
      <CardsSkeleton v-if="isLoading" />
      <template v-else>
        <CardButton @click="manageOffers">
          Gérer les offres associées
        </CardButton>

        <Card
          v-for="offer in visibleOffers"
          :key="offer.id"
          :can-delete="true"
          :can-modify="false"
          @delete="deleteOffer(offer)"
        >
          <h4>{{ offer.name }}</h4>

          <div class="info-block mt-3">
            <h5>Services activés par défaut:</h5>
            <div class="mt-2" v-tooltip="offer.defaultServices.join('\n')">
              {{ offer.defaultServices.slice(0, 5).join(', ') }}
              <template v-if="offer.defaultServices.length > 6">
                ...
              </template>
            </div>
          </div>
          <div
            v-if="offer.editableServices && offer.editableServices.length"
            class="info-block mt-3"
          >
            <h5>Services modifiables:</h5>
            <div class="mt-2" v-tooltip="offer.editableServices.join('\n')">
              {{ offer.editableServices.slice(0, 5).join(', ') }}
              <template v-if="offer.editableServices.length > 6">
                ...
              </template>
            </div>
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

import get from 'lodash.get';
import { mapMutations } from 'vuex';

import { fetchOffers, disableOffer } from '@/api/offers.js';

export default {
  components: {
    CardButton,
    Card,
    CardsSkeleton,
    UiInput,
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
</style>
