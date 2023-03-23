<template>
  <div class="cd-panel__container">
    <div class="cd-panel__content">
      <div class="creation-panel">
        <div class="stepper-container">
          <div class="loader-container">
            <h6>{{ $t('processing') }}...</h6>
            <CircleLoader />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import CircleLoader from '@/components/ui/CircleLoader';
import { validateAccount } from '@/api/digital.js';
import { redirectTo, getBaseURL } from '@/utils';

export default {
  components: {
    CircleLoader,
  },

  mounted() {
    if (this.$route.params && this.$route.params.paymentId) {
      this.validate(this.$route.params.paymentId, true);
      if (window.location.href.includes('payment')) {
        const hashParts = window.location.href.split('/payment/')[1].split('/');
        this.$router.push({
          name: 'home',
          params: { paymentId: hashParts[1], status: hashParts[0] },
        });
      } else if (window.location.href.includes('create-account')) {
        this.validate(this.$route.params.paymentId);
        setTimeout(() => {
          this.routeToLogin();
        }, 3000);
      }
    }
  },

  computed: {
    authUrl() {
      return getBaseURL();
    },
    refreshUrl() {
      return `${this.authUrl}/oauth/resetPassword`;
    },
    currentUrl() {
      const sameUrl =
        location.protocol + '//' + location.hostname + (location.port ? ':' + location.port : '');

      return window.location.href.replace(sameUrl, '');
    },
  },

  methods: {
    async validate(paymentId, status) {
      if (paymentId) {
        return await validateAccount(paymentId, status);
      }
    },

    routeToLogin() {
      redirectTo(this.refreshUrl);
    },
  },
};
</script>

<style lang="scss" scoped>
.creation-panel {
  display: flex;
  flex-flow: row nowrap;
  height: 100%;
  width: 100%;
  overflow: auto;

  .stepper-container {
    width: 70%;
    background: white;
    overflow: auto;
    padding: 1rem;
    display: flex;
    flex-flow: column nowrap;
    height: 100%;
    position: relative;

    .loader-container {
      width: 300px;
      height: 300px;
      position: absolute;
      top: 50%;
      left: 50%;
      margin: -150px 0 0 -150px;
      font-size: 3rem;
      text-align: center;
    }
  }
}
</style>
