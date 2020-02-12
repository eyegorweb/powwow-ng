<template>
  <SearchIdInput
    :types="idsOptions"
    :selected-search-type.sync="selectedSearchType"
    :input-placeholder="$t(placeholder)"
    :init-value="initValue"
    @findType="findType"
    @searchById="searchById"
    @valueChange="$emit('valueChange', $event)"
    :inline="inline"
    :no-search-button="noSearchButton"
  />
</template>

<script>
import SearchIdInput from '@/components/SearchIdInput';
import startsWith from 'lodash.startswith';

export default {
  components: {
    SearchIdInput,
  },
  props: {
    inline: {
      type: Boolean,
      default: true,
    },
    initValue: {
      type: String,
      required: false,
    },

    additionalIds: {
      type: Array,
      default: () => {
        return [];
      },
    },
    placeholder: {
      type: String,
      default: '',
    },

    noSearchButton: Boolean,
  },
  computed: {
    idsOptions() {
      return [...this.valuesForSelectOptions, ...this.additionalIds];
    },
  },
  data() {
    return {
      selectedSearchType: undefined,
      valuesForSelectOptions: [
        {
          code: 'c1',
          value: 'iccid',
          label: 'ICCID',
          checkFn: value => value.length === 19 && startsWith(value, '893320'),
        },
        {
          code: 'c2',
          value: 'imsi',
          label: 'IMSI',
          checkFn: value =>
            value.length === 15 && (startsWith(value, '20820') || startsWith(value, '27007')),
        },
        {
          code: 'c3',
          value: 'msisdn',
          label: 'MSISDN',
          checkFn: value => (value.length === 15 || value.length === 11) && startsWith(value, '33'),
        },
        {
          code: 'c4',
          value: 'msisdnA',
          label: 'A-MSISDN',
        },
        {
          code: 'c5',
          value: 'imei',
          label: 'IMEI',
          checkFn: value => value.length === 15,
        },
      ],
    };
  },
  methods: {
    // Matrice descriptive pour récupérer le format selon la valeur de l'identifiant
    // https://m2m-gitlab.by-docapost.com/powwow-ng/backlog/wikis/documentation/recherche-de-lignes#barre-de-recherche
    findType(newValue) {
      const matched = this.idsOptions.filter(o => {
        if (o.checkFn) {
          return o.checkFn(newValue);
        }
        return false;
      });
      if (matched && matched.length) {
        this.selectedSearchType = matched[0].value;
      }
    },
    searchById(params) {
      this.$emit('searchById', params);
    },
  },
};
</script>

<style scoped></style>
