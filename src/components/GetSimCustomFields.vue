<template>
  <div clas="container">
    <div v-for="item in filterCustomFields" :key="item.id" class="container">
      <div v-if="item.type === 'input'">
        <!-- TODO: to translate -->
        {{ item.label }}
        <UiInput placeholder="Commencer à saisir" :value.sync="searchedField" class="d-block">
          <span slot="label">{{ item.label }}</span>
        </UiInput>
      </div>
      <label v-if="item.type === 'listchoices'" class="form-group">
        <!-- TODO: to translate -->
        {{ item.label }}
        <UiSelect
          class="mb-2"
          placeholder="Choisissez une valeur"
          v-model="selectedPartner"
          :options="item.value"
        />
      </label>
      <UiDate v-if="item.type === 'date'" :date-value.sync="selectedDate" class="d-block">
        <i slot="icon" class="select-icon ic-Flag-Icon" />
      </UiDate>
    </div>
  </div>
</template>

<script>
import UiInput from '@/components/ui/UiInput';
import UiSelect from '@/components/ui/UiSelect';
import UiDate from '@/components/ui/UiDate';
import { mapGetters } from 'vuex';

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
    ...mapGetters(['filterCustomFields']),
  },

  components: {
    UiInput,
    UiSelect,
    UiDate,
  },
};
</script>

<style lang="scss" scoped>
select {
  width: 100%;
}
</style>
