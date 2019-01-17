<template>
  <div class="GetSimSelectSimType">
    <h2 class="title">{{ $t("getsim.manage-orders") }}</h2>
    <div class="choose-sim-type">
      <form>
        <GetSimTypeOption
          v-for="item in filteredSimTypes"
          :key="item.id"
          :item="item"
          :default-selected-item.sync="selectedSimTypeValue"
          :is-active="selectedSimTypeValue.name === item.name"
        />
      </form>
      <div class="text-right">
        <a
          v-if="!allSimTypesVisible"
          href="#"
          @click.prevent="showAllSimTypes"
          class="show-all-types text-right"
        >
          {{ $t("getsim.show-all-sim-types") }}
          <i class="arrow ic-Arrow-Down-Icon" />
        </a>
      </div>
    </div>
    <div class="choose-amount">
      <h2 class="title mt-4">{{ $t("getsim.choose-sim-amount") }}</h2>
      <UiInput
        :placeholder="1"
        v-model="selectedNumberOfSims"
        value
        class="d-block w-50 mx-auto"
        input-type="number"
        :min-value="1"
      />
    </div>

    <div class="row">
      <div class="col-md-12 mt-5">
        <UiCircularButton class="float-left" @click="$emit('prev')">
          <span slot="icon" class="ic-Arrow-Previous-Icon" />
        </UiCircularButton>
        <UiCircularButton class="float-right" @click="done" :disabled="!canGoToNextStep">
          <span slot="icon" class="ic-Arrow-Next-Icon" />
        </UiCircularButton>
      </div>
    </div>
  </div>
</template>

<script>
import GetSimTypeOption from './GetSimTypeOption';
import UiInput from '@/components/ui/UiInput';
import UiCircularButton from '@/components/ui/UiCircularButton';
import { fetchSim } from '@/api/products';

export default {
  name: 'GetSimSelectSimType',
  data() {
    return {
      simTypes: [],
      selectedSimTypeValue: {},
      selectedNumberOfSims: 0,
      limit: 3,
      allSimTypesVisible: false,
    };
  },

  async created() {
    this.simTypes = await fetchSim();
  },

  methods: {
    showAllSimTypes() {
      this.limit = this.simTypes.length;
      this.allSimTypesVisible = true;
    },
    done() {
      this.$emit('done', {
        quantity: {
          label: 'common.quantity',
          value: {
            id: 'quantity',
            content: this.selectedNumberOfSims,
          },
        },

        product: {
          label: 'common.product',
          value: {
            id: this.selectedSimTypeValue.id,
            content: [
              this.selectedSimTypeValue.name,
              this.selectedSimTypeValue.format,
              this.selectedSimTypeValue.patent,
            ],
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
      return this.selectedSimTypeValue.name && this.selectedNumberOfSims > 0;
    },
  },

  components: {
    GetSimTypeOption,
    UiInput,
    UiCircularButton,
  },
};
</script>

<style lang="scss">
.GetSimSelectSimType {
  padding: 55px 40px 30px;

  .choose-sim-type {
    max-height: 400px;
    overflow-y: auto;
  }

  .title {
    background-color: transparent;
    color: $dark-gray;
    font-weight: 300;
    font-size: 2rem;
    margin: 50px 0 30px;
    padding: 0;
    text-align: center;
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
  label input {
    color: black;
    font-size: 2rem;
    font-weight: 600;
    text-align: center;

    &::placeholder {
      color: black;
    }
  }
}
</style>
