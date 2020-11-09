<template>
  <WidgetBloc :widget="widget" large>
    <div slot="header">
      <div class="d-flex">
        <UiSelect
          v-if="canSelectPartner"
          class="text-gray"
          v-model="selectedPartner"
          :placeholder="$t('getparc.actCreation.ManageCancellation.choose')"
          :options="names"
          small
        ></UiSelect>
      </div>
    </div>
    <ul class="list-group bg-white">
      <li class="list-group-item" v-for="(indicator, i) in indicators" :key="'indicator.name_' + i">
        <span>{{ indicator.labelKey }}</span>
        <div class="float-right">
          <button class="btn btn-link p-0" disabled>
            <span v-if="indicator.increasedValue !== undefined">
              <i v-if="indicator.increasedValue" class="arrow ic-Arrow-Up-Icon increase"></i>
              <i v-if="!indicator.increasedValue" class="arrow ic-Arrow-Down-Icon decrease"></i>
              <span
                :class="{ increase: indicator.increasedValue, decrease: !indicator.increasedValue }"
                >{{ indicator.value }}</span
              >
            </span>
            <span v-else>{{ indicator.value }}</span>
          </button>
        </div>
      </li>
    </ul>
  </WidgetBloc>
</template>

<script>
import WidgetBloc from './WidgetBloc';
import UiSelect from '@/components/ui/UiSelect';
import { mapState } from 'vuex';
import { fetchpartners } from '@/api/partners';
import { fetchActiveAndBilledLines } from '@/api/indicators.js';
import moment from 'moment';
import { isBefore, DATE_FORMAT } from '@/utils/date';

const currentMonth = moment()
  .startOf('month')
  .format(DATE_FORMAT);
const prevCurrentMonth = moment()
  .subtract(1, 'month')
  .startOf('month')
  .format(DATE_FORMAT);

export default {
  components: {
    WidgetBloc,
    UiSelect,
  },

  props: {
    widget: Object,
  },

  data() {
    return {
      selectedPartner: undefined,
      partners: [],
      names: [],
      indicators: [],
      previousValue: undefined,
    };
  },

  mounted() {
    this.initPartners();
    this.refreshIndicators(this.selectedPartner);
  },

  computed: {
    ...mapState('userContext', ['contextPartnersType', 'contextPartners']),
    canSelectPartner() {
      return this.names && this.names.length > 0;
    },
  },

  methods: {
    async fetchPartners(q, { page, limit }) {
      const data = await fetchpartners(q, {
        page,
        limit,
        partnerType: this.contextPartnersType,
      });
      if (data) {
        return data.map(p => ({
          id: p.id,
          name: p.name,
        }));
      }
      return undefined;
    },
    fetchPartnerId(id) {
      const found = this.partners.find(p => p.name === id);
      return found ? found.id : '';
    },
    async initPartners() {
      if (this.contextPartners && this.contextPartners.length > 0) {
        this.partners = this.contextPartners.map(p => ({
          id: p.id,
          name: p.name,
        }));
      } else {
        this.partners = await this.fetchPartners('', { page: 0, limit: 999 });
      }
      this.names = this.partners.map(p => p.name);
    },

    async refreshIndicators(partner) {
      const partyId = this.fetchPartnerId(partner);
      const response = await fetchActiveAndBilledLines(partyId);

      this.indicators = response
        .reduce((all, r) => {
          let translatedIndicator, increasedValue;
          // Indicateurs d'activation
          if (r.name === 'SIM_ACTIVATED') {
            // on met au même niveau les données et on inverse le tableau pour faciliter la comparaison de la donnée M-1 avec la donnée M (mois courant)
            let arraySimActivated = r.histories.flat().reverse();
            arraySimActivated.map(a => {
              // traduction du label
              if (a.applicationDate === prevCurrentMonth) {
                translatedIndicator = this.$t(
                  'home.widgets.activeCustomerPark.activatedLinesPreviousMonth'
                );
                // on stocke la valeur M-1...
                this.previousValue = a.numberValue;
              } else if (a.applicationDate === currentMonth) {
                translatedIndicator = this.$t('home.widgets.activeCustomerPark.activatedLines');
                // ... pour la comparer à la valeur M (mois courant)
                if (this.previousValue !== undefined && a.numberValue > this.previousValue) {
                  increasedValue = true;
                } else if (this.previousValue !== undefined && a.numberValue < this.previousValue) {
                  increasedValue = false;
                }
              } else {
                // on ne veut pas récupérer les dates au delà de M-1
                return;
              }
              all.push({
                name: r.name,
                labelKey: translatedIndicator,
                value: a.numberValue,
                date: a.applicationDate,
                increasedValue,
              });
            });
          }
          // Indicateurs des factures (même algo que pour les indicateurs d'activation)
          if (r.name === 'SIM_BILLED') {
            let arraySimBilled = r.histories.flat().reverse();
            arraySimBilled.map(a => {
              if (a.applicationDate === prevCurrentMonth) {
                translatedIndicator = this.$t(
                  'home.widgets.activeCustomerPark.billedLinesPreviousMonth'
                );
                this.previousValue = a.numberValue;
              } else if (a.applicationDate === currentMonth) {
                translatedIndicator = this.$t('home.widgets.activeCustomerPark.billedLines');
                if (this.previousValue !== undefined && a.numberValue > this.previousValue) {
                  increasedValue = true;
                } else if (this.previousValue !== undefined && a.numberValue < this.previousValue) {
                  increasedValue = false;
                }
              } else {
                return;
              }
              all.push({
                name: r.name,
                labelKey: translatedIndicator,
                value: a.numberValue,
                date: a.applicationDate,
                increasedValue,
              });
            });
          }
          return all;
        }, [])
        .sort((a, b) => (!isBefore(a.date, b.date, DATE_FORMAT) ? -1 : 1));
    },
  },

  watch: {
    selectedPartner(newPartner) {
      this.refreshIndicators(newPartner);
    },
    contextPartners() {
      this.initPartners();
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
  i.increase,
  span.increase {
    color: $success;
  }
  i.decrease,
  span.decrease {
    color: $orange;
  }
}
</style>
