<template>
  <div class="gauge-container">
    <div class="corner">{{ leftCorner }}</div>
    <div class="gauge">
      <div class="metric" :class="arcStyle">
        <svg ref="graphics" viewBox="0 0 1000 500">
          <path d="M 950 500 A 450 450 0 0 0 50 500" />
          <text
            class="percentage"
            text-anchor="middle"
            alignment-baseline="middle"
            x="500"
            y="300"
            font-size="140"
            font-weight="bold"
          >
            {{ title || perc }}
          </text>
          <text
            class="title"
            text-anchor="middle"
            alignment-baseline="middle"
            x="500"
            y="450"
            font-size="90"
            font-weight="normal"
          >
            {{ subtitle }}
          </text>
        </svg>
      </div>
    </div>
    <div class="corner">{{ rightCorner }}</div>
  </div>
</template>

<script>
import Snap from 'snapsvg-cjs';

export default {
  mounted() {
    const svg = Snap(this.$refs.graphics);
    this.animate_arc(this.value / 100, svg);
  },
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
      perc: '0%',
    };
  },

  methods: {
    animate_arc(ratio, svg) {
      let arc = svg.path('');
      return Snap.animate(
        0,
        ratio,
        val => {
          let path;
          arc.remove();
          path = svg_circle_arc_path(500, 500, 450, -90, val * 180.0 - 90);
          arc = svg.path(path);
          arc.attr({
            class: 'data-arc',
          });
          this.perc = Math.round(val * 100) + '%';
        },
        Math.round(2000 * ratio),
        this.mina.easeinout
      );
    },
  },
};

function polar_to_cartesian(cx, cy, radius, angle) {
  var radians;
  radians = ((angle - 90) * Math.PI) / 180.0;
  return [
    Math.round((cx + radius * Math.cos(radians)) * 100) / 100,
    Math.round((cy + radius * Math.sin(radians)) * 100) / 100,
  ];
}

function svg_circle_arc_path(x, y, radius, start_angle, end_angle) {
  var end_xy, start_xy;
  start_xy = polar_to_cartesian(x, y, radius, end_angle);
  end_xy = polar_to_cartesian(x, y, radius, start_angle);
  return (
    'M ' +
    start_xy[0] +
    ' ' +
    start_xy[1] +
    ' A ' +
    radius +
    ' ' +
    radius +
    ' 0 0 0 ' +
    end_xy[0] +
    ' ' +
    end_xy[1]
  );
}
</script>

<style lang="scss">
.gauge-container {
  display: flex;
  padding-left: 5%;
  padding-right: 5%;

  .gauge {
    width: 100%;
  }

  .corner {
    align-self: flex-end;
  }
}
.metric {
  svg {
    max-width: 100%;
  }
  path {
    stroke-width: 75;
    stroke: #ecf0f1;
    fill: none;
    &:first-of-type {
      stroke-width: 75;
    }
  }
  text {
    fill: $dark-gray;
  }
  &.success {
    path.data-arc {
      stroke: $success;
    }
  }
  &.danger {
    path.data-arc {
      stroke: $orange;
    }
  }
}
</style>
