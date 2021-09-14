<template>
  <li
    class="list-group-item item"
    :class="{ 'item-sucess': isItemError === false, 'item-error': isItemError }"
  >
    <div class="items-container">
      <div class="info-section d-flex justify-content-start">
        <AnimatedCheckMark :is-loading="isFetchingData" :is-error="!indicator.checked" />
        <div class="item-content">
          <span>{{ $t(indicator.title) }}</span>
          <p>{{ indicator.subTitle }} &nbsp;</p>
        </div>
      </div>
      <template v-if="!indicator.showActionFn || indicator.showActionFn()">
        <div v-if="indicator.action" class="action-section d-flex justify-content-end">
          <div class="d-flex align-items-center">
            <AnimatedButton
              @click="indicator.action.onClick"
              :tooltip="$t(indicator.action.tooltip)"
            >
              {{ $t(indicator.action.title) }}
            </AnimatedButton>
          </div>
        </div>
      </template>
    </div>
  </li>
</template>

<script>
import AnimatedCheckMark from '@/components/ui/AnimatedCheckMark';
import AnimatedButton from '@/components/ui/AnimatedButton.vue';

export default {
  name: 'IndicatorItem',
  components: {
    AnimatedCheckMark,
    AnimatedButton,
  },

  props: {
    indicator: Object,
  },
  computed: {
    model() {
      return true;
    },
  },
  mounted() {
    this.isFetchingData = false;
    this.isItemError = !this.indicator.checked;
  },
  data() {
    return {
      isFetchingData: true,
      isItemError: undefined,
    };
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

.items-container {
  display: flex;
  flex-wrap: wrap;
  align-content: flex-start;

  .info-section {
    flex-grow: 1;
  }

  .action-section {
    flex-basis: 25%;
  }
}
</style>
