<template>
  <ul class="list-unstyled">
    <li>
      <i class="ic-Check-Icon mr-2 text-success" />
      {{ data.validated }}
      {{ $t('getparc.actCreation.report.OK') }}.
    </li>
    <li v-for="e in data.errors" :key="e.key">
      <i class="ic-Cross-Icon mr-2 text-danger" />
      {{
        $t('getparc.actCreation.report.' + e.key, {
          count: e.number,
        })
      }}.
    </li>
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
