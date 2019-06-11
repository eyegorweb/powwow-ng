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
              <UiDate @change="onActDateChange" :value="actDate" class="d-block">
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

export default {
  components: {
    UiDate,
    UiCheckbox,
  },

  data() {
    return {
      actDate: null,
      notificationCheck: false,
    };
  },
  methods: {
    onActDateChange(value) {
      this.actDate = value;
    },

    validate() {
      this.$emit('validate', {
        actDate: this.actDate,
        notificationCheck: this.notificationCheck,
      });
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
