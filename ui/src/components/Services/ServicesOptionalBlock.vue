<template>
  <div class="row">
    <div
      v-if="services && services.length"
      :class="{ 'col-md-8': !fullWidth, 'col-md-12': fullWidth }"
    >
      <div class="s-container">
        <div
          :key="service.code"
          v-for="service in services"
          class="service"
          :class="service.name ? 'fullWidth' : { 'quarter-size': fullWidth }"
        >
          <span class="serviceOptional-name">{{ service.labelService }} :</span>
          <span class="serviceOptional-status" :class="service.checked ? 'enable' : 'disable'">
            {{
              service.checked
                ? $t('getparc.lineDetail.tab1.activatedAt')
                : service.activationDate
                ? $t('getparc.lineDetail.tab1.disableAt')
                : $t('orders.detail.deActivate')
            }}
          </span>
          <span class="serviceOptional-date">{{ service.activationDate }}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    services: Array,
    initialServices: {
      type: Array,
      default: () => [],
    },
    fullWidth: Boolean,
  },
};
</script>

<style lang="scss" scoped>
.s-container {
  display: flex;
  flex-direction: column;
  flex-wrap: wrap;
  justify-content: space-between;
}
.service {
  flex-basis: 45%;
}
.serviceOptional-date {
  font-size: 0.8rem;
  font-weight: 500;
  color: $success;
}

.serviceOptional {
  display: flex;

  > div {
    margin-right: 0.5rem;
  }

  &-status {
    &.enable {
      color: $success;
    }
    &.disable {
      color: $orange;
    }
  }
}
</style>
