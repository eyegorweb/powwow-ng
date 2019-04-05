<template>
  <form class="searchInput">
    <div class="form-row">
      <div class="form-group col-md-8 mb-0">
        <SearchWithSelect
          :options="valuesForSelectOptions"
          :query.sync="resultQuery"
          :type.sync="resultType"
          :input-placeholder="inputPlaceholder"
          :select-placeholder="selectPlaceholder"
        />
      </div>
      <div class="form-group col-md-3 mb-0">
        <UiButton
          :variant="isDisabled ? 'primary' : ''"
          :disabled="!isDisabled"
          @click="fetchOrders"
          >{{ $t('search') }}</UiButton
        >
      </div>
    </div>
  </form>
</template>

<script>
import SearchWithSelect from '@/components/SearchWithSelect';
import UiButton from '@/components/ui/Button';
import startsWith from 'lodash.startswith';
import { mapGetters, mapActions, mapMutations } from 'vuex';

export default {
  data() {
    return {
      valuesForSelectOptions: [
        {
          code: 'c1',
          value: 'iccid',
          label: 'ICCID',
        },
        {
          code: 'c2',
          value: 'imsi',
          label: 'IMSI',
        },
        {
          code: 'c3',
          value: 'msisdn',
          label: 'MSISDN',
        },
        {
          code: 'c4',
          value: 'imei',
          label: 'IMEI',
        },
        {
          code: 'c5',
          value: 'idOrder',
          label: this.$t('orders.search.order-id'),
        },
        {
          code: 'c6',
          value: 'orderReference',
          label: this.$t('orders.search.client-reference'),
        },
      ],
      inputPlaceholder: this.$t('searchOrderById'),
      selectPlaceholder: this.$t('type'),
      selectedSearchType: null,
      inputSearchValue: undefined,
    };
  },

  computed: {
    ...mapGetters('getsim', ['appliedFilters']),
    resultType: {
      get() {
        return this.selectedSearchType;
      },
      set(newType) {
        // this.inputSearchValue = '';
        this.selectedSearchType = newType;
      },
    },
    resultQuery: {
      get() {
        return this.inputSearchValue;
      },
      set(newValue) {
        // Matrice descriptive pour récupérer le format selon la valeur de l'identifiant
        // https://m2m.extelia.fr/gitlab/powwow-ng/backlog/wikis/documentation/commande#barre-de-recherche
        function checkForLength(str) {
          return str.length;
        }
        if (isNaN(newValue)) {
          this.selectedSearchType = this.valuesForSelectOptions[5].value;
        } else {
          const len = checkForLength(newValue);
          if (len === 19 && startsWith(newValue, '893320')) {
            this.selectedSearchType = this.valuesForSelectOptions[0].value;
          } else if (
            len === 15 &&
            (startsWith(newValue, '20820') || startsWith(newValue, '27007'))
          ) {
            this.selectedSearchType = this.valuesForSelectOptions[1].value;
          } else if ((len === 15 || len === 11) && startsWith(newValue, '33')) {
            this.selectedSearchType = this.valuesForSelectOptions[2].value;
          } else if (len === 15) {
            this.selectedSearchType = this.valuesForSelectOptions[3].value;
          } else if ((len !== 19 || len !== 15 || len !== 11) && len !== 0) {
            this.selectedSearchType = this.valuesForSelectOptions[4].value;
          } else {
            this.selectedSearchType = null;
          }
        }
        this.inputSearchValue = newValue;
      },
    },
    isDisabled: {
      get() {
        return !!this.resultType && !!this.inputSearchValue;
      },
    },
  },

  methods: {
    ...mapActions('getsim', ['fetchOrdersFromApi']),
    ...mapMutations('getsim', ['clearAllFilters', 'forceAppliedFilters']),
    async fetchOrders() {
      // la table de résultats ( GetSimOrders) lance une recherche à chaque fois que le filtre est modifié ( appliqué ), pour effectuer une recherche par ID,
      // on applique directement un filtre sans passer par le process normal ( selection -> appliquer les filtres)
      this.forceAppliedFilters([
        {
          id: 'filters.' + this.selectedSearchType,
          value: this.resultQuery,
        },
      ]);
    },
  },

  components: {
    SearchWithSelect,
    UiButton,
  },
};
</script>

<style scoped></style>
