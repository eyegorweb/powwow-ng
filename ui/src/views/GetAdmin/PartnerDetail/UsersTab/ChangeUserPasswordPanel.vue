<template>
  <BaseDetailPanelContent white>
    <div class="entries-line m-2">
      <div class="form-entry">
        <FormControl label="password" input-type="password" v-model="password" />
      </div>
      <div class="form-entry">
        <FormControl label="passwordConfirm" input-type="password" v-model="passwordConfirm" />
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
import FormControl from '@/components/ui/FormControl';
import UiButton from '@/components/ui/Button';
import { mapMutations } from 'vuex';
import { checkPasswordErrors } from './UserFormPanel';
import { updateUserPassword } from '@/api/users.js';

export default {
  components: {
    BaseDetailPanelContent,
    FormControl,
    UiButton,
  },
  data() {
    return {
      password: undefined,
      passwordConfirm: undefined,
    };
  },
  props: {
    content: Object,
  },
  computed: {
    userId() {
      return this.content.duplicateFrom.id;
    },

    passwordConfirmationErrors() {
      if (!this.password) return [];

      const errors = checkPasswordErrors(this.password, this.passwordConfirm);

      return errors;
    },
    canSave() {
      const passwordError = !!this.passwordConfirmationErrors.length;
      const missingFields = ['password', 'passwordConfirm'].filter(field => !this[field]);

      return !missingFields.length && !passwordError;
    },
  },
  methods: {
    ...mapMutations(['flashMessage', 'closePanel']),

    async save() {
      const params = {
        userId: this.userId,
        password: this.password,
        confirmPassword: this.passwordConfirm,
      };

      const response = await updateUserPassword(params);
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
      this.closePanel();
    },
  },
};
</script>

<style lang="scss" scoped></style>
