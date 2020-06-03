<template>
  <div>
    Légendes:
    <ul class="list-unstyled">
      <template v-if="usage == 'ALL'">
        <li>
          <div class="cell green"></div>
          <div>Lignes avec trafic ces dernieres 24h</div>
        </li>
        <li>
          <div class="cell orange"></div>
          <div>Lignes avec trafic depuis plus de 24h et moins de 30 jours</div>
        </li>
      </template>
      <template v-if="usage == 'DATA'">
        <li>
          <div class="cell green"></div>
          <div>Lignes avec une session data en cours</div>
        </li>
        <li>
          <div class="cell orange"></div>
          <div>Lignes avec une session data fermée</div>
        </li>
      </template>

      <template v-if="usage == 'COCKPIT'">
        <li>
          <div class="cell green"></div>
          <div>Pays sans alertes actives.</div>
        </li>
        <li>
          <div class="cell orange"></div>
          <div>Pays avec alerte (variation suspecte détectée)</div>
        </li>

        <li>
          <div class="cell gray"></div>
          <div>Pays non supervisés avec moins de 500 lignes</div>
        </li>
      </template>
    </ul>
  </div>
</template>

<script>
export default {
  props: {
    usage: String,
  },
};
</script>

<style lang="scss" scoped>
li {
  display: flex;
}
.cell {
  width: 10px;
  height: 10px;

  margin: 5px;

  &.green {
    background: $success;
  }

  &.orange {
    background: $warning;
  }

  &.gray {
    background: $gray-400;
  }
}
</style>
