<template>
  <BaseDetailPanelContent white>
    <!-- ajouter partenaire et groupe de partenaires dans la mutation partyId obligatoire et partyGroupId facultatif -->
    <div v-if="canShowForm" class="m-3">
      <div
        v-if="userIsBO"
        class="entries-line mb-3"
        :class="{ noDisplay: fromPagePartner || canHideToggle }"
      >
        <div class="form-entry">
          <Toggle
            block
            @update="userType = $event.id"
            :values="userTypes"
            :disabled="canShowTypes"
            class="pl-2 user-types"
          />
        </div>
      </div>

      <div class="row mb-3">
        <div class="col">
          <div class="d-flex gender">
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
        <div class="language">
          <label>{{ $t('getadmin.users.language') }}</label>
          <UiSelect class="text-gray language" block v-model="form.language" :options="languages" />
        </div>
        <div v-if="shouldSelectAPartner" class="form-entry" :class="{ noDisplay: fromPagePartner }">
          <label>{{ $t('getadmin.users.userTypes.partner') }}</label>
          <PartnerCombo
            class="partner"
            :value.sync="selectedPartner"
            :disabled="!!content.duplicateFrom"
          />
        </div>
        <div v-if="shouldSelectAPartnerGroup" class="form-entry" ref="partner-group">
          <label>{{ $t('getadmin.users.filters.partnerGroup') }}</label>
          <UiApiAutocomplete
            class="partner-group"
            :placeholder="$t('getadmin.users.filters.partnerGroup')"
            :items="groupPartners"
            v-model="selectedGroupPartner"
            display-results-while-empty
            :disabled="!!content.duplicateFrom"
          />
        </div>
      </div>

      <Checkbox v-if="userIsSuperAdmin" v-model="form.userPrivate">
        {{ $t('privateUser') }}
      </Checkbox>

      <div class="entries-line">
        <div class="form-entry">
          <FormControl class="firstname" label="common.firstName" v-model="form.firstName" />
        </div>
        <div class="form-entry pl-2">
          <FormControl class="lastname" label="common.lastName" v-model="form.lastName" />
        </div>
      </div>

      <div class="entries-line">
        <div class="form-entry">
          <FormControl class="email" label="common.email" v-model="form.email" />
          <span v-if="haveMailError" class="error-text">
            {{ $t('errors.password.email-error') }}
          </span>
        </div>
      </div>
      <div class="entries-line">
        <div class="form-entry">
          <input type="text" name="login" class="hidden" autocomplete="off" />
          <FormControl
            class="login"
            label="login"
            v-model="form.username"
            :disabled="loginFieldDisabled"
          />
          <span v-if="form.username && requestErrors && requestErrors.length" class="error-text">
            {{ requestErrors[0].message }}
          </span>
        </div>
      </div>

      <div v-if="isEditMode">
        <div class="entries-line">
          <div class="form-entry">
            <button class="btn pt-0 pl-0 btn-link" @click.stop="() => openChangePasswordPanel()">
              <em class="arrow ic-Plus-Icon" />
              {{ $t('getadmin.partnerDetail.changePassword.title') }}
            </button>
          </div>
        </div>
        <div class="entries-line" v-if="haveSetCaPermission && canShowCustomerAccounsList">
          <div class="form-entry">
            <button class="btn pt-0 pl-0 btn-link" @click.stop="() => openCustomerAccountsPanel()">
              <em class="arrow ic-Plus-Icon" />
              {{ $t('getadmin.partnerDetail.customerAccountsPanel.title') }}
            </button>
          </div>
        </div>
      </div>
      <div v-else>
        <div class="entries-line">
          <div class="form-entry">
            <input type="password" name="password" class="hidden" autocomplete="off" />
            <FormControl
              class="password"
              label="password"
              input-type="password"
              v-model="form.password"
            />
          </div>
          <div class="form-entry pl-2">
            <FormControl
              class="password-confirm"
              label="passwordConfirm"
              input-type="password"
              v-model="form.passwordConfirm"
            />
          </div>
        </div>
        <div class="entries-line" v-if="haveSetCaPermission && canShowCustomerAccounsList">
          <div class="form-entry">
            <button class="btn pt-0 pl-0 btn-link" @click.stop="() => openCustomerAccountsPanel()">
              <em class="arrow ic-Plus-Icon" />
              {{ $t('getadmin.partnerDetail.customerAccountsPanel.title') }}
            </button>
          </div>
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
        <div class="rolesType">
          <h4 :class="{ active: !showWebservices }" @click="showWebservices = false">ROLES</h4>
          <h4
            :class="{ active: showWebservices }"
            @click="showWebservices = true"
            v-if="haveWsPermission && rolesWs.length > 0"
          >
            WEBSERVICES
          </h4>
        </div>
        <div class="overview-item mr-5" v-if="!canShowRoles">
          <h6 v-if="userType === 'PARTNER'">{{ $t('getparc.actLines.step1Partner') }}</h6>
          <h6 v-if="userType === 'PARTNER_GROUP'">
            {{ $t('getadmin.partnerDetail.selectPartyGroup') }}
          </h6>
        </div>
        <div v-else>
          <MultiChoices
            class="roles"
            :options="roles"
            v-model="selectedRoles"
            v-if="!showWebservices"
          />
          <h3 v-if="rolesWsActions && showWebservices">Actions</h3>
          <MultiChoices
            class="roles"
            :options="rolesWsActions"
            v-model="selectedRolesWsActions"
            v-if="showWebservices && rolesWs.length > 0 && haveWsPermission"
          />
          <h3 v-if="rolesWsConsultation && showWebservices">Consultation</h3>
          <MultiChoices
            class="roles"
            :options="rolesWsConsultation"
            v-model="selectedRolesWsConsultation"
            v-if="showWebservices && rolesWs.length > 0 && haveWsPermission"
          />
        </div>
      </div>
    </div>
    <div v-if="exceptionError" slot="error" class="alert alert-danger" role="alert">
      <i class="ic-Alert-Icon"> </i>
      {{ exceptionError }}
    </div>

    <div slot="footer" class="action-buttons" v-if="havePermission('user', 'create')">
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
import PartnerCombo from '@/components/CustomComboxes/PartnerCombo.vue';
import UiApiAutocomplete from '@/components/ui/UiApiAutocomplete';
import Toggle from '@/components/ui/UiToggle2';
import cloneDeep from 'lodash.clonedeep';
import UiSelect from '@/components/ui/UiSelect';
import Checkbox from '@/components/ui/Checkbox.vue';

// API
import { delay } from '@/api/utils.js';
import { fetchAllowedRoles, createUser, updateUser, fetchPartnerGroups } from '@/api/users.js';
import { fetchpartnerById } from '@/api/partners.js';
import { fetchAllLanguages } from '@/api/language.js';
import { fetchBillingAccounts } from '@/api/billingAccounts';
import { formatBackErrors } from '@/utils/errors';

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

  if (!/[!"#$%&'()*+,-./:;<=>?@£µ§²éè\\çàù°¨[\]^_`{|}~]/.test(password)) {
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
    UiSelect,
    MultiChoices,
    PartnerCombo,
    UiApiAutocomplete,
    Toggle,
    Checkbox,
  },
  props: {
    content: Object,
  },
  data() {
    return {
      showWebservices: false,
      languages: undefined,
      canShowForm: false,
      resultLanguages: undefined,
      roles: [],
      rolesWs: [],
      selectedRoles: [],
      selectedRolesWs: [],
      selectedRolesWsActions: [],
      selectedRolesWsConsultation: [],
      selectedPartner: undefined,
      selectedGroupPartner: undefined,
      groupPartners: [],
      partnerChoices: [],
      customerAccounts: [],
      userTypes: [
        {
          id: 'OPERATOR',
          label: 'getadmin.users.userTypes.bouygues',
          default: this.content.fromPage === 'user',
        },
        {
          id: 'PARTNER',
          label: 'getadmin.users.userTypes.partner',
          default: this.content.fromPage === 'partner',
        },
        {
          id: 'PARTNER_GROUP',
          label: 'getadmin.users.userTypes.group',
          default: this.content.fromPage === 'group',
        },
      ],
      userType: undefined,
      formDataBeforeChange: undefined,
      form: {
        title: undefined,
        language: undefined,
        firstName: undefined,
        lastName: undefined,
        username: undefined,
        password: undefined,
        passwordConfirm: undefined,
        email: undefined,
        userPrivate: false,
      },
      userDefaultLanguage: 'FR',
      requestErrors: undefined,
      exceptionError: undefined,
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
          payload: this.content,
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

    async openCustomerAccountsPanel() {
      const title = this.$t('getadmin.partnerDetail.customerAccountsPanel.title');

      const formattedOptions = {
        customerAccounts: this.customerAccounts,
        roles: this.selectedRoles,
        partner: this.selectedPartner,
        form: this.form,
        lastPanelPayload: this.content,
      };

      const openTrigger = () => {
        this.openPanel({
          title,
          panelId: 'getadmin.partnerDetail.customerAccountsPanel.title',
          backdrop: true,
          width: '40rem',
          payload: formattedOptions,
          ignoreClickAway: true,
        });
      };

      this.closePanel();
      await delay(500);
      openTrigger();
    },

    async fetchCustomerAccounts(q = '', page = 0) {
      const partners = [];
      if (this.selectedPartner) {
        partners.push(this.selectedPartner);
      }
      const data = await fetchBillingAccounts(q, partners, { page, limit: 10 });
      return data.map((ba) => ({
        id: ba.id,
        label: `${ba.code} - ${ba.name}`,
        partnerId: ba.party.id,
        partner: ba.party,
      }));
    },

    async save() {
      let lang = this.resultLanguages.find((e) => e.label === this.form.language);
      let wsRoles = this.selectedRolesWsActions.concat(this.selectedRolesWsConsultation);
      const params = {
        title: this.form.title,
        language: lang ? lang.language : this.userDefaultLanguage,
        firstName: this.form.firstName,
        lastName: this.form.lastName,
        email: this.form.email,
        username: this.form.username,
        userPrivate: this.form.userPrivate,
        roles: this.selectedRoles.concat(wsRoles),
      };

      params.customerAccountIds = this.content.customerAccountIds;

      if (this.createMode || this.isDuplicateMode) {
        params.password = this.form.password;
        params.confirmPassword = this.form.passwordConfirm;
      }

      if (this.shouldSelectAPartner) {
        if (this.selectedPartner && this.selectedPartner.id) {
          params.partyId = this.selectedPartner.id;
        }
      }
      if (this.userIsPartner) {
        params.partyId = this.selectedPartner.id;
      }

      if (this.userType === 'PARTNER_GROUP') {
        const groupPartnerId = this.$loGet(this.selectedGroupPartner, 'id');
        if (this.selectedGroupPartner && groupPartnerId) {
          params.partyGroupId = this.selectedGroupPartner.id;
        }
      }
      if (this.userType !== 'PARTNER_GROUP') {
        if (
          this.$loGet(this.content, 'duplicateFrom.type') != 'OPERATOR' &&
          this.userType != 'OPERATOR'
        ) {
          params.partyId = this.content.partnerId || this.selectedPartner.id;
        }
      }

      let response, errorMessage;

      if (this.isEditMode) {
        params.id = this.content.duplicateFrom.id;
        response = await updateUser(params);
      } else {
        response = await createUser(params);
      }

      if (response && response.errors && response.errors.length) {
        response.errors.forEach(() => {
          if (
            response.errors[0].extensions &&
            response.errors[0].extensions['AccessDeniedForThisUser']
          ) {
            errorMessage = this.$t('getadmin.users.errors.AccessDeniedForThisUser');
          } else if (response.errors[0].extensions && response.errors[0].extensions['username']) {
            errorMessage = this.$t('getadmin.users.errors.username');
            this.requestErrors = [
              {
                message: errorMessage,
              },
            ];
            return;
          } else {
            errorMessage = this.$t('genericErrorMessage');
          }
          this.flashMessage({ level: 'danger', message: errorMessage });
          this.closePanel({ resetSearch: true });
        });
      } else {
        this.flashMessage({ level: 'success', message: this.$t('genericSuccessMessage') });
        this.closePanel({ resetSearch: true });
      }
    },

    formattedRoles(roles) {
      if (!roles) return [];
      return roles.map((r) => ({
        code: r.Id,
        label: r.description,
        data: r,
      }));
    },
  },

  computed: {
    ...mapGetters([
      'userInfos',
      'userIsBO',
      'userIsSuperAdmin',
      'userIsMultiPartner',
      'havePermission',
      'userIsPartner',
      'userIsGroupPartner',
      'singlePartner',
    ]),

    rolesWsActions() {
      return this.rolesWs.filter((e) => (e.data.category = 2));
    },

    rolesWsConsultation() {
      return this.rolesWs.filter((e) => (e.data.category = 1));
    },

    haveWsPermission() {
      return this.havePermission('user', 'webservice_permissions');
    },

    haveSetCaPermission() {
      return this.havePermission('user', 'set_ca');
    },

    haveMailError() {
      if (!this.form) return false;
      return this.form.email && !this.isEmailValid(this.form.email);
    },

    shouldSelectAPartnerGroup() {
      return this.userType === 'PARTNER_GROUP';
    },

    shouldSelectAPartner() {
      if (!this.content.duplicateFrom) {
        if (this.userIsGroupPartner) {
          return true;
        }
      }

      if (!this.userIsPartner) {
        return this.userType === 'PARTNER';
      }
      return false;
    },

    isEditMode() {
      return !!this.content.duplicateFrom && !this.content.duplicate;
    },
    isDuplicateMode() {
      return !!this.content.duplicateFrom && this.content.duplicate;
    },

    loginFieldDisabled() {
      if (this.isEditMode && !this.userIsBO) {
        return true;
      }

      return false;
    },

    fromPagePartner() {
      return this.content.fromPage === 'partner';
    },

    fromPageUsers() {
      return this.content.fromPage === 'users';
    },

    canHideToggle() {
      return (
        this.fromPage === 'users' &&
        (this.userInfos.type === 'PARTNER' || this.userInfos.type === 'PARTNER_GROUP')
      );
    },

    canShowCustomerAccounsList() {
      return this.selectedPartner && this.customerAccounts.length > 0;
    },

    canShowRoles() {
      return (
        this.fromPagePartner ||
        this.userType === 'OPERATOR' ||
        !!this.selectedPartner ||
        !!this.selectedGroupPartner ||
        (this.userInfos.type === 'PARTNER' &&
          !!this.userInfos.partners[0] &&
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
          (field) => this.form[field] !== this.formDataBeforeChange[field]
        );
        return !!changedFields.length;
      }
      return false;
    },

    canSave() {
      const passwordError = !!this.passwordConfirmationErrors.length;
      const fieldsToCheck = ['title', 'language', 'firstName', 'lastName', 'email', 'username'];

      if (this.createMode || this.isDuplicateMode) {
        fieldsToCheck.push('password', 'passwordConfirm');
      }

      const missingFields = fieldsToCheck.filter((field) => !this.form[field]);

      const roleError = this.roles.length > 0 ? !this.roles.length : false;

      let userTypeValid = true;

      if (this.userIsBO) {
        if (this.userType === 'PARTNER' && !!this.duplicateFrom) {
          userTypeValid = !!(this.selectedPartner && this.selectedPartner.id);
        }

        if (this.userType === 'PARTNER_GROUP') {
          userTypeValid = !!this.selectedGroupPartner;
        }
      }

      if (this.userIsGroupPartner) {
        if (this.shouldSelectAPartner) {
          userTypeValid = !!(this.selectedPartner && this.selectedPartner.id);
        }
      }

      return (
        !missingFields.length &&
        !passwordError &&
        !roleError &&
        this.isEmailValid(this.form.email) &&
        userTypeValid &&
        (this.selectedRoles.length > 0 ||
          this.selectedRolesWs.length > 0 ||
          this.selectedRolesWsActions.length > 0 ||
          this.selectedRolesWsConsultation.length > 0)
      );
    },

    passwordConfirmationErrors() {
      if (!this.form.password) return [];
      if (this.createMode || this.isDuplicateMode) {
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
    let rolesWs;

    if (this.userIsPartner) {
      this.userType = 'PARTNER';
      this.selectedPartner = this.singlePartner;
    }

    // récupération des langues
    let langArray = [];
    const response = await fetchAllLanguages();
    if (response.errors && response.errors.length) {
      let errorMessage = '';
      const formatted = formatBackErrors(response.errors)
        .map((e) => e.errors)
        .flat();
      formatted.forEach((e) => {
        if (e.key === 'user') {
          errorMessage = `${this.$t('getadmin.users.errors.CUSTOMER_ACCOUNT_USER_NOT_ALLOWED')}`;
        } else {
          errorMessage = `${e.key}: ${e.value}`;
        }
      });
      this.exceptionError = errorMessage;
      return;
    }

    this.resultLanguages = response;
    this.resultLanguages.forEach((e) => {
      langArray.push(e.label);
    });

    this.languages = langArray;

    // récupération du partenaire si fromPagePartner
    if (this.fromPagePartner) {
      this.selectedPartner = await fetchpartnerById(this.content.partnerId);
    }

    // Mode création depuis le menu partenaires

    if (this.content.fromPartnerMenu) {
      this.canShowForm = true;
      this.customerAccounts = await this.fetchCustomerAccounts();
      return;
    }

    // Mode création depuis le menu utilisateurs
    if (this.content.fromUserMenu && this.userIsPartner) {
      this.canShowForm = true;

      roles = await fetchAllowedRoles(null, this.singlePartner.id, null);
      if (roles.errors && roles.errors.length) {
        let errorMessage = '';
        const formatted = formatBackErrors(roles.errors)
          .map((e) => e.errors)
          .flat();
        formatted.forEach((e) => {
          if (e.key === 'user') {
            errorMessage = `${this.$t('getadmin.users.errors.CUSTOMER_ACCOUNT_USER_NOT_ALLOWED')}`;
          } else {
            errorMessage = `${e.key}: ${e.value}`;
          }
        });
        this.exceptionError = errorMessage;
        return;
      }
      this.roles = this.formattedRoles(roles);

      if (this.havePermission('user', 'webservice_permissions')) {
        rolesWs = await fetchAllowedRoles(null, this.singlePartner.id, null, true);
        if (rolesWs.errors && rolesWs.errors.length) {
          let errorMessage = '';
          const formatted = formatBackErrors(rolesWs.errors)
            .map((e) => e.errors)
            .flat();
          formatted.forEach((e) => {
            if (e.key === 'user') {
              errorMessage = `${this.$t(
                'getadmin.users.errors.CUSTOMER_ACCOUNT_USER_NOT_ALLOWED'
              )}`;
            } else {
              errorMessage = `${e.key}: ${e.value}`;
            }
          });
          this.exceptionError = errorMessage;
          return;
        }
        this.rolesWs = this.formattedRoles(rolesWs);
      }

      this.customerAccounts = await this.fetchCustomerAccounts();
      return;
    } else if (this.content.fromUserMenu && this.userInfos.type === 'PARTNER_GROUP') {
      this.canShowForm = true;
      roles = await fetchAllowedRoles(null, null, this.userInfos.partyGroup.id);
      rolesWs = await fetchAllowedRoles(null, null, this.userInfos.partyGroup.id, true);
      this.roles = this.formattedRoles(roles);
      this.rolesWs = this.formattedRoles(rolesWs);
      return;
    }

    // Mode modification
    if (this.content.duplicateFrom) {
      const userType = this.content.duplicateFrom.type;
      this.userType = userType;

      if (this.userType === 'OPERATOR') {
        roles = await fetchAllowedRoles(this.content.duplicateFrom.id, null, null);
        this.roles = this.formattedRoles(roles);
        this.selectedRoles = this.roles.filter((r) => r.data.activated);

        if (this.havePermission('user', 'webservice_permissions')) {
          rolesWs = await fetchAllowedRoles(this.content.duplicateFrom.id, null, null, true);
          this.rolesWs = this.formattedRoles(rolesWs);
          this.selectedRolesWs = this.rolesWs.filter((r) => r.data.activated);
        }
      } else if (this.userType === 'PARTNER') {
        this.selectedPartner = {
          id: this.content.duplicateFrom.partners[0].id,
          value: this.content.duplicateFrom.partners[0].name,
          label: this.content.duplicateFrom.partners[0].name,
          highlighted: this.content.duplicateFrom.partners[0].name,
        };
        this.customerAccounts = await this.fetchCustomerAccounts();

        roles = await fetchAllowedRoles(
          this.content.duplicateFrom.id,
          this.selectedPartner.id,
          null
        );
        if (roles.errors && roles.errors.length) {
          let errorMessage = '';
          const formatted = formatBackErrors(roles.errors)
            .map((e) => e.errors)
            .flat();
          formatted.forEach((e) => {
            if (e.key === 'user') {
              errorMessage = `${this.$t(
                'getadmin.users.errors.CUSTOMER_ACCOUNT_USER_NOT_ALLOWED'
              )}`;
            } else {
              errorMessage = `${e.key}: ${e.value}`;
            }
          });
          this.exceptionError = errorMessage;
          return;
        }
        this.roles = this.formattedRoles(roles);
        this.selectedRoles = this.roles.filter((r) => r.data.activated);

        if (this.havePermission('user', 'webservice_permissions')) {
          rolesWs = await fetchAllowedRoles(
            this.content.duplicateFrom.id,
            this.selectedPartner.id,
            null,
            true
          );
          if (rolesWs.errors && rolesWs.errors.length) {
            let errorMessage = '';
            const formatted = formatBackErrors(rolesWs.errors)
              .map((e) => e.errors)
              .flat();
            formatted.forEach((e) => {
              if (e.key === 'user') {
                errorMessage = `${this.$t(
                  'getadmin.users.errors.CUSTOMER_ACCOUNT_USER_NOT_ALLOWED'
                )}`;
              } else {
                errorMessage = `${e.key}: ${e.value}`;
              }
            });
            this.exceptionError = errorMessage;
            return;
          }
          this.rolesWs = this.formattedRoles(rolesWs);
          this.selectedRolesWs = this.rolesWs.filter((r) => r.data.activated);
        }
      } else if (this.userType === 'PARTNER_GROUP') {
        if (this.content.duplicateFrom.partners && this.content.duplicateFrom.partners.length) {
          this.selectedPartner = this.content.duplicateFrom.partners[0];
        }
        const groupPartnersResponse = await fetchPartnerGroups();
        this.groupPartners = groupPartnersResponse.map((p) => {
          return {
            id: p.id,
            label: p.name,
          };
        });

        this.selectedGroupPartner = this.content.duplicateFrom.partyGroup;

        roles = await fetchAllowedRoles(
          this.content.duplicateFrom.id,
          null,
          this.$loGet(this.selectedGroupPartner, 'id')
        );
        this.roles = this.formattedRoles(roles);
        this.selectedRoles = this.roles.filter((r) => r.data.activated);

        if (this.havePermission('user', 'webservice_permissions')) {
          rolesWs = await fetchAllowedRoles(
            this.content.duplicateFrom.id,
            null,
            this.$loGet(this.selectedGroupPartner, 'id'),
            true
          );
          if (rolesWs.errors && rolesWs.errors.length) {
            let errorMessage = '';
            const formatted = formatBackErrors(rolesWs.errors)
              .map((e) => e.errors)
              .flat();
            formatted.forEach((e) => {
              if (e.key === 'user') {
                errorMessage = `${this.$t(
                  'getadmin.users.errors.CUSTOMER_ACCOUNT_USER_NOT_ALLOWED'
                )}`;
              } else {
                errorMessage = `${e.key}: ${e.value}`;
              }
            });
            this.exceptionError = errorMessage;
            return;
          }
          this.rolesWs = this.formattedRoles(rolesWs);
          this.selectedRolesWs = this.rolesWs.filter((r) => r.data.activated);
        }
      }

      // Pré-remplissage formulaire
      if (this.content.duplicateFrom.name) {
        this.form.title = this.content.duplicateFrom.name.title;
        this.form.firstName = this.content.duplicateFrom.name.firstName;
        this.form.lastName = this.content.duplicateFrom.name.lastName;
        this.form.userPrivate = this.content.duplicateFrom.userPrivate;
      }

      this.form.username = this.content.duplicateFrom.username;
      this.form.email = this.content.duplicateFrom.email;
      let lang = this.resultLanguages.find(
        (e) => e.language === this.$loGet(this.content, 'duplicateFrom.preferredLocale')
      );
      if (lang) this.form.language = lang.label;

      this.userTypes = this.userTypes.map((u) => {
        if (u.id === userType) {
          u.default = true;
        }
        return u;
      });

      this.formDataBeforeChange = cloneDeep(this.form);
    }

    // Route depuis l'association des CF (donc création ou modification en cours)
    if (this.content.fromPanelCustomerAccounts) {
      this.form.title = this.content.form.title;
      this.form.firstName = this.content.form.firstName;
      this.form.lastName = this.content.form.lastName;
      this.form.language = this.content.form.language;
      this.form.username = this.content.form.username;
      this.form.password = this.content.form.password;
      this.form.passwordConfirm = this.content.form.passwordConfirm;
      this.form.email = this.content.form.email;
      this.form.userPrivate = this.content.form.userPrivate;
      this.userTypes = this.userTypes.map((u) => {
        if (u.id === 'PARTNER') {
          u.default = true;
        }
        return u;
      });
      this.selectedPartner = this.content.partner;
    }

    this.canShowForm = true;
  },

  watch: {
    async selectedPartner() {
      if (!this.content.duplicateFrom && this.selectedPartner && this.selectedPartner.id) {
        const id = this.selectedPartner.id;
        const roles = await fetchAllowedRoles(null, id, null);
        this.roles = this.formattedRoles(roles);

        if (this.havePermission('user', 'webservice_permissions')) {
          const rolesWs = await fetchAllowedRoles(null, id, null, true);
          this.rolesWs = this.formattedRoles(rolesWs);
        }

        // Ajouter un fetch sur les CF par le partyId
        if (!this.fromPagePartner) {
          this.customerAccounts = await this.fetchCustomerAccounts();
        }
      }
    },
    async selectedGroupPartner() {
      if (!this.content.duplicateFrom) {
        const roles = await fetchAllowedRoles(
          null,
          null,
          this.$loGet(this.selectedGroupPartner, 'id')
        );
        this.roles = this.formattedRoles(roles);

        if (this.havePermission('user', 'webservice_permissions')) {
          const rolesWs = await fetchAllowedRoles(
            null,
            null,
            this.$loGet(this.selectedGroupPartner, 'id'),
            true
          );
          this.rolesWs = this.formattedRoles(rolesWs);
        }
      }
    },
    async userType(value) {
      let roles;
      let rolesWs;
      if (this.content.duplicateFrom) return;
      if (value === 'OPERATOR') {
        // Appelé en plus de l'initialisation => corriger donc
        this.selectedPartner = undefined;
        this.selectedGroupPartner = undefined;
        if (this.content.fromUserMenu) {
          roles = await fetchAllowedRoles(null, null, null);
          if (this.havePermission('user', 'webservice_permissions')) {
            rolesWs = await fetchAllowedRoles(null, null, null, true);
          }
        } else if (this.content.fromPartnerMenu) {
          roles = await fetchAllowedRoles(null, this.content.partnerId, null);
          if (this.havePermission('user', 'webservice_permissions')) {
            rolesWs = await fetchAllowedRoles(null, this.content.partnerId, null, true);
          }
        }
        this.roles = this.formattedRoles(roles);
        this.rolesWs = this.formattedRoles(rolesWs);
      } else if (value === 'PARTNER') {
        this.selectedGroupPartner = undefined;
      } else if (value === 'PARTNER_GROUP') {
        this.selectedPartner = undefined;
        const groupPartnersResponse = await fetchPartnerGroups();
        this.groupPartners = groupPartnersResponse.map((p) => {
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
.language {
  margin-bottom: 20px;
}

.noDisplay {
  display: none !important;
}

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

.language {
  margin-right: 10px;
}

.rolesType {
  display: flex;

  h4 {
    width: 50%;
    text-align: center;
    font-size: 14px;
    margin-bottom: 20px;
    cursor: pointer;

    &.active {
      border-bottom: 2px solid #009dcc;
      font-weight: 500;
      color: #009dcc;
    }
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
