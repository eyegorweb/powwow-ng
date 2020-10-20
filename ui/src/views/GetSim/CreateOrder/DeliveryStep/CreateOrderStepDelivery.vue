<template>
  <CreateOrderStepContainer
    @done="done"
    @prev="prev"
    :can-go-to-next-step="!!selectedAdress"
    :no-buttons="inEditMode"
  >
    <CreateOrderDeliveryNewAddress
      v-if="inEditMode"
      @cancel="inEditMode = false"
      @saved="refreshList"
      :partner-id="synthesis.billingAccount.value.partnerId"
      :address-edit="addressToEdit"
    />
    <div class="main-content2" v-if="!inEditMode">
      <h3 class="font-weight-light text-center mt-4 mb-4">{{ $t('orders.choose-delivery') }}</h3>

      <div class="subcontainer">
        <div v-if="lastSelectedAdress" class>
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

        <div v-if="adresses.length" class="mb-3">
          <div class="col-md-12">
            <h6>{{ $t('orders.new.deliveryStep.search') }}</h6>
            <UiInput
              :placeholder="$t('orders.new.deliveryStep.searchPlaceholder')"
              class="d-block mx-auto"
              v-model="filterValue"
            />
          </div>
        </div>

        <div class>
          <div class="col-md-12">
            <BlocList :items="filteredAdresses">
              <template
                v-if="havePermission('party', 'update_delivery_address')"
                slot="firstElement"
                slot-scope="{ className }"
              >
                <div :class="`${className}`" @click="addnewAddress">
                  <div class="add-new">
                    <UiButton
                      variant="round-button"
                      @click="addnewAddress"
                      class="ic-Plus-Icon test"
                      style="
                        margin: auto;
                        background: #009dcc;
                        width: 3rem;
                        height: 3rem;
                        font-size: 1.5rem;
                      "
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
                  @modify="editAddress"
                  can-edit
                  name="address"
                />
              </template>
            </BlocList>
          </div>
        </div>
      </div>
    </div>
  </CreateOrderStepContainer>
</template>

<script>
import UiButton from '@/components/ui/Button';
import UiInput from '@/components/ui/UiInput';
import CreateOrderStepDeliveryAddress from './CreateOrderStepDeliveryAddress';
import { fetchpartnerAddresses } from '@/api/partners';
import BlocList from '@/components/BlocList';
import CreateOrderDeliveryNewAddress from './CreateOrderDeliveryNewAddress';
import get from 'lodash.get';
import CreateOrderStepContainer from '../CreateOrderStepContainer';
import { mapGetters } from 'vuex';

export default {
  name: 'CreateOrderStepDelivery',

  components: {
    UiButton,
    UiInput,
    CreateOrderStepDeliveryAddress,
    BlocList,
    CreateOrderDeliveryNewAddress,
    CreateOrderStepContainer,
  },

  props: {
    synthesis: {
      type: Object,
      required: true,
    },
    order: Object,
  },

  computed: {
    ...mapGetters(['havePermission'])
  },

  data() {
    return {
      filterValue: '',
      lastSelectedAdress: undefined,
      filteredAdresses: [],
      adresses: [],
      selectedAdress: undefined,
      inEditMode: false,
      addressToEdit: undefined,
    };
  },

  async mounted() {
    await this.refreshList();
    this.selectedAdress = get(this.synthesis, 'delivery.selection.selectedAdress');
    if (!this.selectedAdress && this.order) {
      this.selectedAdress = this.lastSelectedAdress;
    }
  },

  methods: {
    selectAdress(a) {
      this.selectedAdress = a;
    },
    addnewAddress() {
      this.inEditMode = true;
      this.addressToEdit = undefined;
    },

    editAddress(item) {
      this.inEditMode = true;
      this.addressToEdit = item;
    },

    async refreshList(savedId) {
      this.inEditMode = false;
      const partnerId = this.synthesis.billingAccount.value.partnerId;
      const data = await fetchpartnerAddresses(partnerId);
      if (data) {
        this.lastSelectedAdress = data.last;
        this.adresses = data.all;
        this.filteredAdresses = [...this.adresses];
      }

      if (savedId) {
        this.selectedAdress = this.adresses.find(f => f.id === savedId);
      }
    },

    done() {
      this.$emit('done', this.assembleSynthesis());
    },

    prev() {
      this.$emit('prev', this.assembleSynthesis());
    },

    assembleSynthesis() {
      if (!this.selectedAdress) return {};

      const content = [];

      if (this.selectedAdress.name) {
        content.push(this.selectedAdress.name.firstName + ' ' + this.selectedAdress.name.lastName);
      }

      content.push(this.selectedAdress.address.address1);

      if (this.selectedAdress.address.address2 && this.selectedAdress.address.address2 !== 'null') {
        content.push(this.selectedAdress.address.address2);
      }

      if (this.selectedAdress.address.address3 && this.selectedAdress.address.address3 !== 'null') {
        content.push(this.selectedAdress.address.address3);
      }

      content.push(this.selectedAdress.address.zipCode + ' - ' + this.selectedAdress.address.city);
      if (this.selectedAdress.contactInformation) {
        content.push(this.selectedAdress.contactInformation.email);
        content.push(this.selectedAdress.contactInformation.phone);
      }

      return {
        delivery: {
          label: 'common.delivery',
          value: {
            id:
              this.selectedAdress.address.address1 +
              this.selectedAdress.address.address2 +
              this.selectedAdress.address.address3,
            content,
            detail: this.selectedAdress,
          },
          selection: {
            selectedAdress: this.selectedAdress,
          },
        },
      };
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

.subcontainer {
  max-height: 33rem;
  overflow-y: auto;

  @media only screen and (max-height: 768px) {
    max-height: 67vh;
  }

  @media only screen and (min-height: 769px) {
    max-height: 39rem;
  }
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

.next-button {
  position: relative !important;
  right: 1rem;
  bottom: 0;
}
.prev-button {
  position: relative !important;
  left: 1rem;
  bottom: 0;
}

@media screen and (max-height: 768px) {
  .panel-vertical-container {
    div.main-content {
      max-height: 75vh;
      min-height: 60vh !important;
    }
  }
}
@media screen and (min-height: 769px) {
  .panel-vertical-container {
    div.main-content {
      min-height: 76vh;
      max-height: 76vh;
    }
  }
}
</style>
