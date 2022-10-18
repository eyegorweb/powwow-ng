<template>
  <CreateOrderStepContainer @done="done" @prev="prev" :can-go-to-next-step="!!canGoToNextStep">
    <div class="main-content2">
      <div v-if="filteredSimTypes && filteredSimTypes.length > 0">
        <h3 class="font-weight-light text-center mt-4 mb-4">{{ $t('getsim.step-product') }}</h3>
        <div class="productChoices">
          <form>
            <GetSimTypeOption
              @update:defaultSelectedItem="checkForCurrentSimType"
              v-for="item in filteredSimTypes"
              :key="item.id"
              :item="item"
              :default-selected-item.sync="selectedSimTypeValue"
              :is-active="
                selectedSimTypeValue &&
                  selectedSimTypeValue.simCard &&
                  selectedSimTypeValue.simCard.id === item.simCard.id
              "
              last-action-key="getsim.reservations.lastReservation"
              no-action-key="getsim.reservations.noReservation"
            />
          </form>
          <div class="text-right">
            <a
              v-if="!allSimTypesVisible"
              href="#"
              @click.prevent="showAllSimTypes"
              class="show-all-types text-right"
            >
              {{ $t('getsim.show-all-sim-types') }}
              <i class="arrow ic-Arrow-Down-Icon" />
            </a>
          </div>
        </div>
        <div class="choose-amount">
          <h2 v-if="selectedSimIsOfTapeType" class="panel-title">
            {{ $t('getsim.choose-sim-amount-for-tape-type') }}
          </h2>
          <h2 v-else class="panel-title">{{ $t('getsim.choose-sim-amount') }}</h2>
          <UiInput
            :placeholder="null"
            v-model="selectedNumberOfSims"
            value
            class="d-block w-50 mx-auto"
            input-type="number"
            :min-value="0"
          />
          <p v-if="selectedSimIsOfTapeType" class="text-center display-nb-bobines">
            {{ $t('getsim.nb-of-sim') }}:
            {{ selectedNumberOfSims * selectedSimTypeValue.simCard.number }}
          </p>
        </div>
      </div>
      <div v-else>
        <h3 class="font-weight-light text-center mt-4 mb-4">{{ $t('getsim.no-sim-card') }}</h3>
      </div>
    </div>
  </CreateOrderStepContainer>
</template>

<script>
import CreateOrderStepContainer from '@/views/GetSim/CreateOrder/CreateOrderStepContainer.vue';
import GetSimTypeOption from '@/views/GetSim/CreateOrder/GetSimTypeOption.vue';
import { fetchSim } from '@/api/products';
import UiInput from '@/components/ui/UiInput';

export default {
  components: {
    CreateOrderStepContainer,
    GetSimTypeOption,
    UiInput,
  },

  props: {
    synthesis: {
      type: Object,
      required: true,
    },
    reservation: Object,
  },

  data() {
    return {
      simTypes: [],
      selectedSimTypeValue: {},
      selectedNumberOfSims: 0,
      limit: 3,
      allSimTypesVisible: false,
      selectedSimIsOfTapeType: false,
    };
  },

  computed: {
    canGoToNextStep() {
      return !!this.$loGet(this.selectedSimTypeValue, 'simCard') && this.selectedNumberOfSims > 0;
    },
    filteredSimTypes: {
      get() {
        return this.simTypes.slice(0, this.limit).filter((s) => !!s.simCard);
      },
      set(newVal) {
        return newVal;
      },
    },
  },

  async mounted() {
    this.simTypes = await fetchSim(
      this.$loGet(this.synthesis, 'stepClient.billingAccount.data.party.id'),
      undefined,
      { eq: 'ESIM' },
      false
    );

    this.preFill();
  },

  methods: {
    checkForCurrentSimType(simInfos) {
      simInfos.simCard.type === 'TAPE'
        ? (this.selectedSimIsOfTapeType = true)
        : (this.selectedSimIsOfTapeType = false);
    },
    showAllSimTypes() {
      this.limit = this.simTypes.length;
      this.allSimTypesVisible = true;
    },
    preFill() {
      if (this.synthesis && this.synthesis.stepProduct) {
        if (this.synthesis.stepProduct.simCard) {
          this.selectedSimTypeValue = this.synthesis.stepProduct.selectedSimTypeValue;
          this.selectedNumberOfSims = this.synthesis.stepProduct.quantity;
          this.selectedSimIsOfTapeType = this.synthesis.stepProduct.selectedSimIsOfTapeType;
        }
      }
    },
    getSynthesis() {
      return {
        stepProduct: {
          selectedSimTypeValue: this.selectedSimTypeValue,
          simCard: this.selectedSimTypeValue.simCard,
          quantity: this.selectedNumberOfSims,
          selectedSimIsOfTapeType: this.selectedSimIsOfTapeType,
        },
      };
    },
    done() {
      if (this.selectedSimTypeValue) {
        this.$emit('done', this.getSynthesis());
      }
    },
    prev() {
      if (this.selectedSimTypeValue) {
        this.$emit('prev', this.getSynthesis());
      }
    },
  },
};
</script>

<style lang="scss">
.productChoices {
  // max-height: 400px;
  max-height: 21rem;
  overflow-y: auto;

  @media screen and (max-height: 900px) {
    max-height: 350px;
  }
}

.show-all-types {
  color: $secondary;
  font-weight: 600;
  font-size: 0.9rem;
  appearance: none;
  padding: 0;
  margin: 0;
  border: none;
  background-color: transparent;

  &:hover {
    text-decoration: none;
  }

  i {
    font-size: 1rem;
  }
}

.display-nb-bobines {
  font-size: 1.2rem;
  font-weight: 600;
}

.choose-amount {
  .panel-title {
    margin: 1.5rem 0 0.5rem;
    @media screen and (max-height: 900px) {
      margin: 0.4rem auto;
    }
  }

  label input {
    color: black;
    font-size: 2rem;
    font-weight: 600;
    text-align: center;

    @media screen and (max-height: 900px) {
      padding: 0;
    }

    &::placeholder {
      color: black;
    }
  }
}
</style>
