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

function getRandomInt(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min)) + min;
}

export default {
  name: 'IndocatorItem',

  props: {
    indicator: Object,
    noAnimation: Boolean,
  },
  computed: {
    model() {
      return true;
    },
  },
  created() {
    const onAnimationEnd = () => {
      this.isFetchingData = false;
      this.isItemError = !this.indicator.checked;
      this.$emit('animationEnd', true);
    };
    if (this.noAnimation) {
      onAnimationEnd();
    } else {
      setTimeout(onAnimationEnd, getRandomInt(1000, 6000));
    }
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
