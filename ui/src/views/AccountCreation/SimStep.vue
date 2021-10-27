<template>
  <div>
    <div>
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
          :min-value="1"
        />
        <p v-if="selectedSimIsOfTapeType" class="text-center display-nb-bobines">
          {{ $t('getsim.nb-of-sim') }}:
          {{ selectedNumberOfSims * selectedSimTypeValue.simCard.number }}
        </p>
      </div>
    </div>
    <BottomBar @next="gotoNext" @prev="gotoPrev" :can-prev="true" :can-next="canNext" />
  </div>
</template>

<script>
import BottomBar from './BottomBar.vue';
import GetSimTypeOption from '@/views/GetSim/CreateOrder/GetSimTypeOption.vue';
import UiInput from '@/components/ui/UiInput';

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
      simTypes: [
        {
          orderDate: null,
          simCard: {
            id: 76,
            code: '3526350029494',
            name: 'M2M sim avec code pin',
            format: null,
            licence: null,
            type: 'SIM',
            number: null,
            family: null,
          },
          disabled: null,
        },
        {
          orderDate: null,
          simCard: {
            id: 78,
            code: '3526350037871',
            name: 'M2M sim antivol avec code pin bobine',
            format: null,
            licence: null,
            type: 'TAPE',
            number: 100,
            family: null,
          },
          disabled: null,
        },
        {
          orderDate: null,
          simCard: {
            id: 79,
            code: '3526350037888',
            name: 'M2M sim antivol sans code pin',
            format: null,
            licence: null,
            type: 'TAPE',
            number: 150,
            family: null,
          },
          disabled: null,
        },
        {
          orderDate: null,
          simCard: {
            id: 77,
            code: '3526350037765',
            name: 'M2M sim sans code pin',
            format: null,
            licence: null,
            type: 'SIM',
            number: null,
            family: null,
          },
          disabled: null,
        },
      ],
      limit: 3,
      selectedSimTypeValue: {},
      selectedNumberOfSims: 0,
      allSimTypesVisible: false,
      selectedSimIsOfTapeType: false,
    };
  },
  mounted() {
    if (!this.synthesis) {
      this.$router.push({ name: 'createAccount.partner' });
    }
  },
  computed: {
    filteredSimTypes() {
      return this.simTypes.slice(0, this.limit).filter((s) => !!s.simCard);
    },
    canNext() {
      return !!this.selectedSimTypeValue && !!parseInt(this.selectedNumberOfSims);
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
            },
          },
        },
      });
    },
  },
};
</script>

<style lang="scss" scoped></style>
