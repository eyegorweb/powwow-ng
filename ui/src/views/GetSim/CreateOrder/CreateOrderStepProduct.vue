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
              :key="item.simCard.id"
              :is-alone="filteredSimTypes.length === 1"
              :item="item"
              :default-selected-item.sync="selectedSimTypeValue"
              :is-active="
                selectedSimTypeValue &&
                  selectedSimTypeValue.simCard &&
                  selectedSimTypeValue.simCard.id === item.simCard.id
              "
              last-action-key="getsim.sim-type-labels.orderDate"
              no-action-key="getsim.never-ordered"
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
import GetSimTypeOption from './GetSimTypeOption';
import UiInput from '@/components/ui/UiInput';
import { fetchSim } from '@/api/products';
import CreateOrderStepContainer from './CreateOrderStepContainer';

export default {
  name: 'CreateOrderStepProduct',
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

  props: {
    synthesis: {
      type: Object,
      required: true,
    },
    order: Object,
  },

  async mounted() {
    // gère le retour en arrière dans la commande
    if (this.synthesis.product) {
      this.synthesis.product.selection.product.simCard.type === 'TAPE'
        ? (this.selectedSimIsOfTapeType = true)
        : (this.selectedSimIsOfTapeType = false);
    }

    if (!this.$loGet(this.synthesis, 'quantity.selection.quantity') && this.order) {
      this.preFill();
    }
    this.simTypes = await fetchSim(
      this.$loGet(this.synthesis, 'billingAccount.value.partnerId'),
      undefined,
      undefined,
      false
    );
    this.selectedNumberOfSims = this.$loGet(this.synthesis, 'quantity.selection.quantity', 0);
    /**
     * si on est dans une duplication alors on cherche la carte sim à séléctionner depuis this.simTypes
     * on ne peut pas construire cet objet directement depuis this.order
     */
    const selectedProductInSynthesis = this.$loGet(this.synthesis, 'product.selection.product', {});
    if (!selectedProductInSynthesis.simCard && this.$loGet(this.order, 'orderedSIMCard.code')) {
      this.selectedSimTypeValue = this.simTypes.find(
        (s) => s.simCard.code === this.$loGet(this.order, 'orderedSIMCard.code')
      );
    } else {
      this.selectedSimTypeValue = selectedProductInSynthesis;
    }

    if (
      this.selectedSimTypeValue &&
      this.selectedSimTypeValue.simCard &&
      this.selectedSimTypeValue.simCard.type === 'TAPE' &&
      this.order
    ) {
      this.selectedSimIsOfTapeType = true;
      this.selectedNumberOfSims =
        this.selectedNumberOfSims / this.selectedSimTypeValue.simCard.number;
    }
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
    done() {
      this.$emit('done', this.assembleSynthesis());
    },
    prev() {
      this.$emit('prev', this.assembleSynthesis());
    },
    assembleSynthesis() {
      if (!this.canGoToNextStep) return {};

      let quantity = this.selectedNumberOfSims;
      let totalNbOfSims = this.selectedNumberOfSims * this.selectedSimTypeValue.simCard.number;

      if (this.selectedSimIsOfTapeType) {
        return {
          tapes: {
            label: 'getsim.nb-of-tapes',
            value: {
              id: 'tapes',
              content: quantity,
            },
            selection: {
              tapes: this.selectedSimTypeValue.simCard.number,
            },
          },

          quantity: {
            label: 'getsim.nb-of-sim',
            value: {
              id: 'quantity',
              content: totalNbOfSims,
            },
            selection: {
              quantity,
            },
          },

          product: {
            label: 'common.product',
            value: {
              id: this.$loGet(this.selectedSimTypeValue, 'simCard.id'),
              content: [this.$loGet(this.selectedSimTypeValue, 'simCard.name')],
            },
            selection: {
              product: this.selectedSimTypeValue,
            },
          },
        };
      } else {
        return {
          tapes: undefined,
          quantity: {
            label: 'getsim.nb-of-sim',
            value: {
              id: 'quantity',
              content: quantity,
            },
            selection: {
              quantity,
            },
          },

          product: {
            label: 'common.product',
            value: {
              id: this.$loGet(this.selectedSimTypeValue, 'simCard.id'),
              content: [this.$loGet(this.selectedSimTypeValue, 'simCard.name')],
            },
            selection: {
              product: this.selectedSimTypeValue,
            },
          },
        };
      }
    },
    preFill() {
      this.$emit('saveSynthesis', {
        quantity: {
          label: 'getsim.nb-of-sim',
          value: {
            id: 'quantity',
            content: this.order.quantity,
          },
          selection: {
            quantity: this.order.quantity,
          },
        },
      });
    },
  },
  computed: {
    filteredSimTypes: {
      get() {
        return this.simTypes.slice(0, this.limit).filter((s) => !!s.simCard);
      },
      set(newVal) {
        return newVal;
      },
    },
    canGoToNextStep() {
      return (
        this.selectedSimTypeValue &&
        this.selectedSimTypeValue.simCard &&
        this.selectedSimTypeValue.simCard.id &&
        this.selectedNumberOfSims > 0
      );
    },
  },
  components: {
    GetSimTypeOption,
    UiInput,
    CreateOrderStepContainer,
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
