<template>
  <WidgetBloc :widget="widget">
    <Toggle
      v-if="toggleValues"
      @update="updateContentType"
      :values="toggleValues"
      class="pl-2"
      slim-toggles
      block
    />
    <ul v-if="!noResults" class="list-group bg-white">
      <li class="list-group-item" v-for="indicator in indicators" :key="indicator.id">
        <div>
          <span :class="{ top: indicator.class === 'top', flop: indicator.class === 'flop' }"
            >{{ indicator.indice }}&nbsp;</span
          >
          <span>{{ indicator.labelKey }}</span>
          <div class="float-right">
            <button class="btn btn-link p-0" :disabled="true">
              <span>{{ indicator.total }} {{ indicator.unit }}</span>
            </button>
          </div>
        </div>
      </li>
      <li v-if="specificMessage" class="list-group-item">
        <em>{{ specificMessage }}</em>
      </li>
    </ul>
    <div v-else class="noResult alert-light" role="alert">{{ $t('noResult') }}</div>
  </WidgetBloc>
</template>

<script>
import WidgetBloc from '@/views/Home/widgets/WidgetBloc';
import Toggle from '@/components/ui/UiToggle2';
import { fetchBillingExchange } from '@/api/indicators.js';
import { mapState } from 'vuex';

export default {
  components: {
    WidgetBloc,
    Toggle,
  },
  props: {
    widget: Object,
  },
  computed: {
    ...mapState('userContext', ['contextPartnersType']),
    noResults() {
      return this.indicators && !this.indicators.length ? true : false;
    },
  },
  async mounted() {
    await this.refreshIndicatorsForPeriod();
  },
  data() {
    return {
      indicators: undefined,
      period: '0',
      specificMessage: undefined,
      toggleValues: [
        {
          id: '1',
          label: 'M-1',
          default: this.period === '1',
        },
        {
          id: '2',
          label: 'M-2',
          default: this.period === '2',
        },
        {
          id: '3',
          label: 'M-3',
          default: this.period === '3',
        },
      ],
    };
  },
  methods: {
    async updateContentType(newVal) {
      this.period = newVal.id;
      await this.refreshIndicatorsForPeriod();
    },
    async refreshIndicatorsForPeriod() {
      let period = this.period;
      let top3;
      let flop2;
      const listIndicators = await fetchBillingExchange(period, this.contextPartnersType);
      const temp = listIndicators.map((i, index) => {
        return {
          total: i.amount,
          labelKey: i.partyName,
          id: i.partyId,
          indice: `${index + 1}. `,
        };
      });

      // On récupère les 3 premiers éléments pour définir le Top 3
      top3 = temp.slice(0, 3).map(i => {
        return {
          ...i,
          class: 'top',
        };
      });
      this.displayInfoMessage();

      // Si on a en tout 4 éléments, alors on a un Top 3 et un Flop 1
      if (temp.length === 4) {
        flop2 = temp.slice(-1).map(i => {
          return {
            ...i,
            class: 'flop',
          };
        });
        this.indicators = top3.concat(flop2);
      }
      // Sinon si on a plus de 4 éléments on récupère un Top 3 et un Flop 2
      else if (temp.length > 4) {
        flop2 = temp.slice(-2).map(i => {
          return {
            ...i,
            class: 'flop',
          };
        });
        this.indicators = top3.concat(flop2);
      }
      // Sinon on n'a qu'un Top 3 et pas de Flop
      else {
        this.indicators = top3;
      }
    },
    // Fonction pour insérer un '-' si on a moins de 5 éléments à la première ligne vide rencontréd
    displayInfoMessage(limit = 5) {
      if (this.noResults) return;
      if (this.indicators && this.indicators.length && this.indicators.length < limit) {
        this.specificMessage = '-';
      } else {
        this.specificMessage = '';
      }
    },
  },
  watch: {
    async contextPartnersType() {
      await this.refreshIndicatorsForPeriod();
    },
  },
};
</script>

<style lang="scss" scoped>
li {
  border: none;
  border-top: 1px solid rgba(0, 0, 0, 0.125);
  font-size: 0.8rem;
  padding-bottom: 0.4rem;
  &:first-child {
    border-top: none;
  }
}
.noResult {
  padding: 0.75rem 0.5rem;
}
.top {
  color: $success !important;
}
.flop {
  color: $orange !important;
}
</style>
