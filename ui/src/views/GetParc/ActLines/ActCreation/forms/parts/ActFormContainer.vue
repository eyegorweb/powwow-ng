<template>
  <div class="card">
    <div class="card-body">
      <div class="row">
        <div class="col-8">
          <slot />
          <div class="row">
            <div class="col d-flex">
              <UiCheckbox v-model="notificationCheck" />
              <span>{{ $t('getparc.actCreation.NOTIFICATION_CHECK') }}</span>
            </div>
          </div>
          <div class="row">
            <div class="col">
              <UiDate @change="onActDateChange" :value="actDate" :error="dateError" class="d-block">
                <i slot="icon" class="select-icon ic-Flag-Icon" />
              </UiDate>
            </div>
            <div class="col">
              <button @click="validate" class="btn btn-primary pl-4 pr-4 pt-2 pb-2">
                {{ $t('set') }}
              </button>
            </div>
          </div>
        </div>
        <div class="col-4"></div>
      </div>
    </div>
  </div>
</template>

<script>
import UiDate from '@/components/ui/UiDate2';
import UiCheckbox from '@/components/ui/Checkbox';
import { mapMutations } from 'vuex';

export default {
  components: {
    UiDate,
    UiCheckbox,
  },

  props: {
    validateFn: Function,
  },

  data() {
    return {
      actDate: null,
      dateError: null,
      notificationCheck: false,
    };
  },
  methods: {
    ...mapMutations(['flashMessage']),
    ...mapMutations('actLines', ['setActToCreate']),

    onActDateChange(value) {
      this.actDate = value;
    },

    async validate() {
      if (this.haveErrors()) return;

      const response = await this.validateFn({
        actDate: this.actDate,
        notificationCheck: this.notificationCheck,
      });

      console.log(response);
      if (!response) {
        this.flashMessage({ level: 'danger', message: 'Erreur inconnue' });
      }

      if (response) {
        if (response.errors) {
          response.errors.forEach(e => {
            this.flashMessage({ level: 'danger', message: e.description });
          });
        } else {
          this.flashMessage({ level: 'success', message: 'Opération effectuée avec succès' });

          // sortir du mode création acte
          this.setActToCreate(null);
        }
      }
    },

    haveErrors() {
      this.dateError = undefined;
      if (!this.actDate) {
        this.dateError = 'errors.mandatory';
        return true;
      }
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
