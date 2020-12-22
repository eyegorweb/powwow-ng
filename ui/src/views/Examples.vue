<template>
  <div class="home">
    <div class="mb-4">
      <SearchTranslationKey />
      <br />
      <br />
      <br />
      <button class="btn btn-primary mb-4" @click="version++">Refresh</button>
      <div :key="'ex_' + version">
        <UiDropDownChoicesButton :options="['choice 1', 'choice 2']" @click="chosen = $event">
          <span>Test</span>
        </UiDropDownChoicesButton>
      </div>
    </div>
  </div>
</template>

<script>
// Composant sandbox, ne pas faire de review, c'est du jetable :)

import SearchTranslationKey from '@/components/utils/SearchTranslationKey';
import UiDropDownChoicesButton from '@/components/ui/UiDropDownChoicesButton';

export default {
  name: 'Examples',
  components: {
    SearchTranslationKey,
    UiDropDownChoicesButton,
  },
  data() {
    return {
      version: 0,
      chosen: undefined
    };
  },
};
</script>
