<template>
  <div>
    <draggable handle=".handle">
      <transition-group>
        <ContentBlock :key="'block1'">
          <template slot="title">{{ $t('getparc.lineDetail.tab1.lineInfo') }}</template>
          <template slot="content">
            <div class="d-flex">
              <div class="item">
                <h6>MSISDN:</h6>
                <p>{{ msisdn }}</p>
              </div>
              <div class="item">
                <h6>{{ $t('getparc.lineDetail.lineStatus') }}:</h6>
                <p>
                  <DateStatus :row="content">
                    <div slot="content" slot-scope="{ lineStatus, dateStatus }">
                      {{ getPrefix(lineStatus) }}
                      {{ dateStatus ? dateStatus : '' }}
                    </div>
                  </DateStatus>
                </p>
              </div>
              <div class="item">
                <h6>{{ $t('getparc.lineDetail.tab1.preactivatedAt') }}:</h6>
                <p>{{ formatDate(getFromContent('accessPoint.preactivationDate')) }}</p>
              </div>
              <div class="item">
                <h6>{{ $t('getparc.lineDetail.tab1.activatedAt') }}:</h6>
                <p>{{ formatDate(getFromContent('accessPoint.activationDate')) }}</p>
              </div>
              <div class="item">
                <h6>{{ $t('col.partner') }}:</h6>
                <p>{{ getFromContent('party.name') }}</p>
              </div>
            </div>
          </template>
        </ContentBlock>
        <ContentBlock :key="'block2'">
          <template slot="title">CARTE SIM</template>
          <template slot="content">
            <div class="row">
              <div class="col-md-1">
                <div class="simtype__item">
                  <img src="@/assets/simtype.png" />
                </div>
              </div>
              <div class="col-md-11">
                <div class="d-flex">
                  <div class="item">
                    <h6>{{ $t('filters.lines.typeSIMCard') }}:</h6>
                    <p>{{ getFromContent('type') }}</p>
                  </div>
                  <div class="item">
                    <h6>{{ $t('getsim.sim-type-labels.format') }}:</h6>
                    <p>{{ getFromContent('format') }}</p>
                  </div>
                  <div class="item">
                    <h6>{{ $t('getsim.sim-type-labels.patent') }}:</h6>
                    <p>{{ getFromContent('licence') }}</p>
                  </div>
                </div>
                <div class="d-flex">
                  <div class="item">
                    <h6>{{ $t('orders.detail.orderId') }}:</h6>
                    <p>{{ getFromContent('order.id') }}</p>
                  </div>
                  <div class="item">
                    <h6>ICCID:</h6>
                    <p>{{ getFromContent('iccid') }}</p>
                  </div>
                  <div class="item">
                    <h6>{{ $t('getparc.lineDetail.tab1.pinCode') }}1:</h6>
                    <p>{{ getFromContent('PIN1') }}</p>
                  </div>
                  <div class="item">
                    <h6>{{ $t('getparc.lineDetail.tab1.pinCode') }}2:</h6>
                    <p>{{ getFromContent('PIN2') }}</p>
                  </div>
                  <div class="item">
                    <h6>{{ $t('getparc.lineDetail.tab1.pukCode') }}1:</h6>
                    <p>{{ getFromContent('PUK1') }}</p>
                  </div>
                  <div class="item">
                    <h6>{{ $t('getparc.lineDetail.tab1.pukCode') }}2:</h6>
                    <p>{{ getFromContent('PUK2') }}</p>
                  </div>
                </div>
              </div>
            </div>
          </template>
        </ContentBlock>
        <ContentBlock :key="'block8'" v-if="canSeeBlockEsim">
          <template slot="title">Profile eUICC / ESIM</template>
          <template slot="content">
            <div class="content--flex">
              <div class="content-box">
                <div class="item" v-if="canSeeAllEsimInfos || canSeeLightEsimInfos">
                  <h6>{{ $t('getparc.lineDetail.state') }}:</h6>
                  <p>{{ getFromContent('esimInfos.profileState') }}</p>
                </div>
                <div class="item" v-if="canSeeAllEsimInfos">
                  <h6>{{ $t('getparc.lineDetail.downloadState') }}:</h6>
                  <p>{{ getFromContent('esimInfos.esimDownloadState') }}</p>
                </div>
              </div>
              <div class="content-box">
                <div class="item" v-if="canSeeAllEsimInfos || canSeeLightEsimInfos">
                  <h6>{{ $t('getparc.lineDetail.lastChange') }}:</h6>
                  <p>{{ getFromContent('esimInfos.lastProfileStateDate') }}</p>
                </div>
                <div class="item" v-if="canSeeAllEsimInfos">
                  <h6>Date download synchro:</h6>
                  <p>{{ getFromContent('esimInfos.esimDownloadSynchroDate') }}</p>
                </div>
              </div>
              <div class="content-box">
                <div class="item" v-if="canSeeAllEsimInfos || canSeeLightEsimInfos">
                  <h6>{{ $t('getparc.lineDetail.lastUpdate') }}:</h6>
                  <p>{{ getFromContent('esimInfos.profileStateSynchroDate', '-') }}</p>
                </div>
                <div class="item" v-if="canSeeAllEsimInfos">
                  <h6>EID:</h6>
                  <p>{{ getFromContent('esimInfos.eidValue') }}</p>
                </div>
              </div>
              <div class="content-box">
                <div class="item" v-if="canSeeAllEsimInfos || canSeeLightEsimInfos">
                  <h6>{{ $t('getparc.lineDetail.lastState') }}:</h6>
                  <p>{{ getFromContent('esimInfos.lastProfileState') }}</p>
                </div>
                <div class="item" v-if="canSeeAllEsimInfos">
                  <h6>MSISDN SMSR statut:</h6>
                  <p>{{ getFromContent('esimInfos.msisdnSMSRStatus') }}</p>
                </div>
              </div>
            </div>
          </template>
        </ContentBlock>
        <ContentBlock :key="'block3'" v-if="canSeeDualSIM">
          <template slot="title">{{ $t('getparc.lineDetail.tab1.dualSim') }}</template>
          <template slot="content">
            <div class="d-flex">
              <div class="item">
                <h6>{{ $t('secondary', { item: 'ICCID' }) }}:</h6>
                <p>{{ getFromContent('dualSIMCardInstance.iccid', '-') }}</p>
              </div>
              <div class="item">
                <h6>{{ $t('secondary', { item: 'IMSI' }) }}:</h6>
                <p>{{ getFromContent('dualSIMCardInstance.imsi', '-') }}</p>
              </div>
              <div class="item">
                <h6>{{ $t('secondary', { item: 'MSISDN' }) }}:</h6>
                <p>{{ getFromContent('dualSIMCardInstance.msisdn', '-') }}</p>
              </div>
            </div>
          </template>
        </ContentBlock>
        <ContentBlock :key="'block4'" v-if="canSeeMsisdnHistory">
          <template slot="title">
            <span>{{ $t('getparc.lineDetail.tab1.msisdnHistory') }}</span>
          </template>
          <template slot="content">
            <MSISDNHistoryTable :lines="lines || []" />
          </template>
        </ContentBlock>
        <ContentBlock :key="'block5'">
          <template slot="title">
            <span v-if="partnerTypeMVNO">{{ $t('getparc.lineDetail.tab1.IMEIHistory') }}</span>
            <span v-else>{{ $t('getparc.lineDetail.tab1.equipmentsHistory') }}</span>
          </template>
          <template slot="content">
            <EquipmentsHistoryTable v-if="content" :content="content" />
          </template>
        </ContentBlock>
        <ContentBlock :key="'block6'" v-if="!partnerTypeMVNO">
          <template slot="title">{{ $t('common.customFields') }}</template>
          <template slot="content">
            <div class="d-flex">
              <div v-if="noResults" class="alert-light" role="alert">
                {{ $t('noResult') }}
              </div>
              <div class="item" v-for="item in currentCustomFields" :key="item.index">
                <h6>{{ item.label }}</h6>
                <p>{{ item.value }}</p>
              </div>
            </div>
          </template>
        </ContentBlock>
        <ContentBlock v-if="userIsBO && !partnerTypeMVNO" :key="'block7'">
          <template slot="title">{{ $t('getparc.lineDetail.specificFields.title') }}</template>
          <template slot="content">
            <div class="d-flex">
              <div v-if="!noSpecificResults" class="alert-light" role="alert">
                {{ $t('noResult') }}
              </div>
              <div v-else class="item" v-for="item in currentSpecificFields" :key="item.index">
                <h6>{{ item.label }}</h6>
                <p>{{ item.value }}</p>
              </div>
            </div>
          </template>
        </ContentBlock>
      </transition-group>
    </draggable>
  </div>
</template>

<script>
import ContentBlock from '@/views/GetParc/LineDetail/ContentBlock';
import MSISDNHistoryTable from './MSISDNHistoryTable';
import EquipmentsHistoryTable from './EquipmentsHistoryTable';
import draggable from 'vuedraggable';
import DateStatus from '@/views/GetParc/UnitActionsPage/DateStatus';
import moment from 'moment';
import get from 'lodash.get';
import { fetchCustomFields } from '@/api/customFields';
import { mapGetters } from 'vuex';
import { getFromLatestLineFromAccessPoint } from '@/utils/line.js';

export default {
  components: {
    draggable,
    ContentBlock,
    MSISDNHistoryTable,
    EquipmentsHistoryTable,
    DateStatus,
  },
  props: {
    content: Object,
  },
  async mounted() {
    await this.fetchCustomFieldsForPartner();
  },
  data() {
    return {
      allCustomFields: [],
      customFieldsValues: [],
    };
  },
  computed: {
    ...mapGetters(['userIsBO', 'havePermission', 'userDualPartyType']),

    msisdn() {
      return getFromLatestLineFromAccessPoint(
        this.$loGet(this.content, 'accessPoint', {}),
        'msisdn'
      );
    },
    lines() {
      return this.getFromContent('accessPoint.lines', undefined);
    },
    currentCustomFields() {
      const customFields = get(this.content, 'accessPoint.customFields');
      const customLabels = get(this.content, 'party');
      if (!customFields) return [];
      let customFieldsArray = [];
      for (let i = 1; i <= 6; i++) {
        const value = customFields['custom' + i] || '-';
        const labels = customLabels['custom' + i + 'FieldLabel'] || [];
        const label = this.getCustomFieldLabel(i);
        if (labels) {
          customFieldsArray.push({
            index: i,
            code: 'custom' + i,
            value,
            label,
          });
        }
      }
      return customFieldsArray;
    },
    currentSpecificFields() {
      let specificFieldsArray = [
        {
          label: get(this.content, 'party.spec1_label'),
          value: get(this.content, 'accessPoint.spec1'),
          code: 'spec1',
          index: 0,
        },
        {
          label: get(this.content, 'party.spec2_label'),
          value: get(this.content, 'accessPoint.spec2'),
          code: 'spec2',
          index: 1,
        },
      ];
      return specificFieldsArray;
    },
    noResults() {
      let found = false;
      if (!this.currentCustomFields || !this.currentCustomFields.length) found = true;
      return found;
    },
    noSpecificResults() {
      if (this.currentSpecificFields && !this.currentSpecificFields.length) return;
      let found = this.currentSpecificFields.every((c) => c.value);
      return found;
    },
    partnerTypeMVNO() {
      return get(this.content, 'party.partyType') === 'MVNO';
    },
    canSeeDualSIM() {
      return (
        !this.partnerTypeMVNO &&
        this.$loGet(this.content, 'dualSIMCardInstance') &&
        this.havePermission('getParc', 'manage_dual')
      );
    },
    canSeeBlockEsim() {
      return (
        this.$loGet(this.content, 'esimInfos') &&
        (this.havePermission('getParc', 'manage_esim') ||
          this.havePermission('getParc', 'manage_esim_light'))
      );
    },
    canSeeLightEsimInfos() {
      return this.havePermission('getParc', 'manage_esim_light');
    },
    canSeeAllEsimInfos() {
      return this.havePermission('getParc', 'manage_esim');
    },
    canSeeMsisdnHistory() {
      if (this.userDualPartyType && this.userDualPartyType.length > 0) {
        // search the dualPartyType of party of line if exists
        const userDualPartyTypeFounded = this.userDualPartyType.find(
          (elem) => elem.partyId === this.content.party.id
        );
        return userDualPartyTypeFounded.type === 'ROAMING';
      }
      return true;
    },
  },
  methods: {
    async fetchCustomFieldsForPartner() {
      const partnerId = get(this.content, 'party.id');
      const customFields = await fetchCustomFields(partnerId);

      this.allCustomFields = customFields.customFields;
    },

    formatDate(date) {
      return date && date.length && date != '-'
        ? moment(date, 'DD-MM-YYYY').format('DD/MM/YYYY')
        : '-';
    },
    getFromContent(path, defaultValue = '') {
      const value = get(this.content, path, defaultValue);
      return value !== null ? value : '-';
    },
    getPrefix(status) {
      if (status === 'LINE_NOT_PREACTIVATED') {
        return this.$t('getparc.lineDetail.tab1.statuses.notPreactivated');
      }

      if (status === 'LINE_IS_PREACTIVATED') {
        return this.$t('getparc.lineDetail.tab1.statuses.preactivated');
      }

      if (status === 'LINE_IS_ACTIVATED') {
        return this.$t('getparc.lineDetail.tab1.statuses.activated');
      }

      if (status === 'LINE_IS_SUSPENDED') {
        return this.$t('getparc.lineDetail.tab1.statuses.suspended');
      }
      if (status === 'LINE_IS_RELEASED') {
        return this.$t('getparc.lineDetail.tab1.statuses.RELEASED');
      }

      return '-';
    },

    getCustomFieldLabel(index) {
      const found = this.allCustomFields.find((c) => c.code === `custom${index}`);
      if (found) {
        return found.label;
      } else {
        return this.$t('customFields.customField', { index });
      }
    },
  },
};
</script>

<style lang="scss" scoped>
.content--flex {
  display: flex;
}
.content-box {
  width: 33%;
}
.item {
  p {
    font-size: 0.8rem;
  }
}
</style>
