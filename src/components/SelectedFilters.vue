<template>
  <div class="mb-3">
    <div
      v-for="filter in currentFilters"
      :key="filter.name"
    >
      <SelectedFilterDetails
        v-if="filter && filter.values && filter.values.length"
        :filter="filter"
      />
    </div>
    <div class="actions d-flex flex-column flex-md-row">
      <UiDropdownButton>
        <UiButton
          slot="trigger"
          slot-scope="{ staticClass, toggle }"
          variant="outline-primary"
          class="flex-grow-1 py-1 px-3"
          @click.stop="toggle"
          :class="staticClass"
        >Enregistrer</UiButton>
        <div
          slot-scope="{ hide }"
          style="width: 256px;"
        >
          <button
            type="button"
            class="close"
            data-dismiss="alert"
            aria-label="Close"
            @click="hide"
          >
            <span aria-hidden="true">&times;</span>
          </button>
          <!-- NOTE: créé l'espace qui apparait sur la maquette mais c'est un peu bizarre
          https://projects.invisionapp.com/d/main/default/#/console/15611938/324542348/inspect-->
          <div class="clearfix" />
          <h6 class="modal-title mb-3">Enregistrer un filtre:</h6>
          <form @submit.prevent>
            <UiInput
              v-model="filterName"
              class="d-block"
              placeholder="Nom du nouveau filtre"
            />
            <UiButton
              variant="primary"
              type="submit"
              block
            >Enregistrer</UiButton>
          </form>
        </div>
      </UiDropdownButton>
      <UiButton
        variant="gray"
        disabled
        class="flex-grow-1 py-1 px-3"
      >Appliquer le filtre</UiButton>
    </div>
  </div>
</template>

<script>
import SelectedFilterDetails from './SelectedFilterDetails';
import UiButton from '@/components/ui/Button';
import UiInput from '@/components/ui/UiInput';
import UiDropdownButton from '@/components/ui/UiDropdownButton';

export default {
  name: 'SelectedFilters',

  props: {
    currentFilters: {
      type: Array,
    },
  },

  data() {
    return {
      filterName: '',
    };
  },

  components: { SelectedFilterDetails, UiButton, UiDropdownButton, UiInput },
};
</script>

<style lang="scss">
.actions .btn {
  font-size: 14px;
}

.modal-title {
  font-weight: 600;
}
</style>
