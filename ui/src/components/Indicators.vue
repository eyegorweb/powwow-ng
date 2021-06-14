<template>
  <div>
    <ul v-if="showIndicators" class="list-group bg-white" :class="listClasses">
      <IndicatorItem
        v-for="indicator in visibleIndicators"
        :key="indicator.labelKey"
        :indicator="indicator"
        :disable-click="disableClick"
        :can-refresh="canRefresh"
        :on-click="onClick"
        :precalculated="precalculated"
        @removeme="(i) => removeIndicator(i)"
      />
    </ul>
    <div v-if="lastUpdateDate" class="update-date">
      {{ $t('lastUpdate') }}: {{ lastUpdateDate }}
    </div>
  </div>
</template>

<script>
import IndicatorItem from './IndicatorItem';
import { mapGetters, mapState } from 'vuex';
import { fetchPrecalculatedIndicators } from '@/api/indicators.js';
import { isBefore } from '@/utils/date.js';
import { delay } from '@/api/utils.js';

export default {
  components: {
    IndicatorItem,
  },
  props: {
    meta: Array,
    onClick: {
      type: Function,
      required: false,
    },
    canRefresh: {
      type: Boolean,
      default: true,
    },
    disableClick: Boolean,
    noBorders: Boolean,
    small: Boolean,
    precalculated: Boolean,
    appliedFiltersValue: Array,
  },

  data() {
    return {
      indicators: [],
      isIndicatorsLoading: false,
      lastUpdateDate: undefined,
      showIndicators: true,
    };
  },

  async mounted() {
    if (this.precalculated) {
      const partners = this.contextPartners.map((p) => p.id) || [];
      this.loadPrecalculated(partners);
    } else {
      this.indicators = this.meta;
    }
  },

  computed: {
    ...mapGetters(['userIsBO', 'userIsPartner']),
    ...mapState('userContext', ['contextPartnersType', 'contextPartners']),

    visibleIndicators() {
      return this.indicators.filter((i) => {
        if (i.isVisibleFn) {
          return i.isVisibleFn();
        }
        if (!i.roles) return true;

        if (this.userIsBO) {
          return !!i.roles.find((r) => r === 'BO');
        }

        if (this.userIsPartner) {
          return !!i.roles.find((r) => r === 'PARTNER');
        }
        return true;
      });
    },
    listClasses() {
      const classNames = [];
      if (this.noBorders) classNames.push('no-borders');
      if (this.small) classNames.push('small-text');

      return classNames.join(' ');
    },
  },
  methods: {
    removeIndicator(indicatorToRemove) {
      this.indicators = this.indicators.filter((i) => i !== indicatorToRemove);
    },
    async loadPrecalculated(partners) {
      const keys = this.meta
        .filter((i) => i.fetchKey !== '')
        .filter((i) => i.fetchKey)
        .map((i) => i.fetchKey);

      const unknownKeys = this.meta.filter((i) => i.fetchKey === '');
      if (unknownKeys && unknownKeys.length) {
        console.warn(
          'Indicateurs inconnus : ',
          unknownKeys.map((i) => this.$t(i.labelKey))
        );
      }

      const responseIndicators =
        (await fetchPrecalculatedIndicators(keys, partners, this.contextPartnersType)) || [];
      this.showIndicators = false;
      // reset meta indicators
      this.indicators = this.meta.map((i) => {
        if (i.precalculatedValue) {
          i.precalculatedValue = undefined;
        }
      });
      // fill meta indicators
      this.indicators = this.meta.map((i) => {
        const response = responseIndicators.find((r) => r.name === i.fetchKey);
        if (response) {
          i.precalculatedValue = response;
        }
        return i;
      });

      await delay(1);
      this.showIndicators = true;

      const ordered = this.indicators
        .filter((i) => !!i.precalculatedValue)
        .sort((a, b) =>
          isBefore(a.precalculatedValue.updateDate, b.precalculatedValue.updateDate) ? -1 : 1
        );

      if (ordered.length) {
        this.lastUpdateDate = ordered[0].precalculatedValue.updateDate;
      }
    },
  },
  watch: {
    contextPartners() {
      let partners;
      partners = this.contextPartners.map((p) => p.id);
      this.loadPrecalculated(partners);
    },
    contextPartnersType() {
      let partners;
      partners = this.contextPartners.map((p) => p.id);
      this.loadPrecalculated(partners);
    },
    appliedFiltersValue(partners) {
      this.loadPrecalculated(partners);
    },
  },
};
</script>

<style lang="scss" scoped>
.no-borders {
  li {
    border: none;
    border-top: 1px solid rgba(0, 0, 0, 0.125);
  }
}
.small-text {
  li {
    font-size: 0.8rem;
    padding-bottom: 0.4rem;
  }
}
.info-message {
  font-size: 0.8rem;
  font-style: italic;
  padding: 0.75rem 1.25rem;
  border-top: 1px solid rgba(0, 0, 0, 0.125);
}
</style>
