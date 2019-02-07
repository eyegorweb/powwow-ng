<template>
  <div class="list-container">
    <slot name="firstElement" className="box box__item d-flex" />
    <slot
      v-for="(item, i) in items"
      :index="i"
      :item="item"
      className="box box__item d-flex"
    >

      <div :key="item.id" />
    </slot>

  </div>
</template>

<script>
export default {
  components: {},
  props: {
    items: Array,
  },
  data() {
    return {
      isActive: false,
    };
  },
};
</script>

<style lang="scss" scoped>
.list-container {
  display: flex;
  flex-flow: row wrap;
  overflow: auto;
  .box {
    width: calc((100% / 2) - 20px);
    min-height: 2rem;
    margin: 0.5em;
  }
}
@media screen and (max-height: 768px) {
  .list-container {
    height: 11rem;
  }
}
@media screen and (min-height: 769px) {
  .list-container {
    height: 20rem;
  }
}

.box {
  border: 1px solid $medium-gray;
  border-radius: 0.2rem;
  align-items: stretch;
  display: flex;
  flex-flow: row nowrap;
  justify-content: space-between;
  padding: 10px 20px 10px 15px;
  margin-bottom: 10px;
  overflow: hidden;

  &.active {
    border: 1px solid $blue;

    .box__name {
      color: $blue;
    }
  }

  p {
    color: $dark-gray;
    font-size: 0.8rem;
    text-align: left;

    &.box__name {
      font-size: 0.9rem;
    }

    &.box__order-status {
      color: $gray-680;
    }
    &.box__format {
      font-size: 0.7rem;
    }
  }
}
</style>
