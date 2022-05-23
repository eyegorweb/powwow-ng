<template>
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
        <NewDeliveryAddress
          @cancel="(inEditMode = false), (addressToEdit = undefined)"
          @saved="refreshList"
          @add="addNewAddress"
          :address-edit="addressToEdit"
        />
      </template>
      <template v-if="!inEditMode">
        <div class="row mb-3 add-new">
          <h2 class="panel-title text-center mt-2">
            {{ $t('orders.new.deliveryStep.form.deliveryAddress') }}
          </h2>
          <BlocList :items="address">
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
    <BottomBar no-next :can-prev="true" @prev="gotoPrev" />
  </div>
</template>

<script>
import BottomBar from './BottomBar.vue';
import BlocList from '@/components/BlocList';
import CreateAccountDeliveryAddress from './CreateAccountDeliveryAddress.vue';
import NewDeliveryAddress from './NewDeliveryAddressStep.vue';
import UiToggle from '@/components/ui/UiToggle';
import FormControl from '@/components/ui/FormControl';

export default {
  components: {
    BottomBar,
    BlocList,
    CreateAccountDeliveryAddress,
    NewDeliveryAddress,
    UiToggle,
    FormControl,
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
      lastSelectedAdress: undefined,
      emailNotifAsked: false,
      emailNotif: undefined,
      emailError: undefined,
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
    },

    editAddress(item) {
      this.inEditMode = true;
      this.addressToEdit = item;
    },

    refreshList(form) {
      this.inEditMode = false;
      if (this.synthesis.creationAccountStep && !form) {
        this.lastSelectedAdress = this.synthesis.creationAccountStep;
        this.selectedAddress = this.lastSelectedAdress;
      }
      if (form && form.id) {
        const addressIndex = this.address.findIndex((f) => f.id === form.id);
        this.address.splice(addressIndex, 1, form);
        this.lastSelectedAdress = undefined;
        this.selectedAddress = form;
      }
    },

    selectAdress(a) {
      this.selectedAddress = a;
    },

    gotoPrev() {
      this.$router.push({
        name: 'createAccount.simChoice',
      });
    },
    isEmailValid(email) {
      var re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
      return re.test(email);
    },
    refreshSteps() {
      this.steps = {
        ...this.steps,
        deliveryStep: {
          ...this.steps.deliveryStep,
          emailNotifAsked: this.emailNotifAsked,
          emailNotif: this.emailNotif,
        },
      };
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
    },
    emailNotifAsked(isAsked) {
      if (isAsked) {
        this.emailNotif = this.synthesis.creationAccountStep.email;
        this.refreshSteps();
        this.isEmailValid(this.emailNotif)
          ? this.$emit('validated:deliveryStep', true)
          : this.$emit('validated:deliveryStep', false);
      } else {
        this.refreshSteps();
        this.$emit('validated:deliveryStep', true);
      }
    },
    emailNotif() {
      this.refreshSteps();
      if (this.emailNotifAsked) {
        this.isEmailValid(this.emailNotif)
          ? this.$emit('validated:deliveryStep', true)
          : this.$emit('validated:deliveryStep', false);
      } else {
        this.$emit('validated:deliveryStep', true);
      }
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
  @media screen and (max-width: 900px) {
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
