<template>
  <div class="mt-4">
    <div class="row mb-5">
      <div class="col-md-9">
        <h4>
          <b>GetAdmin</b>
          - USERNAME
        </h4>
      </div>
    </div>

    <Summary />

    <div class="mt-4 mb-4">
      <UiTabs :tabs="tabs" :selected-index="currentLinkIndex">
        <template slot-scope="{ tab, index, selectedIndex }">
          <UiTab v-if="tab" :is-selected="index === selectedIndex" class="tab-grow">
            <a class="tab-link" href="#" @click.prevent="() => (currentLinkIndex = index)">{{
              tab.title
            }}</a>
          </UiTab>
        </template>
        <div class="pt-4 pl-4" slot="users">
          <UsersTab />
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

import { fetchpartnerById } from '@/api/partners.js';

export default {
  components: {
    Summary,
    UiTabs,
    UiTab,

    UsersTab,
  },

  async mounted() {
    this.partner = await fetchpartnerById(this.$route.params.id);
  },

  data() {
    return {
      partner: undefined,
      currentLinkIndex: 0,
      tabs: [
        {
          label: 'users',
          title: this.$t('menu.users'),
        },
        {
          label: 'customize',
          title: this.$t('getadmin.partners.customize'),
        },
        {
          label: 'billingAccounts',
          title: this.$t('filters.billingAccounts'),
        },
        {
          label: 'offersAndSim',
          title: this.$t('getadmin.partners.offersAndSim'),
        },
        {
          label: 'accountDetail',
          title: this.$t('getadmin.partners.accountDetail'),
        },
      ],
    };
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
