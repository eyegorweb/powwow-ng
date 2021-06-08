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
    <div class="cell" @mouseleave="resetPopup">
      <div
        v-if="data.alertNumber !== undefined && data.alertNumber !== null"
        class="mb-1 alert-number"
        @click="$emit('alertClick')"
        @mouseover="showAlertsPopover()"
      >
        {{ data.alertNumber }}
      </div>

      <div class="d-flex values" @mouseover="showLinesUsagePopover()">
        <div @click="$emit('clickData')">{{ data.dataTrafic }}</div>
        <div class="middle-value" @click="$emit('clickSms')">{{ data.smsTrafic }}</div>
        <div @click="$emit('clickVoice')">{{ data.voiceTrafic }}</div>
      </div>
      <div v-if="isVisible" class="box">{{ contentPopup }}</div>
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
      isVisible: false,
      contentPopup: undefined,
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
  methods: {
    resetPopup() {
      this.contentPopup = '';
      this.isVisible = false;
    },
    showAlertsPopover() {
      this.contentPopup = `Nombre d'alertes sur les 7 derniers jours`;
      this.isVisible = true;
    },
    showLinesUsagePopover() {
      this.contentPopup = `Nombre SIM trafiquantes du jour
Data: ${this.data.dataTrafic}
SMS: ${this.data.smsTrafic}
Voix: ${this.data.voiceTrafic}`;
      this.isVisible = true;
    },
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

  .box {
    position: absolute;
    display: none;
    color: black;
    min-width: 15rem;
    width: 100%;
    padding: 0.5rem;
    left: calc(100% + 10px);
    top: 0;
    z-index: 1;
    background-color: $white;
    font-size: 0.8rem;
    line-height: 1.5rem;
    box-shadow: 2px 2px 19px -8px rgba(69, 69, 69, 0.5);
    white-space: pre;
    text-align: initial;
  }

  &:hover {
    .box {
      display: block;
    }
  }
}
</style>
