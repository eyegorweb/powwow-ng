<template>
  <div class="mb-3">
    <div v-for="filter in visibleCurrentFilters" :key="filter.name">
      <SelectedFilterDetails
        v-if="
          filter &&
            ((filter.values && filter.values.length) ||
              filter.value ||
              filter.startDate ||
              filter.from ||
              filter.to)
        "
        :filter="filter"
        @clear="onClear"
      />
    </div>
    <div class="actions d-flex flex-column flex-md-row">
      <UiDropdownButton>
        <UiButton
          slot="trigger"
          slot-scope="{ staticClass, toggle }"
          variant="outline-primary"
          class="flex-grow-1 py-1 px-3"
          @click.prevent="toggle"
          :class="staticClass"
          >{{ $t('save') }}</UiButton
        >
        <div slot-scope="{ hide }" class="p-3" style="width: 256px">
          <button type="button" class="close" data-dismiss="alert" aria-label="Close" @click="hide">
            <span aria-hidden="true">&times;</span>
          </button>
          <!-- NOTE: créé l'espace qui apparait sur la maquette mais c'est un peu bizarre
          https://projects.invisionapp.com/d/main/default/#/console/15611938/324542348/inspect-->
          <div class="clearfix" />
          <h6 class="modal-title mb-3">{{ $t('saveFilter') }}:</h6>
          <form @submit.prevent>
            <UiInput v-model="filterName" class="d-block" placeholder="Nom du nouveau filtre" />
            <UiButton variant="primary" type="submit" block>{{ $t('save') }}</UiButton>
          </form>
        </div>
      </UiDropdownButton>
      <UiButton
        variant="primary"
        @click="applyFilters()"
        class="apply-filters-btn flex-grow-1 py-1 px-3 ml-1"
        >{{ $t('applyTheFilter') }}</UiButton
      >
    </div>
  </div>
</template>

<script>
/**
 * Déprécié, à supprimer après la correction des tests
 */
import SelectedFilterDetails from '@/components/SelectedFilterDetails';
import UiButton from '@/components/ui/Button';
import UiInput from '@/components/ui/UiInput';
import UiDropdownButton from '@/components/ui/UiDropdownButton';
import { mapMutations, mapActions } from 'vuex';

export default {
  name: 'GetSimSelectedFilters',

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
  methods: {
    ...mapMutations('getsim', ['applyFilters']),
    ...mapActions('getsim', ['clearFilter']),
    onClear(filterId) {
      this.clearFilter(filterId);
    },
  },
  computed: {
    visibleCurrentFilters() {
      return this.currentFilters.filter((f) => !f.hidden);
    },
  },
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
