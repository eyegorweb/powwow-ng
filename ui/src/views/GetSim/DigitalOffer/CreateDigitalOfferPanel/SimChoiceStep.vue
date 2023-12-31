<template>
  <CreateOrderStepContainer @done="done" @prev="prev" :can-go-to-next-step="!!canGoToNextStep">
    <div class="step-container">
      <div class="simContainer">
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
        <div v-if="hasDiscounts && !limitDiscounts" class="mt-3">
          <div class="alert alert-success">
            {{
              $t('digitalOffer.simStep.displayDiscount', {
                nbRemainingSim: discounts.remainingSim,
              })
            }}
          </div>
        </div>
        <div v-if="limitDiscounts" class="mt-3">
          <div class="alert alert-warning">
            {{
              $t('digitalOffer.simStep.warningDiscount', {
                nbRemainingSim: discounts.remainingSim,
              })
            }}
          </div>
        </div>
      </div>
    </div>
  </CreateOrderStepContainer>
</template>

<script>
import CreateOrderStepContainer from '@/views/GetSim/CreateOrder/CreateOrderStepContainer.vue';
import GetSimTypeOption from '@/views/GetSim/CreateOrder/GetSimTypeOption.vue';
import UiInput from '@/components/ui/UiInput';
import { fetchSimTypesWhithParty } from '@/api/digital.js';
import { mapGetters } from 'vuex';

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
  },
  async mounted() {
    this.simTypes = await fetchSimTypesWhithParty(this.partnerId);
    this.preFill();
  },
  data() {
    return {
      simTypes: [],
      limit: 3,
      selectedSimTypeValue: {},
      selectedNumberOfSims: 0,
      allSimTypesVisible: false,
      selectedSimIsOfTapeType: false,
    };
  },
  computed: {
    filteredSimTypes() {
      return this.simTypes.slice(0, this.limit).filter((s) => !!s.simCard);
    },
    canGoToNextStep() {
      return !!(
        this.selectedSimTypeValue &&
        this.selectedSimTypeValue.simCard &&
        parseInt(this.selectedNumberOfSims) &&
        parseInt(this.selectedNumberOfSims) < 9999999999 &&
        parseInt(this.selectedNumberOfSims) > 0
      );
    },
    ...mapGetters(['userInfos']),
    partnerId() {
      return this.userInfos.partners[0].id;
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
    preFill() {
      if (this.synthesis && this.synthesis.simStep) {
        this.selectedSimTypeValue = this.synthesis.simStep.selectedSimTypeValue;
        this.selectedNumberOfSims = this.synthesis.simStep.selectedNumberOfSims;
      } else {
        if (this.simTypes.length) {
          this.selectedSimTypeValue = this.simTypes[0];
        }
      }
    },
    checkForCurrentSimType(simInfos) {
      simInfos.simCard.type === 'TAPE'
        ? (this.selectedSimIsOfTapeType = true)
        : (this.selectedSimIsOfTapeType = false);
    },
    showAllSimTypes() {
      this.limit = this.simTypes.length;
      this.allSimTypesVisible = true;
    },
    getSynthesis() {
      return {
        simStep: {
          selectedSimTypeValue: this.selectedSimTypeValue,
          selectedNumberOfSims: this.selectedNumberOfSims,
          discounts: this.discounts,
        },
      };
    },
    done() {
      if (this.canGoToNextStep) {
        this.$emit('done', this.getSynthesis());
      }
    },
    prev() {
      this.$emit('prev', {
        offerStep: this.synthesis.offerStep,
      });
    },
  },
};
</script>

<style lang="scss" scoped></style>
