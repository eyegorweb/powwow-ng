<template>
  <CreateOrderStepContainer no-next-button @done="done" @prev="prev">
    <div class="step-container">
      <div class="deliveryContainer">
        <template v-if="inEditMode">
          <NewDeliveryAddress
            @cancel="(inEditMode = false), (addressToEdit = undefined)"
            @saved="refreshList"
            @add="addNewAddress"
            :address-edit="addressToEdit"
          />
        </template>
        <template v-if="!inEditMode">
          <div class="row mb-3 add-new">
            <BlocList :items="address">
              <template slot="firstElement" slot-scope="{ className }">
                <div
                  :class="`${className}`"
                  @click="(inEditMode = true), (addressToEdit = undefined)"
                >
                  <div class="add-new">
                    <UiButton
                      variant="round-button"
                      @click="(inEditMode = true), (addressToEdit = undefined)"
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
                <CreateAccountDeliveryAddress
                  :item="item"
                  :default-selected-item="selectedAddress"
                  can-edit
                  name="address"
                  @modify="editAddress"
                  @update:defaultSelectedItem="selectAdress"
                />
              </template>
              <template v-if="lastSelectedAdress" slot="defaultElement">
                <CreateAccountDeliveryAddress
                  :item="lastSelectedAdress"
                  :default-selected-item="selectedAddress"
                  can-edit
                  name="Acccountaddress"
                  @modify="editAddress"
                  @update:defaultSelectedItem="selectAdress"
                />
              </template>
            </BlocList>
          </div>
        </template>
      </div>
    </div>
  </CreateOrderStepContainer>
</template>

<script>
import CreateOrderStepContainer from '@/views/GetSim/CreateOrder/CreateOrderStepContainer.vue';
import BlocList from '@/components/BlocList';
import UiButton from '@/components/ui/Button';
import CreateAccountDeliveryAddress from '@/views/AccountCreation/CreateAccountDeliveryAddress.vue';
import NewDeliveryAddress from '@/views/AccountCreation//NewDeliveryAddressStep.vue';
import { fetchpartnerAddresses } from '@/api/partners';
import { mapGetters } from 'vuex';

export default {
  components: {
    CreateOrderStepContainer,
    BlocList,
    UiButton,
    CreateAccountDeliveryAddress,
    NewDeliveryAddress,
  },

  props: {
    synthesis: {
      type: Object,
      required: true,
    },
  },

  mounted() {
    this.refreshList();
  },

  data() {
    return {
      address: [],
      inEditMode: false,
      addressToEdit: undefined,
      selectedAddress: undefined,
      lastSelectedAdress: undefined,
    };
  },

  computed: {
    ...mapGetters(['userInfos']),
  },

  methods: {
    addNewAddress(form) {
      this.inEditMode = false;
      this.address.push(form);
      this.selectedAddress = form;
    },

    editAddress(item) {
      this.inEditMode = true;
      this.addressToEdit = item;
    },

    async refreshList(form) {
      this.inEditMode = false;
      if (this.synthesis.deliveryStep && !form) {
        this.lastSelectedAdress = this.synthesis.deliveryStep;
        this.selectedAddress = this.lastSelectedAdress;
      } else if (form && form.id) {
        const addressIndex = this.address.findIndex((f) => f.id === form.id);
        this.address.splice(addressIndex, 1, form);
        this.lastSelectedAdress = undefined;
        this.selectedAddress = form;
      } else {
        const data = await fetchpartnerAddresses(this.userInfos.partners[0].id);
        if (data) {
          this.lastSelectedAdress = data.last;
          this.selectedAddress = this.lastSelectedAdress;
          if (data.all) {
            this.address = [...data.all];
          }
        }
      }
    },

    selectAdress(a) {
      this.selectedAddress = a;
    },

    getSynthesis() {
      return {
        deliveryStep: this.selectedAddress,
      };
    },
    done() {
      this.$emit('done', this.getSynthesis());
    },
    prev() {
      this.$emit('prev', this.getSynthesis());
    },
  },

  watch: {
    selectedAddress(newAddress) {
      this.steps = { ...this.steps, deliveryStep: newAddress };
      this.$emit('done', this.getSynthesis());
    },
  },
};
</script>

<style lang="scss" scoped>
.deliveryContainer {
  width: 70%;
  margin: 0 auto;
}
.box__item {
  display: flex;
  justify-content: center;
}
.add-new {
  display: flex;
  flex-direction: column;
  justify-content: center;
  // margin: auto;
  &:hover {
    cursor: pointer;
  }
}
</style>
