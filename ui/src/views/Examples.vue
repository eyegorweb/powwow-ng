<template>
  <div class="home">
    <div class="mb-4">
      <SearchTranslationKey />
      <br />
      <br />
      <br />
      <button class="btn btn-primary mb-4" @click="version++">Refresh</button>

      <div :key="'ex_' + version">
        {{ chosen }}
        <i class="ic-Arrow-Next-Icon"></i>
        <AnimatedButton @click="chosen = 'OKK'">Test here</AnimatedButton>
      </div>
    </div>
  </div>
</template>

<script>
// Composant sandbox, ne pas faire de review, c'est du jetable :)

import SearchTranslationKey from '@/components/utils/SearchTranslationKey';

import AnimatedButton from '@/components/ui/AnimatedButton.vue';

export default {
  name: 'Examples',
  components: {
    SearchTranslationKey,
    AnimatedButton,
  },
  data() {
    return {
      version: 0,
      chosen: undefined,
    };
  },
};
</script>
