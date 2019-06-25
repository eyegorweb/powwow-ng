<template>
  <PrereqContainer @validate="validatePrerequisites">
    <div class="d-flex justify-content-center">
      <div class="w-50">
        <h5>{{ $t('getparc.actLines.step1Partner') }}</h5>
        <PartnersPart @setpartner="setPartner" />
      </div>
    </div>
  </PrereqContainer>
</template>

<script>
import PrereqContainer from './parts/PrereqContainer';
import PartnersPart from './parts/PartnersPart';

export default {
  components: {
    PrereqContainer,
    PartnersPart,
  },
  data() {
    return {
      selectedPartner: undefined,
    };
  },
  methods: {
    setPartner(chosenPartner) {
      this.selectedPartner = chosenPartner;
    },

    validatePrerequisites() {
      this.$emit('set:preprequisites', {
        partner: this.selectedPartner,
      });
    },
  },
};
</script>

<style lang="scss" scoped></style>
