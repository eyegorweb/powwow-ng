<template>
  <div class="row mb-4">
    <div class="col">
      <div class="bg-white p-4 rounded">
        <div class="d-flex">
          <div class="item">
            <h6>{{ $t('getparc.lineDetail.offer') }}:</h6>
            <p>
              ENEDIS-LINKY-PROD
            </p>
          </div>
          <div class="item">
            <h6>{{ $t('getparc.lineDetail.lineStatus') }}:</h6>
            <p class="text-success">
              Activé
            </p>
          </div>
          <div class="item">
            <h6>{{ $t('getparc.lineDetail.triggeredAlarms') }}:</h6>
            <p class="text-danger">
              Oui
            </p>
          </div>
        </div>
        <hr />
        <div class="d-flex">
          <div class="item">
            <h6>{{ $t('getparc.actDetail.col.iccid') }}:</h6>
            <p>
              8933200809935003869
            </p>
          </div>
          <div class="item">
            <h6>{{ $t('getparc.lineDetail.manufacturer') }}:</h6>
            <p>
              Gemalto Gbmh
            </p>
          </div>
          <div class="item">
            <h6>{{ $t('getparc.lineDetail.model') }}:</h6>
            <p>
              Cinterion BGS2-W
            </p>
          </div>
        </div>
      </div>
    </div>
    <div class="col">
      <div class="bg-white p-4 rounded">
        <div class="d-flex">
          <div class="item">
            <h6>{{ $t('getparc.lineDetail.data') }}:</h6>
            <p>
              5Mo
            </p>
          </div>
          <div class="item">
            <h6>{{ $t('getparc.lineDetail.sms') }}:</h6>
            <p>
              56
            </p>
          </div>
          <div class="item">
            <h6>{{ $t('getparc.lineDetail.voice') }}:</h6>
            <p>
              2h:56mn:34s
            </p>
          </div>
        </div>
        <hr />
        <div class="d-flex">
          <div class="item">
            <h6>{{ $t('getparc.lineDetail.previsionalData') }}:</h6>
            <p>
              12Mo
            </p>
          </div>
          <div class="item">
            <h6>{{ $t('getparc.lineDetail.previsionalSms') }}:</h6>
            <p>
              125
            </p>
          </div>
          <div class="item">
            <h6>{{ $t('getparc.lineDetail.previsionalVoice') }}:</h6>
            <p>
              5h:20mn:45s
            </p>
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
hr {
  border-bottom: 1px dashed #dddddd;
  margin-top: 0;
  margin-bottom: 0.8rem;
}
.item {
  margin-right: 0.5rem;
  flex-grow: 1;
  h6 {
    color: #7d7d7d;
    font-size: 0.8rem;
    font-weight: 400;
  }
}
</style>
