<template>
  <div class="mt-2">
    <Messages />
    <HomePageDragDropGrid
      v-if="getWidgetsByPermission && canShowGrid"
      :widgets="getWidgetsByPermission"
      :context-filters="contextFilters"
      @change="onWidgetsChange"
    />

    <button class="panel-toggle bg-secondary" @click.stop="openCustomizePanel">
      <i class="ic-Wheel-Icon" />
      <span>{{ $t('personalizeHome') }}</span>
    </button>
  </div>
</template>

<script>
import { mapMutations, mapGetters, mapState, mapActions } from 'vuex';
import HomePageDragDropGrid from './HomePageDragDropGrid';
import { defaultWidgets, userByCustomerAccountWidgets } from './widgets.js';
import Messages from './Messages';

export default {
  components: {
    HomePageDragDropGrid,
    Messages,
  },
  computed: {
    ...mapGetters('userContext', ['contextFilters']),
    ...mapState('userContext', ['contextPartnersType', 'contextPartners']),
    ...mapGetters(['userIsPartner', 'havePermission', 'userIsByCustomerAccount']),
    ...mapGetters(['activeWidgets']),

    ...mapState({
      localWidgets: (state) => state.ui.homeWidgets,
    }),

    getWidgetsByPermission() {
      if (!this.defaultWidgets.length) return;

      const isWidgetAccessible = (widget) => {
        if (!widget || !widget.permission) return false;
        return this.havePermission(widget.permission.domain, widget.permission.action);
      };

      const defaultAcessibleWidgets = this.defaultWidgets.filter(isWidgetAccessible);

      if (this.localWidgets && this.localWidgets.length === defaultAcessibleWidgets.length) {
        const checkWidgets = defaultAcessibleWidgets.every((accessibleWidget) => {
          return this.localWidgets.filter(
            (localStorageWidget) => localStorageWidget.title === accessibleWidget.title
          );
        });

        return checkWidgets
          ? this.localWidgets.filter(isWidgetAccessible)
          : defaultAcessibleWidgets;
      }

      return defaultAcessibleWidgets;
    },
  },
  data() {
    return {
      version: 0,
      updating: false,
      canShowGrid: false,
      defaultWidgets: [],
    };
  },
  mounted() {
    this.defaultWidgets = this.userIsByCustomerAccount
      ? userByCustomerAccountWidgets
      : defaultWidgets;
    this.initHomeWidgets(this.userIsByCustomerAccount);
    this.initFilterForContext();

    /**
     * Attendre avant de charger les composants de la page d'acceuil
     * pour éviter des appels inutiles quand cypress reviens sur la page d'accueil entre les tests
     */
    setTimeout(() => {
      this.canShowGrid = true;
    }, 100);
  },

  methods: {
    ...mapMutations(['openPanel', 'setHomeWidgets', 'initHomeWidgets']),
    ...mapActions('getsim', ['initFilterForContext']),

    openCustomizePanel() {
      this.openPanel({
        title: this.$t('home.customize.title'),
        panelId: 'home.customize.title',
        payload: {
          homeWidgets: this.getWidgetsByPermission,
        },
        wide: false,
        backdrop: false,
      });
    },

    onWidgetsChange(newWidgets) {
      this.setHomeWidgets(newWidgets);
    },
  },
  watch: {
    contextPartnersType() {
      this.initFilterForContext();
    },
    contextPartners() {
      this.initFilterForContext();
    },
  },
};
</script>

<style lang="scss" scoped>
.bloc {
  &.wide {
    width: 100%;
  }
}
.card {
  .card-header {
    background: none;
    color: $dark-gray;
    border-bottom: 0;
    font-family: 'Open Sans', sans-serif;
    font-size: 1rem;
    padding: 0.75rem 1.25rem;
  }
}

.panel-toggle {
  color: white;
  position: fixed;
  padding: 0.7rem;
  border-top-left-radius: 3px;
  border-bottom-left-radius: 3px;
  transform: translateX(calc(100% - 1rem - 16px));
  right: 0;
  transition: transform 0.2s;
  border: 0;
  top: 4rem;
  &:hover {
    cursor: pointer;
    transform: translateX(0);
  }
  span {
    padding-left: 1rem;
  }
}
</style>
