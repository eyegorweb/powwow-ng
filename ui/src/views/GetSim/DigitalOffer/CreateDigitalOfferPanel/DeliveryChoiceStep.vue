<template>
  <CreateOrderStepContainer no-next-button @done="done" @prev="prev">
    <div class="step-container">
      <div class="deliveryContainer">
        <template>
          <div class="row mb-3 add-new">
            <h2 class="panel-title text-center mt-2">
              {{ $t('orders.choose-chronopost-tracking') }}
            </h2>
            <div class="toggles-container">
              <UiToggle :label="$t('orders.by-mail')" v-model="emailNotifAsked" />
            </div>
            <template v-if="emailNotifAsked">
              <div class="form-entry">
                <FormControl
                  label="common.email"
                  v-model="emailNotif"
                  :max-size="50"
                  :class="{ error: emailError }"
                  :required="true"
                />
                <span v-if="emailNotif && !isEmailValid(emailNotif)" class="error-text">
                  {{ $t('errors.password.email-error') }}
                </span>
              </div>
            </template>
          </div>
        </template>
        <template v-if="inEditMode">
          <CreateOrderDeliveryNewAddress
            v-if="inEditMode"
            @cancel="inEditMode = false"
            @saved="refreshList"
            :partner-id="partnerId"
            :address-edit="addressToEdit"
          />
        </template>
        <template v-if="!inEditMode">
          <div class="row mb-3 add-new">
            <h2 class="panel-title text-center mt-2">
              {{ $t('orders.new.deliveryStep.form.deliveryAddress') }}
            </h2>
            <div v-if="lastSelectedAdress" class>
              <div class="col-md-12">
                <h6>{{ $t('orders.new.deliveryStep.last') }}</h6>
                <CreateOrderStepDeliveryAddress
                  :item="lastSelectedAdress"
                  :default-selected-item="selectedAddress"
                  @update:defaultSelectedItem="selectAdress"
                  name="address"
                />
              </div>
            </div>
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
                <CreateOrderStepDeliveryAddress
                  :item="item"
                  :default-selected-item="selectedAddress"
                  @update:defaultSelectedItem="selectAdress"
                  @modify="editAddress"
                  can-edit
                  name="address"
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
import CreateOrderStepDeliveryAddress from '@/views/GetSim/CreateOrder/DeliveryStep/CreateOrderStepDeliveryAddress';
import CreateOrderDeliveryNewAddress from '@/views/GetSim/CreateOrder/DeliveryStep/CreateOrderDeliveryNewAddress'; // ui/src/views/GetSim/CreateOrder/DeliveryStep/CreateOrderDeliveryNewAddress.vue
import { fetchpartnerAddresses } from '@/api/partners';
import { mapGetters } from 'vuex';
import UiToggle from '@/components/ui/UiToggle';
import FormControl from '@/components/ui/FormControl';

export default {
  components: {
    CreateOrderStepContainer,
    BlocList,
    UiButton,
    CreateOrderStepDeliveryAddress,
    CreateOrderDeliveryNewAddress,
    UiToggle,
    FormControl,
  },

  props: {
    synthesis: {
      type: Object,
      required: true,
    },
  },

  mounted() {
    this.refreshList();
    if (!this.selectedAddress) {
      this.selectedAddress = this.lastSelectedAdress;
    }
  },

  data() {
    return {
      address: [],
      inEditMode: false,
      addressToEdit: undefined,
      selectedAddress: undefined,
      lastSelectedAdress: undefined,
      emailNotifAsked: false,
      emailNotif: undefined,
      emailError: undefined,
    };
  },

  computed: {
    ...mapGetters(['userInfos']),
    partnerId() {
      return this.userInfos.partners[0].id;
    },
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

    async refreshList(formId) {
      this.inEditMode = false;
      const data = await fetchpartnerAddresses(this.partnerId);
      if (data) {
        this.lastSelectedAdress = data.last;
        this.selectedAddress = this.lastSelectedAdress;
        this.address = data.all;
      }

      if (formId) {
        this.selectedAddress = this.address.find((f) => f.id === formId);
      }
    },

    selectAdress(a) {
      this.selectedAddress = a;
    },

    getSynthesis() {
      return {
        deliveryStep: {
          ...this.selectedAddress,
          emailNotifAsked: this.emailNotifAsked,
          emailNotif: this.emailNotif,
        },
      };
    },
    done() {
      this.$emit('done', this.getSynthesis());
    },
    prev() {
      this.$emit('prev', this.getSynthesis());
    },
    isEmailValid(email) {
      var re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
      return re.test(email);
    },
  },

  watch: {
    selectedAddress(newAddress) {
      this.steps = {
        ...this.steps,
        deliveryStep: {
          ...newAddress,
          emailNotifAsked: this.emailNotifAsked,
          emailNotif: this.emailNotif,
        },
      };
      this.$emit('done', this.getSynthesis());
    },
    emailNotifAsked(isAsked) {
      if (isAsked) {
        this.emailNotif = this.userInfos.email;
        this.isEmailValid(this.emailNotif)
          ? this.$emit('validated:deliveryChoiceStep', true)
          : this.$emit('validated:deliveryChoiceStep', false);
      } else {
        this.$emit('validated:deliveryChoiceStep', true);
      }
      this.$emit('done', this.getSynthesis());
    },
    emailNotif() {
      if (this.emailNotifAsked) {
        this.isEmailValid(this.emailNotif)
          ? this.$emit('validated:deliveryChoiceStep', true)
          : this.$emit('validated:deliveryChoiceStep', false);
      } else {
        this.$emit('validated:deliveryChoiceStep', true);
      }
      this.$emit('done', this.getSynthesis());
    },
  },
};
</script>

<style lang="scss" scoped>
.toggle {
  padding: 0 0rem;
}
.deliveryContainer {
  width: 70%;
  margin: 0 auto;
}

.list-container .box {
  @media only screen and (max-width: 700px) {
    width: 100%;
  }
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
