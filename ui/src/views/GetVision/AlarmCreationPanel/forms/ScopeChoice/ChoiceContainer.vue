<template>
  <Fragment>
    <div class="scope-form">
      <slot name="form"></slot>
    </div>
    <div v-if="showResultBlock" class="scope-message" :style="{ height: messageHeight }">
      <div class="action-container" v-if="showButton">
        <UiButton variant="outline-info" @click="onStartSearch" :disabled="searchStarted">{{
          $t('search')
        }}</UiButton>
      </div>
      <slot v-else name="message"> </slot>
    </div>
  </Fragment>
</template>

<script>
import { Fragment } from 'vue-fragment';
import UiButton from '@/components/ui/Button';

export default {
  components: {
    Fragment,
    UiButton,
  },

  data() {
    return {
      searchStarted: false,
    };
  },

  methods: {
    onStartSearch() {
      this.$emit('search');
      this.searchStarted = true;
    },
  },

  props: {
    showButton: Boolean,
    showResultBlock: Boolean,
    messageHeight: {
      type: String,
      default: '18rem',
    },
  },
};
</script>

<style lang="scss" scoped>
.scope-message {
  width: 50%;
  padding-left: 1rem;
}

.scope-form {
  width: 50%;
  padding-right: 1rem;
  padding-top: 1rem;
}

.action-container {
  border: 2px dashed $gray-400;
  display: flex;
  justify-content: center;
  padding: 1rem;
}
</style>
