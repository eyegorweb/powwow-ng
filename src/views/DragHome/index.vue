<template>
  <div class="container">
    <div class="bloc d-inline-block p-1 narrow">
      <div class="card">
        <div class="card-header">ZONE FIXE NOTIFICATIONS</div>
        <div class="card-body">Narrow bloc here</div>
      </div>
    </div>
    <div class="bloc d-inline-block p-1 wide">
      <div class="card">
        <div class="card-header">ZONE FIXE PROMOTION</div>
        <div class="card-body">Graphs here</div>
      </div>
    </div>
    <draggable
      v-model="widgetsInPanel"
      :options="draggableOptions"
    >
      <transition-group name="widgets">
        <div
          v-for="w in activeWidgets"
          :key="w.id"
          class="bloc d-inline-block p-1 widgets-item"
          :class="{'wide': w.large, 'narrow': !w.large}"
        >
          <div class="card">
            <div class="card-header">
              <span class="handle ic-Drag-Column-Icon" />
              <span>{{ w.title }}</span>
            </div>
            <div class="card-body">Composant correspondant à l'ID : {{ w.id }}</div>
          </div>
        </div>
      </transition-group>
    </draggable>
    <button
      class="panel-toggle bg-secondary"
      @click="isPanelOpen=true"
    >
      <i class="ic-Star-Icon" />
      <span>Personaliser ma home</span>
    </button>
    <HomePanel
      :widgets.sync="widgetsInPanel"
      :is-open.sync="isPanelOpen"
    />
  </div>
</template>

<script>
// Composant sandbox, ne pas faire de review, c'est du jetable :)
import draggable from 'vuedraggable';
import HomePanel from './HomePanel';

export default {
  name: 'DragHome',
  components: {
    draggable,
    HomePanel,
  },
  computed: {
    activeWidgets() {
      return this.widgetsInPanel.filter(w => w.checked);
    },
  },
  data() {
    return {
      isPanelOpen: false,
      widgetsInPanel: [
        {
          id: 'w1',
          title: 'En cours de consomation',
          description: 'Description',
          checked: true,
          large: true,
        },
        {
          id: 'w2',
          title: 'Rechercher une ligne',
          description: 'Description',
          checked: true,
          large: false,
        },
        {
          id: 'w3',
          title: 'Mes commandes',
          description: 'Description',
          checked: false,
          large: true,
        },
        {
          id: 'w4',
          title: 'Mon parc',
          description: 'Description',
          checked: false,
          large: false,
        },
        {
          id: 'w5',
          title: 'Comparer 2 lignes',
          description: 'Description',
          checked: false,
          large: false,
        },
        {
          id: 'w6',
          title: 'Découvrir GetDiag',
          description: 'Description',
          checked: false,
          large: false,
        },
        {
          id: 'w7',
          title: 'Historique de consommation',
          description: 'Description',
          checked: false,
          large: false,
        },
      ],
    };
  },
  created() {
    this.draggableOptions = { handle: '.handle' };
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

.widgets-item {
  transition: all 0.3s;
  .ic-Drag-Column-Icon:before {
    position: absolute;
    top: 0.5rem;
    font-size: 1.75rem;
    left: -0.2rem;
  }
}

.handle {
  &:hover {
    cursor: move;
  }
}

.widgets-enter,
.widgets-leave-active {
  opacity: 0;
}
</style>
