<template>
  <button
    class="btn btn-link p-0"
    @click.stop="onClick"
  >{{ creatorFirstName }} {{ creatorLastName }}</button>
</template>

<script>
import { mapState, mapMutations } from 'vuex';
import { setTimeout } from 'timers';

export default {
  name: 'GetSimOrdersCreatorCell',
  props: {
    row: {
      type: Object,
    },
  },
  methods: {
    ...mapMutations(['openPanel']),

    onClick() {
      const openTrigger = () => {
        this.openPanel({
          title: this.$t('getsim.creator.title', this.creator),
          panelId: 'getsim.creator.title',
          payload: this.row,
          wide: false,
        });
      };
      if (this.isOpen) {
        setTimeout(openTrigger, 500);
      } else {
        openTrigger();
      }
    },
  },
  computed: mapState({
    isOpen: state => state.ui.isPanelOpen,
    // en attendant l'api reportdefinitions me renvoie les infos du créateur, je suis obligé de tester si cela existe pour ne pas générer d'erreurs
    creator() {
      return this.row &&
        this.row.auditable &&
        this.row.auditable.creator &&
        this.row.auditable.creator.name
        ? this.row.auditable.creator.name
        : undefined;
    },
    creatorFirstName() {
      return this.row &&
        this.row.auditable &&
        this.row.auditable.creator &&
        this.row.auditable.creator.name &&
        this.row.auditable.creator.name.firstName
        ? this.row.auditable.creator.name.firstName
        : undefined;
    },
    creatorLastName() {
      return this.row &&
        this.row.auditable &&
        this.row.auditable.creator &&
        this.row.auditable.creator.name &&
        this.row.auditable.creator.name.lastName
        ? this.row.auditable.creator.name.lastName
        : undefined;
    },
  }),
};
</script>

<style scoped></style>
