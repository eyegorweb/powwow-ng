<template>
  <div>
    <div class="row">
      <div class="col-md-4">
        <draggable handle=".handle">
          <div>
            <h4 class="text-primary text-uppercase">
              {{ $t('getparc.lineDetail.tab2.lineAnalysisTitles.locationSection') }}
            </h4>
          </div>
        </draggable>
      </div>
      <div class="col-md-8">
        <draggable handle=".handle">
          <div>
            <h4 class="text-primary text-uppercase">
              {{ $t('getparc.lineDetail.tab2.lineAnalysisTitles.lastConnectionStatus') }}
            </h4>
            <div class="bg-white p-4 rounded">
              <div class="d-flex">
                <div class="item">
                  <h6>{{ $t('getparc.lineDetail.tab2.lineAnalysisContent.connexionStatus') }}:</h6>
                  <p>
                    -
                  </p>
                </div>
                <div class="item justify-content-end">
                  <h6>
                    {{ $t('getparc.lineDetail.tab2.lineAnalysisContent.closingConnexionReason') }}:
                  </h6>
                  <p class="text-success">
                    -
                  </p>
                </div>
              </div>
              <hr />
              <div class="d-flex">
                <div class="item">
                  <h6>{{ $t('getparc.lineDetail.tab2.lineAnalysisContent.connexionDebut') }}:</h6>
                  <p>
                    Du 18/11/2018 à 15:35:12
                  </p>
                </div>
                <div class="item justify-content-end">
                  <h6>{{ $t('getparc.lineDetail.tab2.lineAnalysisContent.connexionEnd') }}:</h6>
                  <p>
                    Au 18/11/2018 à 15:35:45
                  </p>
                </div>
              </div>
            </div>
          </div>
        </draggable>
        <draggable handle=".handle">
          <div>
            <h4 class="text-primary text-uppercase">
              {{ $t('getparc.lineDetail.tab2.lineAnalysisTitles.ApnIdLastConnexion') }}
            </h4>
            <div class="bg-white p-4 rounded">
              <div class="d-flex">
                <div class="item">
                  <h6>{{ $t('getparc.lineDetail.tab2.lineAnalysisContent.currentApn') }}:</h6>
                  <p>
                    gprsnac.com
                  </p>
                </div>
                <div class="item justify-content-end">
                  <h6>{{ $t('getparc.lineDetail.tab2.lineAnalysisContent.IPType') }}:</h6>
                  <p class="text-success">
                    Non disponible
                  </p>
                </div>
              </div>
              <hr />
              <div class="d-flex">
                <div class="item">
                  <h6>
                    {{ $t('getparc.lineDetail.tab2.lineAnalysisContent.currentIPv4Address') }}:
                  </h6>
                  <p>
                    192.168.1.10
                  </p>
                </div>
                <div class="item justify-content-end">
                  <h6>
                    {{ $t('getparc.lineDetail.tab2.lineAnalysisContent.currentIPv6Address') }}:
                  </h6>
                  <p>
                    2001:db8:0:85a3:0:0:ac1f:8001
                  </p>
                </div>
              </div>
            </div>
          </div>
        </draggable>
      </div>
    </div>

    <div class="row">
      <draggable handle=".handle">
        <div>
          <h4 class="text-primary text-uppercase">
            {{ $t('getparc.lineDetail.tab2.lineAnalysisTitles.LastLocation') }}
          </h4>
          <div class="bg-white p-4 rounded">
            <div class="d-flex">
              <div class="item">
                <h6>{{ $t('getparc.lineDetail.tab2.lineAnalysisContent.currentApn') }}:</h6>
                <p>
                  gprsnac.com
                </p>
              </div>
              <div class="item justify-content-end">
                <h6>{{ $t('getparc.lineDetail.tab2.lineAnalysisContent.IPType') }}:</h6>
                <p class="text-success">
                  Non disponible
                </p>
              </div>
            </div>
            <hr />
            <div class="d-flex">
              <div class="item">
                <h6>{{ $t('getparc.lineDetail.tab2.lineAnalysisContent.currentIPv4Address') }}:</h6>
                <p>
                  192.168.1.10
                </p>
              </div>
              <div class="item justify-content-end">
                <h6>{{ $t('getparc.lineDetail.tab2.lineAnalysisContent.currentIPv6Address') }}:</h6>
                <p>
                  2001:db8:0:85a3:0:0:ac1f:8001
                </p>
              </div>
            </div>
          </div>
        </div>
      </draggable>
    </div>
  </div>
</template>

<script>
import draggable from 'vuedraggable';

export default {
  components: {
    draggable,
  },
  props: {
    content: Object,
  },
};
</script>

<style lang="scss" scoped>
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
