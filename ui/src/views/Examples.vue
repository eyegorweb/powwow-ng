<template>
  <div class="home">
    <div class="mb-4">
      <SearchTranslationKey />

      <button class="btn btn-primary" @click="openDemoPanel">Open panel</button>
    </div>
  </div>
</template>

<script>
// Composant sandbox, ne pas faire de review, c'est du jetable :)

import SearchTranslationKey from '@/components/utils/SearchTranslationKey';
import { mapMutations } from 'vuex';

export default {
  name: 'Home',
  components: {
    SearchTranslationKey,
  },
  mounted() {},
  methods: {
    ...mapMutations(['openPanel']),

    openDemoPanel() {
      this.openPanel({
        title: this.$t('getadmin.partnerDetail.userForm.title'),
        panelId: 'getadmin.partnerDetail.userForm.title',
        backdrop: true,
        width: '40rem',
        ignoreClickAway: true,
      });
    },
  },
};
</script>
