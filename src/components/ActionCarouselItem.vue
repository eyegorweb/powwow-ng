<template>
  <div class="carousel-item">
    <div
      class="card"
      :class="{'inactive': !active }"
    >
      <div class="card-body">
        <div class="row">
          <div class="icon-block">
            <span :class="icon" />
          </div>
          <div class="title">{{ title }}</div>
        </div>
        <div class="subrow">
          <div class="subtitle">{{ subtitle }}</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'ActionsCarouselItem',
  props: {
    icon: String,
    title: String,
    subtitle: String,
    active: Boolean,
  },
};
</script>

<style lang="scss" scoped>
.carousel-item {
  padding-right: 0.3125rem;
  .card {
    border: none;
    box-shadow: 0 0 0.5rem rgba(0, 0, 0, 0.2);
    margin: 0.5rem;

    &.inactive {
      background: $medium-grey;
      color: $gray-680;

      .card-body .title {
        color: $gray-680;
      }
    }
  }
  .card-body {
    padding: 1.25rem 1rem 0.5rem;
    .title {
      display: table-cell;
      vertical-align: middle;
      font-weight: 600;
      line-height: 1.1875rem;
      color: $dark-grey;
    }
    .subtitle {
      font-size: 0.75rem;
      color: $gray-680;
      line-height: 20px;
    }
    > .row {
      display: table;
      table-layout: fixed;
      height: 2.6rem;
      font-size: 0.875rem;
    }
    .subrow {
      text-align: center;
    }
  }
  .icon-block {
    font-size: 1.3rem;
    display: table-cell;
    vertical-align: middle;
    padding: 0 0.5rem;
  }
}
</style>
