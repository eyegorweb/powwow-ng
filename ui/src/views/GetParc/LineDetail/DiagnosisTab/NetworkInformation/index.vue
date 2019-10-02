<template>
  <div>
    <ContentBlock :key="'block1'">
      <template slot="title">
        {{ $t('getparc.lineDetail.tab2.networkInfoContent.dataControl') }}
      </template>
      <template slot="content">
        <div class="d-flex">
          <div class="item">
            <h6>{{ $t('getparc.lineDetail.tab2.networkInfoContent.gaugeConsumtion') }}:</h6>
            <p class="mock-value">0 octets</p>
          </div>
          <div class="item">
            <h6>{{ $t('getparc.lineDetail.tab2.networkInfoContent.stateStopService') }}:</h6>
            <p class="mock-value">Non</p>
          </div>
          <div class="item">
            <h6>{{ $t('getparc.lineDetail.tab2.networkInfoContent.tresholdStopService') }}:</h6>
            <p class="mock-value">-1 octets</p>
          </div>
          <div class="item">
            <h6>{{ $t('getparc.lineDetail.tab2.networkInfoContent.tmpDebarring') }}:</h6>
            <p class="mock-value">Non</p>
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
