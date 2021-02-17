<template>
  <div>
    <div class="row">
      <div class="col-2">
        <div class="skeleton-line"></div>
      </div>
      <div class="col-10">
        <div class="skeleton-line"></div>
      </div>
    </div>

    <ContentBlock no-handle>
      <template slot="title">{{ $t('getadmin.partnerDetail.mb.details') }}</template>
      <template slot="content">
        <div class="row">
          <div class="col">
            <div class="form-group">
              <label class="font-weight-bold">{{
                $t('getadmin.partnerDetail.mb.commercialOffers.code')
              }}</label>
              <div class="skeleton-line"></div>
            </div>
          </div>
          <div class="col">
            <div class="form-group">
              <label class="font-weight-bold">{{
                $t('getadmin.partnerDetail.mb.commercialOffers.name')
              }}</label>
              <div class="skeleton-line"></div>
            </div>
          </div>
        </div>
        <div class="row">
          <div class="col">
            <div class="form-group">
              <label class="font-weight-bold">{{
                $t('getadmin.partnerDetail.mb.commercialOffers.rateplan')
              }}</label>
              <div class="skeleton-line"></div>
            </div>
          </div>
          <div class="col">
            <div class="form-group">
              <label class="font-weight-bold">{{
                $t('getadmin.partnerDetail.mb.commercialOffers.york')
              }}</label>
              <div class="skeleton-line"></div>
            </div>
          </div>
        </div>
        <div class="row">
          <div class="col">
            <div class="form-group">
              <label class="font-weight-bold">{{
                $t('getadmin.partnerDetail.mb.commercialOffers.duration')
              }}</label>
              <div class="skeleton-line"></div>
            </div>
          </div>
          <div class="col">
            <div class="form-group">
              <label class="font-weight-bold">{{
                $t('getadmin.partnerDetail.mb.commercialOffers.suspensionPeriod')
              }}</label>
              <div class="skeleton-line"></div>
            </div>
          </div>
        </div>
      </template>
    </ContentBlock>

    <ContentBlock no-handle>
      <template slot="title">{{ $t('common.services') }}</template>
      <template slot="content">
        <ServicesSkeleton />
      </template>
    </ContentBlock>
  </div>
</template>

<script>
import ContentBlock from '@/views/GetParc/LineDetail/ContentBlock';
import ServicesSkeleton from '@/components/Services/ServicesSkeleton.vue';

export default {
  components: {
    ContentBlock,
    ServicesSkeleton
  },
}
</script>

<style lang="scss" scoped>

</style>
