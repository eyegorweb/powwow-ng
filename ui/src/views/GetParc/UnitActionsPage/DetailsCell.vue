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
        case 'STATUS_CHANGE': {
          return `Ancien statut : ${this.row.commercialStatusFrom} Nouveau statut : ${this.row.commercialStatusTo}`;
        }

        case 'ICCID_CHANGE': {
          return `Ancien ICCID : ${this.row.ICCID} Nouveau ICCID : ${this.row.newICCID}`;
        }

        case 'MSISDN_CHANGE': {
          return `Ancien MSISDN : ${this.row.oldMSISDN} Nouveau MSISDN : ${this.row.newMSISDN}`;
        }

        case 'CHANGE_CUSTOMER_ACCOUNT': {
          return `Ancien C.F : ${this.row.customerAccountCode}`;
        }

        case 'GEO_LOCATION': {
          return `${this.row.status} | ${this.row.errorCode}| ${this.row.errorDescription} | ${this.row.geolocation}`;
        }

        case 'PORT_IN': {
          return `
          Id portabilité: ${this.row.portabilityId}, Date de portabilité: ${this.row.portabilityDate}, OPD: ${this.row.OPD}, OPR: ${this.row.OPR}, MSISDN: ${this.row.oldMSISDN}
          `;
        }

        case 'PORT_OUT': {
          return `
          Id portabilité: ${this.row.portabilityId}, Date de portabilité: ${this.row.portabilityDate}, OPD: ${this.row.OPD}, OPR: ${this.row.OPR}, MSISDN: ${this.row.newMSISDN}
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
