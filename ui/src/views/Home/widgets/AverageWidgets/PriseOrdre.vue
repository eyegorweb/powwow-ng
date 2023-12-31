<template>
  <WidgetBloc :widget="widget">
    <Toggle
      v-if="toggleValues && chosenPeriod !== undefined"
      @update="updateContentType"
      :values="toggleValues"
      class="pl-2"
      slim-toggles
      block
      no-translation
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
import moment from 'moment';
import { capitalize } from '@/utils';

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
    this.listIndicators = await fetchBillingExchange(this.rubric, this.contextPartnersType);
    this.chosenPeriod = this.listIndicators.length - 1;
    this.toggleValues = this.fillToggleValues(this.listIndicators);
    this.refreshIndicatorsForPeriod();
  },
  data() {
    return {
      listIndicators: undefined,
      indicators: undefined,
      chosenPeriod: undefined,
      specificMessage: undefined,
      rubric: 'PO',
      toggleValues: [],
    };
  },
  methods: {
    fillToggleValues(listIndicators) {
      if (!listIndicators && !listIndicators.length) return;
      return listIndicators.map((indicator, index) => {
        const periodParts = indicator.periode.split('/');
        const mountNumber = parseInt(periodParts[1]) - 1;

        return {
          id: index,
          label: capitalize(
            moment()
              .month(mountNumber)
              .format('MMMM')
          ),
          default: this.chosenPeriod === index,
        };
      });
    },
    updateContentType(newVal) {
      this.chosenPeriod = newVal.id;
      this.refreshIndicatorsForPeriod();
    },
    async refreshIndicatorsForPeriod() {
      let period = this.chosenPeriod;
      let top3;
      let flop2;
      let temp;
      if (this.listIndicators && this.listIndicators.length) {
        temp = this.listIndicators[period].billingExchanges.map((i, index) => {
          return {
            total: i.amount,
            labelKey: i.partyName,
            id: i.partyId,
            indice: `${index + 1}. `,
          };
        });

        // On récupère les 3 premiers éléments pour définir le Top 3
        top3 = temp.slice(0, 3).map((i) => {
          return {
            ...i,
            class: 'top',
          };
        });
        this.displayInfoMessage(temp);
        // Si on a en tout 4 éléments, alors on a un Top 3 et un Flop 1
        if (temp.length === 4) {
          flop2 = temp.slice(-1).map((i) => {
            return {
              ...i,
              class: 'flop',
            };
          });
          this.indicators = top3.concat(flop2);
        }
        // Sinon si on a plus de 4 éléments on récupère un Top 3 et un Flop 2
        else if (temp.length > 4) {
          flop2 = temp.slice(-2).map((i) => {
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
      }
    },
    // Fonction pour insérer un '-' si on a moins de 5 éléments à la première ligne vide rencontréd
    displayInfoMessage(array, limit = 5) {
      if (this.noResults) return;
      if (array && array.length && array.length < limit) {
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
