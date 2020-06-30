<template>
  <div>
    <div v-if="adresses && adresses.length > 0" class="mb-3">
      <div class="col-md-6">
        <h6>{{ $t('orders.new.deliveryStep.search') }}</h6>
        <UiInput
          :placeholder="$t('orders.new.deliveryStep.searchPlaceholder')"
          class="d-block mx-auto"
          v-model="filterValue"
        />
      </div>
    </div>
    <div class="cards">
      <div class="addNew" @click="openCreationPanel">
        <div class="addNew-logo">
          <i class="icon ic-Pin-Icon"></i>
        </div>
        <div>{{ $t('getadmin.customize.addDeliveryAddress') }}</div>
      </div>
      <template v-if="filteredAdresses">
        <Card
          v-for="list in filteredAdresses"
          :key="list.id"
          :can-delete="false"
          @modify="modifyList(list)"
        >
          <div v-if="list.company" class="cardBloc-infos-name">
            {{ list.company }}
          </div>
          <div class="cardBloc-infos-name">
            {{ getFromObject(list, 'name.firstName') }} {{ getFromObject(list, 'name.lastName') }}
          </div>
          <div class="cardBloc-infos-role">
            {{ getFromObject(list, 'address.address1') }}
            <span v-if="list.address.address2 && list.address.address2 !== 'null'">
              <br />
              {{ getFromObject(list, 'address.address2') }}</span
            >
            <span v-if="list.address.address3 && list.address.address3 !== 'null'">
              <br />
              {{ getFromObject(list, 'address.address3') }}</span
            >
            <br v-if="list.address && list.address.city" />
            {{ getFromObject(list, 'address.zipCode') }} - {{ getFromObject(list, 'address.city') }}
            <br v-if="list.address && list.address.country" />
            {{ getFromObject(list, 'address.country') }}
          </div>
        </Card>
      </template>
    </div>
  </div>
</template>

<script>
import get from 'lodash.get';

import Card from '@/components/Card';
import UiInput from '@/components/ui/UiInput';
import { fetchpartnerAddresses } from '@/api/partners';
import { fetchDeliveryCountries } from '@/api/filters';
import { mapMutations } from 'vuex';

export default {
  components: {
    Card,
    UiInput,
  },

  props: {
    partnerid: {
      type: String,
      default: undefined,
    },
  },

  data() {
    return {
      adresses: undefined,
      filterValue: '',
      filteredAdresses: [],
    };
  },

  mounted() {
    this.refreshLists();
  },

  methods: {
    ...mapMutations(['openPanel', 'confirmAction']),

    getFromObject(object, path, defaultValue = '') {
      const value = get(object, path, defaultValue);
      return value !== null ? value : '';
    },

    openCreationPanel() {
      const doReset = () => {
        this.refreshLists();
      };

      this.openPanel({
        title: this.$t('getadmin.customize.addDeliveryAddress'),
        panelId: 'getadmin.customize.addDeliveryAddress',
        payload: { partnerId: this.partnerid, inEditMode: false },
        backdrop: true,
        width: '40rem',
        ignoreClickAway: true,
        onClosePanel() {
          doReset();
        },
      });
    },

    async refreshLists() {
      const data = await fetchpartnerAddresses(this.partnerid);
      const countries = await fetchDeliveryCountries(this.$i18n.locale);
      if (data && data.all) {
        this.adresses = data.all;
        data.all = data.all.map(a => {
          if (!a.id) return;
          const foundCountry = countries.find(c => c.code === a.address.country);
          a.address.country = foundCountry.name;
        });
        this.filteredAdresses = [...this.adresses];
      }
    },

    modifyList(address) {
      const doReset = () => {
        this.refreshLists();
      };

      this.openPanel({
        title: this.$t('getadmin.customize.modifyDeliveryAddress'),
        panelId: 'getadmin.customize.addDeliveryAddress',
        payload: { modifyDA: address, partnerId: this.partnerid, inEditMode: true },
        backdrop: true,
        width: '40rem',
        ignoreClickAway: true,
        onClosePanel() {
          doReset();
        },
      });
    },
  },

  watch: {
    filterValue(q) {
      if (!q) {
        this.filteredAdresses = [...this.adresses];
      } else {
        const query = q.toLowerCase();
        this.filteredAdresses = this.adresses.filter(a => {
          if (a.address.address1) {
            if (a.address.address1.toLowerCase().includes(query)) {
              return true;
            }
          }
          if (a.address.address2) {
            if (a.address.address2.toLowerCase().includes(query)) {
              return true;
            }
          }
          if (a.address.address3) {
            if (a.address.address3.toLowerCase().includes(query)) {
              return true;
            }
          }
          if (a.address.city) {
            if (a.address.city.toLowerCase().includes(query)) {
              return true;
            }
          }
          if (a.address.zipCode) {
            if (a.address.zipCode.toLowerCase().includes(query)) {
              return true;
            }
          }
          const fullName = `${a.name.firstName} ${a.name.lastName}`;
          if (fullName.toLowerCase().includes(query)) {
            return true;
          }
          if (fullName.toLowerCase().includes(query)) {
            return true;
          }
        });
      }
    },
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
