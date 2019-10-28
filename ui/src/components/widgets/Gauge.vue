<template>
  <div :style="containerStyle">
    <div class="gauge_title" :style="gaugeTitleStyle">
      <slot />
    </div>
    <div ref="gauge" class="GaugeMeter mx-auto" :style="mainGaugeStyle"></div>
    <div class="gauge_corners mx-auto" :style="cornersStyle">
      <div class="gauge_min">{{ minValue }}</div>
      <div class="gauge_max" :style="maxCornerStyle">{{ formattedMaxValue }}</div>
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
    subtitle: String,
    unit: String,
    formatValueFn: Function,
    timeMaxValue: Boolean,
    minValue: {
      type: String,
      default: '0',
    },
    maxValue: {
      type: String,
      default: '100',
    },
  },

  data() {
    return {
      cornersStyle: { width: '100%' },
      mainGaugeStyle: {},
      containerStyle: {},
      maxCornerStyle: {},
      gaugeTitleStyle: {},
    };
  },
  filters: {
    maxValueFormat(value) {
      if (this.formatValueFn) return this.formatValueFn(value);

      return value;
    },
  },
  computed: {
    formattedMaxValue() {
      if (this.formatValueFn) return this.formatValueFn(parseInt(this.maxValue));
      return this.maxValue;
    },
  },
  methods: {
    getMaxPercent() {
      if (!isNaN(this.maxValue)) {
        const value = parseInt(this.value);
        const max = parseInt(this.maxValue);

        return (value * 100) / max;
      } else {
        return this.value;
      }
    },
  },
  mounted() {
    // set size

    let gaugeSize = 250;
    let gaugeWidth = 15;
    let gaugeTopSpacing = gaugeSize / 4;
    let titleSpacing = 78;

    if (window.innerWidth <= 1024) {
      gaugeSize = 150;
      gaugeWidth = 8;
      gaugeTopSpacing = 40;
      titleSpacing = 47;
    }

    if (window.innerWidth >= 1366 && window.innerWidth < 1920) {
      gaugeSize = 170;
      gaugeWidth = 8;

      gaugeTopSpacing = 45;
      titleSpacing = 57;
    }

    const options = {
      size: gaugeSize,
      theme: 'Green-Orange',
      back: 'RGBa(0,0,0,.1)',
      animate_gauge_colors: true,
      animate_text_colors: true,
      width: gaugeWidth,
      style: 'Arch',
      percent: this.getMaxPercent(),
      append: this.unit,
      label: this.subtitle,
      text_size: 0.15,
      minCorner: '0',
      maxCorner: '100',
      formatValueFn: (unitPercent, unit) => {
        const valueToShow = (unitPercent * this.value) / this.getMaxPercent();
        if (this.formatValueFn) return this.formatValueFn(valueToShow);
        return valueToShow + ' ' + unit;
      },
    };

    this.cornersStyle = { width: percent(85, gaugeSize) + 'px' };
    this.mainGaugeStyle = { top: gaugeTopSpacing + 'px' };
    //  this.containerStyle = { paddingBottom: containerBottomSpacing + 'px' };
    if (this.timeMaxValue) this.maxCornerStyle = { position: 'relative', left: '43px' };

    this.gaugeTitleStyle = {
      top: titleSpacing + 'px',
      position: 'relative',
    };

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

.gauge_title {
  font-weight: 500;
  text-align: center;
}
</style>
