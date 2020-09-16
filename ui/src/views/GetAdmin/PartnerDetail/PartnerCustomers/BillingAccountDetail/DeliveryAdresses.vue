<template>
  <CardsList
    :key="version"
    search-input-txt="orders.new.deliveryStep.search"
    placeholder-txt="orders.new.deliveryStep.searchPlaceholder"
    add-txt="getadmin.customize.addDeliveryAddress"
    add-icon="ic-Pin-Icon"
    :fetch-fn="fetchFn"
    :filter-fn="filterFn"
    @create="openCreationPanel"
    @modify="modifyList($event)"
    no-edit
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
</template>

<script>
import get from 'lodash.get';
import CardsList from '@/views/GetAdmin/PartnerDetail/parts/CardsList.vue';

export default {
  components: {
    CardsList,
  },
  props: {
    partner: Object,
    billingAccountToDetail: Object,
  },
  data() {
    return {
      version: 0,
    };
  },
  methods: {
    async fetchFn() {
      return get(this.billingAccountToDetail, 'customerAccountShippingAddresses.items');
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
    openCreationPanel() { },
    modifyList(address) {
      console.log(address)
    },
    getFromObject(object, path, defaultValue = '') {
      const value = get(object, path, defaultValue);
      return value !== null ? value : '';
    },
  },
};
</script>

<style lang="scss" scoped></style>
