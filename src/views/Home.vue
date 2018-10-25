<template>
  <div class="home">
    <img
      alt="Vue logo"
      src="../assets/logo.png"
    >

    <button @click="show = !show">Toggle</button>
    <TransitionCollapse>
      <HelloWorld
        v-if="show"
        msg="Welcome to Your Vue.js App"
      />
    </TransitionCollapse>
  </div>
</template>

<script>
// @ is an alias to /src
import HelloWorld from '@/components/HelloWorld.vue';
import TransitionCollapse from '@/components/TransitionCollapse.vue';

export default {
  name: 'Home',
  data() {
    return {
      show: false,
    };
  },
  components: {
    HelloWorld,
    TransitionCollapse,
  },
};
</script>
