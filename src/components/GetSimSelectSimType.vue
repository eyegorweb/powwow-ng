<template>
  <div class="GetSimSelectSimType">
    <h2 class="title">{{ $t("getsim.manage-orders") }}</h2>
    <div class="choose-sim-type">
      <form>
        <GetSimTypeOption v-for="item in simTypes"/>
      </form>
      <div class="text-right">
        <a href="#" class="show-all-types text-right">
          {{ $t("getsim.show-all-sim-types") }}
          <i class="arrow ic-Arrow-Down-Icon"/>
        </a>
      </div>
    </div>
    <div class="choose-amount">
      <h2 class="title mt-4">{{ $t("getsim.choose-sim-amount") }}</h2>
      <UiInput
        :placeholder="1"
        value
        class="d-block w-50 mx-auto"
        input-type="number"
        min-value="1"
      />
    </div>
  </div>
</template>

<script>
import GetSimTypeOption from '@/components/GetSimTypeOption';
import UiInput from '@/components/ui/UiInput';

export default {
  name: 'GetSimSelectSimType',
  data() {
    return {
      result: '',
    };
  },
  props: {
    simTypes: {
      type: Array,
    },
  },
  components: {
    GetSimTypeOption,
    UiInput,
  },
};
</script>

<style lang="scss">
.GetSimSelectSimType {
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
