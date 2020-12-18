<template>
  <div class="supervision-marker" :style="cssStyle">
    <div
      class="active cell"
      @click="$emit('activeClick')"
      @mouseover="showPopup('active')"
      @mouseleave="resetPopup"
    >
      <div v-if="data.label" class="mb-1">{{ data.label }}</div>
      <span>{{ data.activeCount }}</span>
      <div v-if="isVisible" class="box">{{ contentPopup }}</div>
    </div>
    <div
      class="passive cell"
      @click="$emit('passiveClick')"
      @mouseover="showPopup('passive')"
      @mouseleave="resetPopup"
    >
      {{ data.passiveCount }}
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

  mounted() {
    const position = this.mapOverlay.getProjection().fromLatLngToDivPixel(this.data.position);
    const adjustedPosition = this.adjustPosition(position);
    this.cssStyle = {
      left: `${adjustedPosition.x}px`,
      top: `${adjustedPosition.y}px`,
    };
  },

  methods: {
    showPopup(countType) {
      if (!this.data) return;
      this.isVisible = true;
      const location =
        this.data && this.data.data && this.data.data.locationNameFr
          ? this.data.data.locationNameFr
          : this.data.data.locationName
          ? this.data.data.locationName
          : '';
      const count = countType === 'active' ? this.data.activeCount : this.data.passiveCount;
      const type = countType === 'active' ? 'active(s)' : 'inactive(s)';
      const textMark = location.length > 0 ? '-' : '';
      this.contentPopup = `${this.$t('getvsion.supervisionMarker', {
        count,
        type,
      })} ${textMark} ${location}`;
    },
    resetPopup() {
      this.contentPopup = '';
      this.isVisible = false;
    },
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

  .box {
    position: absolute;
    display: none;
    color: black;
    min-width: 10rem;
    width: 100%;
    padding: 0.5rem;
    left: calc(100% + 10px);
    top: 0;
    z-index: 1;
    background-color: $white;
    font-size: 0.8rem;
    line-height: 1.5rem;
    box-shadow: 2px 2px 19px -8px rgba(69, 69, 69, 0.5);
  }

  &:hover {
    .box {
      display: block;
    }
  }
}
</style>
