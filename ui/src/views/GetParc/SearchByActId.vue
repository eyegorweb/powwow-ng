<template>
  <SearchIdInput
    :types="options"
    :selected-search-type.sync="selectedSearchType"
    :input-placeholder="$t('searchActById')"
    @findType="findType"
    @searchById="searchById"
  />
</template>

<script>
import SearchIdInput from '@/components/SearchIdInput';
import startsWith from 'lodash.startswith';

export default {
  components: {
    SearchIdInput,
  },
  data() {
    return {
      selectedSearchType: undefined,
    };
  },
  props: {
    options: {
      type: Array,
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
        if (len === 19 && startsWith(newValue, '893320')) {
          this.selectedSearchType = this.options[0].value;
        } else if (len === 15 && (startsWith(newValue, '20820') || startsWith(newValue, '27007'))) {
          this.selectedSearchType = this.options[1].value;
        } else if ((len === 15 || len === 11) && startsWith(newValue, '33')) {
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
