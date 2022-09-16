<template>
  <div class="step-container">
    <div class="simContainer">
      <h2 class="font-weight-light text-center mt-4 mb-4">{{ $t('getsim.step-product') }}</h2>
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
            :is-alone="filteredSimTypes.length === 1"
            last-action-key="getsim.sim-type-labels.orderDate"
            no-action-key="getsim.never-ordered"
          />
        </form>
        <div class="text-right">
          <a
            v-if="!allSimTypesVisible && limit > 3"
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
        <div v-if="hasDiscounts" class="mt-3">
          <div class="alert alert-success">
            {{
              $t('digitalOffer.simStep.displayDiscount', {
                nbSimDiscount: discounts.simDiscount,
                nbRemainingSim: discounts.remainingSim,
              })
            }}
          </div>
          <div v-if="limitDiscounts" class="alert alert-warning">
            {{
              $t('digitalOffer.simStep.warningDiscount', {
                nbRemainingSim: discounts.remainingSim,
              })
            }}
          </div>
        </div>
      </div>
    </div>
    <BottomBar @next="gotoNext" @prev="gotoPrev" :can-prev="true" :can-next="canNext" />
  </div>
</template>

<script>
import BottomBar from './BottomBar.vue';
import GetSimTypeOption from '@/views/GetSim/CreateOrder/GetSimTypeOption.vue';
import UiInput from '@/components/ui/UiInput';
import { fetchSimTypes } from '@/api/digital.js';

export default {
  components: {
    BottomBar,
    GetSimTypeOption,
    UiInput,
  },
  props: {
    synthesis: Object,
  },
  data() {
    return {
      simTypes: [],
      limit: 3,
      selectedSimTypeValue: {},
      selectedNumberOfSims: 0,
      allSimTypesVisible: false,
      selectedSimIsOfTapeType: false,
      maxValue: 9999999999,
    };
  },

  async mounted() {
    if (!this.synthesis) {
      this.$router.push({ name: 'createAccount.partner' });
    }
    this.simTypes = await fetchSimTypes();
    if (this.simTypes.length) {
      this.selectedSimTypeValue = this.simTypes[0];
    }
  },

  computed: {
    filteredSimTypes() {
      return this.simTypes.slice(0, this.limit).filter((s) => !!s.simCard);
    },
    canNext() {
      return !!(
        this.selectedSimTypeValue &&
        this.selectedSimTypeValue.simCard &&
        parseInt(this.selectedNumberOfSims) &&
        parseInt(this.selectedNumberOfSims) <= this.maxValue &&
        parseInt(this.selectedNumberOfSims) > 0
      );
    },
    hasDiscounts() {
      return (
        this.synthesis.offerStep.discounts &&
        !!this.synthesis.offerStep.discounts.find((d) => d.step === 'ORDER')
      );
    },
    discounts() {
      if (this.hasDiscounts) {
        return this.synthesis.offerStep.discounts.find((d) => d.step === 'ORDER');
      }
      return undefined;
    },
    limitDiscounts() {
      if (this.hasDiscounts) {
        return !!(this.selectedNumberOfSims > this.discounts.remainingSim);
      }
      return undefined;
    },
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
    gotoPrev() {
      this.$router.push({
        name: 'createAccount.offer',
      });
    },
    gotoNext() {
      this.$router.push({
        name: 'createAccount.delivery',
        params: {
          step: {
            simStep: {
              selectedSimTypeValue: this.selectedSimTypeValue,
              selectedNumberOfSims: this.selectedNumberOfSims,
              discounts: this.discounts,
            },
          },
        },
      });
    },
  },
};
</script>

<style lang="scss">
.simContainer {
  width: 70%;
  margin: 0 auto;
  @media screen and (max-width: 900px) {
    width: 100%;
  }
}
.choose-amount {
  .cmp-ui-input input {
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
