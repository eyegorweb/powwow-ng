<template>
  <div class="card filter-bar">
    <div class="card-body">
      <h5 class="card-title">FILTRES</h5>
      <draggable>
        <transition-group>
          <FoldableBlock :title="'Partenaires'" :key="'el1'" draggable></FoldableBlock>
          <FoldableBlock :title="'Compte de facturation'" :key="'el2'" draggable></FoldableBlock>
          <FoldableBlock :title="'Statut de la commande'" :key="'el3'" draggable></FoldableBlock>
          <FoldableBlock :title="'Référence de la commande'" :key="'el4'" draggable></FoldableBlock>
          <FoldableBlock :title="'Date de la commande'" :key="'el5'" draggable></FoldableBlock>
          <FoldableBlock :title="'Offre'" :key="'el6'" draggable></FoldableBlock>
          <FoldableBlock :title="'Quantité'" :key="'el7'" draggable></FoldableBlock>
          <FoldableBlock :title="'Champs personnalisés'" :key="'el8'" draggable></FoldableBlock>
          <FoldableBlock :title="'Créateur de la commande'" :key="'el9'" draggable></FoldableBlock>
          <FoldableBlock :title="'Activé'" :key="'el10'" draggable></FoldableBlock>
          <FoldableBlock :title="'Pays de livraison'" :key="'el11'" draggable></FoldableBlock>
          <FoldableBlock :title="'Code postal'" :key="'el12'" draggable></FoldableBlock>
          <FoldableBlock :title="'Ville'" :key="'el13'" draggable></FoldableBlock>
        </transition-group>
      </draggable>
    </div>
  </div>
</template>

<script>
import draggable from 'vuedraggable';
import FoldableBlock from '@/components/FoldableBlock';

export default {
  components: {
    draggable,
    FoldableBlock,
  },
};
</script>

<style scoped>
</style>
