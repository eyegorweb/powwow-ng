<template>
  <div class="mt-2">
    <ff-wip>
      <div class="bloc d-inline-block p-1 wide">
        <div class="card">
          <div class="card-header">ZONE FIXE NOTIFICATIONS</div>
          <div class="card-body">Notifications ici</div>
        </div>
      </div>
      <div class="bloc d-inline-block p-1 narrow">
        <div class="card">
          <div class="card-header">ZONE FIXE PROMOTION</div>
          <div class="card-body">promotions ici</div>
        </div>
      </div>
    </ff-wip>

    <draggable v-model="widgetsInPanel" handle=".handle">
      <transition-group name="widgets">
        <template v-for="w in activeWidgets">
          <component
            :key="w.title"
            v-if="w.component"
            :is="w.component"
            :widget="w"
            :context-filters="contextFilters"
          />
        </template>
      </transition-group>
    </draggable>
    <button class="panel-toggle bg-secondary" @click.stop="openCustomizePanel">
      <i class="ic-Wheel-Icon" />
      <span>Personaliser ma home</span>
    </button>
  </div>
</template>

<script>
import draggable from 'vuedraggable';
import { mapMutations, mapGetters, mapState, mapActions } from 'vuex';

export default {
  components: {
    draggable,
  },
  computed: {
    ...mapGetters(['activeWidgets']),
    ...mapGetters('userContext', ['contextFilters']),
    ...mapState('userContext', ['contextPartnersType', 'contextPartners']),
    ...mapState({
      homeWidgets: state => state.ui.homeWidgets,
    }),
    widgetsInPanel: {
      get() {
        return this.homeWidgets;
      },
      set(newValues) {
        this.setHomeWidgets(newValues);
      },
    },
  },
  mounted() {
    this.initFilterForContext();
  },
  methods: {
    ...mapMutations(['openPanel', 'setHomeWidgets']),
    ...mapActions('getsim', ['initFilterForContext']),

    openCustomizePanel() {
      this.openPanel({
        title: this.$t('home.customize.title'),
        panelId: 'home.customize.title',
        payload: {},
        wide: false,
        backdrop: false,
      });
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
  &.narrow {
    width: 33.3333%;
  }

  &.wide {
    width: 66.6666%;
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
