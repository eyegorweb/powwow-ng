<template>
  <div class="mt-2">
    <HomePageDragDropGrid
      v-if="permittedHomeWidgets"
      :widgets="permittedHomeWidgets"
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

export default {
  components: {
    HomePageDragDropGrid,
  },
  computed: {
    ...mapGetters('userContext', ['contextFilters']),
    ...mapState('userContext', ['contextPartnersType', 'contextPartners']),
    ...mapGetters(['userIsPartner', 'havePermission']),

    ...mapState({
      homeWidgets: (state) => state.ui.homeWidgets,
    }),

    permittedHomeWidgets() {
      if (!this.homeWidgets) {
        return undefined;
      }
      return this.homeWidgets.filter((w) => {
        if (!w || !w.permission) return false;
        return this.havePermission(w.permission.domain, w.permission.action);
      });
    },

    activeWidgets() {
      if (!this.permittedHomeWidgets) return [];

      return this.permittedHomeWidgets.filter((w) => w.checked);
    },
  },
  data() {
    return {
      version: 0,
      startWatchingWidgets: false,
      updating: false,
    };
  },
  mounted() {
    this.initHomeWidgets();
    this.initFilterForContext();

    this.startWatchingWidgets = true;
  },

  methods: {
    ...mapMutations(['openPanel', 'setHomeWidgets', 'initHomeWidgets']),
    ...mapActions('getsim', ['initFilterForContext']),

    openCustomizePanel() {
      this.openPanel({
        title: this.$t('home.customize.title'),
        panelId: 'home.customize.title',
        payload: {
          homeWidgets: this.permittedHomeWidgets,
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
