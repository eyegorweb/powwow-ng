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
        {{ testvar }}
        <UiInput
          :placeholder="null"
          v-model="testvar"
          value
          class="d-block w-50 mx-auto"
          input-type="number"
        />

        <input :placeholder="null" type="number" :min="1" v-model="testvar" />
      </div>
    </div>
  </div>
</template>

<script>
// Composant sandbox, ne pas faire de review, c'est du jetable :)
import SearchTranslationKey from '@/components/utils/SearchTranslationKey';
import { formatLargeNumber } from '@/utils/numbers';
import ServicesBlock2 from '@/components/Services/ServicesBlock2.vue';
import UiInput from '@/components/ui/UiInput';

export default {
  name: 'Home',
  components: {
    SearchTranslationKey,
    ServicesBlock2,
    UiInput,
  },
  mounted() {
    console.log(formatLargeNumber(1234567));
  },
  methods: {
    onChane(e) {
      console.log('AAA>', e);
    },
  },
  data() {
    return {
      testvar: undefined,
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
