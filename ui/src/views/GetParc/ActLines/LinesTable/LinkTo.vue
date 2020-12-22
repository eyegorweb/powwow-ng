<template>
  <button class="btn btn-link p-0" @click.prevent="onClick()">{{ msisdn }}</button>
</template>

<script>
import { getFromLatestLineFromAccessPoint } from '@/utils/line.js';

export default {
  name: 'LinkTo',
  props: {
    row: Object,
  },

  methods: {
    onClick() {},
  },
  computed: {
    msisdn() {
      return getFromLatestLineFromAccessPoint(this.row.accessPoint, 'msisdn');
    },
  },
};
</script>
