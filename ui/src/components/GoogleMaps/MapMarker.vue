<template>
  <div></div>
</template>

<script>
export default {
  props: {
    google: Object,
    map: Object,
    position: Object,
  },
  mounted() {
    console.log('this.position >', this.position);
    new this.google.maps.Marker({
      position: this.position,
      map: this.map,
    });
  },
};
</script>

<style lang="scss" scoped></style>
