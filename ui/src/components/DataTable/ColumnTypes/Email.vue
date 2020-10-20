<template>
  <a :href="'mailto:' + item">{{ item }}</a>
</template>

<script>
export default {
  props: {
    item: String,
  },
};
</script>

<style lang="scss" scoped></style>
