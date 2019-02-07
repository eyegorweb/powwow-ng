<template>
  <div class="step-client-container">
    <div>
      <h2 class="title">{{ $t('orders.choose-delivery') }}</h2>
    </div>
    <div v-if="lastSelectedAdress" class="row">
      <div class="col-md-12">
        <h6>{{ $t('orders.new.deliveryStep.last') }}</h6>
        <CreateOrderStepDeliveryAddress
          :item="lastSelectedAdress"
          :default-selected-item="selectedAdress"
          @update:defaultSelectedItem="selectAdress"
          name="address"
        />
      </div>
    </div>

    <div v-if="adresses.length" class="row">
      <div class="col-md-12">
        <h6>{{ $t('orders.new.deliveryStep.search') }}</h6>
        <UiInput
          placeholder="Saisir un nom ou une adresse"
          class="d-block mx-auto"
          v-model="filterValue"
        />
      </div>
    </div>

    <div class="row">
      <div class="col-md-12">
        <BlocList :items="filteredAdresses">
          <template slot="firstElement" slot-scope="{ className }">
            <div :class="`${className}`" @click="addnewAddress">
              <div class="add-new">
                <UiButton
                  variant="round-button"
                  @click="addnewAddress"
                  class="ic-Plus-Icon test"
                  style="margin: auto"
                />
                <span>{{ $t('orders.new.deliveryStep.new') }}</span>
              </div>

            </div>
          </template>
          <template slot-scope="{ item }">
            <CreateOrderStepDeliveryAddress
              :item="item.address"
              :default-selected-item="selectedAdress"
              @update:defaultSelectedItem="selectAdress"
              name="address"
            />
          </template>
        </BlocList>
      </div>
    </div>

    <div class="row">
      <div class="col-md-12 mt-5">
        <UiButton
          variant="round-button"
          @click="$emit('prev')"
          class="float-left ic-Arrow-Previous-Icon"
        />
        <UiButton
          variant="round-button"
          @click="done"
          class="float-right ic-Arrow-Next-Icon"
        />
      </div>
    </div>
  </div>
</template>

<script>
import UiButton from '@/components/ui/Button';
import UiInput from '@/components/ui/UiInput';
import CreateOrderStepDeliveryAddress from './CreateOrderStepDeliveryAddress';
import { fetchpartnerAddresses } from '@/api/partners';
import BlocList from '@/components/BlocList';

export default {
  name: 'CreateOrderStepDelivery',

  components: {
    UiButton,
    UiInput,
    CreateOrderStepDeliveryAddress,
    BlocList,
  },

  props: {
    synthesis: {
      type: Object,
      required: true,
    },
  },

  data() {
    return {
      filterValue: '',
      lastSelectedAdress: undefined,
      filteredAdresses: [],
      adresses: [],
      selectedAdress: undefined,
    };
  },

  async mounted() {
    const partnerId = this.synthesis.billingAccount.value.partnerId;
    const data = await fetchpartnerAddresses(partnerId);
    if (data) {
      this.lastSelectedAdress = data.last;
      this.adresses = data.all;
      this.filteredAdresses = [...this.adresses];
    }
  },

  methods: {
    selectAdress(a) {
      this.selectedAdress = a;
    },
    addnewAddress() {
      console.log('New Address');
    },

    done() {
      this.$emit('done', {
        delivery: {
          label: 'common.delivery',
          value: {
            id:
              this.selectedAdress.address1 +
              this.selectedAdress.address2 +
              this.selectedAdress.address3,
            content: [
              this.selectedAdress.address1,
              this.selectedAdress.address2,
              this.selectedAdress.address3,
              this.selectedAdress.zipCode + ' - ' + this.selectedAdress.city,
            ],
          },
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
        this.filteredAdresses = this.adresses.filter(
          a =>
            a.address.address1
              ? a.address.address1.toLowerCase().includes(query)
              : undefined || a.address.address2
                ? a.address.address2.toLowerCase().includes(query)
                : undefined || a.address.address3
                  ? a.address.address3.toLowerCase().includes(query)
                  : undefined || a.address.city
                    ? a.address.city.toLowerCase().includes(query)
                    : undefined || a.address.zipCode
                      ? a.address.zipCode.toLowerCase().includes(query)
                      : undefined
        );
      }
    },
  },
};
</script>

<style lang="scss" scoped>
/* voir comment gérer le css en double */
.title {
  background-color: transparent;
  color: $dark-gray;
  font-weight: 300;
  font-size: 2rem;
  margin: 3rem 0 1.875rem;
  padding: 0;
  text-align: center;
}

.step-client-container {
  padding: 0 2rem !important;
}

.add-new {
  display: flex;
  flex-direction: column;
  justify-content: center;
  margin: auto;

  .btn {
    margin: auto;
  }
}

.box {
  max-height: 10rem;
}
.address {
  max-height: 11rem;
}
</style>
