<template>
  <BaseDetailPanelContent white>
    <!-- ajouter partenaire et groupe de partenaires dans la mutation partyId obligatoire et partyGroupId facultatif -->
    <div v-if="canShowForm" class="m-3">
      <div v-if="userIsBO" class="entries-line mb-3">
        <div class="form-entry">
          <Toggle
            block
            @update="userType = $event.id"
            :values="userTypes"
            :disabled="canShowTypes"
            class="pl-2"
          />
        </div>
      </div>

      <div class="row mb-3">
        <div class="col">
          <div class="d-flex">
            <label class="radio-container mr-3">
              {{ $t('common.MR') }}
              <input name="civility" type="radio" value="MR" v-model="form.title" />
              <span class="checkmark" />
            </label>
            <label class="radio-container">
              {{ $t('common.MRS') }}
              <input name="civility" type="radio" value="MRS" v-model="form.title" />
              <span class="checkmark" />
            </label>
          </div>
        </div>
      </div>

      <div class="entries-line">
        <div v-if="userType === 'PARTNER'" class="form-entry">
          <label>{{ $t('getadmin.users.userTypes.partner') }}</label>
          <PartnerCombo :value.sync="selectedPartner" offline :disabled="!!content.duplicateFrom" />
        </div>
        <div v-if="userType === 'PARTNER_GROUP'" class="form-entry">
          <label>{{ $t('getadmin.users.filters.partnerGroup') }}</label>
          <UiApiAutocomplete
            :placeholder="$t('getadmin.users.filters.partnerGroup')"
            :items="groupPartners"
            v-model="selectedGroupPartner"
            display-results-while-empty
            :disabled="!!content.duplicateFrom"
          />
        </div>
      </div>

      <div class="entries-line">
        <div class="form-entry">
          <FormControl label="common.firstName" v-model="form.firstName" />
        </div>
        <div class="form-entry pl-2">
          <FormControl label="common.lastName" v-model="form.lastName" />
        </div>
      </div>

      <div class="entries-line">
        <div class="form-entry">
          <FormControl label="common.email" v-model="form.email" />
          <span v-if="form.email && !isEmailValid(form.email)" class="error-text">
            {{ $t('errors.password.email-error') }}
          </span>
        </div>
      </div>
      <div class="entries-line">
        <div class="form-entry">
          <FormControl label="login" v-model="form.username" />
        </div>
      </div>

      <div v-if="content.duplicateFrom" class="entries-line">
        <div class="form-entry">
          <button class="btn pt-0 pl-0 btn-link" @click.stop="() => openChangePasswordPanel()">
            <i class="arrow ic-Plus-Icon" />
            Modifier le mot de passe
          </button>
        </div>
      </div>
      <div v-else class="entries-line">
        <div class="form-entry">
          <FormControl label="password" input-type="password" v-model="form.password" />
        </div>
        <div class="form-entry pl-2">
          <FormControl
            label="passwordConfirm"
            input-type="password"
            v-model="form.passwordConfirm"
          />
        </div>
      </div>

      <div v-if="passwordConfirmationErrors" class="entries-line">
        <div class="form-entry">
          <ul class="list-unstyled">
            <li :key="error" v-for="error in passwordConfirmationErrors" class="error-text">
              {{ $t(error) }}
            </li>
          </ul>
        </div>
      </div>

      <div>
        <h4>{{ $t('getadmin.users.filters.roles') }}</h4>
        <div class="overview-item mr-5" v-if="!canShowRoles">
          <h6 v-if="userType === 'PARTNER'">{{ $t('getparc.actLines.step1Partner') }}</h6>
          <h6 v-if="userType === 'PARTNER_GROUP'">
            {{ $t('getadmin.partnerDetail.selectPartyGroup') }}
          </h6>
        </div>
        <div v-else>
          <MultiChoices :options="roles" v-model="selectedRoles" />
        </div>
      </div>
    </div>
    <div slot="footer" class="action-buttons">
      <div>
        <UiButton variant="import" @click="closePanel" block>{{ $t('cancel') }}</UiButton>
      </div>
      <div>
        <UiButton :disabled="!canSave" variant="primary" @click="save" block>
          {{ $t('save') }}
        </UiButton>
      </div>
    </div>
  </BaseDetailPanelContent>
</template>

<script>
import BaseDetailPanelContent from '@/components/BaseDetailPanelContent';
import UiButton from '@/components/ui/Button';
import FormControl from '@/components/ui/FormControl';
import MultiChoices from '@/components/MultiChoices';

import { mapGetters, mapMutations } from 'vuex';
import { fetchAllowedRoles, createUser, updateUser, fetchPartnerGroups } from '@/api/users.js';
import PartnerCombo from '@/components/CustomComboxes/PartnerCombo.vue';
import UiApiAutocomplete from '@/components/ui/UiApiAutocomplete';
import Toggle from '@/components/ui/UiToggle2';
import { delay } from '@/api/utils.js';
import cloneDeep from 'lodash.clonedeep';

export function checkPasswordErrors(password, passwordConfirm) {
  const errors = [];

  // Le mot de passe doit faire plus de 8 caractères.
  if (password.length <= 8) {
    errors.push('errors.password.length-error');
  }

  // Le mot de passe doit contenir au moins une minuscule et une majuscule.
  if (!/[A-Z]/.test(password)) {
    errors.push('errors.password.uppercase-error');
  }
  if (!/[a-z]/.test(password)) {
    errors.push('errors.password.lowercase-error');
  }
  // Le mot de passe doit contenir au moins un chiffre, une lettre avec accent ou un caractère spécial.

  if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
    errors.push('errors.password.special-error');
  }

  if (!/[0-9]+/.test(password)) {
    errors.push('errors.password.number-error');
  }

  // correspond
  if (password && password != passwordConfirm) {
    errors.push('errors.password.confirm-error');
  }

  return errors;
}

export default {
  components: {
    BaseDetailPanelContent,
    UiButton,
    FormControl,
    MultiChoices,
    PartnerCombo,
    UiApiAutocomplete,
    Toggle,
  },
  props: {
    content: Object,
  },
  data() {
    return {
      canShowForm: false,
      roles: [],
      selectedRoles: [],
      selectedPartner: undefined,
      selectedGroupPartner: undefined,
      groupPartners: [],
      partnerChoices: [],
      userTypes: [
        {
          id: 'OPERATOR',
          label: 'getadmin.users.userTypes.bouygues',
        },
        {
          id: 'PARTNER',
          label: 'getadmin.users.userTypes.partner',
        },
        {
          id: 'PARTNER_GROUP',
          label: 'getadmin.users.userTypes.group',
        },
      ],
      userType: undefined,
      formDataBeforeChange: undefined,
      form: {
        title: undefined,
        firstName: undefined,
        lastName: undefined,
        username: undefined,
        password: undefined,
        passwordConfirm: undefined,
        email: undefined,
      },
    };
  },

  methods: {
    ...mapMutations(['flashMessage', 'closePanel', 'openPanel', 'confirmAction']),

    isEmailValid(email) {
      var re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
      return re.test(email);
    },

    async openChangePasswordPanel() {
      const title = this.$t('getadmin.partnerDetail.changePassword.title');

      const openTrigger = () => {
        this.openPanel({
          title,
          panelId: 'getadmin.partnerDetail.changePassword.title',
          backdrop: true,
          width: '40rem',
          ignoreClickAway: true,
        });
      };

      if (this.fieldsHaveChanged) {
        this.confirmAction({
          message: 'getadmin.partnerDetail.changePassword.warning',
          actionFn: async () => {
            this.closePanel();
            await delay(500);
            openTrigger();
          },
        });
      } else {
        this.closePanel();
        await delay(500);
        openTrigger();
      }
    },

    async save() {
      const params = {
        title: this.form.title,
        firstName: this.form.firstName,
        lastName: this.form.lastName,
        email: this.form.email,
        username: this.form.username,
        roles: this.selectedRoles,
      };

      if (this.createMode) {
        params.password = this.form.password;
        params.confirmPassword = this.form.passwordConfirm;
      }

      if (this.userIsBO) {
        if (this.userType === 'PARTNER') {
          if (this.selectedPartner && this.selectedPartner.id) {
            params.partyId = this.selectedPartner.id;
          }
        }

        if (this.userType === 'PARTNER_GROUP') {
          if (this.selectedGroupPartner && this.selectedGroupPartner.id) {
            params.partyGroupId = this.selectedGroupPartner.id;
          }
        }
      }

      let response;

      if (this.content.duplicateFrom && !this.content.duplicate) {
        params.id = this.content.duplicateFrom.id;
        response = await updateUser(params);
      } else {
        response = await createUser(params);
      }

      if (response && response.errors && response.errors.length) {
        response.errors.forEach(e => {
          console.log(e);
          let errorMessage =
            response.errors[0].extensions[''] === 'AccessDeniedForThisUser'
              ? this.$t('getadmin.users.errors.AccessDeniedForThisUser')
              : this.$t('genericErrorMessage');
          this.flashMessage({ level: 'danger', message: errorMessage });
        });
      } else {
        this.flashMessage({ level: 'success', message: this.$t('genericSuccessMessage') });
      }

      this.closePanel({ resetSearch: true });
    },

    formattedRoles(roles) {
      if (!roles) return [];
      return roles.map(r => ({
        code: r.Id,
        label: r.description,
        data: r,
      }));
    },
  },

  computed: {
    ...mapGetters(['userInfos', 'userIsBO', 'userIsPartner', 'userIsGroupAccount']),

    canShowRoles() {
      return (
        this.userType === 'OPERATOR' ||
        !!this.selectedPartner ||
        !!this.selectedGroupPartner ||
        (this.userInfos.type === 'PARTNER' &&
          this.userInfos.partners[0].length > 0 &&
          !!this.userInfos.partners[0].id) ||
        (this.userInfos.type === 'PARTNER_GROUP' &&
          !!this.userInfos.partyGroup &&
          !!this.userInfos.partyGroup.id)
      );
    },

    canShowTypes() {
      return !!this.content.duplicateFrom;
    },

    createMode() {
      return !this.content.duplicateFrom;
    },

    fieldsHaveChanged() {
      if (this.formDataBeforeChange) {
        const fieldsToCheck = ['title', 'firstName', 'lastName', 'email', 'username'];
        const changedFields = fieldsToCheck.filter(
          field => this.form[field] !== this.formDataBeforeChange[field]
        );
        return !!changedFields.length;
      }
      return false;
    },

    canSave() {
      const passwordError = !!this.passwordConfirmationErrors.length;
      const fieldsToCheck = ['title', 'firstName', 'lastName', 'email', 'username'];

      if (this.createMode) {
        fieldsToCheck.push('password', 'passwordConfirm');
      }

      const missingFields = fieldsToCheck.filter(field => !this.form[field]);

      const roleError = this.roles.length > 0 ? !this.roles.length : false;

      let userTypeValid = true;

      if (this.userIsBO) {
        if (this.userType === 'PARTNER') {
          userTypeValid = !!(this.selectedPartner && this.selectedPartner.id);
        }

        if (this.userType === 'PARTNER_GROUP') {
          userTypeValid = !!this.selectedGroupPartner;
        }
      }

      return (
        !missingFields.length &&
        !passwordError &&
        !roleError &&
        this.isEmailValid(this.form.email) &&
        userTypeValid
      );
    },

    passwordConfirmationErrors() {
      if (!this.form.password) return [];
      if (this.createMode) {
        const errors = checkPasswordErrors(this.form.password, this.form.passwordConfirm);

        // Le mot de passe doit être différent du nom ou prénom.
        if (
          this.form.firstName === this.form.password ||
          this.form.lastName === this.form.password
        ) {
          errors.push('errors.password.name-error');
        }

        return errors;
      }

      return [];
    },
  },

  async mounted() {
    this.canShowForm = false;
    let roles;
    // Mode création
    if (this.content.fromPartnerMenu) return;
    // Mode modification
    if (this.content.duplicateFrom) {
      const userType = this.content.duplicateFrom.type;
      this.userType = userType;

      this.selectedPartner = { id: parseInt(this.content.partnerId) };

      if (this.userType === 'OPERATOR') {
        roles = await fetchAllowedRoles(this.content.duplicateFrom.id, null, null);
        this.roles = this.formattedRoles(roles);
        this.selectedRoles = this.roles.filter(r => r.data.activated);
      } else if (this.userType === 'PARTNER') {
        roles = await fetchAllowedRoles(
          this.content.duplicateFrom.id,
          this.selectedPartner.id,
          null
        );
        this.roles = this.formattedRoles(roles);
        this.selectedRoles = this.roles.filter(r => r.data.activated);
      } else if (this.userType === 'PARTNER_GROUP') {
        const groupPartnersResponse = await fetchPartnerGroups();
        this.groupPartners = groupPartnersResponse.map(p => {
          return {
            id: p.id,
            label: p.name,
          };
        });
        this.selectedGroupPartner =
          this.groupPartners && this.groupPartners.length > 0 ? this.groupPartners[0].label : '';
        const groupPartnerId =
          this.groupPartners && this.groupPartners.length > 0 ? this.groupPartners[0].id : null;

        roles = await fetchAllowedRoles(this.content.duplicateFrom.id, null, groupPartnerId);
        this.roles = this.formattedRoles(roles);
        this.selectedRoles = this.roles.filter(r => r.data.activated);
      }

      // Pré-remplissage formulaire
      if (this.content.duplicateFrom.name) {
        this.form.title = this.content.duplicateFrom.name.title;
        this.form.firstName = this.content.duplicateFrom.name.firstName;
        this.form.lastName = this.content.duplicateFrom.name.lastName;
      }
      this.form.username = this.content.duplicateFrom.username;
      this.form.email = this.content.duplicateFrom.email;

      this.userTypes = this.userTypes.map(u => {
        if (u.id === userType) {
          u.default = true;
        }
        return u;
      });

      this.formDataBeforeChange = cloneDeep(this.form);
    }

    this.canShowForm = true;
  },

  watch: {
    async selectedPartner() {
      if (!this.content.duplicateFrom) {
        if (!this.selectedPartner) return;
        const roles = await fetchAllowedRoles(null, this.selectedPartner.id, null);
        this.roles = this.formattedRoles(roles);
      }
    },
    async selectedGroupPartner() {
      if (!this.content.duplicateFrom) {
        const groupPartnerId =
          this.groupPartners && this.groupPartners.length > 0 ? this.groupPartners[0].id : null;
        const roles = await fetchAllowedRoles(null, null, groupPartnerId);
        this.roles = this.formattedRoles(roles);
      }
    },
    async userType(value) {
      let roles;
      if (this.content.duplicateFrom) return;
      if (value === 'OPERATOR') {
        // Appelé en plus de l'initialisation => corriger donc
        this.selectedPartner = undefined;
        this.selectedGroupPartner = undefined;
        if (this.content.fromUserMenu) {
          roles = await fetchAllowedRoles(null, null, null);
        } else if (this.content.fromPartnerMenu) {
          roles = await fetchAllowedRoles(null, this.content.partnerId, null);
        }
        this.roles = this.formattedRoles(roles);
      } else if (value === 'PARTNER') {
        this.selectedGroupPartner = undefined;
      } else if (value === 'PARTNER_GROUP') {
        this.selectedPartner = undefined;
        const groupPartnersResponse = await fetchPartnerGroups();
        this.groupPartners = groupPartnersResponse.map(p => {
          return {
            id: p.id,
            label: p.name,
          };
        });
      }
    },
  },
};
</script>

<style lang="scss" scoped>
.form-input {
  font-size: 1.5rem !important;
}

.form-entry {
  flex-grow: 1;

  h5 {
    font-size: 1rem;
    color: $dark-gray;
  }
}

.overview-item {
  flex-grow: 1;
}

.entries-line {
  display: flex;
  justify-content: space-between;
}
.labels-container {
  display: flex;
  border-bottom: 1px dashed $medium-gray;
  .overview-item {
    border: none !important;
  }
}

.radio-container {
  display: block;
  position: relative;
  padding-left: 35px;
  cursor: pointer;
  font-size: 1rem;
  user-select: none;
  input {
    position: absolute;
    opacity: 0;
    cursor: pointer;
  }
}

.checkmark {
  position: absolute;
  top: 0;
  left: 0;
  height: 25px;
  width: 25px;
  border-radius: 50%;
  border: 1px solid $gray-400;
}

.radio-container {
  input:checked ~ .checkmark {
    background-color: white;
    border: 1px solid $secondary;
  }
}

.checkmark:after {
  content: '';
  position: absolute;
  display: none;
}

.radio-container {
  input:checked ~ .checkmark:after {
    display: block;
  }
  .checkmark:after {
    top: 5px;
    left: 5px;
    width: 13px;
    height: 13px;
    border-radius: 50%;
    background: $secondary;
  }
}
</style>
