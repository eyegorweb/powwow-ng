<template>
  <div>
    <CardsList
      :key="version"
      searchInputTxt="orders.new.deliveryStep.search"
      placeholderTxt="orders.new.deliveryStep.searchPlaceholder"
      add-txt="getadmin.customize.addDeliveryAddress"
      add-icon="ic-Pin-Icon"
      :fetch-fn="fetchFn"
      :filter-fn="filterFn"
      @create="openCreationPanel"
      @modify="modifyList($event)"
    >
      <template v-slot="{ item }">
        <div v-if="item.company" class="cardBloc-infos-name">
          {{ item.company }}
        </div>
        <div class="cardBloc-infos-name">
          {{ getFromObject(item, 'name.firstName') }} {{ getFromObject(item, 'name.lastName') }}
        </div>
        <div class="cardBloc-infos-role">
          {{ getFromObject(item, 'address.address1') }}
          <span v-if="item.address.address2 && item.address.address2 !== 'null'">
            <br />
            {{ getFromObject(item, 'address.address2') }}</span
          >
          <span v-if="item.address.address3 && item.address.address3 !== 'null'">
            <br />
            {{ getFromObject(item, 'address.address3') }}</span
          >
          <br v-if="item.address && item.address.city" />
          {{ getFromObject(item, 'address.zipCode') }} - {{ getFromObject(item, 'address.city') }}
          <br v-if="item.address && item.address.country" />
          {{ getFromObject(item, 'address.country') }}
        </div>
      </template>
    </CardsList>
  </div>
</template>

<script>
import get from 'lodash.get';

import CardsList from '@/views/GetAdmin/PartnerDetail/parts/CardsList.vue';

import { fetchpartnerAddresses } from '@/api/partners';
import { fetchDeliveryCountries } from '@/api/filters';
import { mapMutations } from 'vuex';

export default {
  components: {
    CardsList,
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
      version: 0,
    };
  },

  methods: {
    ...mapMutations(['openPanel', 'confirmAction']),

    async fetchFn() {
      const data = await fetchpartnerAddresses(this.partnerid);
      const countries = await fetchDeliveryCountries(this.$i18n.locale);
      if (data && data.all) {
        data.all = data.all.map(a => {
          if (!a.id) return;
          const foundCountry = countries.find(c => c.code === a.address.country);
          if (foundCountry) {
            a.address.country = foundCountry.name;
          }
          return a;
        });
        return [...data.all];
      }
    },

    filterFn(q, items) {
      let filteredAdresses;
      if (!q) {
        filteredAdresses = [...items];
      } else {
        const query = q.toLowerCase();
        filteredAdresses = items.filter(a => {
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

      return filteredAdresses;
    },

    getFromObject(object, path, defaultValue = '') {
      const value = get(object, path, defaultValue);
      return value !== null ? value : '';
    },

    openCreationPanel() {
      const doReset = () => {
        this.version += 1;
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

    modifyList(address) {
      const doReset = () => {
        this.version += 1;
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
};
</script>

<style lang="scss" scoped>
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
</style>
