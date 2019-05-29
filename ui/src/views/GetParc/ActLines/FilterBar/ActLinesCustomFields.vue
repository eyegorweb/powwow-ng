<template>
  <CustomFieldsFilter
    :custom-fields="filterCustomFieldsList"
    :values="selectedCustomFieldsValues"
    @updateCustomFields="setCustomFieldsFilter"
  />
</template>

<script>
import CustomFieldsFilter from '@/components/Filters/CustomFieldsFilter';
import { mapGetters, mapMutations } from 'vuex';

export default {
  name: 'GetSimCustomFields',

  data() {
    return {
      searchedField: undefined,
      selectedPartner: null,
      selectedDate: undefined,
    };
  },

  computed: {
    ...mapGetters('actLines', ['filterCustomFieldsList', 'selectedCustomFieldsValues']),
  },

  methods: {
    ...mapMutations('actLines', ['setCustomFieldsFilter']),
  },

  components: {
    CustomFieldsFilter,
  },
};
</script>
