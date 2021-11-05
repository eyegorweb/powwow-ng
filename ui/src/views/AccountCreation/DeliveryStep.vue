<template>
  <div class="step-container">
    <template v-if="inEditMode">
      <CreateAccountNewDeliveryAddress
        @cancel="inEditMode = false"
        @saved="addnewAddress"
        :address-edit="addressToEdit"
      />
    </template>
    <template v-if="!inEditMode">
      <div class="row mb-3 add-new">
        <BlocList :items="address">
          <template slot="firstElement" slot-scope="{ className }">
            <div :class="`${className}`" @click="inEditMode = true">
              <div class="add-new">
                <UiButton
                  variant="round-button"
                  @click="inEditMode = true"
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
            />
          </template>
        </BlocList>
      </div>
      <BottomBar no-next :can-prev="true" @prev="gotoPrev" />
    </template>
  </div>
</template>

<script>
import BottomBar from './BottomBar.vue';
import BlocList from '@/components/BlocList';
import UiButton from '@/components/ui/Button';
import CreateAccountDeliveryAddress from '@/views/GetSim/CreateOrder/DeliveryStep/CreateOrderStepDeliveryAddress.vue';
import CreateAccountNewDeliveryAddress from './NewDeliveryAddressStep.vue';

export default {
  components: {
    BottomBar,
    BlocList,
    UiButton,
    CreateAccountDeliveryAddress,
    CreateAccountNewDeliveryAddress,
  },
  props: {
    synthesis: Object,
  },

  mounted() {
    if (!this.synthesis) {
      this.$router.push({ name: 'createAccount.partner' });
    }
  },

  data() {
    return {
      address: [],
      inEditMode: false,
      addressToEdit: undefined,
      selectedAddress: undefined,
    };
  },

  computed: {
    steps: {
      get() {
        return this.synthesis;
      },
      set(synthesis) {
        this.$emit('done', synthesis);
      },
    },
  },

  methods: {
    addnewAddress(form) {
      this.inEditMode = false;
      this.address.push(form);
      this.selectedAddress = form;
      this.steps = { ...this.steps, deliveryStep: form };
    },

    gotoPrev() {
      this.$router.push({
        name: 'createAccount.simChoice',
      });
    },

    async saveQuery() {
      console.log('Appel api ici');
    },
  },
};
</script>

<style lang="scss" scoped>
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
