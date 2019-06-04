<template>
  <PrereqContainer @validate="validatePrerequisites">
    <SelectPartners @setpartner="setPartners" />
  </PrereqContainer>
</template>

<script>
import SelectPartners from './parts/SelectPartners';
import PrereqContainer from './parts/PrereqContainer';

export default {
  components: {
    SelectPartners,
    PrereqContainer,
  },
  data() {
    return {
      selectedPartner: null,
    };
  },
  methods: {
    setPartners(chosenPartners) {
      this.selectedPartner = chosenPartners;
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
