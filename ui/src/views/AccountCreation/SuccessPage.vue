<template>
  <div class="cd-panel__container">
    <div class="cd-panel__content">
      <div class="creation-panel">
        <div class="stepper-container">
          <CircleLoader />
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
    console.log('success page redirection from paynum', this.$route);
    if (this.$route.params && this.$route.params.paymentId) {
      this.validate(this.$route.params.paymentId);

      // redirection 1ère ou commandes suivantes (donc connecté)
      if (window.location.href.includes('payment')) {
        const hashParts = window.location.href.split('/ok/');
        this.$router.push({ name: 'home', params: { paymentId: hashParts[1] } });
      } else if (window.location.href.includes('create-account')) {
        setTimeout(() => {
          this.routeToLogin();
        }, 3000);
      }
    }

    // ajouter la redirection pour commandes suivantes ou recharge
    // recharge {"paymentTypeEnum":"TOP_UP", "id":880585613, "paid":false} // id=> null retour vers getparc car recherche non unitaire sinon retour vers détail de la ligne
    // autres commandes {"paymentTypeEnum":"ORDER", "id":221, "paid":false}
  },

  computed: {
    authUrl() {
      return getBaseURL();
    },
    refreshUrl() {
      return `${this.authUrl}/oauth/authorize?response_type=token&client_id=${process.env.VUE_APP_CLIENT_ID}&redirect_uri=${window.location.origin}/refresh.html`;
    },
    currentUrl() {
      const sameUrl =
        location.protocol + '//' + location.hostname + (location.port ? ':' + location.port : '');

      return window.location.href.replace(sameUrl, '');
    },
  },

  methods: {
    async validate(paymentId) {
      if (paymentId) {
        return await validateAccount(paymentId);
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
  }
}
</style>
