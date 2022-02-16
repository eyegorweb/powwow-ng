<template>
  <WidgetBloc :widget="widget" @seeMore="onSeeMore">
    <table class="table">
      <thead>
        <tr>
          <th v-if="!userIsPartner">{{ $t('orders.new.customer') }}</th>
          <th>{{ $t('getparc.lineDetail.alarms.name') }}</th>
          <th>{{ $t('lines') }}</th>
        </tr>
      </thead>
      <tbody v-if="!noResults">
        <tr v-for="indicator in indicators" :key="indicator.id">
          <td v-if="!userIsPartner">{{ formattedLabel(indicator.labelKey) }}</td>
          <td>
            <a href="#" @click.prevent="onClick(indicator.entityId)" class="nameLink">
              {{
                indicator.name.length > 20
                  ? indicator.name.substring(0, 20) + '...'
                  : indicator.name
              }}
              <span class="nameLink-tooltip">{{ indicator.name }}</span>
            </a>
          </td>
          <td>
            <span>{{ indicator.total }}</span>
          </td>
        </tr>
        <tr v-if="specificMessage">
          <td colspan="3">
            <em>{{ specificMessage }}</em>
          </td>
        </tr>
      </tbody>
      <tbody v-else>
        <tr>
          <td>{{ $t('noResult') }}</td>
        </tr>
      </tbody>
    </table>
  </WidgetBloc>
</template>

<script>
import WidgetBloc from './WidgetBloc';
import { fetchEntitiesIndicators } from '@/api/indicators.js';
import { mapGetters } from 'vuex';
import { truncateLabel } from '@/utils';

export default {
  components: {
    WidgetBloc,
  },
  props: {
    widget: Object,
    contextFilters: Array,
  },
  data() {
    return {
      indicators: undefined,
      specificMessage: undefined,
    };
  },
  computed: {
    ...mapGetters(['userIsPartner', 'appIsReady']),
    noResults() {
      return this.indicators && !this.indicators.length ? true : false;
    },
  },
  async mounted() {
    await this.loadListTriggeredAlarms();
  },
  methods: {
    async loadListTriggeredAlarms() {
      const listTopIndicators = await fetchEntitiesIndicators([`ALARM_TRIGGERED`]);
      this.indicators = listTopIndicators.map((i, index) => {
        return {
          total: i.numberValue,
          name: i.stringValue,
          clickable: true,
          labelKey: i.partyName,
          id: `${i.name}_${index}`,
          entityId: i.entityId,
          stringValue: i.stringValue,
          linked: true,
        };
      });
      this.displayInfoMessage();
    },
    formattedLabel(label) {
      return truncateLabel(label);
    },
    displayInfoMessage() {
      if (this.noResults) return;
      if (this.indicators && this.indicators.length && this.indicators.length < 5) {
        this.specificMessage = this.$t('home.widgets.message.triggeredAlarm');
      } else {
        this.specificMessage = '';
      }
    },
    onSeeMore() {
      this.$pushAnalytics({ event: 'm2m.seeMore', widget: 'TriggeredAlarm' });
      this.$router.push({
        name: 'alarms',
        params: {
          queryFilters: [],
        },
      });
    },
    onClick(id) {
      this.$router.push({
        name: 'alarmDetail',
        params: { alarmId: id, tabIndex: 0 },
      });
    },
  },
};
</script>

<style lang="scss" scoped>
.nameLink {
  position: relative;

  &-tooltip {
    display: none;
  }
  &:hover {
    .nameLink-tooltip {
      display: block;
      position: absolute;
      background: #000;
      color: white;
      padding: 5px 10px;
      border-radius: 5px;
      top: -20px;
    }
  }
}
.table {
  td {
    font-size: 0.8rem;
    color: $dark-gray;
    padding: 0.5rem 0.75rem 0.4rem;
    button {
      color: $orange;
    }
  }
  th {
    font-size: 0.7rem;
    font-weight: 500;
    color: $dark-gray;
    text-transform: uppercase;
  }
}
</style>
