<template>
  <span>
    {{ description }}
  </span>
</template>

<script>
export default {
  props: {
    line: Object,
  },

  computed: {
    description() {
      if (this.$loGet(this.line, 'party.partyType') === 'MULTI_CUSTOMER') {
        return this.$loGet(this.line, 'workflow.workflowDescription');
      }
      return this.$loGet(this.line, 'accessPoint.offer.marketingOffer.description');
    },
  },
};
</script>

<style lang="scss" scoped></style>
