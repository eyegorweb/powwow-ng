<template>
  <div clas="container">
    <div v-for="(config, item) in fields" :key="config.type" class="container">
      <div v-if="config.type === 'input'">
        <UiInput
          placeholder="Rechercher un partenaire"
          :value.sync="searchedField"
          class="container m-2 p-2"
        />
      </div>
      <MultiChoices
        v-else-if="config.type === 'multichoices'"
        :values="fields[item].values"
        :selected-values.sync="selectedChoices"
        class="ml-3 p-1"
      />
      <UiDate v-else-if="config.type === 'date'" :date-value.sync="selectedDate" />
    </div>
  </div>
</template>

<script>
import UiInput from '@/components/ui/UiInput';
import MultiChoices from '@/components/MultiChoices';
import UiDate from '@/components/ui/UiDate';

export default {
  name: 'CustomFields',

  data() {
    return {
      selectedChoices: [],
      searchedField: undefined,
      selectedDate: undefined,
    };
  },

  props: {
    fields: {
      type: Array,
      required: true,
    },
  },

  components: {
    UiInput,
    MultiChoices,
    UiDate,
  },
};
</script>

<style scoped>
</style>
