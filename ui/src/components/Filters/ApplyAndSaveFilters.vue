<template>
  <div class="actions d-flex flex-column flex-md-row">
    <ff-wip>
      <UiDropdownButton>
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
          <button type="button" class="close" data-dismiss="alert" aria-label="Close" @click="hide">
            <span aria-hidden="true">&times;</span>
          </button>
          <!-- NOTE: créé l'espace qui apparait sur la maquette mais c'est un peu bizarre
            https://projects.invisionapp.com/d/main/default/#/console/15611938/324542348/inspect-->
          <div class="clearfix" />
          <h6 class="modal-title mb-3">Enregistrer un filtre:</h6>
          <form @submit.prevent>
            <UiInput v-model="filterName" class="d-block" placeholder="Nom du nouveau filtre" />
            <UiButton variant="primary" @click="() => saveFilter(hide)" type="submit" block
              >Enregistrer</UiButton
            >
          </form>
        </div>
      </UiDropdownButton>
    </ff-wip>
    <UiButton
      v-if="!hideApply"
      variant="primary"
      @click="$emit('applyFilters')"
      class="flex-grow-1 py-1 px-3 ml-1"
      >Appliquer le filtre</UiButton
    >
  </div>
</template>

<script>
import UiButton from '@/components/ui/Button';
import UiInput from '@/components/ui/UiInput';
import UiDropdownButton from '@/components/ui/UiDropdownButton';
import { createFilter } from '@/api/filters.js';

export default {
  components: {
    UiButton,
    UiInput,
    UiDropdownButton,
  },

  props: {
    moduleName: String,
    hideApply: Boolean,
    currentFilters: Array,
  },

  data() {
    return {
      filterName: '',
    };
  },

  methods: {
    async saveFilter(onSaveDone) {
      const response = await createFilter(
        this.filterName,
        this.moduleName,
        JSON.stringify(this.currentFilters)
      );
      console.log(response);
      if (response) {
        onSaveDone();
        this.filterName = '';
        this.$emit('saved');
      }
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
