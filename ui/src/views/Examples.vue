<template>
  <div class="home">
    <div class="mb-4">
      <SearchTranslationKey />
      <br />
      <br />
      <br />
    </div>
  </div>
</template>

<script>
// Composant sandbox, ne pas faire de review, c'est du jetable :)

import SearchTranslationKey from '@/components/utils/SearchTranslationKey';

export default {
  name: 'Examples',
  components: {
    SearchTranslationKey,
  },
  data() {
    return {
      version: 0,
    };
  },
};
</script>
<style lang="scss" scoped>
.example {
  width: 1048px;
}
</style>
