<template>
  <div class="home">
    <div class="mb-4">
      <SearchTranslationKey />
      <br />
      <br />
      <br />

      <div class="example">
        <ChargeLVOffers />
      </div>
    </div>
  </div>
</template>

<script>
// Composant sandbox, ne pas faire de review, c'est du jetable :)

import SearchTranslationKey from '@/components/utils/SearchTranslationKey';
import ChargeLVOffers from '@/views/GetParc/ActLines/ActCreation/forms/ChargeLVOffers.vue';

export default {
  name: 'Examples',
  components: {
    SearchTranslationKey,
    ChargeLVOffers,
  },
  data() {
    return {
      version: 0,
      chosen: undefined,
    };
  },
};
</script>
<style lang="scss" scoped>
.example {
  width: 1048px;
}
</style>
