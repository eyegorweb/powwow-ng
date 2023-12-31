<template>
  <div>
    <div class="cards">
      <div v-if="canUpdate" class="addNew" @click="openCreationPanel">
        <div class="addNew-logo">
          <i class="icon ic-User-Icon"></i>
        </div>
        <div>{{ $t('getadmin.customize.addList') }}</div>
      </div>
      <template v-if="broadcastLists">
        <Card
          v-for="list in broadcastLists"
          :key="list.id"
          :can-delete="canUpdate"
          :can-modify="canUpdate"
          @delete="deleteList(list.id)"
          @modify="modifyList(list)"
        >
          <div class="cardBloc-infos-name">{{ list.name }}</div>
          <div class="cardBloc-infos-username">
            {{ getFormattedMails(list.emails) }}
          </div>
        </Card>
      </template>
    </div>
  </div>
</template>

<script>
import Card from '@/components/Card';
import { fetchBroadcastLists, deleteBroadcastList } from '@/api/partners.js';
import { mapGetters, mapMutations } from 'vuex';
import { formatBackErrors } from '@/utils/errors';

export default {
  components: {
    Card,
  },

  props: {
    partnerid: {
      type: String,
      default: undefined,
    },
  },

  methods: {
    ...mapMutations(['openPanel', 'confirmAction', 'flashMessage']),

    getFormattedMails(emails) {
      if (!emails) return '';

      return emails.replace(/;/g, ' ');
    },

    openCreationPanel() {
      const doReset = () => {
        this.refreshLists();
      };

      this.openPanel({
        title: this.$t('getadmin.customize.addList'),
        panelId: 'getadmin.customize.addList',
        payload: { partnerId: this.partnerid, broadcastLists: this.broadcastLists },
        backdrop: true,
        width: '40rem',
        ignoreClickAway: true,
        onClosePanel() {
          doReset();
        },
      });
    },

    async refreshLists() {
      this.broadcastLists = await fetchBroadcastLists(this.partnerid);
    },

    modifyList(list) {
      const doReset = () => {
        this.refreshLists();
      };
      this.openPanel({
        title: this.$t('getadmin.customize.modifyList'),
        panelId: 'getadmin.customize.addList',
        payload: {
          duplicateFrom: list,
          partnerId: this.partnerid,
          broadcastLists: this.broadcastLists,
        },
        backdrop: true,
        width: '40rem',
        ignoreClickAway: true,
        onClosePanel() {
          doReset();
        },
      });
    },

    deleteList(id) {
      const doReset = () => {
        this.refreshLists();
      };
      this.confirmAction({
        message: 'confirmAction',
        actionFn: async () => {
          const response = await deleteBroadcastList(id);
          if (response) {
            if (response.errors && response.errors.length) {
              const formatted = formatBackErrors(response.errors)
                .map((e) => e.errors)
                .flat();
              let errorMessage = '';
              formatted.forEach((e) => {
                errorMessage = `${'getadmin.partnerDetail.errors.'}${e.value}`;
              });
              this.flashMessage({ level: 'danger', message: `${this.$t(errorMessage)}` });
            } else {
              this.flashMessage({ level: 'success', message: this.$t('genericSuccessMessage') });
              doReset();
            }
          } else {
            this.flashMessage({ level: 'danger', message: this.$t('genericErrorMessage') });
          }
        },
      });
    },
  },

  data() {
    return {
      broadcastLists: undefined,
      searchValue: null,
    };
  },

  computed: {
    ...mapGetters(['havePermission']),
    canUpdate() {
      return this.havePermission('party', 'update_broadcast_list');
    },
  },

  async mounted() {
    this.broadcastLists = await fetchBroadcastLists(this.partnerid);
  },
};
</script>

<style lang="scss" scoped>
.cards {
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;

  .addNew {
    width: 49%;
    height: 220px;
    border-radius: 5px;
    font-size: 14px;
    padding: 20px;
    border: #dddddd solid 1px;
    display: flex;
    justify-content: center;
    align-items: center;
    font-weight: 600;
    flex-direction: column;
    cursor: pointer;

    &-logo {
      width: 50px;
      height: 50px;
      background-color: #009dcc;
      border-radius: 100px;
      margin-bottom: 10px;
      display: flex;
      justify-content: center;
      align-items: center;

      i {
        color: white;
      }
    }
  }

  .cardBloc-infos {
    &-name {
      font-weight: 500;
      color: #454545;
      margin-bottom: 7px;
      font-size: 16px;
    }

    &-role {
      font-size: 12px;
      margin-top: 5px;
      margin-bottom: 15px;
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
