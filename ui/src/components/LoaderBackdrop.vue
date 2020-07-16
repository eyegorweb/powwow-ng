<template>
  <Fragment>
    <div v-if="loading" class="backdrop">
      <div class="barSpinner centered">
        <div class="rect1"></div>
        <div class="rect2"></div>
        <div class="rect3"></div>
        <div class="rect4"></div>
        <div class="rect5"></div>
      </div>
    </div>
  </Fragment>
</template>

<script>
import { Fragment } from 'vue-fragment';

export default {
  components: {
    Fragment,
  },
  props: {
    loading: Boolean,
  },
};
</script>

<style lang="scss" scoped>
.backdrop {
  background: rgba(0, 0, 0, 0.6);
  width: 100%;
  height: 100%;
  position: fixed;
  top: 0;
  left: 0;
  z-index: 5;
}

.centered {
  position: fixed; /* or absolute */
  top: 50%;
  left: 50%;
}

.barSpinner {
  width: 50px;
  height: 40px;
  text-align: center;
  font-size: 10px;
}

.barSpinner > div {
  background-color: #fff;
  height: 100%;
  width: 6px;
  margin-right: 1px;
  display: inline-block;

  -webkit-animation: sk-stretchdelay 1.2s infinite ease-in-out;
  animation: sk-stretchdelay 1.2s infinite ease-in-out;
}

.barSpinner .rect2 {
  -webkit-animation-delay: -1.1s;
  animation-delay: -1.1s;
}

.barSpinner .rect3 {
  -webkit-animation-delay: -1s;
  animation-delay: -1s;
}

.barSpinner .rect4 {
  -webkit-animation-delay: -0.9s;
  animation-delay: -0.9s;
}

.barSpinner .rect5 {
  -webkit-animation-delay: -0.8s;
  animation-delay: -0.8s;
}

@-webkit-keyframes sk-stretchdelay {
  0%,
  40%,
  100% {
    -webkit-transform: scaleY(0.4);
  }
  20% {
    -webkit-transform: scaleY(1);
  }
}

@keyframes sk-stretchdelay {
  0%,
  40%,
  100% {
    transform: scaleY(0.4);
    -webkit-transform: scaleY(0.4);
  }
  20% {
    transform: scaleY(1);
    -webkit-transform: scaleY(1);
  }
}
</style>
