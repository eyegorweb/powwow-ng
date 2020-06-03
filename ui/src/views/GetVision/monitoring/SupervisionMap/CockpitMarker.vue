<template>
  <div
    class="supervision-marker"
    :class="{
      'marker-gray': isGrayMarker,
      'marker-green': isGreenMarker,
      'marker-orange': isOrangeMarker,
    }"
    :style="cssStyle"
  >
    <div class=" cell" @click="$emit('cockpitClick')">
      <div v-if="data.alertNumber" class="mb-1">{{ data.alertNumber }}</div>

      <div class="d-flex values">
        <div @click="$emit('clickVoice')">{{ data.voiceTrafic }}</div>
        <div @click="$emit('clickData')">{{ data.dataTrafic }}</div>
        <div @click="$emit('clickSms')">{{ data.smsTrafic }}</div>
      </div>
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

  computed: {
    isGrayMarker() {
      return !this.data.enoughValues;
    },
    isGreenMarker() {
      return this.data.enoughValues && this.data.activeAlertNumber === 0;
    },
    isOrangeMarker() {
      return this.data.enoughValues && this.data.activeAlertNumber !== 0;
    },
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
.values {
  div {
    padding: 5px;

    &::last-child {
      border-right: none;
    }
  }
}
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

  &.marker-gray {
    background: $gray-400;
  }

  &.marker-green {
    background: #009643;
  }

  &.marker-orange {
    background: $warning;
  }
}
</style>
