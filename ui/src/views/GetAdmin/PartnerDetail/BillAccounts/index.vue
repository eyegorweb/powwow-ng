<template>
  <div>
    <router-view :partner="partner"></router-view>
  </div>
</template>
<script>
export default {
  props: {
    partner: {
      type: Object,
    },
  },
};
</script>
