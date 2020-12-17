<template>
  <div class="home">
    <div class="mb-4">
      <SearchTranslationKey />
      <br />
      <br />
      <br />
      <button class="btn btn-primary mb-4" @click="version++">Refresh</button>
      <div :key="'ex_' + version">
        {{ selectedOffer }}
        <OfferCombo v-model="selectedOffer" />
      </div>
    </div>
  </div>
</template>

<script>
// Composant sandbox, ne pas faire de review, c'est du jetable :)

import SearchTranslationKey from '@/components/utils/SearchTranslationKey';
import OfferCombo from '@/components/CustomComboxes/OfferCombo.vue';

export default {
  name: 'Examples',
  components: {
    SearchTranslationKey,
    OfferCombo,
  },
  data() {
    return {
      version: 0,
      selectedOffer: undefined,
    };
  },
};
</script>
