<template>
  <div class="cardBloc">
    <div class="cardBloc-infos">
      <slot></slot>
    </div>
    <div class="cardBloc-buttons">
      <Button v-if="canDelete" class="button" :variant="'import'" @click="$emit('delete')">{{
        $t('delete')
      }}</Button>
      <Button v-if="canModify" :variant="'primary'" @click="$emit('modify')">{{
        $t('modify')
      }}</Button>
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
  height: 220px;
  background-color: white;
  border-radius: 5px;
  font-size: 14px;
  padding: 20px;
  margin-bottom: 20px;
  position: relative;

  &-buttons {
    display: flex;
    justify-content: flex-end;
    width: 100%;
    position: absolute;
    bottom: 20px;
    right: 20px;
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
