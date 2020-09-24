<template>
  <div class="home">
    <div class="mb-4">
      <SearchTranslationKey />
      <br />
      <br />
      <br />
      {{ limits }}
      <OverConsoVolumeFlotteGraph :init-limits="limits" @setLimits="limits = $event" />
    </div>
  </div>
</template>

<script>
// Composant sandbox, ne pas faire de review, c'est du jetable :)

import SearchTranslationKey from '@/components/utils/SearchTranslationKey';
import OverConsoVolumeFlotteGraph from '@/views/GetVision/AlarmCreationPanel/forms/OverConsoVolumeFlotteGraph.vue';

export default {
  name: 'Examples',
  components: {
    SearchTranslationKey,
    OverConsoVolumeFlotteGraph,
  },

  data() {
    return {
      limits: [],
    };
  },
};
</script>
