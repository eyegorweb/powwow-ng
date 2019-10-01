<template>
  <div class="card">
    <div class="card-body">
      <div class="row">
        <div class="col-7">
          <slot name="main" :containerValidationFn="validate" />
          <slot name="bottom"></slot>
        </div>
        <div class="col-5">
          <slot name="messages"></slot>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapMutations } from 'vuex';

export default {
  components: {},

  props: {
    validateFn: Function,
    checkErrorsFn: Function,
    successMessage: String,
  },

  methods: {
    ...mapMutations(['flashMessage']),
    ...mapMutations('actLines', [
      'setActToCreate',
      'setActCreationPrerequisites',
      'setSelectedLinesForActCreation',
    ]),

    async validate() {
      if (this.haveErrors()) return;

      const response = await this.validateFn({
        actDate: this.actDate,
        notificationCheck: this.notificationCheck,
      });

      if (!response) {
        this.flashMessage({ level: 'danger', message: 'Erreur inconnue' });
      }

      if (response) {
        if (response.needDoubleConfirmation) return;
        if (response.errors) {
          response.errors.forEach(e => {
            this.flashMessage({ level: 'danger', message: e.message });
          });
        } else {
          const successMessage = this.successMessage
            ? this.$t(this.successMessage)
            : 'Opération effectuée avec succès';
          this.flashMessage({ level: 'success', message: successMessage });

          // sortir du mode création acte
          this.setActToCreate(null);
          this.setActCreationPrerequisites(null);
          this.setSelectedLinesForActCreation([]);
        }
      }
    },

    haveErrors() {
      if (this.checkErrorsFn) {
        return this.checkErrorsFn();
      }

      return false;
    },
  },
};
</script>

<style lang="scss" scoped>
.to-bottom {
  align-items: flex-end;
  display: flex;
  margin-bottom: 1rem;
}
</style>
