<template>
  <div>
    <NoPrerequisitesPre
      v-if="!userIsPartner && actWithNoPrerequs(act.title)"
      @set:preprequisites="setPrerequisites"
    />
    <PartnerAndCFTransfertSim
      v-if="['getparc.actCreation.carouselItem.TRANSFERT_LINES'].find((a) => a === act.title)"
      @set:preprequisites="setPrerequisites"
      :user-partner="userPartner"
    />
    <PartnerAndCF
      v-if="
        [
          'getparc.actCreation.carouselItem.ACTIVATE_PREACTIVATE',
          'getparc.actCreation.carouselItem.esim.FREE_RESERVATION',
          'getparc.actCreation.carouselItem.esim.CHANGE_STATUS_PROFIL_ESIM',
          'getparc.actCreation.carouselItem.esim.AUDIT',
        ].find((a) => a === act.title) && !userIsMVNO
      "
      @set:preprequisites="setPrerequisites"
      :user-partner="userPartner"
    />
    <PartnerCFEsimStatus
      v-if="
        ['getparc.actCreation.carouselItem.esim.DOWNLOAD_ESIM_PROFILE'].find(
          (a) => a === act.title
        ) && !userIsMVNO
      "
      @set:preprequisites="setPrerequisites"
      :user-partner="userPartner"
    />
    <OfferPrerequisite
      :all-offers="true"
      v-if="
        [
          'getparc.actCreation.carouselItem.CHANGE_SERVICES',
          'getparc.actCreation.carouselItem.CHANGE_OFFER',
          'getparc.actCreation.carouselItem.CHANGE_CF',
          'getparc.actCreation.carouselItem.esim.CHARGE_LV_LINES',
          'getparc.actCreation.carouselItem.RECHARGE_LINES',
        ].find((a) => a === act.title)
      "
      @set:preprequisites="setPrerequisites"
      :partner="userPartner"
      :can-select-billing-account="
        act.title === 'getparc.actCreation.carouselItem.CHANGE_OFFER' ||
          act.title === 'getparc.actCreation.carouselItem.CHANGE_CF' ||
          act.title === 'getparc.actCreation.carouselItem.esim.CHARGE_LV_LINES'
      "
      :have-lv-offers="
        act.title === 'getparc.actCreation.carouselItem.esim.CHARGE_LV_LINES' ||
          act.title === 'getparc.actCreation.carouselItem.RECHARGE_LINES'
      "
      :partner-type="getPartnerType"
      :act-is-cf="act.id === 'CHANGE_CF'"
    />
    <!-- add condition to display admin radius all prerequesites components -->
    <RadiusPrerequisite
      v-if="['getparc.actCreation.carouselItem.RADIUS_ADMIN'].find((a) => a === act.title)"
      :partner="userPartner"
      @set:preprequisites="setPrerequisites"
      partner-feature="RADIUS"
    />
    <CommunityPrerequisite
      v-if="['getparc.actCreation.carouselItem.UPDATE_YORK_COMMUNITY'].find((a) => a === act.title)"
    />
  </div>
</template>

<script>
// ACTIVATE_PREACTIVATE
import NoPrerequisitesPre from './prerequisites/NoPrerequisitesPre';
import OfferPrerequisite from './prerequisites/OfferPrerequisite';
import PartnerAndCFTransfertSim from './prerequisites/PartnerAndCFTransfertSim';
import PartnerAndCF from './prerequisites/PartnerAndCF';
import PartnerCFEsimStatus from './prerequisites/PartnerCFEsimStatus';
import RadiusPrerequisite from './prerequisites/RadiusPrerequisite';
import CommunityPrerequisite from './prerequisites/CommunityPrerequisite';
import { mapState, mapActions, mapMutations, mapGetters } from 'vuex';

export default {
  components: {
    NoPrerequisitesPre,
    OfferPrerequisite,
    PartnerAndCF,
    PartnerCFEsimStatus,
    PartnerAndCFTransfertSim,
    RadiusPrerequisite,
    CommunityPrerequisite,
  },
  props: {
    act: Object,
  },
  computed: {
    ...mapState('userContext', ['contextPartnersType', 'contextPartners']),
    ...mapState('actLines', ['defaultAppliedFilters']),
    ...mapGetters(['userIsPartner', 'userIsMVNO']),
    getPartnerType() {
      return this.act.title === 'getparc.actCreation.carouselItem.RECHARGE_LINES'
        ? 'M2M_LIGHT'
        : undefined;
    },
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
      'setSimStatusesFilter',
      'setBillingAccountsFilter',
      'setCommunityFilter',
    ]),

    actWithNoPrerequs(actTitle) {
      return [
        'getparc.actCreation.carouselItem.REACTIVATE',
        'getparc.actCreation.carouselItem.SUSPEND',
        'getparc.actCreation.carouselItem.SUSPEND_BILLS',
        'getparc.actCreation.carouselItem.CHANGE_STATUS',
        'getparc.actCreation.carouselItem.SEND_SMS',
        'getparc.actCreation.carouselItem.TEST_PHASE',
        'getparc.actCreation.carouselItem.CUSTOM_FIELDS',
        'getparc.actCreation.carouselItem.MANAGE_CANCELLATION',
        'getparc.actCreation.carouselItem.CHANGE_MSISDN',
        'getparc.actCreation.carouselItem.CHANGE_SIMCARD',
        'getparc.actCreation.carouselItem.esim.POLICY_RULES',
      ].find((a) => a === actTitle);
    },

    initPrerequisites() {
      if (this.userIsPartner) {
        this.userPartner = this.defaultAppliedFilters[0].values[0];
        if (
          (this.act && this.actWithNoPrerequs(this.act.title)) ||
          (this.act &&
            this.act.title === 'getparc.actCreation.carouselItem.ACTIVATE_PREACTIVATE' &&
            this.userIsMVNO)
        ) {
          this.setPrerequisites({
            search: true,
            isHidden: true,
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
          isHidden: this.userIsPartner,
        });
      }

      if (allPrereq.billingAccount) {
        this.setBillingAccountsFilter([allPrereq.billingAccount]);
      }

      if (allPrereq.offer) {
        this.setOffersFilter([allPrereq.offer]);
      }

      if (allPrereq.selectedStatus) {
        this.setSimStatusesFilter([allPrereq.selectedStatus]);
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
