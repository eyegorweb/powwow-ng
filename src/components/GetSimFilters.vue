<template>
  <div class="card filter-bar">
    <div class="card-body">
      <h5 class="card-title">FILTRES</h5>
      <draggable>
        <transition-group>
          <FoldableBlock :title="'Partenaires'" :key="'el1'" draggable />
          <FoldableBlock :title="'Compte de facturation'" :key="'el2'" draggable />
          <FoldableBlock :title="'Statut de la commande'" :key="'el3'" draggable>
            <UiCheckbox
              v-for="status in statusResults"
              :checked="status.checked"
              :value="status.label"
              :key="status.id"
            >{{ status.label }}</UiCheckbox>
          </FoldableBlock>
          <FoldableBlock :title="'Référence de la commande'" :key="'el4'" draggable />
          <FoldableBlock :title="'Date de la commande'" :key="'el5'" draggable />
          <FoldableBlock :title="'Offre'" :key="'el6'" draggable />
          <FoldableBlock :title="'Quantité'" :key="'el7'" draggable />
          <FoldableBlock :title="'Champs personnalisés'" :key="'el8'" draggable />
          <FoldableBlock :title="'Créateur de la commande'" :key="'el9'" draggable />
          <FoldableBlock :title="'Activé'" :key="'el10'" draggable />
          <FoldableBlock :title="'Pays de livraison'" :key="'el11'" draggable />
          <FoldableBlock :title="'Code postal'" :key="'el12'" draggable />
          <FoldableBlock :title="'Ville'" :key="'el13'" draggable />
        </transition-group>
      </draggable>
    </div>
  </div>
</template>

<script>
import draggable from 'vuedraggable';
import UiCheckbox from '@/components/ui/Checkbox';
import FoldableBlock from '@/components/FoldableBlock';
import { fetchOrderStatuses } from '@/api/orderStatuses';

export default {
  components: {
    draggable,
    FoldableBlock,
    UiCheckbox,
  },
  async mounted() {
    this.statusResults = await fetchOrderStatuses();
  },
  data() {
    return {
      statusResults: [],
    };
  },
};
</script>

<style lang="scss" scoped>
</style>
