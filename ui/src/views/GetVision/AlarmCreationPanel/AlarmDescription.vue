<template>
  <div class="alarm-parent">
    <div class="alarm-desc slide-up-reveal">
      <div class="content">
        <h2>{{ $t('alarms.' + alarm.id) }}</h2>

        <p v-if="alarm.description">
          {{ alarm.description }}
        </p>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    alarm: Object,
  },
};
</script>

<style lang="scss" scoped>
.alarm-parent {
  display: flex;
  flex-direction: column;
  justify-content: center;
  height: 40%;
}
.alarm-desc {
  display: flex;
  justify-content: center;

  .content {
    width: 50%;
    text-align: center;
    color: $dark-gray;

    h2 {
      font-weight: 300;
      margin-bottom: 1.4rem;
    }

    p {
      font-size: 1.1rem;
      line-height: 1.1rem;
    }
  }
}
</style>
