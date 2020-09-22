<template>
  <button class="btn btn-link p-0">{{ row.numberOfTriggerEvents }}</button>
</template>

<script>
export default {
  name: 'TriggeredEventsCell',
  props: {
    row: Object,
  },
};
</script>

<style lang="scss" scoped></style>
