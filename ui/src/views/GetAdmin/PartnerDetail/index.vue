<template>
  <div class="mt-4">
    <div class="row" v-if="!userIsPartner">
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

    <Summary
      v-if="partner && havePermission('party', 'read_account_detail')"
      :partner-id="$route.params.id"
      :partner-type="partner.partyType"
    />

    <div v-if="partner" class="mt-4 mb-4 bottom-space">
      <UiTabs :tabs="tabs">
        <template slot-scope="{ tab, index }">
          <UiTab v-if="tab" :is-selected="index === currentTabToShow" class="tab-grow">
            <router-link :to="tab.to">{{ tab.title }}</router-link>
          </UiTab>
        </template>
      </UiTabs>
      <div class="pt-4 pl-4">
        <router-view :partner="partner" />
      </div>
    </div>
  </div>
</template>

<script>
import Summary from './Summary';

import UiTabs from '@/components/ui/Tabs';
import UiTab from '@/components/ui/Tab';

import { fetchpartnerById } from '@/api/partners.js';

import { mapGetters } from 'vuex';

export default {
  components: {
    Summary,
    UiTabs,
    UiTab,
  },

  async mounted() {
    // mvnoRanges
    this.partner = await fetchpartnerById(this.$route.params.id, {
      includeMailingLists: true,
      mvnoRanges: true,
    });
    const permissionsForUsersTab = [
      {
        domain: 'party',
        action: 'read_administrator',
      },
      {
        domain: 'user',
        action: 'read',
      },
    ];

    this.prepareTabs();
  },

  data() {
    return {
      partner: undefined,
      currentLinkIndex: 0,
      tabs: [],
      show: undefined,
    };
  },

  methods: {
    returnToSearch() {
      this.$router.push({ name: 'getAdminPartners', params: { fromDetail: true } });
    },

    // Gestion des permissions sur les onglets
    filterByPermission(arrayInput) {
      let permit = false;
      return arrayInput.filter((a) => {
        if (!a.permissions) return true;
        a.permissions.forEach((e) => {
          if (this.havePermission(e.domain, e.action)) {
            permit = true;
          }
        });
        return permit;
      });
    },

    // Définiton des onglets sur la page
    prepareTabs() {
      const tabs = [];
      const permissionsForUsersTab = [
        this.havePermission('party', 'read_administrator'),
        this.havePermission('user', 'read'),
      ];
      if (this.canShowTab(permissionsForUsersTab)) {
        tabs.push({
          section: 'users',
          title: this.$t('menu.users').toUpperCase(),
          permission: permissionsForUsersTab,
          to: {
            name: 'partnerDetail.users.admins',
            params: { partner: this.partner },
          },
        });
      }

      if (this.canShowTab(permissionsForUsersTab)) {
        tabs.push({
          section: 'customize',
          title: this.$t('getadmin.partners.customize').toUpperCase(),
          to: {
            name: 'partnerDetail.customize.customFields',
            params: { partner: this.partner },
          },
        });
      }

      if (this.partner && this.partner.partyType === 'MULTI_CUSTOMER') {
        tabs.push({
          section: 'customerList',
          title: this.$t('getadmin.partners.customerList').toUpperCase(),
          to: {
            name: 'getAdminPartnerDetails.customerList.list',
            params: { partner: this.partner },
          },
        });
      } else {
        if (this.havePermission('party', 'read_customer_account')) {
          tabs.push({
            section: 'billingAccounts',
            title: this.$t('filters.billingAccounts').toUpperCase(),
            to: {
              name: 'getAdminPartnerDetails.billingAccounts.list',
              params: { partner: this.partner },
            },
          });
        }
      }

      const permissionsForOffersTab = [
        this.havePermission('party', 'read_available_catalog_offers'),
        this.havePermission('party', 'read_available_sims'),
        this.partner.partyType === 'CUSTOMER' &&
          this.havePermission('party', 'read_supervision_option'),
      ];
      if (this.canShowTab(permissionsForOffersTab)) {
        tabs.push({
          section: 'offersAndSim',
          title: this.$t('getadmin.partners.offersAndSim').toUpperCase(),
          to: {
            name: 'partnerDetail.offersAndSim.simCards',
            params: { partner: this.partner },
          },
        });
      }

      const permissionsForAccountDetailTab = [
        this.havePermission('party', 'read_account_detail') &&
          (this.havePermission('party', 'read_main_options') ||
            this.havePermission('party', 'read_secondary_options')),
        this.havePermission('party', 'read_account_detail') &&
          !(
            this.havePermission('party', 'read_main_options') ||
            this.havePermission('party', 'read_secondary_options')
          ),
        !this.havePermission('party', 'read_account_detail') &&
          (this.havePermission('party', 'read_main_options') ||
            this.havePermission('party', 'read_secondary_options')),
        this.partner && this.partner.partyType === 'MVNO',
      ];

      if (this.canShowTab(permissionsForAccountDetailTab)) {
        tabs.push({
          section: 'accountDetail',
          title: this.$t('getadmin.partners.accountDetail').toUpperCase(),
          to: {
            name: 'partnerDetail.accountDetail.description',
            params: { partner: this.partner },
          },
        });
      }

      this.tabs = tabs;
    },

    canShowTab(permissions) {
      return permissions.some((p) => {
        return p;
      });
    },
  },

  computed: {
    ...mapGetters(['userIsPartner', 'havePermission']),

    // Gestion des "active tab" sur les onglets
    currentTabToShow() {
      //partnerDetail.customize.customFields
      if (this.$route.name.includes('customize')) return 1;
      if (this.$route.name.includes('customerList') || this.$route.name.includes('billingAccounts'))
        return 2;
      if (this.$route.name.includes('offers')) return 3;
      if (this.$route.name.includes('accountDetail')) return 4;
      return 0;
    },
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
