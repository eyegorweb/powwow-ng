<template>
  <div class="card filter-bar">
    <div class="card-body show-all-filters">
      <h5 class="card-title">{{ $t('filters.title') }}</h5>
      <SelectedFilters
        v-if="canShowSelectedFilter"
        :current-filters="currentFilters"
        @applyFilters="applyFilters"
        @clear="filterId => clearFilter(filterId)"
      >
        <template v-slot:actions="{ hasAnyValue }">
          <div v-if="hasAnyValue" class="actions d-flex flex-column flex-md-row mb-2">
            <UiButton variant="primary" @click="applyFilters" class="flex-grow-1 py-1 px-3 ml-1"
              >Appliquer / Rafraichir</UiButton
            >
          </div>
        </template>
      </SelectedFilters>
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
          <FoldableBlock :title="$t('filters.billingAccounts')" :key="'el2'" draggable>
            <AlarmsBillingAccount />
          </FoldableBlock>
          <FoldableBlock :title="$t('filters.lines.associatedOffer')" :key="'el5'" draggable>
            <AlarmsOffersFilter />
          </FoldableBlock>
          <FoldableBlock :title="$t('getvsion.filters.ALARMS_OFFER')" :key="'el6'" draggable>
            <AlarmsRange />
          </FoldableBlock>
          <FoldableBlock :title="$t('getvsion.filters.ALARM_TYPE')" :key="'el7'" draggable>
            <AlarmType />
          </FoldableBlock>
          <FoldableBlock :title="$t('getvsion.filters.DATE_TRIGGER')" :key="'el8'" draggable>
            <DateTriggerAlarm />
          </FoldableBlock>
        </transition-group>
      </draggable>
    </div>
  </div>
</template>

<script>
import FoldableBlock from '@/components/FoldableBlock';
import draggable from 'vuedraggable';
import { mapActions, mapGetters, mapMutations } from 'vuex';
import SelectedFilters from '@/components/Filters/SelectedFilters';

import AlarmsPartnersFilter from './AlarmsPartnersFilter';
import AlarmsBillingAccount from './AlarmsBillingAccount';
import AlarmsOffersFilter from './AlarmsOffersFilter';
import AlarmsRange from './AlarmsRange';
import AlarmType from './AlarmType';
import DateTriggerAlarm from './DateTriggerAlarm';
import UiButton from '@/components/ui/Button';

export default {
  components: {
    draggable,
    FoldableBlock,
    SelectedFilters,
    AlarmsPartnersFilter,
    AlarmsBillingAccount,
    AlarmsOffersFilter,
    AlarmsRange,
    AlarmType,
    DateTriggerAlarm,
    UiButton,
  },

  computed: {
    ...mapGetters(['userIsPartner']),
    ...mapGetters('alarms', ['currentFilters', 'canShowSelectedFilter']),
  },
  methods: {
    ...mapMutations('alarms', ['applyFilters']),
    ...mapActions('alarms', ['clearFilter']),
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
