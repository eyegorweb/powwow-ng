<template>
  <div class="search-container d-flex">
    <UiInput
      :placeholder="inputPlaceholder"
      class="flex-grow-1 input-container"
      v-model="query_"
      input-type="text"
      no-number-arrows
      have-cross-button
    >
      <i slot="icon" class="select-icon ic-Magnify-Icon" />
    </UiInput>
    <UiSelect
      class="text-gray"
      :placeholder="selectPlaceholder"
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
    inputPlaceholder: String,
    selectPlaceholder: String,
  },
};
</script>

<style lang="scss" scoped>
.search-container {
  & ::v-deep label {
    margin-bottom: 0.5rem;
  }
  & ::v-deep input {
    border-radius: 0;
    font-size: 1.05rem;
    padding: 0.33rem 0.8rem;
  }

  & ::v-deep select {
    border-left: none;
    padding-right: 2rem;
    text-transform: uppercase;
    background-color: $light-gray;
  }
}
</style>
