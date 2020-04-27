<template>
  <div class="cards">
    <Card v-if="admins.mainAdministrator" :can-delete="false">
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
          {{
          getFromContent('mainAdministrator.contactInformation.email')
          }}
        </a>
      </div>
      <div
        class="cardBloc-infos-role"
      >{{ $t('getadmin.partners.role') }} : {{ $t('getadmin.partners.mainAdmin') }}</div>
    </Card>

    <Card v-if="admins.secondAdministrator" :can-delete="false">
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
          {{
          getFromContent('secondAdministator.contactInformation.email')
          }}
        </a>
      </div>
      <div
        class="cardBloc-infos-role"
      >{{ $t('getadmin.partners.role') }} : {{ $t('getadmin.partners.mainAdmin') }}</div>
    </Card>

    <div class="addNew">
      <div class="addNew-logo">
        <i class="icon ic-User-Icon"></i>
      </div>
      <div>{{ $t('getadmin.users.addAdmin') }}</div>
    </div>
  </div>
</template>

<script>
import Card from '@/components/Card';
import { fetchAdminInfos } from '@/api/partners.js';
import get from 'lodash.get';

export default {
  components: {
    Card,
  },

  methods: {
    getFromContent(path, defaultValue = '-') {
      return get(this.admins, path, defaultValue);
    },
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
    height: 220px;
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
