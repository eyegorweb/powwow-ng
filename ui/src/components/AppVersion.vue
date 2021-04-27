<template>
  <div>
    <div class="app-version-container">
      {{ appVersion }}
    </div>
  </div>
</template>

<script>
import axios from 'axios';

export default {
  async mounted() {
    try {
      this.appVersion = await axios.get('/getversion');
    } catch {
      this.appVersion = 'local';
    }
  },
  data() {
    return {
      appVersion: undefined,
    };
  },
};
</script>

<style lang="scss" scoped>
.app-version-container {
  position: fixed;
  bottom: 0;
  left: 0;
  color: #f3f3f3;
}
</style>
