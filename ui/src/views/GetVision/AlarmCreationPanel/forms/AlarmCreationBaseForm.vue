<template>
  <div class="p-4 slide-up-reveal">
    <div v-if="editMode">
      <div class="mb-2" v-if="!sharedAlarm">
        <h5>{{ $t('getvsion.filters.ALARMS_SCOPE') }} :</h5>
        <p>{{ alarmScope }}</p>

        <template v-if="offer">
          <h5>{{ $t('alarms.alarmScope.OFFER') }} :</h5>
          <p>{{ offer }}</p>
        </template>
        <template v-if="billingAccount">
          <h5>{{ $t('alarms.alarmScope.CUSTOMER_ACCOUNT') }} :</h5>
          <p>{{ billingAccount }}</p>
        </template>
      </div>
      <div v-else>
        <template v-if="userIsMultiPartner">
          <h5>{{ $t('alarms.alarmScope.PARTY') }} :</h5>
          <p>{{ partnerName }}</p>
        </template>
        <h5>{{ $t('alarms.alarmScope.OFFER') }} :</h5>
        <p>{{ chosenOffer }}</p>
      </div>
    </div>
    <template v-if="!editMode">
      <div v-if="shouldSelectPartner" class="row mb-2">
        <div class="col-md-6">
          <SectionTitle :num="1">{{ $t('getparc.history.col.partyId') }}</SectionTitle>
          <PartnerCombo
            :value.sync="selectedPartner"
            include-mailing-lists
            @update:value="$emit('partnerChange', $event)"
          />
        </div>
      </div>
      <ScopeChoice
        :key="'choice_' + (selectedPartner ? selectedPartner.id : '')"
        :num="scopeIndex"
        :partner="selectedPartner"
        :container-height="containerHeight"
        :skip-scope-check="skipScopeCheck"
        @scope="onScopeChange"
      >
        <slot name="scopechoice" :chosenPartner="selectedPartner"></slot>
      </ScopeChoice>
    </template>

    <div class="mb-4">
      <slot @change="onChange" :scopeIndex="scopeIndex" :partner="selectedPartner" />
    </div>
    <AlarmInfoBlock
      :num="notifIndex"
      @save="$emit('save', $event)"
      :can-save="canSave"
      :partner="selectedPartner"
      :no-wsnotification="noWsnotification"
      :suspension="suspension"
      :duplicate-from="duplicateFrom"
      :is-loading="isLoading"
      :edit-mode="editMode"
      :num-notif="numNotif"
      :alarm="alarm"
    />
  </div>
</template>

<script>
import ScopeChoice from './ScopeChoice';
import AlarmInfoBlock from './AlarmInfoBlock';
import SectionTitle from '@/components/SectionTitle';
import PartnerCombo from '@/components/CustomComboxes/PartnerCombo.vue';
import get from 'lodash.get';
import { mapGetters } from 'vuex';

export default {
  components: {
    ScopeChoice,
    AlarmInfoBlock,
    PartnerCombo,
    SectionTitle,
  },
  props: {
    alarm: Object,
    duplicateFrom: Object,
    isLoading: Boolean,
    partner: Object,
    haveForm: Boolean,
    noWsnotification: Boolean,
    numNotif: Number,
    suspension: Boolean,
    checkErrorsFn: {
      type: Function,
      required: false,
    },
    containerHeight: {
      type: String,
      required: false,
    },
    skipScopeCheck: Boolean,
    sharedAlarm: Boolean,
  },

  mounted() {
    if (this.userIsPartner) {
      this.shouldSelectPartner = false;
      this.selectedPartner = {
        ...this.singlePartner,
        label: get(this.singlePartner, 'name'),
        data: this.singlePartner,
      };
    } else if (this.duplicateFrom) {
      this.selectedPartner = {
        ...get(this.duplicateFrom, 'party', {}),
        label: get(this.duplicateFrom, 'party.name'),
        data: get(this.duplicateFrom, 'party'),
      };
      if (this.sharedAlarm) {
        this.chosenOffer = `${this.duplicateFrom.offerGroup.offerInstance.marketingOffer.description} /
          ${this.duplicateFrom.offerGroup.customerAccount.code} -
        ${this.duplicateFrom.offerGroup.customerAccount.name}`;
      }
    } else if (this.partner) {
      this.shouldSelectPartner = false;
      this.selectedPartner = {
        ...this.partner,
        label: get(this.partner, 'name'),
        data: this.partner,
      };
    }

    if (this.selectedPartner) {
      setTimeout(() => {
        this.$emit('partnerChange', this.selectedPartner);
      });
    }
  },

  data() {
    return {
      selectedPartner: undefined,
      shouldSelectPartner: true,
      lastChosenScope: undefined,
      chosenOffer: undefined,
    };
  },

  methods: {
    onScopeChange(scopeChoice) {
      this.lastChosenScope = scopeChoice;
      this.$emit('scope', scopeChoice);
    },
  },

  computed: {
    ...mapGetters(['userIsPartner', 'singlePartner', 'userIsMultiPartner']),

    canSave() {
      let scopeIsValid = true;

      if (!this.skipScopeCheck) {
        scopeIsValid =
          this.lastChosenScope &&
          (this.lastChosenScope.partner ||
            this.lastChosenScope.searchById ||
            this.lastChosenScope.searchByFile ||
            this.lastChosenScope.offer ||
            this.lastChosenScope.billingAccount);

        if (this.editMode) {
          scopeIsValid = true;
        }
      }

      let formIsValid = true;
      if (this.checkErrorsFn) {
        formIsValid = this.checkErrorsFn();
      }

      return !!scopeIsValid && !!formIsValid;
    },
    editMode() {
      return this.duplicateFrom && this.duplicateFrom.toModify;
    },
    scopeIndex() {
      if (this.editMode) {
        return 0;
      }
      return this.shouldSelectPartner ? 2 : 1;
    },

    notifIndex() {
      return this.scopeIndex + 1 + (this.haveForm ? 1 : 0);
    },

    partnerName() {
      return this.selectedPartner ? this.selectedPartner.name : '';
    },
    alarmScope() {
      const alarmScope = get(this.duplicateFrom, 'alarmScope');
      if (alarmScope === 'OFFER') {
        return this.$t('alarms.offer_cf');
      }
      return alarmScope ? this.$t('alarms.alarmScope.' + alarmScope) : '-';
    },

    billingAccount() {
      if (this.duplicateFrom && this.duplicateFrom.type === 'OVER_CONSUMPTION_VOLUME_FLOTTE') {
        return this.duplicateFrom &&
          this.duplicateFrom.offerGroup &&
          this.duplicateFrom.offerGroup.offerInstance &&
          this.duplicateFrom.offerGroup.offerInstance.marketingOffer &&
          this.duplicateFrom.offerGroup.offerInstance.marketingOffer
          ? `${this.duplicateFrom.offerGroup.offerInstance.marketingOffer.code} - ${this.duplicateFrom.offerGroup.offerInstance.marketingOffer.description}`
          : '';
      }
      return this.duplicateFrom && this.duplicateFrom.autoPositionCustAccount
        ? `${this.duplicateFrom.autoPositionCustAccount.code} - ${this.duplicateFrom.autoPositionCustAccount.name}`
        : '';
    },

    offer() {
      if (this.duplicateFrom && this.duplicateFrom.type === 'OVER_CONSUMPTION_VOLUME_FLOTTE') {
        return this.duplicateFrom &&
          this.duplicateFrom.offerGroup &&
          this.duplicateFrom.offerGroup.customerAccount
          ? `${this.duplicateFrom.offerGroup.customerAccount.code} - ${this.duplicateFrom.offerGroup.customerAccount.name}`
          : '';
      }
      return this.duplicateFrom &&
        this.duplicateFrom.autoPositionWorkflow &&
        this.duplicateFrom.autoPositionWorkflow.workflowDescription
        ? this.duplicateFrom.autoPositionWorkflow.workflowDescription
        : '';
    },
  },

  watch: {
    selectedPartner(newValue) {
      console.log('select partner', newValue);
      return newValue;
    },
  },
};
</script>

<style lang="scss" scoped></style>
