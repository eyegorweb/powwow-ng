<template>
  <div>
    <draggable handle=".handle">
      <ContentBlock :key="'block1'">
        <template slot="title">
          {{ $t('getparc.lineDetail.tab1.billingOffer.billingAccount') }}
        </template>
        <template slot="content">
          <div class="d-flex">
            <div class="item">
              <h6>{{ $t('getparc.lineDetail.tab1.billingOffer.billingAccount') }}:</h6>
                <p>
                  {{ getFromContent('accessPoint.offerGroup.customerAccount.code') }} - {{ getFromContent('accessPoint.offerGroup.customerAccount.name') }}
                </p>
            </div>
            <div class="item">
              <h6>{{ $t('getparc.lineDetail.tab1.billingOffer.offerName') }}:</h6>
                <p>
                  {{ getFromContent('accessPoint.offer.marketingOffer.description') }}
                </p>
            </div>
            <div class="item">
              <h6>{{ $t('getparc.lineDetail.tab1.billingOffer.endCommitmentDate') }}:</h6>
                <p>
                  {{ dateCommitmentEnd }}
                </p>
            </div>
            <div class="item">
              <h6>{{ $t('getparc.lineDetail.tab1.billingOffer.billingStatus') }}:</h6>
                <p>
                  {{ billingStatus }}
                </p>
            </div>
          </div>
        </template>
      </ContentBlock>
      <ContentBlock :key="'block2'">
        <template slot="title">
          {{ $t('getparc.lineDetail.tab1.billingOffer.detailStatus') }}
        </template>
        <template slot="content">
          <div class="d-flex">
            <div class="item">
              <h6>{{ $t('getparc.actLines.col.simStatus') }}:</h6>
                <p>
                  {{ simStatus }}
                </p>
            </div>
            <div class="item">
              <h6>{{ $t('getparc.actLines.col.lineStatus') }}:</h6>
                <p>
                  {{ lineStatus }}
                </p>
            </div>
            <div class="item">
              <h6>{{ $t('filters.lines.networkStatus') }}:</h6>
                <p>
                  {{ networkStatus }}
                </p>
            </div>
            <div class="item">
              <h6>{{ $t('getparc.lineDetail.tab1.billingOffer.billingStatus') }}:</h6>
                <p>
                  {{ billingStatus }}
                </p>
            </div>
            <div class="item">
              <h6>{{ $t('filters.lines.commercialStatus') }}:</h6>
                <p>
                  {{ commercialStatus }}
                </p>
            </div>
          </div>
        </template>
      </ContentBlock>
      <ContentBlock :key="'block3'">
        <template slot="title">
          {{ $t('getparc.lineDetail.tab1.billingOffer.timeForSuspendedOffer') }}
        </template>
        <template slot="content">
          <div class="d-flex">
            <div class="item">
              <h6>{{ $t('getparc.lineDetail.tab1.billingOffer.remainingTime') }}:</h6>
                <p>
                  {{ $t('getparc.lineDetail.tab1.billingOffer.descriptionTimeForSuspendedOffer') }}
                </p>
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
import { fetchCommercialStatuses } from '@/api/linesActions';

export default {
  components: {
    draggable,
    ContentBlock,
  },

  async mounted() {
    this.commercialStatuses = await fetchCommercialStatuses();
    const foundCommercialStatus = this.commercialStatuses
      .map(l => {
        return this.$t(`${'getparc.actLines.commercialStatuses.'}${l}`);
      })
      .find(s => s.indexOf(get(this.content, 'accessPoint.commercialStatus' !== -1)));
    this.commercialStatus = `${foundCommercialStatus} ${this.$t('fromThe')} ${get(
      this.content,
      'accessPoint.commercialStatusDate'
    )}`;
  },

  props: {
    content: Object,
  },

  data() {
    return {
      commercialStatuses: [],
      commercialStatus: '-',
    };
  },

  computed: {
    simStatus() {
      const simStatus = get(this.content, 'statuts');
      if (simStatus === 'AVAILABLE') {
        return `${this.$t('getparc.lineDetail.tab1.statuses.ALLOCATED')} ${get(
          this.content,
          'created'
        )}`;
      } else if (simStatus === 'ALLOCATED') {
        const result = get(this.content, 'accessPoint.activationDate')
          ? get(this.content, 'accessPoint.activationDate')
          : get(this.content, 'accessPoint.preactivationDate');
        return `${this.$t('getparc.lineDetail.tab1.statuses.ALLOCATED')} ${result}`;
      } else if (simStatus === 'ALLOCATING') {
        return `${this.$t('getparc.lineDetail.tab1.statuses.ALLOCATING')} ${get(
          this.content,
          'updated'
        )}`;
      } else if (simStatus === 'RELEASED') {
        return `${this.$t('getparc.lineDetail.tab1.statuses.RELEASED')} ${get(
          this.content,
          'updated'
        )}`;
      } else if (simStatus === 'RESERVED') {
        return `${this.$t('getparc.lineDetail.tab1.statuses.RESERVED')} ${get(
          this.content,
          'updated'
        )}`;
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
      return `${billingStatus} ${this.$t('fromThe')} ${get(
        this.content,
        'accessPoint.billingStatusChangeDate'
      )}`;
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
      return `${networkStatus} ${this.$t('fromThe')} ${get(
        this.content,
        'accessPoint.activationDate'
      )}`;
    },

    dateCommitmentEnd() {
      let commitmentEnd = get(this.content, 'accessPoint.commitmentEnd');
      if (!commitmentEnd) return '-';
      return commitmentEnd;
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
