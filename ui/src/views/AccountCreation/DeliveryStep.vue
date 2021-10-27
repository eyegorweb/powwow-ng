<template>
  <div>
    <div class="row mb-3 add-new">
      <BlocList :items="address">
        <template slot="firstElement" slot-scope="{ className }">
          <div :class="`${className}`" @click="isAddress = true" v-if="!isAddress">
            <div class="add-new">
              <UiButton
                variant="round-button"
                @click="isAddress = true"
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
        <template slot-scope="{ item }" v-if="isAddress">
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
    <BottomBar no-next :can-prev="true" @prev="gotoPrev">
      <template #nextBtn>
        <button class="btn btn-primary" @click="saveQuery">Enregistrer</button>
      </template>
    </BottomBar>
  </div>
</template>

<script>
import BottomBar from './BottomBar.vue';
import BlocList from '@/components/BlocList';
import UiButton from '@/components/ui/Button';
import CreateOrderStepDeliveryAddress from '@/views/GetSim/CreateOrder/DeliveryStep/CreateOrderStepDeliveryAddress.vue';

export default {
  components: {
    BottomBar,
    BlocList,
    UiButton,
    CreateOrderStepDeliveryAddress,
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
      isAddress: false,
    };
  },

  methods: {
    addnewAddress() {
      console.log('add new address');
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
.add-new {
  display: flex;
  flex-direction: column;
  justify-content: center;
  margin: auto;
  &:hover {
    cursor: pointer;
  }
}
</style>
