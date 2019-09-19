<template>
  <span>
    <template v-if="title === 'home.widgets.userActs'">
      {{ $t('home.widgets.userActs', { userName: userName }) }}
    </template>
    <template v-else>{{ $t(title) }}</template>
  </span>
</template>

<script>
import { mapGetters } from 'vuex';

export default {
  props: {
    title: String,
  },
  computed: {
    ...mapGetters(['userName']),
  },
};
</script>

<style lang="scss" scoped></style>
