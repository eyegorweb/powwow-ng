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
                      {{ formatDate(dateStatus) }}
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
          <template slot="title"
            >CARTE SIM</template
          >
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
        <ContentBlock :key="'block3'">
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
        <ContentBlock :key="'block4'">
          <template slot="title">
            <span>{{ $t('getparc.lineDetail.tab1.msisdnHistory') }}</span>
          </template>
          <template slot="content">
            <MSISDNHistoryTable :lines="lines || []" />
          </template>
        </ContentBlock>
        <ContentBlock :key="'block5'">
          <template slot="title">
            <span>{{ $t('getparc.lineDetail.tab1.equipmentsHistory') }}</span>
          </template>
          <template slot="content">
            <EquipmentsHistoryTable v-if="content" :content="content" />
          </template>
        </ContentBlock>
        <ContentBlock :key="'block6'">
          <template slot="title">{{ $t('common.customFields') }}</template>
          <template slot="content">
            <div class="d-flex">
              <div class="item">
                <h6>
                  {{
                    getFromContent('party.custom1FieldLabel') || $t('col.customFields', { num: 1 })
                  }}:
                </h6>
                <p>{{ getFromContent('accessPoint.customFields.custom1') }}</p>
              </div>
              <div class="item">
                <h6>
                  {{
                    getFromContent('party.custom2FieldLabel') || $t('col.customFields', { num: 2 })
                  }}:
                </h6>
                <p>{{ getFromContent('accessPoint.customFields.custom2') }}</p>
              </div>
              <div class="item">
                <h6>
                  {{
                    getFromContent('party.custom3FieldLabel') || $t('col.customFields', { num: 3 })
                  }}:
                </h6>
                <p>{{ getFromContent('accessPoint.customFields.custom3') }}</p>
              </div>
              <div class="item">
                <h6>
                  {{
                    getFromContent('party.custom4FieldLabel') || $t('col.customFields', { num: 4 })
                  }}:
                </h6>
                <p>{{ getFromContent('accessPoint.customFields.custom4') }}</p>
              </div>
              <div class="item">
                <h6>
                  {{
                    getFromContent('party.custom5FieldLabel') || $t('col.customFields', { num: 5 })
                  }}:
                </h6>
                <p>{{ getFromContent('accessPoint.customFields.custom5') }}</p>
              </div>
              <div class="item">
                <h6>
                  {{
                    getFromContent('party.custom6FieldLabel') || $t('col.customFields', { num: 6 })
                  }}:
                </h6>
                <p>{{ getFromContent('accessPoint.customFields.custom6') }}</p>
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
import DateStatus from '@/views/GetParc/ActDetail/DateStatus';
import moment from 'moment';
import get from 'lodash.get';

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
  computed: {
    msisdn() {
      return get(this.lines[0], 'msisdn', '');
    },
    lines() {
      return this.getFromContent('accessPoint.lines', undefined);
    },
  },
  methods: {
    formatDate(date) {
      let dateOnly = date.substr(0, date.indexOf(' '));
      return date && date.length ? moment(dateOnly, 'DD-MM-YYYY').format('DD/MM/YYYY') : '-';
    },
    getFromContent(path, defaultValue = '') {
      const value = get(this.content, path, defaultValue);
      return value !== null ? value : '';
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

      if (status === 'LINE_IS_SUSPENDED' || status === 'LINE_IS_RELEASED') {
        return this.$t('getparc.lineDetail.tab1.statuses.suspendedReleased');
      }

      return '-';
    },
  },
};
</script>

<style lang="scss" scoped>
.item {
  p {
    font-size: 0.8rem;
  }
}
</style>
