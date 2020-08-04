<template>
  <div class="home">
    <div class="mb-4">
      <SearchTranslationKey />
      <button @click.stop="() => openCoachPanel()">Coach panel</button>
      <div class="row">
        <div class="col-md-6">
          <SearchLineWithResults>
            <UiButton variant="primary" block>{{ $t('coach.testLine') }}</UiButton>
          </SearchLineWithResults>
        </div>
      </div>
      <DataTablePagination :page.sync="page" :total="200" :page-limit="10" />
    </div>
  </div>
</template>

<script>
// Composant sandbox, ne pas faire de review, c'est du jetable :)

import SearchTranslationKey from '@/components/utils/SearchTranslationKey';
import DataTablePagination from '@/components/DataTable/DataTablePagination.vue';
import { mapMutations } from 'vuex';
import SearchLineWithResults from '@/views/GetParc/CoachM2M/SearchLineWithResults.vue';
import UiButton from '@/components/ui/Button';

export default {
  name: 'Home',
  components: {
    SearchTranslationKey,
    DataTablePagination,
    SearchLineWithResults,
    UiButton,
  },
  mounted() {
    setTimeout(() => {
      this.isLoading = false;
    }, 2000);
  },
  data() {
    return {
      page: 2,
      isLoading: true,
    };
  },

  methods: {
    ...mapMutations(['openPanel']),

    openCoachPanel() {
      this.openPanel({
        title: this.$t('coach.title'),
        panelId: 'coach.title',
        wide: false,
        backdrop: false,
        ignoreClickAway: true,
      });
    },
  },
};
</script>
