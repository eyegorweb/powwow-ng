<template>
  <ul class="list-unstyled text-danger font-weight-bold">
    <li v-if="data.alreadyExists">{{ $t('getparc.lineDetail.report.alreadyExists') }}</li>
    <li v-if="data.invalidFormat">{{ $t('getparc.actCreation.report.invalidFormat') }}</li>
    <li v-if="data.notFound">{{ $t('getparc.actCreation.report.notFound') }}</li>
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
