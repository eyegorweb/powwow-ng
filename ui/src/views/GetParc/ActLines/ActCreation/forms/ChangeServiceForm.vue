<template>
  <ActFormContainer @validate="onValidate">
    <div class="row">
      <div class="col">
        <SelectOffer
          title="getparc.actCreation.SERVICE_TO_ACTIVATE"
          @setOffers="setServicesToActivate"
        />
      </div>
      <div class="col">
        <SelectOffer
          title="getparc.actCreation.SERVICE_TO_DESACTIVATE"
          @setOffers="setServicesToDesactivate"
        />
      </div>
    </div>
  </ActFormContainer>
</template>

<script>
import ActFormContainer from './parts/ActFormContainer';
import SelectOffer from './parts/SelectOffer';

export default {
  components: {
    ActFormContainer,
    SelectOffer,
  },

  data() {
    return {
      servicesToActivate: null,
      servicesToDesctivate: null,
    };
  },

  methods: {
    setServicesToActivate(values) {
      this.servicesToActivate = values;
    },
    setServicesToDesactivate(values) {
      this.servicesToDesctivate = values;
    },
    onValidate(contextValues) {
      console.log(contextValues, this.servicesToActivate, this.servicesToDesctivate);
    },
  },
};
</script>

<style lang="scss" scoped></style>
