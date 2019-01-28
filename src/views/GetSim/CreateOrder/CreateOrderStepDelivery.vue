<template>
  <div class="step-client-container">
    <div>
      <h2 class="title">{{ $t('orders.choose-delivery') }}</h2>
    </div>

    <div class="row">
      <div class="col-md-12 mt-5">
        <UiButton
          variant="round-button"
          @click="$emit('prev')"
          class="float-left ic-Arrow-Previous-Icon"
        />
        <UiButton
          variant="round-button"
          @click="$emit('done')"
          class="float-right ic-Arrow-Next-Icon"
        />
      </div>
    </div>
  </div>
</template>

<script>
import UiApiAutocomplete from '@/components/ui/UiApiAutocomplete';
import UiButton from '@/components/ui/Button';

export default {
  name: 'CreateOrderStepDelivery',

  components: {
    UiApiAutocomplete,
    UiButton,
  },
};
</script>

<style lang="scss" scoped>
/* voir comment gérer le css en double */
.title {
  background-color: transparent;
  color: $dark-gray;
  font-weight: 300;
  font-size: 2rem;
  margin: 3rem 0 1.875rem;
  padding: 0;
  text-align: center;
}

.step-client-container {
  padding: 0 2rem !important;
}
</style>
