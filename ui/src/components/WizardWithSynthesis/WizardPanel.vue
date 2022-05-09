<template>
  <div class="creation-panel">
    <div class="step-wrapper">
      <div class="steps pb-4">
        <Stepper :key="$i18n.locale" :steps="steps" :selected-index="currentStep" />
      </div>
      <div class="stepContent">
        <slot name="content" />
      </div>
    </div>
    <div class="wizard-synthesis" :class="{ open: showSynthesis }">
      <div class="loader" v-if="showLoader">
        <div class="skeleton-line"></div>
      </div>
      <slot v-else name="synthesis" />
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
    currentStep: Number,
    showSynthesis: Boolean,
  },
  data() {
    return {
      showLoader: false,
    };
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

    @media screen and (max-width: 768px) {
      padding-top: 30px;
      width: 100%;
    }
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

@media screen and (max-width: 900px) {
  .cd-panel__container {
    width: 100%;
  }
  .creation-panel {
    width: 100%;
    .stepper-container {
      width: 100% !important;
      margin-top: 60px;
      .step-container {
        .container {
          max-width: 100%;
          width: 100%;
        }
      }
      .account-creation-success {
        text-align: left;
        font-size: 14px;
      }
    }
    .wizard-synthesis {
      position: absolute;
      width: 100%;
      top: 0;
      left: 0;

      &-wrapper {
        height: 60px;
      }

      &.open {
        height: 100vh;
        h6 span {
          transform: rotate(-45deg);
        }
      }
    }
  }
}
</style>
