<template>
  <div>
    <SearchIdInput
      :types="options"
      :selected-search-type.sync="selectedSearchType"
      :input-placeholder="$t('searchActById')"
      :init-value="initValue"
      @findType="findType"
      @searchById="searchById"
    />
  </div>
</template>

<script>
import SearchIdInput from '@/components/SearchIdInput';
import startsWith from 'lodash.startswith';

export default {
  components: {
    SearchIdInput,
  },
  data() {
    const prefix = {
      iccid: {
        'serie-0': '893320',
      },
      imsi: {
        'serie-0': '20820',
        'serie-1': '27007',
      },
      msisdn: {
        'serie-0': '33',
      },
    };
    return {
      selectedSearchType: undefined,
      prefix,
    };
  },
  props: {
    options: {
      type: Array,
    },
    initValue: {
      type: String,
      required: false,
    },
  },
  methods: {
    // Matrice descriptive pour récupérer le format selon la valeur de l'identifiant
    // https://m2m-gitlab.by-docapost.com/powwow-ng/backlog/wikis/documentation/actes-de-gestion#barre-de-recherche-1
    findType(newValue) {
      function checkForLength(str) {
        return str.length;
      }
      if (isNaN(newValue)) {
        // idAct
        this.selectedSearchType = this.options[5].value;
      } else {
        const len = checkForLength(newValue);
        if (len === 19 && startsWith(newValue, this.prefix.iccid['serie-0'])) {
          this.selectedSearchType = this.options[0].value;
        } else if (
          len === 15 &&
          (startsWith(newValue, this.prefix.imsi['serie-0']) ||
            startsWith(newValue, this.prefix.imsi['serie-1']))
        ) {
          this.selectedSearchType = this.options[1].value;
        } else if (
          (len === 15 || len === 11) &&
          startsWith(newValue, this.prefix.msisdn['serie-0'])
        ) {
          this.selectedSearchType = this.options[2].value;
        } else if (len === 15) {
          this.selectedSearchType = this.options[4].value;
        } else if ((len !== 19 || len !== 15 || len !== 11) && len !== 0) {
          this.selectedSearchType = this.options[5].value;
        } else {
          this.selectedSearchType = null;
        }
      }
    },
    searchById(params) {
      this.$emit('searchById', params);
    },
  },
};
</script>

<style scoped></style>
