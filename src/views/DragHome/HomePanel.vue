<template>
  <SlidePanel
    title="Ajouter/Supprimer des widgets"
    :is-open="isOpen"
    @close="close"
  >
    <HomePanelOption
      v-for="w in localWidgets"
      :key="w.id"
      :title="w.title"
      v-model="w.checked"
    >{{ w.description }}</HomePanelOption>

    <div
      slot="footer"
      class="footer p-3"
    >
      <div class="row">
        <div class="col-sm-6">
          <UiButton
            variant="outline-primary"
            @click="close"
            block
          >Annuler</UiButton>
        </div>
        <div class="col-sm-6">
          <UiButton
            variant="primary"
            @click="saveChanges"
            block
          >Appliquer</UiButton>
        </div>
      </div>
    </div>
  </SlidePanel>
</template>

<script>
import SlidePanel from '@/components/SlidePanel';
import HomePanelOption from './HomePanelOption';
import UiButton from '@/components/ui/Button';
import { cloneDeep } from 'lodash-es';

export default {
  name: 'HomePanel',
  components: {
    SlidePanel,
    HomePanelOption,
    UiButton,
  },
  props: {
    widgets: {
      type: Array,
    },
    isOpen: {
      type: Boolean,
    },
  },
  data() {
    return {
      localWidgets: [],
    };
  },
  watch: {
    isOpen(newValue) {
      if (newValue) {
        this.localWidgets = cloneDeep(this.widgets);
      }
    },
  },
  methods: {
    saveChanges() {
      this.close();
      this.$emit('update:widgets', this.localWidgets);
    },
    close() {
      this.$emit('update:isOpen', false);
    },
  },
};
</script>
