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

        case 'Suspension / Réactivation d’une   ligne':
        case 'Résiliation de la ligne':
        case 'Changement de statut': {
          return `Nouveau   statut : ${this.row.transitionName}`;
        }

        case 'Changement du compte de   facturation': {
          return `Nouveau ${this.row.destinationCustomerAccountCode}`;
        }

        case "Changement d'offre": {
          return `Nouvelle   offre : ${this.row.offerName}`;
        }

        case 'Transfert vers un autre partenaire   (uniquement BO et compte groupe)': {
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

        case 'Modification des champs libres': {
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

        case 'Réengagement (uniquement BO)': {
          if (!this.userIsBO) {
            return;
          }
          return '-';
        }

        case 'Envoi SMS': {
          return `${this.row.endDate} ${this.row.message} ${this.row.shortCode}`;
        }

        case "Activation d'alarme": {
          return '-';
        }

        case "Désactivation d'alarme": {
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
