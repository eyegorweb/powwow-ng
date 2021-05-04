<template>
  <div class="mt-4">
    <div class="card">
      <div class="card-body p-1">
        <div class="row">
          <div class="col-3 pr-0">
            <RolesChoice
              :roles="roles"
              :on-role-click="onRoleClick"
              :selected-role="selectedRole"
            />
          </div>
          <div class="col-9">
            <div class="d-flex justify-content-end mb-2">
              <div class="pt-1 pr-1">
                {{ openAll ? 'Fermer tout les panneaux' : 'Ouvrir tout les panneaux' }}
              </div>
              <UiSimpleToggle v-model="openAll" />
            </div>
            <div class="list-group">
              <PermissionChoice
                :key="domain.id"
                v-for="domain in domains"
                :domain="domain"
                :default-open="openAll"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import PermissionChoice from './PermissionChoice.vue';
import UiSimpleToggle from '@/components/ui/UiSimpleToggle.vue';

const RolesChoice = {
  functional: true,
  props: {
    roles: Array,
    selectedRole: Object,
    onRoleClick: Function,
  },

  render(h, context) {
    const { roles, selectedRole, onRoleClick } = context.props;
    return (
      <div class="roles-container">
        <ul class="list-group list-group-flush">
          {roles.map((role) => {
            return (
              <li
                class={`list-group-item ${selectedRole === role ? 'active' : ''}`}
                onClick={() => onRoleClick(role)}
              >
                {role.label}
              </li>
            );
          })}
        </ul>
      </div>
    );
  },
};

export default {
  components: {
    RolesChoice,
    PermissionChoice,
    UiSimpleToggle,
  },
  methods: {
    onRoleClick(role) {
      this.selectedRole = role;
    },
  },
  data() {
    return {
      selectedRole: undefined,
      openAll: false,
      roles: [
        {
          id: 'role 1',
          label: 'Role 1',
        },
        {
          id: 'role 2',
          label: 'Role 2',
        },
        {
          id: 'role3',
          label: 'Role 3',
        },
        {
          id: 'role4',
          label: 'Role 4',
        },
        {
          id: 'role5',
          label: 'Role 5',
        },
      ],
      domains: [
        {
          id: 'getSim',
          label: 'GetSIM',
          permissions: [
            { label: 'Recherche / Consultation', id: 'read', checked: false },
            { label: 'Création / annulation', id: 'create', checked: false },
            { label: 'Validation', id: 'validate', checked: false },
            { label: 'Import de SIM', id: 'import', checked: false },
            { label: 'Commande ESIM', id: 'order_esim', checked: false },
            { label: 'Accès menu stock', id: 'manage_stock', checked: false },
            { label: 'Accès menu stock ESIM', id: 'manage_stock_esim', checked: false },
          ],
        },
        {
          id: 'getParc',
          label: 'GetParc',
          permissions: [
            { label: 'Recherche / Consultation', id: 'read', checked: false },
            { label: 'Engagement', id: 'manage_commitment', checked: false },
            { label: 'Suspension offerte', id: 'manage_suspension', checked: false },
            { label: 'Supervision', id: 'manage_supervision', checked: false },
            { label: 'Coach M2M', id: 'manage_coach', checked: false },
            { label: 'Historique réseau', id: 'manage_network', checked: false },
            { label: 'Informations DUAL SIM', id: 'manage_dual', checked: false },
            { label: 'Export des services', id: 'export_service', checked: false },
            { label: 'Export des derniers usages', id: 'export_last_usage', checked: false },
            {
              label: 'Affichage des informations ESIM(STEP1/STEP2)',
              id: 'manage_esim',
              checked: false,
            },
            {
              label: 'Affichage des informations ESIM light (PSA)',
              id: 'manage_esim_light',
              checked: false,
            },
          ],
        },
        {
          id: 'getDiag',
          label: 'GetDiag',
          permissions: [{ label: 'Consultation', id: 'read', checked: false }],
        },
        {
          id: 'act',
          label: 'Actes de gestion',
          permissions: [
            { label: 'Consultation', id: 'read', checked: false },
            { label: 'Tous', id: 'manage_main', checked: false },
            { label: 'Validation des résiliations', id: 'validate_termination', checked: false },
            { label: 'Changement de MSISDN', id: 'msisdn_change', checked: false },
            { label: 'Demande de résiliation', id: 'terminate', checked: false },
            {
              label: 'Transferer les lignes sur un autre CF',
              id: 'transfer_customer_account',
              checked: false,
            },
            {
              label: 'Transferer les lignes sur un autre partenaire',
              id: 'transfer_party',
              checked: false,
            },
            { label: 'Action ESIM', id: 'manage_esim', checked: false },
            { label: 'Action Audit ESIM light (PSA)', id: 'audit_esim_light', checked: false },
            { label: 'Informations DUAL SIM', id: 'read_dual', checked: false },
            { label: 'Relancer un acte en échec', id: 'replay', checked: false },
          ],
        },
        {
          id: 'alarm',
          label: 'Alarme',
          permissions: [
            { label: 'Création / modification', id: 'create', checked: false },
            { label: 'Recherche / Consultation', id: 'read', checked: false },
            { label: 'Activation / Désactivation (sur une ligne)', id: 'activate', checked: false },
            { label: 'Création alarme de suspension', id: 'suspend_line', checked: false },
            { label: 'Suppression (Si aucune ligne activée)', id: 'delete', checked: false },
          ],
        },
        {
          id: 'party',
          label: 'Partenaire',
          permissions: [
            { label: 'Création', id: 'create', checked: false },
            { label: 'Consulation administrateur', id: 'read_administrator', checked: false },
            { label: 'Mise à jour administrateur', id: 'update_administrator', checked: false },
            { label: 'Modification', id: 'update', checked: false },
            { label: 'Recherche / Consultation', id: 'read', checked: false },
            {
              label: 'Consulation des listes de diffusion',
              id: 'read_broadcast_list',
              checked: false,
            },
            {
              label: 'Mise à jour des listes de diffusion',
              id: 'update_broadcast_list',
              checked: false,
            },
            { label: 'Consulation des champs libres', id: 'read_custom_field', checked: false },
            { label: 'Mise à jour des champs libres', id: 'update_custom_field', checked: false },
            {
              label: 'Consulation des champs spécifiques',
              id: 'read_specific_field',
              checked: false,
            },
            {
              label: 'Mise à jour des champs spécifiques',
              id: 'update_specific_field',
              checked: false,
            },
            {
              label: 'Consultation des adresses de livraison',
              id: 'read_delivery_address',
              checked: false,
            },
            {
              label: 'Mise à jour des adresses de livraison',
              id: 'update_delivery_address',
              checked: false,
            },
            {
              label: 'Consultation des comptes de facturation',
              id: 'read_customer_account',
              checked: false,
            },
            {
              label: 'Mise à jour des comptes de facturation',
              id: 'update_customer_account',
              checked: false,
            },
            { label: 'Blocage des actes (recouvrement)', id: 'manage_recovery', checked: false },
            {
              label: 'Consultation des offres catalogues',
              id: 'read_available_catalog_offers',
              checked: false,
            },
            {
              label: 'Association des offres catalogues',
              id: 'update_available_catalog_offers',
              checked: false,
            },
            { label: 'Consultation des types de SIM', id: 'read_available_sims', checked: false },
            { label: 'Association des types de SIM', id: 'update_available_sims', checked: false },
            {
              label: 'Consultation option de supervision',
              id: 'read_supervision_option',
              checked: false,
            },
            {
              label: 'Consultation du détail du compte',
              id: 'read_account_detail',
              checked: false,
            },
            {
              label: 'Modification du détail du compte',
              id: 'update_account_detail',
              checked: false,
            },
            {
              label: 'Consultation options du partenaire niveau 1 (vision client)',
              id: 'read_main_options',
              checked: false,
            },
            {
              label: 'Consultation options du partenaire niveau 2 (vision BO)',
              id: 'read_secondary_options',
              checked: false,
            },
            {
              label: 'Modification options du partenaire niveau 1',
              id: 'update_main_options',
              checked: false,
            },
            {
              label: 'Modification options du partenaire niveau 2',
              id: 'update_secondary_options',
              checked: false,
            },
            {
              label: 'Recherche compte de facturation',
              id: 'search_customer_account',
              checked: false,
            },
          ],
        },

        {
          id: 'user',
          label: 'Utilisateurs',
          permissions: [
            { label: 'Recherche / Consultation', id: 'read', checked: false },
            { label: 'Mise à jour', id: 'create', checked: false },
          ],
        },
      ],
    };
  },
};
</script>

<style lang="scss" scoped>
.roles-container {
  height: 100%;
  border-right: 1px solid rgba(0, 0, 0, 0.125);
  .list-group-item {
    &:hover {
      background: $light-gray;
      cursor: pointer;
    }
    &.active {
      background: $light-gray;
      color: black;
      font-weight: bold;
      border-top: 1px solid rgba(0, 0, 0, 0.125);
      border-bottom: 1px solid rgba(0, 0, 0, 0.125);
    }
  }
}
</style>
