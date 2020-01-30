<template>
  <AlarmCreationBaseForm :alarm="alarm"> </AlarmCreationBaseForm>
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
