<template>
  <div class="p-4 slide-up-reveal">
    <div v-if="shouldSelectPartner" class="row mb-2">
      <div class="col-md-6">
        <SectionTitle :num="1">{{ $t('getparc.history.col.partyId') }}</SectionTitle>
        <PartnerCombo :value.sync="selectedPartner" />
      </div>
    </div>

    <ScopeChoice
      :key="'choice_' + (selectedPartner ? selectedPartner.id : '')"
      :num="scopeIndex"
      :partner="selectedPartner"
      :containerHeight="containerHeight"
    >
      <slot name="scopechoice" :partner="selectedPartner"></slot>
    </ScopeChoice>
    <div class="mb-4">
      <slot />
    </div>
    <NotificationChoice :num="notifIndex" />
  </div>
</template>

<script>
import ScopeChoice from './ScopeChoice';
import NotificationChoice from './NotificationChoice';
import SectionTitle from './SectionTitle';
import PartnerCombo from '@/components/CustomComboxes/PartnerCombo.vue';

export default {
  components: {
    ScopeChoice,
    NotificationChoice,
    PartnerCombo,
    SectionTitle,
  },
  props: {
    alarm: Object,
    haveForm: Boolean,
    containerHeight: {
      type: String,
      required: false,
    },
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
