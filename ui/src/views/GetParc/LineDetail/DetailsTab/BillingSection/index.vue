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
            <div class="item">
              <h6>{{ $t('getparc.lineDetail.tab1.billingOffer.endCommitmentDate') }}:</h6>
              <p>{{ dateCommitmentEnd }}</p>
            </div>
            <div class="item">
              <h6>{{ $t('getparc.lineDetail.tab1.billingOffer.billingStatus') }}:</h6>
              <p>{{ billingStatus }}</p>
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
              <p class="mb-0">{{ billingStatusChangeDate }}</p>
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
import { fetchCommercialStatuses } from '@/api/linesActions';
import draggable from 'vuedraggable';
import moment from 'moment';
import get from 'lodash.get';

export default {
  components: {
    draggable,
    ContentBlock,
  },

  async mounted() {
    this.commercialStatuses = await fetchCommercialStatuses();
    const status = get(this.content, 'accessPoint.commercialStatus');
    if (!status) return;
    const formattedStatus = this.capitalize(status);
    const foundCommercialStatus = this.commercialStatuses.map(l =>
      this.$t(`${'getparc.actLines.commercialStatuses.'}${l}`)
    );
    const foundCommercialStatusIndex = foundCommercialStatus.indexOf(formattedStatus);
    this.commercialStatus =
      foundCommercialStatusIndex !== -1
        ? `${foundCommercialStatus[foundCommercialStatusIndex]} ${this.$t('fromThe')}`
        : '-';
  },

  props: {
    content: Object,
  },

  computed: {
    billingStatusChangeDate() {
      const date = this.getFromContent('accessPoint.billingStatusChangeDate');
      return moment(date, 'DD/MM/YYYY').format('DD/MM/YYYY');
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
    commercialStatus() {
      if (get(this.content, 'accessPoint.commercialStatus')) {
        return `${this.$t(
          'getparc.actLines.commercialStatuses.' + get(this.content, 'accessPoint.commercialStatus')
        )} ${this.$t('fromThe')}`;
      }

      return '-';
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
      const lineStatus = get(this.content, 'line.statuts');
      if (lineStatus === 'ALLOCATED') {
        return `${lineStatus} ${get(this.content, 'line.created')}`;
      } else if (lineStatus === 'RELEASED') {
        return `${lineStatus} ${this.$t('fromThe')} ${get(this.content, 'line.updated')}`;
      } else {
        return '-';
      }
    },

    billingStatus() {
      let billingStatus = get(this.content, 'accessPoint.billingStatus');
      if (billingStatus === 'ACTIVATED') {
        billingStatus = this.$t('getparc.actLines.simStatuses.ACTIVATED');
      } else if (billingStatus === 'SUSPENDED') {
        billingStatus = this.$t('getparc.actLines.simStatuses.SUSPENDED');
      } else if (billingStatus === 'CANCELED') {
        billingStatus = this.$t('getparc.actLines.simStatuses.CANCELED');
      } else if (billingStatus === 'TEST') {
        billingStatus = this.$t('getparc.actLines.simStatuses.TEST');
      } else {
        billingStatus = '-';
      }
      return `${billingStatus} ${this.$t('fromThe')}`;
    },

    networkStatus() {
      let networkStatus = get(this.content, 'accessPoint.networkStatus');
      if (networkStatus === 'ACTIVATED') {
        networkStatus = this.$t('getparc.actLines.simStatuses.ACTIVATED');
      } else if (networkStatus === 'SUSPENDED') {
        networkStatus = this.$t('getparc.actLines.simStatuses.SUSPENDED');
      } else if (networkStatus === 'CANCELED') {
        networkStatus = this.$t('getparc.actLines.simStatuses.CANCELED');
      } else if (networkStatus === 'BARRED') {
        networkStatus = this.$t('getparc.actLines.simStatuses.BARRED');
      } else {
        networkStatus = '-';
      }
      return `${networkStatus} ${this.$t('fromThe')}`;
    },

    dateCommitmentEnd() {
      let commitmentEnd = get(this.content, 'accessPoint.commitmentEnd');
      if (!commitmentEnd) return '-';
      return commitmentEnd;
    },
  },

  methods: {
    capitalize(string) {
      return string.charAt(0).toUpperCase() + string.slice(1);
    },
    formatDate(date) {
      let dateOnly = date.substr(0, date.indexOf(' '));
      return date && date.length ? moment(dateOnly, 'DD/MM/YYYY').format('DD/MM/YYYY') : '-';
    },
    getFromContent(path, defaultValue = '') {
      const value = get(this.content, path, defaultValue);
      return value !== null ? value : '';
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
