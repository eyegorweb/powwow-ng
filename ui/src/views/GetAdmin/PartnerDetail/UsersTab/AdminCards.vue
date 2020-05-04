<template>
  <div class="cards">
    <Card
      v-if="admins.mainAdministrator"
      :can-delete="false"
      @modify="modifyAdmin(admins.mainAdministrator)"
    >
      <div class="cardBloc-infos-name">
        {{
          getFromContent('mainAdministrator.name.firstName') +
            ' ' +
            getFromContent('mainAdministrator.name.lastName')
        }}
      </div>
      <div class="cardBloc-infos-tel">
        {{
          getFromContent('mainAdministrator.contactInformation.mobile') ||
            getFromContent('mainAdministrator.contactInformation.phone')
        }}
      </div>
      <div class="cardBloc-infos-email">
        <a :href="'mailto:' + getFromContent('mainAdministrator.contactInformation.email')">
          {{ getFromContent('mainAdministrator.contactInformation.email') }}
        </a>
      </div>
      <div class="cardBloc-infos-role">
        {{ $t('getadmin.partners.role') }} : {{ $t('getadmin.partners.mainAdmin') }}
      </div>
    </Card>
    <CardButton v-else @click="addMainAdmin">
      {{ $t('getadmin.users.addAdmin') }}
    </CardButton>

    <Card v-if="admins.secondAdministator" @delete="deleteSecondAdministrator">
      <div class="cardBloc-infos-name">
        {{
          getFromContent('secondAdministator.name.firstName') +
            ' ' +
            getFromContent('secondAdministator.name.lastName')
        }}
      </div>
      <div class="cardBloc-infos-tel">
        {{
          getFromContent('secondAdministator.contactInformation.mobile') ||
            getFromContent('secondAdministator.contactInformation.phone')
        }}
      </div>
      <div class="cardBloc-infos-email">
        <a :href="'mailto:' + getFromContent('secondAdministator.contactInformation.email')">
          {{ getFromContent('secondAdministator.contactInformation.email') }}
        </a>
      </div>
      <div class="cardBloc-infos-role">
        {{ $t('getadmin.partners.role') }} : {{ $t('getadmin.partners.secondAdmin') }}
      </div>
    </Card>
    <CardButton :disabled="!admins.mainAdministrator" @click="addSecondaryAdmin" v-else>
      {{ $t('getadmin.users.addAdmin') }}
    </CardButton>
  </div>
</template>

<script>
import Card from '@/components/Card';
import CardButton from '@/components/CardButton';
import { fetchAdminInfos, deleteSecondaryAdministrator } from '@/api/partners.js';
import get from 'lodash.get';
import { mapMutations } from 'vuex';

export default {
  components: {
    Card,
    CardButton,
  },

  props: {
    partnerid: {
      type: String,
      default: undefined,
    },
  },

  data() {
    return {
      admins: Object,
    };
  },

  async mounted() {
    this.refreshData();
  },

  methods: {
    ...mapMutations(['openPanel', 'confirmAction']),

    getFromContent(path, defaultValue = '') {
      const value = get(this.admins, path, defaultValue);
      return value !== null ? value : '';
    },

    addMainAdmin() {
      this.modifyAdmin();
    },

    addSecondaryAdmin() {
      this.modifyAdmin({ adminType: 'SECONDARY' });
    },

    async refreshData() {
      this.admins = await fetchAdminInfos(this.partnerid);
    },

    async deleteSecondAdministrator() {
      const doReset = () => {
        this.refreshData();
      };
      this.confirmAction({
        message: 'confirmAction',
        actionFn: async () => {
          await deleteSecondaryAdministrator(this.partnerid);
          doReset();
        },
      });
    },

    modifyAdmin(admin) {
      const doReset = () => {
        this.refreshData();
      };
      this.openPanel({
        title: this.$t('getadmin.partnerDetail.adminForm.title'),
        panelId: 'getadmin.partnerDetail.adminForm.title',
        payload: {
          ...admin,
          partnerId: this.partnerid,
        },
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
  },
};
</script>

<style lang="scss" scoped>
.cards {
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;

  .cardBloc-infos {
    &-name {
      font-weight: 500;
      color: #454545;
      margin-bottom: 7px;
      font-size: 16px;
    }

    &-role {
      font-size: 12px;
      margin-top: 10px;
    }

    &-email {
      margin-top: 5px;

      a {
        color: #009dcc;
        text-decoration: underline;
      }
    }
  }
}
</style>
