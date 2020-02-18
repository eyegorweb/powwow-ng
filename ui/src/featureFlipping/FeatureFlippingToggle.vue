<template>
  <div>
    <div v-if="canShowToggle" class="ff-container" @click.stop="toggle">
      <template v-if="mockIsVisible">
        <span class="ff-icon">
          <i class="ic-Eye-Icon"></i>
        </span>
        <div class="ff-text">Mocks visibles</div>
      </template>
      <template v-else>
        <span class="ff-icon">
          <i class="ic-Eye-Closed-Icon"></i>
        </span>
        <div class="ff-text">Mocks invisibles</div>
      </template>
    </div>

    <div
      v-if="canShowToggle"
      class="ff-container"
      style="bottom: 1.5rem;"
      @click.stop="debugMode = !debugMode"
    >
      <template v-if="debugMode">
        <span class="ff-icon">
          <i class="ic-Amplifier-Icon"></i>
        </span>
        <div class="ff-text">Debug : ON</div>
      </template>
      <template v-else>
        <span class="ff-icon">
          <i class="ic-Alt-Icon"></i>
        </span>
        <div class="ff-text">Debug : OFF</div>
      </template>
    </div>
  </div>
</template>

<script>
import { HIDE_MOCKS, DEBUG_MODE_ON, isProdEnv } from './plugin';

export default {
  data() {
    return {
      mockIsVisible: true,
      debugMode: false,
    };
  },
  watch: {
    mockIsVisible(value) {
      this.saveVisibilityState(value);
    },
    debugMode(value) {
      if (value) {
        localStorage.setItem(DEBUG_MODE_ON, DEBUG_MODE_ON);
      } else {
        localStorage.removeItem(DEBUG_MODE_ON);
      }
    },
  },
  computed: {
    canShowToggle() {
      return !isProdEnv();
    },
  },
  mounted() {
    this.mockIsVisible = !localStorage.getItem(HIDE_MOCKS);
    this.debugMode = !!localStorage.getItem(DEBUG_MODE_ON);
  },
  methods: {
    saveVisibilityState(value) {
      if (!value) {
        localStorage.setItem(HIDE_MOCKS, HIDE_MOCKS);
      } else {
        localStorage.removeItem(HIDE_MOCKS);
      }
    },
    toggle() {
      this.mockIsVisible = !this.mockIsVisible;
      location.reload();
    },
  },
};
</script>

<style lang="scss" scoped>
.ff-container {
  display: flex;
  position: fixed;
  bottom: 0;
  right: 0;
  .ff-text {
    font-size: 14px;
    padding-top: 5px;
    transition: width 0.15s;
    width: 0;
    height: 0;
    overflow: hidden;
  }
  &:hover {
    cursor: pointer;
    .ff-text {
      width: 100px;
      height: 40px;
    }
  }
  .ff-icon {
    outline: none;
    padding: 5px;
    border: 0px;
    box-sizing: none;
    background-color: transparent;
  }
}
</style>
