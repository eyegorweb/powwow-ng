<template>
  <div class="row mb-3">
    <div class="col-md-12">
      <ChangeServicePre
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
    </div>
  </div>
</template>

<script>
import NoPrerequisitesPre from './prerequisites/NoPrerequisitesPre';
import ChangeServicePre from './prerequisites/ChangeServicePre';
import { mapState, mapActions, mapMutations } from 'vuex';

export default {
  components: {
    NoPrerequisitesPre,
    ChangeServicePre,
  },
  props: {
    act: Object,
  },
  methods: {
    ...mapState('actLines', ['selectedLinesForActCreation']),
    ...mapActions('actLines', ['setPartnersFilter']),
    ...mapMutations('actLines', [
      'applyFilters',
      'setOffersFilter',
      'setActCreationPrerequisites',
      'setSelectedLinesForActCreation',
    ]),

    setPrerequisites(allPrereq) {
      console.log(allPrereq);
      if (allPrereq.offer) {
        this.setOffersFilter([allPrereq.offer]);
      }
      if (allPrereq.partner) {
        this.setPartnersFilter([allPrereq.partner]);
      }

      if (allPrereq) {
        this.setActCreationPrerequisites(allPrereq);
        // Reset selected lines for a new application partner
        this.setSelectedLinesForActCreation([]);
        this.applyFilters();
      }
    },
  },
};
</script>

<style lang="scss" scoped></style>
