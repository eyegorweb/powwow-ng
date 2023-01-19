<template>
  <BaseDetailPanelContent white>
    <div class="entries-line m-2">
      <GroupMultiSelect
        from-title="getadmin.partnerDetail.customerAccountsPanel.ba_list"
        to-title="getadmin.partnerDetail.customerAccountsPanel.chosen_ba"
        :options.sync="options"
        @update:options="updateOptions"
      />
    </div>
    <div slot="footer" class="action-buttons">
      <div>
        <UiButton variant="import" @click="cancel" block>{{ $t('cancel') }}</UiButton>
      </div>
      <div>
        <UiButton :disabled="!canSave" variant="primary" @click="validate" block>
          {{ $t('getsim.actions.VALIDATE') }}
        </UiButton>
      </div>
    </div>
  </BaseDetailPanelContent>
</template>

<script>
import BaseDetailPanelContent from '@/components/BaseDetailPanelContent';
import UiButton from '@/components/ui/Button';
import GroupMultiSelect from '@/components/GroupMultiSelect';
import { mapMutations } from 'vuex';
import { delay } from '@/api/utils.js';
import cloneDeep from 'lodash.clonedeep';
import isEqual from 'lodash.isequal';
import { searchUsers } from '@/api/users';

export default {
  components: {
    BaseDetailPanelContent,
    UiButton,
    GroupMultiSelect,
  },

  props: {
    content: Object,
  },

  mounted() {
    const formattedOptions = this.content.customerAccounts.map((c) => ({
      id: c.id,
      label: c.label,
      data: c,
      parent: c.partnerId,
      selected: c.selected ? true : false,
    }));
    this.options = formattedOptions;

    this.lastPanelPayload = this.content.lastPanelPayload;

    this.initOptions();

    this.form.language = this.content.form.language;
    this.form.title = this.content.form.title;
    this.form.firstName = this.content.form.firstName;
    this.form.lastName = this.content.form.lastName;
    this.form.username = this.content.form.username;
    this.form.password = this.content.form.password;
    this.form.passwordConfirm = this.content.form.passwordConfirm;
    this.form.email = this.content.form.email;
    this.form.userPrivate = this.content.form.userPrivate;
  },

  data() {
    return {
      options: [],
      selectedOptions: [],
      initialSelectedOptions: [],
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
      lastPanelPayload: undefined,
      hasSelectedCustomerAccountsChanged: false,
    };
  },

  computed: {
    canSave() {
      if (
        this.content &&
        this.content.lastPanelPayload &&
        this.content.lastPanelPayload.duplicateFrom
      ) {
        return this.hasSelectedCustomerAccountsChanged;
      }
      return this.selectedOptions && this.selectedOptions.length;
    },

    payloadTitlePanel() {
      let title = this.$t('getadmin.partnerDetail.userForm.title');
      if (this.$loGet(this.content, 'lastPanelPayload.duplicateFrom'))
        title = this.$t('getadmin.partnerDetail.userForm.modify-title');
      return title;
    },
  },

  methods: {
    ...mapMutations(['openPanel', 'closePanel', 'confirmAction']),

    initOptions() {
      if (
        this.lastPanelPayload &&
        this.lastPanelPayload.duplicateFrom &&
        this.lastPanelPayload.duplicateFrom.customerAccounts &&
        this.lastPanelPayload.duplicateFrom.customerAccounts.length > 0
      ) {
        this.selectedOptions = this.options.filter((o) => {
          if (this.lastPanelPayload.duplicateFrom.customerAccounts.find((oo) => o.id === oo.id)) {
            o.selected = true;
            return o;
          }
        });
        this.initialSelectedOptions = cloneDeep(this.selectedOptions);
      }
    },

    updateOptions(values) {
      const selectedValues = values.filter((o) => o.selected);
      this.selectedOptions = values.filter((o) => o.selected);
      this.hasSelectedCustomerAccountsChanged = this.checkSelectedCustomerAccounts(selectedValues);
    },
    /**
     * Comparer les "CA" présélectionnés avec ceux en cours de sélection/désélection
     * @param {Array} options liste générale des CA
     */
    checkSelectedCustomerAccounts(options) {
      if (!options.length && !this.initialSelectedOptions.length) {
        return false;
      } else if (this.initialSelectedOptions.length !== options.length) {
        return true;
      } else if (
        this.initialSelectedOptions.length &&
        this.initialSelectedOptions.length === options.length
      ) {
        return !isEqual(this.initialSelectedOptions, options);
      } else {
        return false;
      }
    },

    async validate() {
      const customerAccountIds = this.selectedOptions.map((cf) => cf.id);
      const refreshUsersTable = async () => {
        await searchUsers('', { key: 'fullname', direction: 'ASC' }, { limit: 50, page: 0 }, []);
      };
      const openTrigger = () => {
        this.openPanel({
          title: this.payloadTitlePanel,
          panelId: 'getadmin.partnerDetail.userForm.title',
          backdrop: true,
          width: '40rem',
          payload: {
            ...this.lastPanelPayload,
            form: this.form,
            customerAccountIds,
            fromPanelCustomerAccounts: true,
            partner: this.content.partner,
            roles: this.content.roles,
            rolesWs: this.content.rolesWs,
          },
          ignoreClickAway: false,
          onClosePanel() {
            refreshUsersTable();
          },
        });
      };

      this.closePanel();
      await delay(500);
      openTrigger();
    },

    async cancel() {
      const openTrigger = () => {
        this.openPanel({
          title: this.payloadTitlePanel,
          panelId: 'getadmin.partnerDetail.userForm.title',
          backdrop: true,
          width: '40rem',
          payload: {
            ...this.lastPanelPayload,
            form: this.form,
            customerAccountIds: [],
            fromPanelCustomerAccounts: true,
            partner: this.content.partner,
            roles: this.content.roles,
            rolesWs: this.content.rolesWs,
          },
          ignoreClickAway: false,
        });
      };

      if (this.selectedOptions.length > 0 && this.hasSelectedCustomerAccountsChanged) {
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
        // await delay(500);
        // openTrigger();
      }
    },
  },
};
</script>

<style lang="scss" scoped></style>
