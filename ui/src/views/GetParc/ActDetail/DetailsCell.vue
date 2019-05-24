<template>
  <div>
    {{ content }}
  </div>
</template>

<script>
import { mapGetters } from 'vuex';
// import get from 'lodash.get';

export default {
  props: {
    row: Object,
  },
  computed: {
    ...mapGetters(['userIsBO']),
    content() {
      switch (this.row.actionType) {
        case 'Suspension / Réactivation d’une   liagne':
        case 'Résiliation de la ligne':
        case 'Changement de statut': {
          return `Ancien statut : ${this.row.commercialStatusFrom} Nouveau statut : ${
            this.row.commercialStatusTo
          }`;
        }

        case 'Changement de carte SIM': {
          return `Ancien ICCID : ${this.row.ICCID} Nouveau ICCID : ${this.row.newICCID}`;
        }

        case 'Changement de MSISDN': {
          return `Ancien MSISDN : ${this.row.oldMSISDN} Nouveau MSISDN : ${this.row.newMSISDN}`;
        }

        case 'Changement du compte de   facturation': {
          return `Ancien C.F : ${this.row.customerAccountCode}`;
        }

        case 'Localisation M2M': {
          return `${this.row.status} | ${this.row.errorCode}| ${this.row.errorDescription} | ${
            this.row.geolocation
          }`;
        }

        case 'Portabilités entrantes': {
          return `
          Id portabilité: ${this.row.portabilityId}, Date de portabilité: ${
            this.row.portabilityDate
          }, OPD: ${this.row.OPD}, OPR: ${this.row.OPR}, MSISDN: ${this.row.oldMSISDN}
          `;
        }

        case 'Portabilités sortantes': {
          return `
          Id portabilité: ${this.row.portabilityId}, Date de portabilité: ${
            this.row.portabilityDate
          }, OPD: ${this.row.OPD}, OPR: ${this.row.OPR}, MSISDN: ${this.row.newMSISDN}
          `;
        }

        default:
          return this.row.actionType;
      }
    },
  },
};
</script>

<style lang="scss" scoped></style>
