<template>
  <div class="navbars bg-white">
    <NavBarBackoffice
      v-if="isBackofficeProfile"
      :partners-types="partnersTypes"
      :partners-names="partnersNames"
    />
    <NavBar :is-backoffice-profile="isBackofficeProfile" />
  </div>
</template>

<script>
import NavBarBackoffice from './NavBarBackoffice';
import NavBar from './NavBar';

export default {
  name: 'NavBars',
  data() {
    return {
      partnersTypes: [],
      partnersNames: [],
    };
  },
  props: {
    isBackofficeProfile: Boolean,
  },
  components: {
    NavBarBackoffice,
    NavBar,
  },
};
</script>

<style scoped lang="scss">
.navbars {
  width: auto;
  margin: 0 auto;
  padding: 0 10px;
}
</style>
