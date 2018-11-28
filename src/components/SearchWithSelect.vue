<template>
  <div class="search-container d-flex">
    <UiInput
      placeholder="Rechercher une carte par identifiant"
      class="flex-grow-1"
      v-model="query_"
    >
      <i
        slot="icon"
        class="select-icon ic-Flag-Icon"
      />
    </UiInput>
    <UiSelect
      class="text-gray"
      placeholder="Type de partenaire"
      v-model="type_"
      :options="options"
    />
  </div>
</template>

<script>
import UiSelect from '@/components/ui/UiSelect';
import UiInput from '@/components/ui/UiInput';
import { propWithSync } from '@/mixins';

export default {
  name: 'SearchWithSelect',
  components: {
    UiSelect,
    UiInput,
  },

  mixins: [propWithSync('type'), propWithSync('query')],

  props: {
    options: {
      type: Array,
      required: true,
    },
  },
};
</script>

<style lang="scss" scoped>
.search-container {
  & /deep/ label {
    margin-bottom: 0.5rem;
  }
  & /deep/ input {
    border-right: none;
  }

  & /deep/ select {
    border-left: none;
    padding-right: 2rem;
    text-transform: uppercase;
    background-color: $light-grey;
    max-width: 6rem;
  }
}
</style>
