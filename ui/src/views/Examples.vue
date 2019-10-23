<template>
  <div class="home">
    <div class="mb-4">
      <SearchTranslationKey />
    </div>
    <div class="row">
      <div class="col-md-6">
        <ServicesBlock2 :services="services" />
      </div>
      <div class="col-md-6">
        <SimpleMap :markers="testMarkers" />
      </div>
    </div>
  </div>
</template>

<script>
// Composant sandbox, ne pas faire de review, c'est du jetable :)
import SearchTranslationKey from '@/components/utils/SearchTranslationKey';
import { formatLargeNumber } from '@/utils/numbers';
import ServicesBlock2 from '@/components/Services/ServicesBlock2.vue';
import SimpleMap from '@/components/GoogleMaps/SimpleMap';

export default {
  name: 'Home',
  components: {
    SearchTranslationKey,
    ServicesBlock2,
    SimpleMap,
  },
  mounted() {
    console.log(formatLargeNumber(1234567));
  },
  data() {
    return {
      testMarkers: [
        {
          latitude: 46.8989,
          longitude: 2,
        },
        {
          latitude: 45,
          longitude: 4,
        },
      ],
      services: [
        {
          code: 'SERVICE_1',
          activated: false,
          editable: true,
          optional: false,
          barring: false,
        },
        {
          code: 'SERVICE_2',
          activated: true,
          editable: false,
          optional: false,
          barring: false,
        },
        {
          code: 'SERVICE_3',
          activated: false,
          editable: true,
          optional: false,
          barring: false,
        },
        {
          code: 'SERVICE_4',
          activated: true,
          editable: false,
          optional: false,
          barring: false,
        },
        {
          code: 'DATA',
          activated: false,
          editable: true,
          optional: false,
          parameters: [
            {
              active: false,
              value: 'apn1.testrnis.fr',
              editable: true,
              code: 'APN1',
              name: 'APN1',
            },
          ],
          barring: false,
        },
      ],
    };
  },
};
</script>
