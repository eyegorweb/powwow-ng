<template>
  <UiApiAutocomplete :items="items" v-model="selectedItem" display-results-while-empty>
    <img style="font-size: 24px" class="arrow" src="@/assets/search.svg" :style="{ left: 0 }" />
  </UiApiAutocomplete>
</template>

<script>
import UiApiAutocomplete from '@/components/ui/UiApiAutocomplete';
import { fetchReports } from '@/api/reports.js';
import { mapGetters } from 'vuex';

export default {
  components: {
    UiApiAutocomplete,
  },
  props: {
    selectedData: Object,
  },

  data() {
    return {
      items: [],
      selectedItem: undefined,
    };
  },
  computed: {
    ...mapGetters(['singlePartger']),
  },
  watch: {
    selectedData(selectedData) {
      this.selectItemFromProp(selectedData);
    },
    selectedItem(newValue) {
      if (newValue && newValue.id) {
        this.$emit('change', newValue);
      }
    },
  },
  methods: {
    selectItemFromProp(selectedData) {
      if (selectedData) {
        if (this.selectedItem) {
          if (this.selectedItem.id !== selectedData.id) {
            this.selectedItem = this.items.find(i => i.id === selectedData.id);
          }
        } else {
          this.selectedItem = this.items.find(i => i.id === selectedData.id);
        }
      } else {
        this.selectedItem = undefined;
      }
    },
  },
  async mounted() {
    const pagination = { page: 0, limit: 999 };
    const orderBy = {
      key: 'id',
      direction: 'DESC',
    };

    const response = await fetchReports(orderBy, pagination, this.singlePartger);

    if (response.items) {
      this.items = response.items.map(i => ({ id: i.id, label: i.name }));
    }

    this.selectItemFromProp(this.selectedData);
  },
};
</script>

<style lang="scss" scoped></style>
