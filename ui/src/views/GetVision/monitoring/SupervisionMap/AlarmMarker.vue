<template>
  <div class="supervision-marker" :style="cssStyle">
    <div class="active cell" @click="$emit('activeClick')">
      <span>{{ data.data.nbAlarms }}</span>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    data: Object,
    adjustPosition: Function,
    mapOverlay: Object,
    mapPosition: Object,
  },
  data() {
    return {
      cssStyle: undefined,
    };
  },

  mounted() {
    const position = this.mapOverlay.getProjection().fromLatLngToDivPixel(this.data.position);
    const adjustedPosition = this.adjustPosition(position);
    this.cssStyle = {
      left: `${adjustedPosition.x}px`,
      top: `${adjustedPosition.y}px`,
    };
  },
};
</script>

<style lang="scss" scoped>
.supervision-marker {
  position: absolute;
  cursor: pointer;

  border-radius: 3px;

  .cell {
    color: white;
    padding-left: 10px;
    padding-right: 10px;
    font-size: 9px;
    font-style: normal;
    text-align: center;
  }

  .active {
    background: #009643;
  }

  .passive {
    background: #f35a3e;
  }
}
</style>
