<template>
  <div class="row mb-3">
    <div class="col-md-12">
      <ChangeServicePre
        v-if="act.title === 'getparc.actCreation.carouselItem.CHANGE_SERVICES'"
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
import SuspendLinesPre from './prerequisites/SuspendLinesPre';
import { mapActions, mapMutations } from 'vuex';

export default {
  components: {
    ChangeServicePre,
    SuspendLinesPre,
  },
  props: {
    act: Object,
  },
  methods: {
    ...mapActions('actLines', ['setPartnersFilter']),
    ...mapMutations('actLines', ['applyFilters', 'setOffersFilter']),

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
    },
  },
};
</script>

<style lang="scss" scoped></style>
