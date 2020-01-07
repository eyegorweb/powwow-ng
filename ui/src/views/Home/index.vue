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
      :layout.sync="layout"
      :col-num="3"
      :row-height="30"
      :is-draggable="true"
      :is-resizable="false"
      :is-mirrored="false"
      :vertical-compact="true"
      :margin="[10, 10]"
      :use-css-transforms="true"
    >
      <grid-item
        v-for="item in layout"
        :x="item.x"
        :y="item.y"
        :w="item.w"
        :h="item.h"
        :i="item.i"
        :key="item.i"
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
      <span>Personaliser ma home</span>
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

    ...mapState({
      homeWidgets: state => state.ui.homeWidgets,
    }),
    cellHeight() {
      if (window.innerWidth <= 1024) {
        return 4;
      }
      if (window.innerWidth > 1024 && window.innerWidth <= 1366) {
        return 5;
      }
      return 8;
    },
    activeWidgets() {
      if (!this.homeWidgets) return [];

      return this.homeWidgets.filter(w => w.checked);
    },
  },
  data() {
    return {
      layout: undefined,
      version: 0,
    };
  },
  mounted() {
    this.initFilterForContext();
    this.createLayout();
  },
  methods: {
    ...mapMutations(['openPanel', 'setHomeWidgets']),
    ...mapActions('getsim', ['initFilterForContext']),

    createLayout() {
      const layout = [];
      let lastLineIndex = 0;
      let x = 0;
      for (let i = 0; i < this.activeWidgets.length; i++) {
        const meta = this.activeWidgets[i];

        const width = meta.large ? 2 : 1;
        if (x + width > 2) {
          lastLineIndex += 1;
        }
        layout.push({ x, y: lastLineIndex, w: width, h: this.cellHeight, i, meta });
        x += width;
        if (x > 2) {
          x = 0;
        }
      }
      this.layout = layout;
      this.version += 1;
    },

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
    homeWidgets() {
      this.createLayout();
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
  background: $gray-400;
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
