<template>
  <div class="p-4 slide-up-reveal">
    <ScopeChoice />
    <slot />
    <NotificationChoice :num="haveForm ? 3 : 2" />
  </div>
</template>

<script>
import ScopeChoice from './ScopeChoice';
import NotificationChoice from './NotificationChoice';

export default {
  components: {
    ScopeChoice,
    NotificationChoice,
  },
  props: {
    alarm: Object,
    haveForm: Boolean,
  },
};
</script>

<style lang="scss" scoped></style>
