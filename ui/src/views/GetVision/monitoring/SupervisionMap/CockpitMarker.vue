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
    <div class=" cell">
      <div
        v-if="data.alertNumber !== undefined && data.alertNumber !== null"
        class="mb-1 alert-number"
        @click="$emit('alertClick')"
      >
        {{ data.alertNumber }}
      </div>

      <div class="d-flex values">
        <div @click="$emit('clickVoice')">{{ data.voiceTrafic }}</div>
        <div class="middle-value" @click="$emit('clickData')">{{ data.dataTrafic }}</div>
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
.alert-number {
  border-bottom: 1px solid white;
}
.middle-value {
  border-left: 1px solid white;
  border-right: 1px solid white;
}
.values {
  div {
    padding: 0 5px 0 5px;

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
    padding-left: 0;
    padding-right: 0;
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
