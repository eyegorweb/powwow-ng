<template>
  <div class="card filter-bar">
    <div class="card-body" :class="[allFiltersVisible ? 'show-all-filters' : 'hide-all-filters']">
      <h5 class="card-title">{{ $t('filters.title') }}</h5>
      <SelectedFilters
        v-if="canShowSelectedFilter"
        :current-filters="currentFilters"
        @applyFilters="applyFilters"
        @clear="filterId => clearFilter(filterId)"
      />
      <draggable handle=".handle">
        <transition-group>
          <FoldableBlock
            v-if="!userIsPartner"
            :title="$t('filters.partners')"
            :key="'el1'"
            draggable
          >
            <AlarmsPartnersFilter />
          </FoldableBlock>
        </transition-group>
      </draggable>
    </div>
    <div class="text-right">
      <a
        v-if="!allFiltersVisible"
        href="#"
        @click.prevent="showAllFilters"
        class="show-all-types text-right"
      >
        Plus de filtres
        <i class="arrow ic-Arrow-Down-Icon" />
      </a>
    </div>
    <div class="text-right">
      <a
        v-if="allFiltersVisible"
        href="#"
        @click.prevent="showAllFilters"
        class="show-all-types text-right"
      >
        Moins de filtres
        <i class="arrow ic-Arrow-Up-Icon" />
      </a>
    </div>
  </div>
</template>

<script>
import FoldableBlock from '@/components/FoldableBlock';
import draggable from 'vuedraggable';
import { mapActions, mapGetters, mapMutations } from 'vuex';
import SelectedFilters from '@/components/Filters/SelectedFilters';

import AlarmsPartnersFilter from './AlarmsPartnersFilter';

export default {
  components: {
    draggable,
    FoldableBlock,
    SelectedFilters,
    AlarmsPartnersFilter,
  },
  data() {
    return {
      allFiltersVisible: false,
    };
  },
  computed: {
    ...mapGetters(['userIsPartner']),
    ...mapGetters('alarms', ['currentFilters', 'canShowSelectedFilter']),
  },
  methods: {
    ...mapMutations('alarms', ['applyFilters']),
    ...mapActions('alarms', ['clearFilter']),

    showAllFilters() {
      this.allFiltersVisible = !this.allFiltersVisible;
    },
  },
};
</script>

<style lang="scss" scoped>
.card-body {
  transition: max-height 0.25s ease-out;
  max-height: 100%;
  overflow: hidden;
  padding-bottom: 0;
}
.checkbox-container .checkmark {
  border: 1px solid $medium-gray;
}

.checkbox-container .checkmark.regular {
  &:after {
    border-color: $dark-gray;
  }
}

.hide-all-filters {
  transition: all 0.5s ease-in;

  .foldable-block:nth-child(n + 7) {
    //par défaut on affiche 6 items
    display: none;
  }
}

.show-all-filters {
  transition: all 0.5s ease-in;

  .foldable-block:nth-child(n + 7) {
    //par défaut on affiche 6 items
    display: block;
  }
}

.text-right {
  & a {
    color: $dark-gray;
    display: block;
    padding: 0.75rem 1.25rem;
    &:hover {
      color: $secondary;
      text-decoration: none;
    }
  }
}
</style>
