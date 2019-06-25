<template>
  <div>
    {{ content }}
  </div>
</template>

<script>
import { mapGetters } from 'vuex';
import get from 'lodash.get';

export default {
  props: {
    row: Object,
  },
  computed: {
    ...mapGetters(['userIsBO']),
    content() {
      switch (this.row.actionType) {
        case 'PREACTIVATION_ACTIVATION':
        case 'ACTIVATION': {
          return `Offer: ${this.row.offerName}`;
        }

        case 'SERVICE_CHANGE': {
          const addedServices = this.row.addedServices ? this.row.addedServices.join(',') : '-';
          const removeServices = this.row.removeServices ? this.row.removeServices.join(',') : '-';

          return `Service(s) ajouté(s): ${addedServices} ; Service(s) retiré(s): ${removeServices}`;
        }

        case 'STATUS_CHANGE': {
          return `Nouveau statut : ${this.row.transitionName}`;
        }

        case 'CHANGE_CUSTOMER_ACCOUNT': {
          return `Nouveau C.F ${this.row.destinationCustomerAccountCode}`;
        }

        case 'CHANGE_OFFER': {
          return `Nouvelle offre : ${this.row.offerName}`;
        }

        case 'SIMCARD_TRANSFER': {
          if (!this.userIsBO) {
            return;
          }

          const fromPartyName = get(this.row, 'fromParty.name');
          const toPartyName = get(this.row, 'toParty.name');

          if (fromPartyName && toPartyName) {
            return `Ancien part. : ${fromPartyName}, Nouveau part. : ${toPartyName}`;
          }

          return '-';
        }

        case 'CUSTOM_FIELDS_UPDATE': {
          const customFields = [
            this.row.custom1,
            this.row.custom2,
            this.row.custom3,
            this.row.custom4,
            this.row.custom5,
            this.row.custom6,
          ].filter(c => c != null);
          return `Libellé : ${customFields.join(',')}`;
        }

        case 'UPDATE_COMMITMENT': {
          if (!this.userIsBO) {
            return;
          }
          return '-';
        }

        case 'SEND_SMS': {
          const endDate = this.row.endDate ? this.row.endDate : '-';
          const message = this.row.message ? this.row.message : '-';
          const shortCode = this.row.shortCode ? this.row.shortCode : '-';
          return `Date de fin : ${endDate}, message : ${message}, short code : ${shortCode}`;
        }

        case 'ALARM_SETTING': {
          return '-';
        }

        case 'ALARM_UNSETTING': {
          return '-';
        }

        default:
          return this.row.actionType;
      }
    },
  },
};
</script>

<style lang="scss" scoped></style>
