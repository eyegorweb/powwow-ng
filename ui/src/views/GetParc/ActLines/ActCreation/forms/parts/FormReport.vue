<template>
  <ul class="list-unstyled">
    <li>{{ data.alreadyExists }} {{ $t('getparc.actCreation.report.alreadyExists') }}</li>
    <li>{{ data.invalidFormat }} {{ $t('getparc.actCreation.report.invalidFormat') }}</li>
    <li>{{ data.alreadyExists }} {{ $t('getparc.actCreation.report.alreadyExists') }}</li>
    <li>{{ data.notFound }} {{ $t('getparc.actCreation.report.notFound') }}</li>
  </ul>
</template>

<script>
export default {
  props: {
    data: Object,
  },
};
</script>

<style lang="scss" scoped></style>
