<template>
  <div class="row mb-3">
    <div class="col-md-12">
      <OfferPrerequisite
        v-if="act.title === 'getparc.actCreation.carouselItem.CHANGE_SERVICES'"
        @set:preprequisites="setPrerequisites"
      />
      <NoPrerequisitesPre
        v-if="act.title === 'getparc.actCreation.carouselItem.REACTIVATE'"
        @set:preprequisites="setPrerequisites"
      />
      <NoPrerequisitesPre
        v-if="act.title === 'getparc.actCreation.carouselItem.SUSPEND'"
        @set:preprequisites="setPrerequisites"
      />
      <NoPrerequisitesPre
        v-if="act.title === 'getparc.actCreation.carouselItem.CHANGE_STATUS'"
        @set:preprequisites="setPrerequisites"
      />
      <NoPrerequisitesPre
        v-if="act.title === 'getparc.actCreation.carouselItem.SEND_SMS'"
        @set:preprequisites="setPrerequisites"
      />
      <NoPrerequisitesPre
        v-if="act.title === 'getparc.actCreation.carouselItem.TEST_PHASE'"
        @set:preprequisites="setPrerequisites"
      />
      <NoPrerequisitesPre
        v-if="act.title === 'getparc.actCreation.carouselItem.CUSTOM_FIELDS'"
        @set:preprequisites="setPrerequisites"
      />
      <NoPrerequisitesPre
        v-if="act.title === 'getparc.actCreation.carouselItem.MANAGE_CANCELLATION'"
        @set:preprequisites="setPrerequisites"
      />
      <NoPrerequisitesPre
        v-if="act.title === 'getparc.actCreation.carouselItem.TRANSFERT_LINES'"
        @set:preprequisites="setPrerequisites"
      />
      <NoPrerequisitesPre
        v-if="act.title === 'getparc.actCreation.carouselItem.CHANGE_CF'"
        @set:preprequisites="setPrerequisites"
      />
      <NoPrerequisitesPre
        v-if="act.title === 'getparc.actCreation.carouselItem.CHANGE_MSISDN'"
        @set:preprequisites="setPrerequisites"
      />
      <NoPrerequisitesPre
        v-if="act.title === 'getparc.actCreation.carouselItem.CHANGE_SIMCARD'"
        @set:preprequisites="setPrerequisites"
      />
      <NoPrerequisitesPre
        v-if="act.title === 'getparc.actCreation.carouselItem.ACTIVATE_PREACTIVATE'"
        @set:preprequisites="setPrerequisites"
      />
      <OfferPrerequisite
        v-if="act.title === 'getparc.actCreation.carouselItem.CHANGE_OFFER'"
        @set:preprequisites="setPrerequisites"
      />
    </div>
  </div>
</template>

<script>
import NoPrerequisitesPre from './prerequisites/NoPrerequisitesPre';
import OfferPrerequisite from './prerequisites/parts/OfferPrerequisite';
import { mapState, mapActions, mapMutations } from 'vuex';

export default {
  components: {
    NoPrerequisitesPre,
    OfferPrerequisite,
  },
  props: {
    act: Object,
  },
  computed: {
    ...mapState('userContext', ['contextPartnersTypes', 'contextPartners']),
  },
  watch: {
    contextPartnersTypes() {
      this.resetPrerequs();
    },
    contextPartners() {
      this.resetPrerequs();
    },
  },
  methods: {
    ...mapActions('actLines', ['setPartnersFilter']),
    ...mapMutations('actLines', [
      'applyFilters',
      'setOffersFilter',
      'setActCreationPrerequisites',
      'setSelectedLinesForActCreation',
      'setSelectedFileForActCreation',
      'resetForm',
      'setPageLimit',
      'setActToCreate',
    ]),

    resetPrerequs() {
      this.resetForm();
      this.setActToCreate(undefined);
      this.setActCreationPrerequisites(undefined);
      this.setSelectedLinesForActCreation([]);
      this.setSelectedFileForActCreation(undefined);
    },

    setPrerequisites(allPrereq) {
      this.resetForm();
      if (allPrereq.offer) {
        this.setOffersFilter([allPrereq.offer]);
      }
      if (allPrereq.partner) {
        this.setPartnersFilter([allPrereq.partner]);
      }

      if (allPrereq) {
        this.setActCreationPrerequisites(allPrereq);
        if (allPrereq.search) {
          this.applyFilters();
          this.setPageLimit(5);
        }
      }
    },
  },
};
</script>

<style lang="scss" scoped></style>
