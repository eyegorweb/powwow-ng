<template>
  <div class="cards">
    <Card v-if="admins.mainAdministrator" :canDelete="false">
      <div
        class="cardBloc-infos-name"
      >{{admins.secondAdministator.name.firstName + ' ' + admins.secondAdministator.name.lastName}}</div>
      <div
        class="cardBloc-infos-tel"
      >{{ admins.secondAdministator.contactInformation.mobile || admins.secondAdministator.contactInformation.phone || '-'}}</div>
      <div class="cardBloc-infos-email">
        <a
          href="mailto:chloédulac@enedis-france.com"
        >{{ admins.secondAdministator.contactInformation.email || '-'}}</a>
      </div>
      <div
        class="cardBloc-infos-role"
      >{{$t('getadmin.partners.role')}} : {{$t('getadmin.partners.mainAdmin')}}</div>
    </Card>

    <Card v-if="admins.secondAdministator" :canDelete="true">
      <div
        class="cardBloc-infos-name"
      >{{admins.secondAdministator.name.firstName + ' ' + admins.secondAdministator.name.lastName}}</div>
      <div
        class="cardBloc-infos-tel"
      >{{ admins.secondAdministator.contactInformation.mobile || admins.secondAdministator.contactInformation.phone || '-'}}</div>
      <div class="cardBloc-infos-email">
        <a
          href="mailto:chloédulac@enedis-france.com"
        >{{ admins.secondAdministator.contactInformation.email || '-'}}</a>
      </div>
      <div
        class="cardBloc-infos-role"
      >{{$t('getadmin.partners.role')}} : {{$t('getadmin.partners.secondAdmin')}}</div>
    </Card>

    <div class="addNew">
      <div class="addNew-logo">
        <i class="icon ic-User-Icon"></i>
      </div>
      <div>{{$t('getadmin.users.addAdmin')}}</div>
    </div>
  </div>
</template>

<script>
import Card from '@/components/Card';
import { fetchAdminInfos } from '@/api/partners.js';

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

  data() {
    return {
      admins: Object,
    };
  },

  async mounted() {
    this.admins = await fetchAdminInfos(this.partnerid);
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
    height: 200px;
    border-radius: 5px;
    font-size: 14px;
    padding: 30px 20px;
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
