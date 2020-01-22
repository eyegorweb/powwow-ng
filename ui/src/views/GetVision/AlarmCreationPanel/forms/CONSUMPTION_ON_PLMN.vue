<template>
  <AlarmCreationBaseForm :alarm="alarm" have-form></AlarmCreationBaseForm>
</template>

<script>
import AlarmCreationBaseForm from './AlarmCreationBaseForm';

export default {
  components: {
    AlarmCreationBaseForm,
  },
  props: {
    alarm: Object,
  },
};
</script>

<style lang="scss" scoped></style>
