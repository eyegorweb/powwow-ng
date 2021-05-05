<template>
  <CardsList
    :key="version"
    search-input-txt="getadmin.partnerDetail.simcards.search"
    placeholder-txt="getadmin.partnerDetail.simcards.searchPlaceholder"
    add-txt="getadmin.customize.manageSimCards"
    add-icon="ic-Sim-Icon"
    @create="manageSimCards"
    :can-modify="false"
    :fetch-fn="fetchFn"
    :filter-fn="filterFn"
    :no-edit="!havePermissionToEdit"
  >
    <template #title>
      <h4 class="text-primary text-uppercase">{{ $t('getadmin.partnerDetail.simcards.title') }}</h4>
    </template>
    <template #default="{ item }">
      <ul>
        <li>
          <strong>{{ $t('card') }} {{ getFromObject(item, 'simCard.name') }}</strong>
        </li>
        <li>
          {{ $t('getsim.sim-type-labels.format') }} : {{ getFromObject(item, 'simCard.format') }}
        </li>
        <li>
          {{ $t('getsim.sim-type-labels.patent') }} : {{ getFromObject(item, 'simCard.licence') }}
        </li>
        <li class="cards-orderdate">
          {{ $t('getsim.sim-type-labels.orderDate') }}: : {{ getFromObject(item, 'orderDate') }}
        </li>
      </ul>
      <slot>
        <div class="cardBloc-buttons" v-if="havePermissionToEdit">
          <Button :variant="'import'" @click="disableSim(item.simCard.id)">{{ $t('actions.DISABLE') }}</Button>
        </div>
      </slot>
      <div class="cards-sim">
        <img src="@/assets/simtype.png" />
      </div>
    </template>
  </CardsList>
</template>

<script>
import CardsList from '@/views/GetAdmin/PartnerDetail/parts/CardsList.vue';
import get from 'lodash.get';

import { mapMutations, mapGetters } from 'vuex';
import Button from '@/components/ui/Button';

import { fetchSim, disableSimCard } from '@/api/products.js';

export default {
  components: {
    CardsList,
    Button,
  },

  props: {
    partner: Object,
    billingAccountToDetail: {
      type: Object,
      required: false,
    },
  },

  data() {
    return {
      version: 0,
      isLoading: true,
      simCards: [],
    };
  },

  methods: {
    ...mapMutations(['openPanel', 'confirmAction']),

    manageSimCards() {
      const doReset = () => {
        this.fetchFn();
      };
      this.openPanel({
        title: this.$t('getadmin.partnerDetail.simCardsFromPanel.title'),
        panelId: 'getadmin.partnerDetail.simCardsFromPanel.title',
        payload: { partner: this.partner, offers: this.simCards },
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

    async disableSim(simId) {
      const doReset = () => {
        this.fetchFn();
      };
      this.confirmAction({
        message: 'confirmAction',
        actionFn: async () => {
          await disableSimCard(this.partner.id, simId)
          doReset();
        },
      });
    },

    async fetchFn() {
      let cfId;

      if (this.billingAccountToDetail) {
        cfId = this.billingAccountToDetail.id;
      }
      const sims = await fetchSim(this.partner.id, cfId)
      return sims;
    },

    getFromObject(object, path, defaultValue = '') {
      const value = get(object, path, defaultValue);
      return value !== null ? value : '';
    },

    filterFn(q, items) {
      let filteredItems;
      if (!q) {
        filteredItems = [...items];
      } else {
        const query = q.toLowerCase();
        filteredItems = items.filter((item) => {
          const name = this.getFromObject(item, 'simCard.name');
          if (name && name.toLowerCase().includes(query)) {
            return true;
          }
          return false;
        });
      }

      return filteredItems;
    },
  },

  computed: {
    ...mapGetters(['userInfos']),
    ...mapGetters(['havePermission']),

    havePermissionToEdit() {
      return this.havePermission('party', 'update_available_sims');
    }

  },
};
</script>

<style lang="scss" scoped>
h3 {
  font-size: 16px;
  margin-bottom: 20px;
  color: #0055a4;
}

.cardBloc {
  height: 14rem;
}

.cards {
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;

  &-sim {
    position: absolute;
    top: 10px;
    right: 10px;
  }

  ul {
    padding: 0;

    li {
      list-style-type: none;
      margin-bottom: 5px;
      &:first-child {
        margin-right: 6rem;
      }

      strong {
        display: block;
        margin-bottom: 10px;
      }
    }
  }
  &-orderdate {
    color: #7d7d7d;
    font-size: 12px;
  }
}
</style>
