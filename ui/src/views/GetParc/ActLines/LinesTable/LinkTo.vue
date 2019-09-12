<template>
  <button class="btn btn-link p-0" @click.prevent="onClick()">{{ msisdn }}</button>
</template>

<script>
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
      return this.row.accessPoint !== null ? this.row.accessPoint.lines[0].msisdn : '';
    },
  },
};
</script>
