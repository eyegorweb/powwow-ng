<template>
  <GraphContainer :size="size" :can-show="canShow">
    <div>
      <div class="d-flex justify-content-center">
        <Toggle
          v-if="toggleValues"
          @update="currentValue = $event.id"
          :values="toggleValues"
          class="pl-2"
        />
      </div>
      <slot />
    </div>
    <div slot="onHide">
      <slot name="onHide" />
    </div>
  </GraphContainer>
</template>

<script>
import GraphContainer from './GraphContainer';
import Toggle from '@/components/ui/UiToggle2';

export default {
  components: {
    GraphContainer,
    Toggle,
  },

  props: {
    size: {
      type: Number,
      default: 12,
    },
    canShow: Boolean,
  },

  data() {
    return {
      currentValue: 12,
      toggleValues: [
        {
          id: '12',
          label: 'common.months_12',
          default: true,
        },
        {
          id: '24',
          label: 'common.months_24',
        },
        {
          id: '36',
          label: 'common.months_36',
        },
      ],
    };
  },
};
</script>

<style lang="scss" scoped></style>
