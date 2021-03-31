<template>
  <div class="creation-panel">
    <div class="step-wrapper">
      <div class="steps">
        <Stepper :key="$i18n.locale" :steps="steps" :selected-index="currentStep" />
      </div>
      <div class="stepContent">
        <slot
          name="content"
          :currentStep="currentStep"
          :previousStep="previousStep"
          :stepisDone="stepisDone"
          :saveSynthesis="saveSynthesis"
          :reset="reset"
          :synthesis="synthesis"
        />
      </div>
    </div>
    <div class="wizard-synthesis">
      <div class="loader" v-if="showLoader">
        <div class="skeleton-line"></div>
      </div>
      <slot v-else name="synthesis" :synthesis="synthesis" :currentStep="currentStep" />
    </div>
  </div>
</template>

<script>
import Stepper from '@/components/ui/Stepper';

export default {
  components: {
    Stepper,
  },
  props: {
    steps: Array,
  },
  data() {
    return {
      showLoader: false,
      synthesis: {},
      currentStep: 0,
    };
  },

  methods: {
    reset() {
      this.currentStep = 0;
      this.synthesis = {};
    },

    previousStep(payload) {
      this.saveSynthesis(payload);
      this.currentStep--;
    },
    stepisDone(payload) {
      this.saveSynthesis(payload);
      this.currentStep++;
    },
    saveSynthesis(payload) {
      this.synthesis = {
        ...this.synthesis,
        ...payload,
      };
    },
  },
};
</script>

<style lang="scss" scoped>
.content {
  background: #fff;
}

.creation-panel {
  display: flex;
  flex-flow: row nowrap;
  height: 100%;

  .step-wrapper {
    width: 70%;
    background: white;
    overflow: auto;
    padding: 1rem;
    display: flex;
    flex-flow: column nowrap;
    height: 100%;

    .steps {
      flex-basis: 4rem;
    }

    @media all and (-ms-high-contrast: none), (-ms-high-contrast: active) {
      .steps {
        overflow: hidden;
      }
    }

    .stepContent {
      flex-grow: 1;
    }
  }

  .wizard-synthesis {
    width: 30%;
    background: #f1f1f1;
    overflow: auto;
    padding: 1rem;
    position: relative;

    .loader {
      z-index: 100;
      position: absolute;
      width: 100%;
      height: 100%;
      background-color: #fff;
      display: flex;
      justify-content: center;
      align-items: center;
    }
    .skeleton-line {
      width: 100px;
      height: 10px;
    }
  }
}
</style>
