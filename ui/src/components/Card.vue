<template>
  <div class="cardBloc">
    <div class="cardBloc-infos">
      <slot></slot>
    </div>
    <div class="cardBloc-buttons">
      <slot name="buttons">
        <Button v-if="canDelete" class="button" :variant="'import'" @click="$emit('delete')">{{
          $t('delete')
        }}</Button>
        <Button v-if="canModify" :variant="'primary'" @click="$emit('modify')">{{
          $t('modify')
        }}</Button>
      </slot>
    </div>
  </div>
</template>

<script>
import Button from '@/components/ui/Button';

export default {
  props: {
    canDelete: {
      type: Boolean,
      default: true,
    },
    canModify: {
      type: Boolean,
      default: true,
    },
  },
  components: {
    Button,
  },
};
</script>

<style lang="scss" scoped>
.cardBloc {
  width: 49%;
  background-color: white;
  border-radius: 5px;
  position: relative;

  height: 20rem;
  margin-bottom: 1.5rem;
  padding: 1.5rem;

  &-buttons {
    display: flex;
    justify-content: flex-end;
    width: 100%;
    position: absolute;
    bottom: 1.5rem;
    right: 1.5rem;
  }
}
</style>

<style lang="scss">
.cardBloc-buttons {
  .btn {
    max-width: 140px;
    width: 100%;
    margin-left: 10px;
  }
}
</style>
