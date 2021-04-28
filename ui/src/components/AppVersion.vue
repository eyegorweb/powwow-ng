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
      const response = await axios.get('/getversion');
      if (response && response.data) {
        this.appVersion = response.data;
      }
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
  font-size: 10px;
}
</style>
