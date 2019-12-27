<template>
  <div>
    <NoPrerequisitesPre
      v-if="!userIsPartner && actWithNoPrerequs(act.title)"
      @set:preprequisites="setPrerequisites"
    />
    <OfferPrerequisite
      v-if="
        [
          'getparc.actCreation.carouselItem.CHANGE_SERVICES',
          'getparc.actCreation.carouselItem.CHANGE_OFFER',
        ].find(a => a === act.title)
      "
      @set:preprequisites="setPrerequisites"
      :partner="userPartner"
      :can-select-billing-account="act.title === 'getparc.actCreation.carouselItem.CHANGE_OFFER'"
    />
  </div>
</template>

<script>
import NoPrerequisitesPre from './prerequisites/NoPrerequisitesPre';
import OfferPrerequisite from './prerequisites/parts/OfferPrerequisite';
import { mapState, mapActions, mapMutations, mapGetters } from 'vuex';

export default {
  components: {
    NoPrerequisitesPre,
    OfferPrerequisite,
  },
  props: {
    act: Object,
  },
  computed: {
    ...mapState('userContext', ['contextPartnersType', 'contextPartners']),
    ...mapState('actLines', ['defaultAppliedFilters']),
    ...mapGetters(['userIsPartner']),
  },
  watch: {
    contextPartnersType() {
      this.resetPrerequs();
    },
    contextPartners() {
      this.resetPrerequs();
    },
    act() {
      this.initPrerequisites();
    },
  },
  data() {
    return {
      userPartner: undefined,
    };
  },
  mounted() {
    this.initPrerequisites();
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

    actWithNoPrerequs(actTitle) {
      return [
        'getparc.actCreation.carouselItem.REACTIVATE',
        'getparc.actCreation.carouselItem.SUSPEND',
        'getparc.actCreation.carouselItem.CHANGE_STATUS',
        'getparc.actCreation.carouselItem.SEND_SMS',
        'getparc.actCreation.carouselItem.TEST_PHASE',
        'getparc.actCreation.carouselItem.CUSTOM_FIELDS',
        'getparc.actCreation.carouselItem.MANAGE_CANCELLATION',
        'getparc.actCreation.carouselItem.TRANSFERT_LINES',
        'getparc.actCreation.carouselItem.CHANGE_CF',
        'getparc.actCreation.carouselItem.CHANGE_MSISDN',
        'getparc.actCreation.carouselItem.CHANGE_SIMCARD',
        'getparc.actCreation.carouselItem.ACTIVATE_PREACTIVATE',
      ].find(a => a === actTitle);
    },

    initPrerequisites() {
      if (this.userIsPartner) {
        this.userPartner = this.defaultAppliedFilters[0].values[0];
        if (this.act && this.actWithNoPrerequs(this.act.title)) {
          this.setPrerequisites({
            search: true,
            isPartnerHidden: true,
            partner: this.defaultAppliedFilters[0].values[0],
          });
        }
      }
    },

    resetPrerequs() {
      this.resetForm();
      this.setActToCreate(undefined);
      this.setActCreationPrerequisites(undefined);
      this.setSelectedLinesForActCreation([]);
      this.setSelectedFileForActCreation(undefined);
    },

    setPrerequisites(allPrereq) {
      this.resetForm();
      if (allPrereq.partner) {
        this.setPartnersFilter({
          partners: [allPrereq.partner],
          isHidden: !!allPrereq.isPartnerHidden,
        });
      }

      if (allPrereq.offer) {
        this.setOffersFilter([allPrereq.offer]);
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
