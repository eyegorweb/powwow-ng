<template>
  <!-- ------------------------------------ MVNO TYPE PARTNER -------------------------------------------- -->
  <table class="table table-blue mt-1 mb-3 partnerTypeMVNO">
    <tbody>
      <tr>
        <td>
          <ul class="content-cell list-unstyled">
            <li class="total-line">
              {{ $t('getparc.lineDetail.consummated.totalVoice') }}
            </li>
            <li class="value-line">
              {{ $t('getparc.lineDetail.consummated.voiceIncomingNationalConsumption') }}
            </li>
            <li class="value-line">
              {{ $t('getparc.lineDetail.consummated.voiceOutgoingNationalConsumption') }}
            </li>
            <li class="value-line">
              {{ $t('getparc.lineDetail.consummated.voiceRoaming') }}
            </li>
          </ul>
        </td>
        <td>
          <ul class="content-cell list-unstyled">
            <li><div class="skeleton-line" :style="{ width: '40%' }"></div></li>
          </ul>
        </td>
      </tr>
      <tr>
        <td>
          <ul class="content-cell list-unstyled">
            <li class="total-line">
              {{ $t('getparc.lineDetail.consummated.totalSMS') }}
            </li>
          </ul>
        </td>
        <td>
          <ul class="content-cell list-unstyled">
            <li><div class="skeleton-line" :style="{ width: '40%' }"></div></li>
          </ul>
        </td>
      </tr>
      <tr class="total-line">
        <td>
          <ul class="content-cell list-unstyled">
            <li class="total-line">
              {{ $t('getparc.lineDetail.consummated.totalData') }}
            </li>
          </ul>
        </td>
        <td>
          <ul class="content-cell list-unstyled">
            <li><div class="skeleton-line" :style="{ width: '40%' }"></div></li>
          </ul>
        </td>
      </tr>
    </tbody>
  </table>
</template>

<script>
export default {};
</script>

<style lang="scss" scoped>
.partnerTypeM2M {
  margin-bottom: 20rem !important;
}
.partnerTypeM2M .content-cell {
  li:nth-child(1) {
    color: $dark-gray;
    font-size: 1.4rem;
    font-weight: 300;
    line-height: 40px;
    text-align: right;
  }
  li:nth-child(2) {
    color: $blue;
    font-size: 1rem;
    line-height: 1.4rem;
    text-align: right;
  }
  li:nth-child(3) {
    color: $accent;
    font-size: 1rem;
    line-height: 1.4rem;
    text-align: right;
  }
}
.partnerTypeMVNO .content-cell {
  li.total-line {
    color: $dark-gray;
    font-size: 1.4rem;
    font-weight: 300;
    line-height: 40px;
    text-align: right;
  }
  li.total-value {
    font-size: 1.4rem;
    font-weight: 300;
    line-height: 40px;
    text-align: left;
  }
  li.value-line {
    font-size: 1rem;
    line-height: 1.4rem;
    text-align: right;
  }
}

.total-line {
  font-size: 2rem;
  color: $dark-gray;
  font-weight: 600;
  line-height: 40px;
  text-align: right;
}

.table thead th {
  text-align: right;
}

.partnerTypeMVNO tr td:nth-child(2) {
  width: 50%;
  padding-right: 30%;
}
</style>
