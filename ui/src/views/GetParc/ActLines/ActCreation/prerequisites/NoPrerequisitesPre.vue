<template>
  <PrereqContainer>
    <div class="d-flex justify-content-center">
      <div class="w-50">
        <h5>{{ $t('getparc.actLines.step1Partner') }}</h5>
        <PartnersPart @setpartner="setPartner" @setAndSearch="setAndSearch" />
      </div>
      <div class="pl-1 to-bottom">
        <button
          @click="validatePrerequisites"
          :disabled="!selectedPartner"
          class="btn btn-primary pl-4 pr-4 pt-2 pb-2"
        >
          {{ $t('set') }}
        </button>
      </div>
    </div>
    <div slot="validate"></div>
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

    setAndSearch(partner) {
      this.selectedPartner = partner;
      this.$emit('set:preprequisites', {
        partner,
        search: true,
      });
    },

    validatePrerequisites() {
      this.$emit('set:preprequisites', {
        partner: this.selectedPartner,
        search: true,
      });
    },
  },
};
</script>

<style lang="scss" scoped></style>
