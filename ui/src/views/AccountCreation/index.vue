<template>
  <div class="cd-panel__container">
    <div class="cd-panel__content">
      <div class="creation-panel">
        <div class="stepper-container">
          <div class="account-creation-stepper">
            <div class="card">
              <Stepper :key="$i18n.locale" :steps="steps" :selected-index="currentStep" />
              <div class="p-4">
                <keep-alive>
                  <router-view :key="$route.fullPath" :synthesis="synthesis"></router-view>
                </keep-alive>
              </div>
            </div>
          </div>
        </div>
        <CreateAccountPanelSynthesis
          :synthesis="synthesis"
          :can-save="currentStep === steps.length - 1"
          @save="saveAccount"
        />
      </div>
    </div>
  </div>
</template>

<script>
import Stepper from '@/components/ui/Stepper';
import CreateAccountPanelSynthesis from './CreateAccountPanelSynthesis';

export default {
  components: {
    Stepper,
    CreateAccountPanelSynthesis,
  },

  mounted() {
    // url page anonyme: http://localhost:8081/p/create-account
    // si utilisateur connecté aller directement vers le choix Offre
    // this.$router.push({ name: 'createAccount.offer' });
    // sinon aller à la création de partenaire
    this.$router.push({ name: 'createAccount.partner' });
  },

  data() {
    return {
      synthesis: {},
    };
  },

  computed: {
    currentStep() {
      const index = this.steps.findIndex((s) => s.route === this.$route.name);
      return index !== -1 ? index : 0;
    },
    steps() {
      return [
        {
          label: this.$t('digitalOffer.accountCreation'),
          route: 'createAccount.partner',
        },
        {
          label: this.$t('digitalOffer.offer'),
          route: 'createAccount.offer',
        },
        {
          label: this.$t('digitalOffer.simType'),
          route: 'createAccount.simChoice',
        },
        {
          label: this.$t('digitalOffer.delivery'),
          route: 'createAccount.delivery',
        },
      ];
    },
  },

  methods: {
    saveAccount() {
      console.log('appel api save account here');
    },
  },

  watch: {
    $route() {
      const stepData = this.$loGet(this.$route, 'params.step');
      if (!this.synthesis) {
        this.synthesis = {};
      }
      if (stepData) {
        this.synthesis = {
          ...this.synthesis,
          ...stepData,
        };
      }
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
    // .account-creation-stepper
    // display: flex;
    // justify-content: center;
    // margin-top: 1rem;
    width: 70%;
    background: white;
    overflow: auto;
    padding: 1rem;
    display: flex;
    flex-flow: column nowrap;
    height: 100%;

    .account-creation-stepper {
      height: 100%;
      padding: 0;

      .step-container {
        display: flex;
        flex-direction: column;
        height: 100%;
      }
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
