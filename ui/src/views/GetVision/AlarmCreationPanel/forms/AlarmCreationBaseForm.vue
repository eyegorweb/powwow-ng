<template>
  <div class="p-4 slide-up-reveal ">
    <div v-if="shouldSelectPartner" class="row mb-2">
      <div class="col-md-6">
        <h5 class="text-primary text-uppercase">
          <span class="badge badge-pill badge-primary">1</span>
          <span class="title"> {{ $t('getparc.history.col.partyId') }}</span>
        </h5>
        <PartnerCombo :value.sync="selectedPartner" />
      </div>
    </div>

    <ScopeChoice
      :key="'choice_' + (selectedPartner ? selectedPartner.id : '')"
      :num="scopeIndex"
      :partner="selectedPartner"
    />
    <slot />
    <NotificationChoice :num="notifIndex" />
  </div>
</template>

<script>
import ScopeChoice from './ScopeChoice';
import NotificationChoice from './NotificationChoice';
import PartnerCombo from '@/components/CustomComboxes/PartnerCombo.vue';

export default {
  components: {
    ScopeChoice,
    NotificationChoice,
    PartnerCombo,
  },
  props: {
    alarm: Object,
    haveForm: Boolean,
  },

  data() {
    return {
      selectedPartner: undefined,
      shouldSelectPartner: true,
    };
  },

  computed: {
    scopeIndex() {
      return this.shouldSelectPartner ? 2 : 1;
    },

    notifIndex() {
      return this.scopeIndex + 1 + (this.haveForm ? 1 : 0);
    },
  },
};
</script>

<style lang="scss" scoped></style>
