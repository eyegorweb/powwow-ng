<template>
  <div>
    <ContentBlock>
      <template slot="title">{{ $t('getparc.lineDetail.standardTest') }}</template>
      <template slot="content">
        <div class="row">
          <div class="col">
            <div class="skeleton-line"></div>
          </div>
          <div class="col">
            <div class="skeleton-line"></div>
          </div>
          <div class="col">
            <div class="skeleton-line"></div>
          </div>
          <div class="col">
            <div class="skeleton-line"></div>
          </div>
        </div>
      </template>
    </ContentBlock>

    <ContentBlock>
      <template slot="title">{{ $t('getparc.lineDetail.advancedTest') }}</template>
      <template slot="content">
        <div class="row">
          <div class="col">
            <div class="skeleton-line"></div>
          </div>
          <div class="col">
            <div class="skeleton-line"></div>
          </div>
          <div class="col">
            <div class="skeleton-line"></div>
          </div>
          <div class="col">
            <div class="skeleton-line"></div>
          </div>
        </div>
      </template>
    </ContentBlock>
  </div>
</template>

<script>
import ContentBlock from '@/views/GetParc/LineDetail/ContentBlock';

export default {
  components: {
    ContentBlock,
  },
};
</script>

<style lang="scss" scoped></style>
