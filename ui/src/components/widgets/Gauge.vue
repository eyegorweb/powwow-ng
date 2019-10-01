<template>
  <div :style="containerStyle">
    <div ref="gauge" class="GaugeMeter mx-auto" :style="mainGaugeStyle"></div>
    <div class="gauge_corners mx-auto" :style="cornersStyle">
      <div class="gauge_min">{{ leftCorner }}</div>
      <div class="gauge_max">{{ rightCorner }}</div>
    </div>
  </div>
</template>

<script>
import $ from 'jquery';

function percent(v, max) {
  return (v * max) / 100;
}

export default {
  props: {
    value: {
      type: Number,
      default: 0,
    },
    arcStyle: {
      type: String,
      default: 'success',
    },
    title: String,
    subtitle: String,
    leftCorner: {
      type: String,
      default: '0',
    },
    rightCorner: {
      type: String,
      default: '100',
    },
  },

  data() {
    return {
      cornersStyle: { width: '100%' },
      mainGaugeStyle: {},
      containerStyle: {},
    };
  },
  mounted() {
    // set size

    let gaugeSize = 250;
    let gaugeWidth = 15;
    let gaugeTopSpacing = gaugeSize / 4;
    let containerBottomSpacing = gaugeSize / 10;

    if (window.innerWidth <= 1024) {
      gaugeSize = 150;
      gaugeWidth = 8;
      gaugeTopSpacing = 40;
      containerBottomSpacing = 12;
    }

    if (window.innerWidth >= 1366 && window.innerWidth < 1920) {
      gaugeSize = 180;
      gaugeWidth = 8;
      containerBottomSpacing = 6;

      gaugeTopSpacing = 45;
      containerBottomSpacing = 2;
    }

    const options = {
      size: gaugeSize,
      theme: 'Green-Orange',
      back: 'RGBa(0,0,0,.1)',
      animate_gauge_colors: true,
      animate_text_colors: true,
      width: gaugeWidth,
      style: 'Arch',
      percent: this.value,
      label: this.subtitle,
      minCorner: '0',
      maxCorner: '100',
    };

    this.cornersStyle = { width: percent(80, gaugeSize) + 'px' };
    this.mainGaugeStyle = { top: gaugeTopSpacing + 'px' };
    this.containerStyle = { paddingBottom: containerBottomSpacing + 'px' };

    $(this.$refs.gauge).gaugeMeter(options);
  },
};
</script>

<style lang="scss">
.GaugeMeter {
  position: Relative;
  text-align: Center;
  overflow: Hidden;
  cursor: Default;
}

.GaugeMeter span,
.GaugeMeter b {
  margin: 0 23%;
  width: 54%;
  position: Absolute;
  text-align: Center;
  display: Inline-Block;
  color: RGBa(0, 0, 0, 0.8);
  font-weight: 100;
  overflow: Hidden;
  white-space: NoWrap;
  text-overflow: Ellipsis;
}
.GaugeMeter[data-style='Semi'] b {
  margin: 0 10%;
  width: 80%;
}

.GaugeMeter s,
.GaugeMeter u {
  text-decoration: None;
  font-size: 0.5em;
  opacity: 0.5;
}

.GaugeMeter b {
  color: Black;
  font-weight: 300;
  font-size: 1rem;
  opacity: 0.8;
}

.gauge_corners {
  display: flex;
  justify-content: space-between;
  position: relative;
  padding-left: 10px;
  padding-right: 10px;
}
</style>
