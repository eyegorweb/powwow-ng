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
    <grid-layout
      :key="'grid_' + version"
      v-if="layout"
      :layout="layout"
      :col-num="3"
      :row-height="30"
      :is-draggable="true"
      :is-resizable="false"
      :is-mirrored="false"
      :vertical-compact="true"
      :margin="[10, 10]"
      :use-css-transforms="true"
      @layout-updated="onLayoutUpdate"
    >
      <grid-item
        v-for="item in layout"
        :x="item.x"
        :y="item.y"
        :w="item.w"
        :h="item.h"
        :i="item.i"
        :key="item.i"
        :is-draggable="!item.notDraggable"
      >
        <component
          :is="item.meta.component"
          :key="item.meta.title"
          v-if="item.meta.component"
          :widget="item.meta"
          :context-filters="contextFilters"
        />
      </grid-item>
    </grid-layout>

    <button class="panel-toggle bg-secondary" @click.stop="openCustomizePanel">
      <i class="ic-Wheel-Icon" />
      <span>{{ $t('personalizeHome') }}</span>
    </button>
  </div>
</template>

<script>
import VueGridLayout from 'vue-grid-layout';
import { mapMutations, mapGetters, mapState, mapActions } from 'vuex';

export default {
  components: {
    GridLayout: VueGridLayout.GridLayout,
    GridItem: VueGridLayout.GridItem,
  },
  computed: {
    ...mapGetters('userContext', ['contextFilters']),
    ...mapState('userContext', ['contextPartnersType', 'contextPartners']),
    ...mapGetters(['userIsPartner', 'havePermission']),

    ...mapState({
      homeWidgets: state => state.ui.homeWidgets,
    }),

    permittedHomeWidgets() {
      return this.homeWidgets.filter(w => {
        if (!w || !w.permission) return false;
        return this.havePermission(w.permission.domain, w.permission.action);
      });
    },
    cellHeight() {
      if (window.innerWidth <= 1024) {
        return 5;
      }
      if (window.innerWidth > 1024 && window.innerWidth <= 1460) {
        return 5.5;
      }
      return 8;
    },
    activeWidgets() {
      if (!this.permittedHomeWidgets) return [];

      return this.permittedHomeWidgets.filter(w => w.checked);
    },
  },
  data() {
    return {
      layout: undefined,
      version: 0,
      startWatchingWidgets: false,
      updating: false,
    };
  },
  mounted() {
    this.initHomeWidgets();
    this.initFilterForContext();
    this.setWidgetsToLayout();
    this.updateLayoutInfoInWigets(this.layout);

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

    updateLayoutInfoInWigets(layout) {
      const homeWidgets = this.permittedHomeWidgets.map(w => {
        const existingLayout = layout.find(l => l.title === w.title);
        if (existingLayout) {
          w.layout = {
            x: existingLayout.x,
            y: existingLayout.y,
            w: existingLayout.w,
            h: this.cellHeight,
            title: existingLayout.title,
            i: existingLayout.i,
            notDraggable: existingLayout.notDraggable,
          };
        }
        return w;
      });
      this.updating = true;
      this.setHomeWidgets(homeWidgets);
      setTimeout(() => {
        this.updating = false;
      });
    },

    onLayoutUpdate(newLayout) {
      this.updateLayoutInfoInWigets(newLayout);
    },

    setWidgetsToLayout() {
      this.layout = this.getLayoutFromHomeWidgets();
      this.version += 1;
    },

    getLayoutFromHomeWidgets() {
      if (!this.permittedHomeWidgets) return;

      let layout = [];
      let y = 0;
      let x = 0;
      let spaceInLine = 3;

      if (this.permittedHomeWidgets.length && this.permittedHomeWidgets[0].layout) {
        // already have layout data
        layout = this.permittedHomeWidgets
          .filter(o => o.checked)
          .map(w => {
            return {
              ...w.layout,
              meta: w,
              notDraggable: w.notDraggable,
            };
          });
      } else {
        for (let i = 0; i < this.permittedHomeWidgets.length; i++) {
          const meta = this.permittedHomeWidgets[i];

          const width = meta.large ? 2 : 1;

          if (width > spaceInLine) {
            spaceInLine = 3;
            y += this.cellHeight;
            x = 0;
          }

          if (meta.checked) {
            layout.push({
              x,
              y,
              w: width,
              h: this.cellHeight,
              title: meta.title,
              i,
              meta,
              notDraggable: meta.notDraggable,
            });
          }

          spaceInLine -= width;
          x += width;
        }
      }

      return layout;
    },
  },
  watch: {
    homeWidgets() {
      // recalculate layout
      if (!this.updating) {
        this.setWidgetsToLayout();
      }
    },
    contextPartnersType() {
      this.initFilterForContext();
    },
    contextPartners() {
      this.initFilterForContext();
    },
  },
};
</script>

<style lang="scss">
.vue-grid-item.vue-grid-placeholder {
  background: $gray-400 !important;
}
</style>

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
