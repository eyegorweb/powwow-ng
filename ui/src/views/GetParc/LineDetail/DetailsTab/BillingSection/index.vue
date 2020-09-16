<template>
  <div>
    <draggable handle=".handle">
      <ContentBlock :key="'block1'">
        <template slot="title">{{
          $t('getparc.lineDetail.tab1.billingOffer.billingAccount')
        }}</template>
        <template slot="content">
          <div class="d-flex">
            <div class="item">
              <h6>{{ $t('getparc.lineDetail.tab1.billingOffer.billingAccount') }}:</h6>
              <p>
                {{ getFromContent('accessPoint.offerGroup.customerAccount.code') }} -
                {{ getFromContent('accessPoint.offerGroup.customerAccount.name') }}
              </p>
            </div>
            <div class="item">
              <h6>{{ $t('getparc.lineDetail.tab1.billingOffer.offerName') }}:</h6>
              <p>{{ getFromContent('accessPoint.offer.marketingOffer.description') }}</p>
            </div>
            <div class="item" v-if="!isMVNO && dateCommitmentEnd">
              <h6>{{ $t('getparc.lineDetail.tab1.billingOffer.endCommitmentDate') }}:</h6>
              <p>{{ dateCommitmentEnd }}</p>
            </div>
            <div class="item" v-if="isMVNO">
              <h6>{{ $t('getparc.lineDetail.tab1.billingOffer.endForfaitDate') }}:</h6>
              <p>{{ flatEndDate }}</p>
            </div>
          </div>
        </template>
      </ContentBlock>
      <ContentBlock :key="'block2'">
        <template slot="title">{{
          $t('getparc.lineDetail.tab1.billingOffer.detailStatus')
        }}</template>
        <template slot="content">
          <div class="d-flex">
            <div class="item">
              <h6>{{ $t('getparc.actLines.col.simStatus') }}:</h6>
              <p v-if="simStatusDate" class="mb-0">{{ simStatus }}</p>
              <p class="mb-0">{{ formatDate(simStatusDate) }}</p>
            </div>
            <div class="item">
              <h6>{{ $t('getparc.actLines.col.lineStatus') }}:</h6>
              <p v-if="lineStatus">{{ lineStatus }}</p>
            </div>
            <div class="item">
              <h6>{{ $t('filters.lines.networkStatus') }}:</h6>
              <p v-if="getFromContent('accessPoint.activationDate')" class="mb-0">
                {{ networkStatus }}
              </p>
              <p class="mb-0">{{ formatDate(getFromContent('accessPoint.activationDate')) }}</p>
            </div>
            <div class="item">
              <h6>{{ $t('getparc.lineDetail.tab1.billingOffer.billingStatus') }}:</h6>
              <p v-if="getFromContent('accessPoint.billingStatusChangeDate')" class="mb-0">
                {{ billingStatus }}
              </p>
              <p class="mb-0">{{ billingStatusChangeDate || '-' }}</p>
            </div>
            <div class="item">
              <h6>{{ $t('filters.lines.commercialStatus') }}:</h6>
              <p v-if="getFromContent('accessPoint.commercialStatusDate')" class="mb-0">
                {{ commercialStatus }}
              </p>
              <p class="mb-0">
                {{ formatDate(getFromContent('accessPoint.commercialStatusDate')) }}
              </p>
            </div>
          </div>
        </template>
      </ContentBlock>
      <ContentBlock v-if="remainingTime !== undefined" :key="'block3'">
        <template slot="title">{{
          $t('getparc.lineDetail.tab1.billingOffer.timeForSuspendedOffer')
        }}</template>

        <template slot="content">
          <div>
            <div class="d-flex">
              <div class="item">
                <h6>{{ $t('getparc.lineDetail.tab1.billingOffer.remainingTime') }}:</h6>
                <p>
                  {{
                    $t('getparc.lineDetail.tab1.billingOffer.descriptionTimeForSuspendedOffer', {
                      total: remainingTime,
                      date: suspensionDate,
                    })
                  }}
                </p>
              </div>
            </div>
          </div>
        </template>
      </ContentBlock>
    </draggable>
  </div>
</template>

<script>
import ContentBlock from '@/views/GetParc/LineDetail/ContentBlock';
import draggable from 'vuedraggable';
import moment from 'moment';
import get from 'lodash.get';

export default {
  components: {
    draggable,
    ContentBlock,
  },

  props: {
    content: Object,
  },

  data() {
    return {
      commercialStatus: undefined,
      isMVNO: undefined,
    };
  },

  mounted() {
    this.getCommercialStatus();
    this.isMVNO = this.content.party.partyType === 'MVNO' ? true : false;
  },

  computed: {
    billingStatusChangeDate() {
      return this.getFromContent('accessPoint.billingStatusChangeDate');
    },
    remainingTime() {
      return this.getFromContent('accessPoint.remainingSuspension')
        ? this.getFromContent('accessPoint.remainingSuspension')
        : undefined;
    },
    suspensionDate() {
      return moment()
        .add('days', this.remainingTime)
        .format('DD/MM/YYYY');
    },

    simStatus() {
      const simStatus = get(this.content, 'statuts');
      if (simStatus === 'AVAILABLE') {
        return `${this.$t('getparc.lineDetail.tab1.statuses.ALLOCATED')}`;
      } else if (simStatus === 'ALLOCATED') {
        return `${this.$t('getparc.lineDetail.tab1.statuses.ALLOCATED')}`;
      } else if (simStatus === 'ALLOCATING') {
        return `${this.$t('getparc.lineDetail.tab1.statuses.ALLOCATING')}`;
      } else if (simStatus === 'RELEASED') {
        return `${this.$t('getparc.lineDetail.tab1.statuses.RELEASED')}`;
      } else if (simStatus === 'RESERVED') {
        return `${this.$t('getparc.lineDetail.tab1.statuses.RESERVED')}`;
      } else {
        return '-';
      }
    },

    simStatusDate() {
      const simStatus = get(this.content, 'statuts');

      if (simStatus === 'AVAILABLE') {
        return `${get(this.content, 'created')}`;
      } else if (simStatus === 'ALLOCATED') {
        const result = get(this.content, 'accessPoint.activationDate')
          ? get(this.content, 'accessPoint.activationDate')
          : get(this.content, 'accessPoint.preactivationDate');
        return `${result}`;
      } else if (simStatus === 'ALLOCATING') {
        return `${get(this.content, 'updated')}`;
      } else if (simStatus === 'RELEASED') {
        return `${get(this.content, 'updated')}`;
      } else if (simStatus === 'RESERVED') {
        return `${get(this.content, 'updated')}`;
      } else {
        return '-';
      }
    },

    lineStatus() {
      const lineStatus = get(this.content, 'accessPoint.lines[0].status');
      if (lineStatus === 'ALLOCATED') {
        return `${this.$t('getparc.lineDetail.tab1.statuses.ALLOCATED')} ${this.$t(
          'fromThe'
        )} ${get(this.content, 'accessPoint.lines[0].auditable.created')}`;
      } else if (lineStatus === 'RELEASED') {
        return `${this.$t('getparc.lineDetail.tab1.statuses.RELEASED')} ${this.$t('fromThe')} ${get(
          this.content,
          'accessPoint.lines[0].auditable.updated'
        )}`;
      } else {
        return '-';
      }
    },

    billingStatus() {
      let billingStatus = get(this.content, 'accessPoint.billingStatus');
      if (!billingStatus) {
        return '-';
      }
      return this.$t('getparc.actLines.simStatuses.' + billingStatus) + ' ' + this.$t('fromThe');
    },

    networkStatus() {
      let networkStatus = get(this.content, 'accessPoint.networkStatus');
      if (!networkStatus) {
        return '-';
      }
      return this.$t('getparc.actLines.simStatuses.' + networkStatus) + ' ' + this.$t('fromThe');
    },

    dateCommitmentEnd() {
      let commitmentEnd = get(this.content, 'accessPoint.commitmentEnd');
      if (!commitmentEnd) return '-';
      return commitmentEnd;
    },

    flatEndDate() {
      let flatEndDate = get(this.content, 'accessPoint.flatEndDate');
      if (!flatEndDate) return '-';
      return flatEndDate;
    },
  },

  methods: {
    capitalize(string) {
      return string.charAt(0).toUpperCase() + string.slice(1);
    },
    formatDate(date) {
      let dateOnly = date.substr(0, date.indexOf(' '));
      return date && date.length ? dateOnly : '-';
    },
    getFromContent(path, defaultValue = '') {
      const value = get(this.content, path, defaultValue);
      return value !== null ? value : '';
    },
    getCommercialStatus() {
      this.commercialStatus = get(this.content, 'accessPoint.commercialStatus')
        ? `${this.$t(
            'getparc.actLines.commercialStatuses.' +
              get(this.content, 'accessPoint.commercialStatus')
          )} ${this.$t('fromThe')}`
        : '-';
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
