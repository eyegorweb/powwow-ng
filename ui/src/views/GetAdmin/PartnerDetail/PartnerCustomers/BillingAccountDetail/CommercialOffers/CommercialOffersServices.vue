<template>
  <div>
    <ServicesBlock :services="services" full-width no-click />
  </div>
</template>

<script>
import ServicesBlock from '@/components/Services/ServicesBlock.vue';

export default {
  components: {
    ServicesBlock,
  },
  data() {
    return {
      services: [
        {
          code: 'INCOMING_VOICE',
          checked: true,
          editable: true,
          optional: false,
          activationDate: null,
          labelService: 'Voix entrante',
        },
        {
          code: 'OUTGOING_VOICE',
          checked: true,
          editable: false,
          optional: false,
          activationDate: null,
          labelService: 'Voix sortante',
        },
        {
          code: 'INCOMING_SMS',
          checked: true,
          editable: false,
          optional: false,
          activationDate: null,
          labelService: 'SMS entrant',
        },
        {
          code: 'OUTGOING_SMS',
          checked: true,
          editable: true,
          optional: false,
          activationDate: null,
          labelService: 'SMS sortant',
        },
        {
          code: 'DATA_CSD_NUMBER',
          checked: false,
          editable: true,
          optional: false,
          activationDate: null,
          labelService: 'Numéro data csd',
        },
        {
          code: 'INCOMING_DATA_CSD',
          checked: true,
          editable: false,
          optional: false,
          activationDate: null,
          labelService: 'Data csd entrante',
        },
        {
          code: 'ROAMING',
          checked: true,
          editable: false,
          optional: false,
          activationDate: null,
          labelService: 'Roaming',
        },
        {
          code: 'OUTGOING_DATA_CSD',
          checked: true,
          editable: false,
          optional: false,
          activationDate: null,
          labelService: 'Data csd sortante',
        },
      ],
    };
  },
};
</script>

<style lang="scss" scoped></style>
