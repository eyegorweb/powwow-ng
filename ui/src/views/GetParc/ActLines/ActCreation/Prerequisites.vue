<template>
  <div class="row mb-3">
    <div class="col-md-12">
      <ChangeServicePre
        v-if="act.title === 'getparc.actCreation.carouselItem.CHANGE_SERVICES'"
        @set:preprequisites="setPrerequisites"
      />
      <ReactivatePre
        v-if="act.title === 'getparc.actCreation.carouselItem.REACTIVATE'"
        @set:preprequisites="setPrerequisites"
      />
      <SuspendLinesPre
        v-if="act.title === 'getparc.actCreation.carouselItem.SUSPEND'"
        @set:preprequisites="setPrerequisites"
      />
    </div>
  </div>
</template>

<script>
import ChangeServicePre from './prerequisites/ChangeServicePre';
import ReactivatePre from './prerequisites/ReactivatePre';
import SuspendLinesPre from './prerequisites/SuspendLinesPre';
import { mapActions, mapMutations } from 'vuex';

export default {
  components: {
    ChangeServicePre,
    ReactivatePre,
    SuspendLinesPre,
  },
  props: {
    act: Object,
  },
  methods: {
    ...mapActions('actLines', ['setPartnersFilter']),
    ...mapMutations('actLines', ['applyFilters', 'setOffersFilter', 'setActCreationPrerequisites']),

    setPrerequisites(allPrereq) {
      if (allPrereq.partner) {
        this.setPartnersFilter([allPrereq.partner]);
      }
      if (allPrereq.offer) {
        this.setOffersFilter([allPrereq.offer]);
      }

      if (allPrereq) {
        this.applyFilters();
      }

      this.setActCreationPrerequisites(allPrereq);
    },
  },
};
</script>

<style lang="scss" scoped></style>
