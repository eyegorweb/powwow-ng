<template>
  <div class="step-container">
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
            <div :class="`${className}`" @click="(inEditMode = true), (addressToEdit = undefined)">
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
import CreateAccountDeliveryAddress from './CreateAccountDeliveryAddress.vue';
import NewDeliveryAddress from './NewDeliveryAddressStep.vue';

export default {
  components: {
    BottomBar,
    BlocList,
    UiButton,
    CreateAccountDeliveryAddress,
    NewDeliveryAddress,
  },
  props: {
    synthesis: Object,
  },

  mounted() {
    if (!this.synthesis) {
      this.$router.push({ name: 'createAccount.partner' });
    }
    this.refreshList();
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
    addNewAddress(form) {
      this.inEditMode = false;
      this.address.push(form);
      this.selectedAddress = form;
      this.steps = { ...this.steps, deliveryStep: form };
    },

    editAddress(item) {
      this.inEditMode = true;
      this.addressToEdit = item;
    },

    refreshList(form) {
      this.inEditMode = false;
      if (form && form.id) {
        const addressIndex = this.address.findIndex((f) => f.id === form.id);
        this.address.splice(addressIndex, 1, form);
        this.selectedAddress = form;

        this.steps = { ...this.steps, deliveryStep: form };
      }
    },

    gotoPrev() {
      this.$router.push({
        name: 'createAccount.simChoice',
      });
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
