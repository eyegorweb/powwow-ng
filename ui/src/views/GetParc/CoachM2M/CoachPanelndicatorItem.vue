<template>
  <li
    class="list-group-item item"
    :class="{ 'item-sucess': isItemError === false, 'item-error': isItemError }"
  >
    <div class="d-flex justify-content-start">
      <AnimatedCheckMark :is-loading="isFetchingData" :is-error="!indicator.checked" />
      <div class="item-content">
        <h6>{{ $t(indicator.title) }}</h6>
        <p>{{ indicator.subTitle }} &nbsp;</p>
      </div>
    </div>
  </li>
</template>

<script>
import AnimatedCheckMark from '@/components/ui/AnimatedCheckMark';

export default {
  name: 'IndocatorItem',

  props: {
    indicator: Object,
  },
  computed: {
    model() {
      return true;
    },
  },
  created() {
    this.isFetchingData = false;
    this.isItemError = !this.indicator.checked;
  },
  data() {
    return {
      isFetchingData: true,
      isItemError: undefined,
    };
  },
  components: {
    AnimatedCheckMark,
  },
};
</script>

<style lang="scss" scoped>
.item {
  padding-left: 0;
  padding-right: 0;

  .item-content {
    padding-left: 1em;
  }

  &.item-sucess {
    color: $success;
  }

  &.item-error {
    color: $orange;
  }

  p {
    font-size: 11px;
    color: $gray-680;
    margin-bottom: 0;
  }
}
</style>
