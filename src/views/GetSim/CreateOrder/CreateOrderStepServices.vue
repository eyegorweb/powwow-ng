<template>
  <div class="get-sim-services" :style="{ paddingLeft: 55 + 'px', paddingRight: 55 + 'px' }">
    <div class="panel-vertical-container">
      <div class="main-content">
        <div>
          <h2 class="title">{{ $t('orders.choose-services') }}</h2>
        </div>
        <div class="toggles-container">
          <UiToggle label="Préactivation" v-model="preActivation" />
          <UiToggle label="Activation" v-model="activation" />
        </div>
        <div v-if="activation">
          <div class="row justify-content-center">
            <UiSelect class="form-offers w-75 mt-4" :class="selectedOffer ? '' : 'disabled'" v-model="selectedOffer" :placeholder="$t('orders.select-offer-placeholder')" :options="offers" :arrow-blue="true" />
          </div>
          <div>
            <h2 class="title">{{ $t('orders.personalize-services') }}</h2>
          </div>
          <div class="toggles-container">
            <UiToggle label="Itinérance" />
            <UiToggle label="N° data CSD" default-state="disabled" />
          </div>
          <div class="toggles-container">
            <UiToggle label="Data CSD sortante" default-state="disabled" />
            <UiToggle label="Data CSD entrante" default-state="disabled" />
          </div>
          <div class="toggles-container">
            <UiToggle label="SMS sortant" checked />
            <UiToggle label="SMS entrant" default-state="disabled" />
          </div>
          <div class="toggles-container">
            <UiToggle label="Voix sortante" default-state="disabled" />
            <UiToggle label="Voix entrante" default-state="disabled" />
          </div>
          <div class="toggles-container">
            <UiToggle label="Data" default-state="enabled" />
            <div class="select-container">
              <p>APN :</p>
              <UiSelect class="form-offers" :class="selectedOffer ? '' : 'disabled'" v-model="selectedApn" :options="apn" :number-of-visible-items="3" />
            </div>
          </div>
        </div>
      </div>
      <div class="footer-bock">
        <div class="row">
          <div class="col-md-12 mt-5">
            <UiButton
              variant="round-button"
              @click="prev"
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
    </div>


  </div>
</template>

<script>
import UiButton from '@/components/ui/Button';
import UiToggle from '@/components/ui/UiToggle';
import UiSelect from '@/components/ui/UiSelect';
import get from 'lodash.get';

export default {
  name: 'CreateOrderStepServices',
  props: {
    offers: {
      type: Array,
      required: true,
    },
    apn: {
      type: Array,
      required: true,
    },
    synthesis: {
      type: Object,
      required: true,
    },
  },
  data() {
    return {
      selectedOffer: null,
      selectedApn: this.apn[0],
      activation: false,
      preActivation: false,
    };
  },
  created() {
    this.activation = get(this.synthesis, 'services.selection.activation', false);
    this.preActivation = get(this.synthesis, 'services.selection.preActivation', false);
  },
  methods: {
    done() {
      this.$emit('done', this.assembleSynthesis());
    },
    prev() {
      this.$emit('prev', this.assembleSynthesis());
    },
    assembleSynthesis() {
      return {
        services: {
          label: 'common.services',
          value: {
            id: 'comon.services',
            content: [
              `Activation: ${this.activation ? 'Oui' : 'Non'}`,
              `Préactivation: ${this.preActivation ? 'Oui' : 'Non'}`,
            ],
            activation: this.activation,
            preActivation: this.preActivation,
          },
          selection: {
            activation: !!this.activation,
            preActivation: !!this.preActivation,
          },
        },
      };
    },
  },
  components: {
    UiButton,
    UiToggle,
    UiSelect,
  },
};
</script>

<style lang="scss" scoped>
.get-sim-services {
  .title {
    background-color: transparent;
    color: $dark-gray;
    font-weight: 300;
    font-size: 2rem;
    margin: 50px 0 30px;
    padding: 0;
    text-align: center;
  }

  .toggles-container {
    flex-grow: 1;
    display: flex;
    flex-flow: row nowrap;
    justify-content: space-between;
    align-items: flex-start;
    margin-bottom: 24px;

    .toggle {
      flex-grow: 1;
    }
  }

  .form-offers {
    color: $dark-gray;

    &.disabled {
      color: $gray-680;
    }
  }

  select {
    height: 56px;
  }

  .select-container {
    max-width: 220px;
    display: flex;
    flex-flow: row wrap;
    justify-content: space-between;
    flex-grow: 1;

    p {
      color: $dark-gray;
      font-size: 14px;
      margin: 0;
    }

    select {
      align-self: flex-end;
      background: none;
      background-color: transparent;
      font-size: 14px;
      max-height: 50px;
      max-width: 180px;
      overflow-y: auto;
    }
  }
}
</style>
