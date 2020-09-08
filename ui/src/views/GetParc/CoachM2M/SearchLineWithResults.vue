<template>
  <div class="bg-white p-3">
    <SearchByLinesId @searchById="searchById" :init-value="searchByIdValue" disable-when-empty />
    <div v-if="isLoading" class="skeleton-line"></div>
    <template v-else-if="rows && rows.length">
      <ul v-if="rows.length > 1" class="result list-unstyled">
        <li v-for="row in rows" :key="row.id">
          <Checkbox
            input-type="radio"
            :value="row"
            v-model="selectedLine"
            shape="round"
            :filled="true"
          >
            {{ row.iccid }}</Checkbox
          >
        </li>
      </ul>
      <template v-if="rows.length === 1">
        <div class="single-line">
          <i class="ic-Check-Icon mr-2 text-success" />
          {{ selectedLine.iccid }}
        </div>
      </template>
      <slot v-if="selectedLine" :selectedLine="selectedLine" />
    </template>
    <template v-else-if="noResult">
      <div class="mt-2 alert alert-primary">
        {{ $t('noResult') }}
      </div>
    </template>
  </div>
</template>

<script>
import SearchByLinesId from '@/views/GetParc/ActLines/SearchByLinesId';
import { searchLines } from '@/api/linesActions';
import Checkbox from '@/components/ui/Checkbox.vue';

export default {
  components: {
    SearchByLinesId,
    Checkbox,
  },
  props: {
    initValue: String,
  },
  data() {
    return {
      rows: [],
      searchByIdValue: undefined,
      selectedLine: undefined,
      isLoading: false,
      noResult: false,
    };
  },

  watch: {
    selectedLine(newValue) {
      this.$emit('choice', newValue);
    },
  },

  mounted() {
    if (this.initValue) {
      this.searchByIdValue = this.initValue;
    }
  },

  methods: {
    async searchById(filterObj) {
      console.log('searchById -> filterObj', filterObj);
      this.isLoading = true;
      this.searchByIdValue = filterObj.value;
      this.$emit('searchedId', this.searchByIdValue);
      const result = await searchLines({ key: 'id', direction: 'DESC' }, { page: 0, limit: 1 }, [
        filterObj,
      ]);
      this.isLoading = false;
      if (result && result.items && result.items.length) {
        this.rows = result.items;
        if (this.rows && this.rows.length === 1) {
          this.selectedLine = this.rows[0];
        }
      } else {
        this.noResult = true;
      }
    },
  },
};
</script>

<style lang="scss" scoped>
.result {
  padding-top: 1rem;
  margin-top: 1rem;
  border-top: 1px solid $gray-400;
}

.single-line {
  padding-top: 1rem;
  padding-bottom: 1rem;
}
</style>
