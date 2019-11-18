<template>
  <div class="row">
    <div class="col-md-5">
      <h4 class="text-primary text-uppercase">
        {{ $t('getparc.lineDetail.tab2.lineAnalysisTitles.locationSection') }}
      </h4>
      <div class="bg-white p-2">
        <div class="row">
          <div class="col">
            <div class="map-part skeleton-line"></div>
          </div>
        </div>
        <div class="row">
          <div class="col">
            <div class="skeleton-line"></div>
          </div>
          <div class="col">
            <div class="skeleton-line"></div>
          </div>
        </div>
      </div>
    </div>
    <div class="col-md-7">
      <div>
        <h4 class="text-primary text-uppercase">
          {{ $t('getparc.lineDetail.tab2.lineAnalysisTitles.lastConnectionStatus') }}
        </h4>
        <div class="bg-white p-4 rounded">
          <div class="d-flex">
            <div class="item">
              <h6>{{ $t('getparc.lineDetail.tab2.lineAnalysisContent.connexionStatus') }}:</h6>
              <div class="skeleton-line"></div>
            </div>
            <div class="item justify-content-end">
              <h6>
                {{ $t('getparc.lineDetail.tab2.lineAnalysisContent.closingConnexionReason') }}:
              </h6>
              <div class="skeleton-line"></div>
            </div>
          </div>
          <hr />
          <div class="d-flex">
            <div class="item">
              <h6>{{ $t('getparc.lineDetail.tab2.lineAnalysisContent.connexionDebut') }}:</h6>
              <div class="skeleton-line"></div>
            </div>
            <div class="item justify-content-end">
              <h6>{{ $t('getparc.lineDetail.tab2.lineAnalysisContent.connexionEnd') }}:</h6>
              <div class="skeleton-line"></div>
            </div>
          </div>
        </div>
      </div>
      <div>
        <h4 class="text-primary text-uppercase">
          {{ $t('getparc.lineDetail.tab2.lineAnalysisTitles.ApnIdLastConnexion') }}
        </h4>
        <div class="bg-white p-4 rounded">
          <div class="d-flex">
            <div class="item">
              <h6>{{ $t('getparc.lineDetail.tab2.lineAnalysisContent.currentApn') }}:</h6>
              <div class="skeleton-line"></div>
            </div>
            <div class="item justify-content-end">
              <h6>{{ $t('getparc.lineDetail.tab2.lineAnalysisContent.IPType') }}:</h6>
              <div class="skeleton-line"></div>
            </div>
          </div>
          <hr />
          <div class="d-flex">
            <div class="item">
              <h6>{{ $t('getparc.lineDetail.tab2.lineAnalysisContent.currentIPv4Address') }}:</h6>
              <div class="skeleton-line"></div>
            </div>
            <div class="item justify-content-end">
              <h6>{{ $t('getparc.lineDetail.tab2.lineAnalysisContent.currentIPv6Address') }}:</h6>
              <div class="skeleton-line"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {};
</script>

<style lang="scss" scoped>
.map-part {
  height: 22.7rem;
}

.item {
  margin-right: 0.5rem;
  flex-grow: 1;
  p {
    font-size: 0.8rem;
  }
  h6 {
    color: #7d7d7d;
    font-size: 0.8rem;
    font-weight: 400;
  }
}
</style>
