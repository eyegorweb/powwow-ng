<template>
  <div class="mt-4">
    <div class="row">
      <div class="col-md-9">
        <button @click.prevent="returnToSearch()" class="btn btn-link back-btn">
          <i class="ic-Arrow-Previous-Icon" />
          {{ $t('back') }}
        </button>
      </div>
    </div>
    <div class="row mb-5">
      <div class="col-md-9">
        <h4>
          <b>GetAdmin</b>
          - {{ partnerName }}
        </h4>
      </div>
    </div>

    <Summary v-if="partner" :partner-id="this.$route.params.id" :partner-type="partner.partyType" />

    <div v-if="partner" class="mt-4 mb-4 bottom-space">
      <UiTabs :tabs="tabs" :selected-index="currentLinkIndex">
        <template slot-scope="{ tab, index, selectedIndex }">
          <UiTab
            v-if="tab"
            :is-selected="index === selectedIndex"
            class="tab-grow"
            :disable-menu="tab.disable"
          >
            <a class="tab-link" href="#" @click.prevent="() => (currentLinkIndex = index)">{{
              tab.title
            }}</a>
          </UiTab>
        </template>
        <div class="pt-4 pl-4" slot="users">
          <UsersTab :partnerid="this.$route.params.id" :partner="partner" />
        </div>
        <div class="pt-4 pl-4" slot="customize">
          <CustomizeTab :partnerid="this.$route.params.id" :partner="partner" />
        </div>
        <div class="pt-4 pl-4" slot="billingAccounts">
          <BillAccounts :partner="partner" />
        </div>
        <div class="pt-4 pl-4" slot="customerList">
          <PartnerCustomers :partner="partner" />
        </div>
        <div class="pt-4 pl-4" slot="accountDetail">
          <AccountDetail :partner="partner" />
        </div>
        <div class="pt-4 pl-4" slot="offersAndSim">
          <OffersTab :partner="partner" />
        </div>
      </UiTabs>
    </div>
  </div>
</template>

<script>
import Summary from './Summary';

import UiTabs from '@/components/ui/Tabs';
import UiTab from '@/components/ui/Tab';

import UsersTab from './UsersTab';
import CustomizeTab from './CustomizeTab';
import AccountDetail from './AccountDetail';
import OffersTab from './OffersTab';
import BillAccounts from './BillAccounts';
import PartnerCustomers from './PartnerCustomers';

import { fetchpartnerById } from '@/api/partners.js';

export default {
  components: {
    Summary,
    UiTabs,
    UiTab,

    BillAccounts,
    PartnerCustomers,
    UsersTab,
    CustomizeTab,
    AccountDetail,
    OffersTab,
  },

  async mounted() {
    this.partner = await fetchpartnerById(this.$route.params.id, { includeMailingLists: true });
    this.prepareTabs();
  },

  data() {
    return {
      partner: undefined,
      currentLinkIndex: 0,
      tabs: [],
    };
  },

  methods: {
    returnToSearch() {
      this.$router.push({ name: 'getAdminPartners', params: { fromDetail: true } });
    },

    prepareTabs() {
      const tabs = [
        {
          label: 'users',
          title: this.$t('menu.users'),
        },
        {
          label: 'customize',
          title: this.$t('getadmin.partners.customize'),
        },
      ];

      if (this.partner && this.partner.partyType === 'MULTI_CUSTOMER') {
        tabs.push({
          label: 'customerList',
          title: this.$t('getadmin.partners.customerList'),
        });
      } else {
        tabs.push({
          label: 'billingAccounts',
          title: this.$t('filters.billingAccounts'),
        });
      }

      tabs.push(
        {
          label: 'offersAndSim',
          title: this.$t('getadmin.partners.offersAndSim'),
        },
        {
          label: 'accountDetail',
          title: this.$t('getadmin.partners.accountDetail'),
        }
      );

      this.tabs = tabs;
    },
  },

  computed: {
    partnerName() {
      return this.partner ? this.partner.name : '';
    },
  },
};
</script>

<style lang="scss" scoped>
.tab-grow {
  flex-grow: 1;
}
a.tab-link {
  text-transform: uppercase;
}
</style>
