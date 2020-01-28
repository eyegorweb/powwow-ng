<template>
  <div class="home">
    <div class="mb-4">
      <SearchTranslationKey />
    </div>

    {{ selectedPartner }}

    <PartnerCombo :value.sync="selectedPartner" />

    <div class="row">
      <div class="col-8">
        <FormAlarm />
      </div>
    </div>
    <div class="row">
      <div class="col-md-6">
        <ServicesChoice :offer="offer" :selected-items.sync="selectedServices" />
      </div>
      <div class="col-md-6">{{ selectedServices }}</div>
    </div>
  </div>
</template>

<script>
// Composant sandbox, ne pas faire de review, c'est du jetable :)
import SearchTranslationKey from '@/components/utils/SearchTranslationKey';
import ServicesChoice from '@/views/GetParc/ActLines/ActCreation/forms/parts/ServicesChoice';
import FormAlarm from '@/views/GetVision/AlarmCreationPanel/forms/COUNTRY_CHANGE.vue';

import PartnerCombo from '@/components/CustomComboxes/PartnerCombo.vue';

export default {
  name: 'Home',
  components: {
    SearchTranslationKey,
    ServicesChoice,
    FormAlarm,
    PartnerCombo,
  },

  data() {
    return {
      selectedPartner: undefined,
      selectedServices: [],
      offer: {
        id: '3',
        code: 'OFFRE_TEST',
        workflowDescription: 'Catalog Test',
        rCard: false,
        initialOffer: {
          id: '116',
          marketingServices: [
            {
              code: 'INCOMING_VOICE',
              activated: true,
              editable: false,
              optional: false,
              parameters: [null],
            },
            {
              code: 'OUTGOING_VOICE',
              activated: true,
              editable: false,
              optional: false,
              parameters: [null],
            },
            {
              code: 'INCOMING_SMS',
              activated: true,
              editable: false,
              optional: false,
              parameters: [null],
            },
            {
              code: 'OUTGOING_SMS',
              activated: true,
              editable: false,
              optional: false,
              parameters: [null],
            },
            {
              code: 'DATA_CSD_NUMBER',
              activated: true,
              editable: false,
              optional: false,
              parameters: [null],
            },
            {
              code: 'INCOMING_DATA_CSD',
              activated: true,
              editable: false,
              optional: false,
              parameters: [null],
            },
            {
              code: 'ROAMING',
              activated: true,
              editable: true,
              optional: false,
              parameters: [null],
            },
            {
              code: 'OUTGOING_DATA_CSD',
              activated: true,
              editable: false,
              optional: false,
              parameters: [null],
            },
            {
              code: 'DATA',
              activated: true,
              editable: false,
              optional: false,
              parameters: [
                {
                  activated: false,
                  value: 'manaty3.fr',
                  code: 'APN3',
                  editable: true,
                },
              ],
            },
          ],
        },
        label: 'Catalog Test',
        value: 'OFFRE_TEST',
      },
    };
  },
};
</script>
