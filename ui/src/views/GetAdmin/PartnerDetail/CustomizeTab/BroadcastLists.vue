<template>
  <div>
    <div class="cards">
      <div class="addNew">
        <div class="addNew-logo">
          <i class="icon ic-User-Icon"></i>
        </div>
        <div>{{ $t('getadmin.customize.addList') }}</div>
      </div>
      <Card v-if="broadcastLists" v-for="list in broadcastLists" :key="list.id" :can-delete="true">
        <div class="cardBloc-infos-name">{{ list.name }}</div>
        <div class="cardBloc-infos-username">{{ list.emails }}</div>
      </Card>
    </div>
  </div>
</template>

<script>
import Card from '@/components/Card';
import { fetchBroadcastLists } from '@/api/partners.js';

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
      broadcastLists: undefined,
      searchValue: null,
    };
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
