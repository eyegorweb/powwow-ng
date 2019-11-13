<template>
  <div>
    <ul class="list-group bg-white" :class="listClasses">
      <IndicatorItem
        v-for="indicator in indicatorsWithCompatibleRoles"
        :key="indicator.labelKey"
        :indicator="indicator"
        :on-click="onClick"
        :precalculated="precalculated"
        @removeme="i => removeIndicator(i)"
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
    noBorders: Boolean,
    small: Boolean,
    precalculated: Boolean,
  },

  data() {
    return {
      indicators: [],
      isIndicatorsLoading: false,
      lastUpdateDate: undefined,
    };
  },

  async mounted() {
    if (this.precalculated) {
      this.loadPrecalculated();
    } else {
      this.indicators = this.meta;
    }
  },

  computed: {
    ...mapGetters(['userIsBO', 'userIsPartner']),
    ...mapState('userContext', ['contextPartnersType', 'contextPartners']),

    indicatorsWithCompatibleRoles() {
      return this.indicators.filter(i => {
        if (!i.roles) return true;

        if (this.userIsBO) {
          return !!i.roles.find(r => r === 'BO');
        }

        if (this.userIsPartner) {
          return !!i.roles.find(r => r === 'PARTNER');
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
      this.indicators = this.indicators.filter(i => i !== indicatorToRemove);
    },
    async loadPrecalculated() {
      const keys = this.meta
        .filter(i => i.fetchKey !== '')
        .filter(i => i.fetchKey)
        .map(i => i.fetchKey);

      const unknownKeys = this.meta.filter(i => i.fetchKey === '');
      if (unknownKeys && unknownKeys.length) {
        console.warn('Indicateurs inconnus : ', unknownKeys.map(i => this.$t(i.labelKey)));
      }

      let partners;
      if (this.contextPartners) {
        partners = this.contextPartners.map(p => p.id);
      }

      const responseIndicators = await fetchPrecalculatedIndicators(
        keys,
        partners,
        this.contextPartnersType
      );
      this.indicators = this.meta.map(i => {
        const response = responseIndicators.find(r => r.name === i.fetchKey);
        if (response) {
          i.precalculatedValue = response;
        }
        return i;
      });

      const ordered = this.indicators
        .filter(i => !!i.precalculatedValue)
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
      this.loadPrecalculated();
    },
    contextPartnersType() {
      this.loadPrecalculated();
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
.update-date {
  text-align: right;
  font-size: 11px;
  font-style: italic;
  padding-right: 5px;
}
</style>
