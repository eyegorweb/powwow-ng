<template>
  <div class="get-sim-product">
    <div class="panel-vertical-container">
      <div class="main-content step-content">
        <div v-if="filteredSimTypes && filteredSimTypes.length > 0">
          <h3 class="font-weight-light text-center mt-4 mb-4">{{ $t('getsim.step-product') }}</h3>
          <div class="choose-sim-type">
            <form>
              <GetSimTypeOption
                v-for="item in filteredSimTypes"
                :key="item.id"
                :item="item"
                :default-selected-item.sync="selectedSimTypeValue"
                :is-active="
                  selectedSimTypeValue &&
                    selectedSimTypeValue.simCard &&
                    selectedSimTypeValue.simCard.id === item.simCard.id
                "
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
            <h2 class="panel-title">{{ $t('getsim.choose-sim-amount') }}</h2>
            <UiInput
              :placeholder="1"
              v-model="selectedNumberOfSims"
              value
              class="d-block w-50 mx-auto"
              input-type="number"
              :min-value="1"
            />
          </div>
        </div>
        <div v-else>
          <h3 class="font-weight-light text-center mt-4 mb-4">{{ $t('getsim.no-sim-card') }}</h3>
        </div>
      </div>
      <div class="footer-back">
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
              :disabled="!canGoToNextStep"
              class="float-right ic-Arrow-Next-Icon"
            />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import GetSimTypeOption from './GetSimTypeOption';
import UiInput from '@/components/ui/UiInput';
import UiButton from '@/components/ui/Button';
import { fetchSim } from '@/api/products';
import get from 'lodash.get';

export default {
  name: 'CreateOrderStepProduct',
  data() {
    return {
      simTypes: [],
      selectedSimTypeValue: {},
      selectedNumberOfSims: 0,
      limit: 3,
      allSimTypesVisible: false,
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
    if (!get(this.synthesis, 'quantity.selection.quantity') && this.order) {
      this.preFill();
    }
    this.simTypes = await fetchSim(get(this.synthesis, 'billingAccount.value.partnerId'));
    this.selectedNumberOfSims = get(this.synthesis, 'quantity.selection.quantity', 0);
    /**
     * si on est dans une duplication alors on cherche la carte sim à séléctionner depuis this.simTypes
     * on ne peut pas construire cet objet directement depuis this.order
     */
    const selectedProductInSynthesis = get(this.synthesis, 'product.selection.product', {});
    if (!selectedProductInSynthesis.simCard && get(this.order, 'orderedSimcard.code')) {
      this.selectedSimTypeValue = this.simTypes.find(
        s => s.simCard.code === get(this.order, 'orderedSimcard.code')
      );
    } else {
      this.selectedSimTypeValue = selectedProductInSynthesis;
    }
  },

  methods: {
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

      return {
        quantity: {
          label: 'common.quantity',
          value: {
            id: 'quantity',
            content: this.selectedNumberOfSims,
          },
          selection: {
            quantity: this.selectedNumberOfSims,
          },
        },

        product: {
          label: 'common.product',
          value: {
            id: get(this.selectedSimTypeValue, 'simCard.id'),
            content: [get(this.selectedSimTypeValue, 'simCard.name')],
          },
          selection: {
            product: this.selectedSimTypeValue,
          },
        },
      };
    },
    preFill() {
      this.$emit('saveSynthesis', {
        quantity: {
          label: 'common.quantity',
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
        return this.simTypes.slice(0, this.limit);
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
    UiButton,
  },
};
</script>

<style lang="scss">
.get-sim-product {
  padding-left: 30px !important;
  padding-right: 30px !important;
  .choose-sim-type {
    max-height: 400px;
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
}

.choose-amount {
  .panel-title {
    margin-top: 1.5rem;
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

@media screen and (max-height: 768px) {
  .panel-vertical-container {
    div.step-content {
      max-height: 87vh;
      min-height: 75vh !important;
    }
  }
}
@media screen and (min-height: 769px) {
  .panel-vertical-container {
    div.step-content {
      min-height: 75vh;
      max-height: 87vh;
    }
  }
}
</style>
