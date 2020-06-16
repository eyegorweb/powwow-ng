<template>
  <div class="mb-3">
    <template v-for="filter in visibleCurrentFilters">
      <SelectedFilterDetails
        :key="filter.name"
        v-if="
          filter &&
            ((filter.values && filter.values.length) ||
              filter.value ||
              filter.startDate ||
              filter.endDate ||
              filter.from ||
              filter.to)
        "
        :filter="filter"
        :fixed="checkIfFilterIsFixed(filter)"
        @clear="onClear"
      />
    </template>
    <div class="actions d-flex flex-column flex-md-row">
      <ff-wip>
        <UiDropdownButton v-if="canSave">
          <UiButton
            slot="trigger"
            slot-scope="{ staticClass, toggle }"
            variant="outline-primary"
            class="flex-grow-1 py-1 px-3"
            @click.prevent="toggle"
            :class="staticClass"
            >Enregistrer</UiButton
          >
          <div slot-scope="{ hide }" class="p-3" style="width: 256px;">
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
              <UiInput v-model="filterName" class="d-block" placeholder="Nom du nouveau filtre" />
              <UiButton variant="primary" type="submit" block>Enregistrer</UiButton>
            </form>
          </div>
        </UiDropdownButton>
      </ff-wip>
      <UiButton
        v-if="!hideApply"
        variant="primary"
        @click="applyFilters()"
        class="flex-grow-1 py-1 px-3 ml-1"
        >Appliquer le filtre</UiButton
      >
    </div>
  </div>
</template>

<script>
import SelectedFilterDetails from '@/components/SelectedFilterDetails';
import UiButton from '@/components/ui/Button';
import UiInput from '@/components/ui/UiInput';
import UiDropdownButton from '@/components/ui/UiDropdownButton';

export default {
  name: 'SelectedFilters',

  props: {
    currentFilters: {
      type: Array,
    },
    fixedFilters: {
      type: Array,
      required: false,
    },
    canSave: Boolean,
    hideApply: Boolean,
  },

  data() {
    return {
      filterName: '',
    };
  },

  components: { SelectedFilterDetails, UiButton, UiDropdownButton, UiInput },
  methods: {
    checkIfFilterIsFixed(item) {
      if (!this.fixedFilters) {
        return false;
      }
      return !!this.fixedFilters.find(c => c.id === item.id);
    },
    onClear(filterId) {
      this.$emit('clear', filterId);
    },
    applyFilters() {
      this.$emit('applyFilters');
    },
  },
  computed: {
    visibleCurrentFilters() {
      return this.currentFilters.filter(f => !f.hidden);
    },
  },
};
</script>

<style lang="scss">
.actions .btn {
  font-size: 1rem;
}

.modal-title {
  font-weight: 600;
}
</style>
