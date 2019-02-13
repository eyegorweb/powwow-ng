<template>
  <div class="step-client-container">
    <CreateOrderDeliveryNewAddress
      v-if="inEditMode"
      @cancel="inEditMode = false"
      @saved="refreshList"
      :partner-id="synthesis.billingAccount.value.partnerId"
    />
    <div class="panel-vertical-container" v-if="!inEditMode">
      <div class="main-content">
        <h3 class="font-weight-light text-center mt-4 mb-4">{{ $t('orders.choose-delivery') }}</h3>

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

        <div v-if="adresses.length" class="row mb-3">
          <div class="col-md-12">
            <h6>{{ $t('orders.new.deliveryStep.search') }}</h6>
            <UiInput
              :placeholder="$t('orders.new.deliveryStep.searchPlaceholder')"
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
                      style="margin: auto; background: #009dcc"
                    />
                    <span>{{ $t('orders.new.deliveryStep.new') }}</span>
                  </div>

                </div>
              </template>
              <template slot-scope="{ item }">
                <CreateOrderStepDeliveryAddress
                  :item="item"
                  :default-selected-item="selectedAdress"
                  @update:defaultSelectedItem="selectAdress"
                  name="address"
                />
              </template>
            </BlocList>
          </div>
        </div>
      </div>

      <div class="footer-bock">
        <div class="row">
          <div class="col-md-12 mt-5">
            <UiButton
              variant="round-button"
              @click="$emit('prev')"
              class="float-left ic-Arrow-Previous-Icon"
            />
            <UiButton
              variant="round-button"
              :disabled="!selectedAdress"
              @click="done"
              class="float-right ic-Arrow-Next-Icon"
            />
          </div>
        </div>
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
import CreateOrderDeliveryNewAddress from './CreateOrderDeliveryNewAddress';

export default {
  name: 'CreateOrderStepDelivery',

  components: {
    UiButton,
    UiInput,
    CreateOrderStepDeliveryAddress,
    BlocList,
    CreateOrderDeliveryNewAddress,
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
      inEditMode: false,
    };
  },

  async mounted() {
    this.refreshList();
  },

  methods: {
    selectAdress(a) {
      this.selectedAdress = a;
    },
    addnewAddress() {
      this.inEditMode = true;
    },

    async refreshList() {
      this.inEditMode = false;
      const partnerId = this.synthesis.billingAccount.value.partnerId;
      const data = await fetchpartnerAddresses(partnerId);
      if (data) {
        this.lastSelectedAdress = data.last;
        this.adresses = data.all;
        this.filteredAdresses = [...this.adresses];
      }
    },

    done() {
      this.$emit('done', {
        delivery: {
          label: 'common.delivery',
          value: {
            id:
              this.selectedAdress.address.address1 +
              this.selectedAdress.address.address2 +
              this.selectedAdress.address.address3,
            content: [
              this.selectedAdress.name.firstName + ' ' + this.selectedAdress.name.lastName,
              this.selectedAdress.address.address1,
              this.selectedAdress.address.address2,
              this.selectedAdress.address.address3,
              this.selectedAdress.address.zipCode + ' - ' + this.selectedAdress.address.city,
              this.selectedAdress.contactInformation.email,
              this.selectedAdress.contactInformation.phone,
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
/* voir comment gérer le css en double */

.step-client-container {
  padding: 0 2rem !important;
}

.add-new {
  display: flex;
  flex-direction: column;
  justify-content: center;
  margin: auto;
  &:hover {
    cursor: pointer;
  }
}

.box {
  max-height: 10rem;
}
.address {
  max-height: 11rem;
}
</style>
