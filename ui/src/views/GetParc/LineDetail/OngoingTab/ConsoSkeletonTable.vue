<template>
  <table class="table table-blue mt-1 mb-3 partnerTypeM2M">
    <thead>
      <tr>
        <th>{{ $t('getparc.lineDetail.titled') }}</th>
        <th>{{ $t('getparc.lineDetail.data') }}</th>
        <th>{{ $t('getparc.lineDetail.sms') }}</th>
        <th>{{ $t('getparc.lineDetail.voice') }}</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td>
          <ul class="content-cell list-unstyled">
            <li>{{ $t('getparc.lineDetail.consummated.nationalConsumption') }}</li>
            <li>{{ $t('getparc.lineDetail.consummated.incoming') }}</li>
            <li>{{ $t('getparc.lineDetail.consummated.outgoing') }}</li>
          </ul>
        </td>
        <td>
          <ul class="content-cell list-unstyled">
            <li><div class="skeleton-line" :style="{ width: '40%' }"></div></li>
            <li>
              <div class="skeleton-line" :style="{ width: '40%' }"></div>
            </li>
            <li>
              <div class="skeleton-line" :style="{ width: '40%' }"></div>
            </li>
          </ul>
        </td>
        <td>
          <ul class="content-cell list-unstyled">
            <li><div class="skeleton-line" :style="{ width: '40%' }"></div></li>
            <li><div class="skeleton-line" :style="{ width: '40%' }"></div></li>
            <li><div class="skeleton-line" :style="{ width: '40%' }"></div></li>
          </ul>
        </td>
        <td>
          <ul class="content-cell list-unstyled">
            <li><div class="skeleton-line" :style="{ width: '40%' }"></div></li>
            <li>
              <div class="skeleton-line" :style="{ width: '40%' }"></div>
            </li>
            <li>
              <div class="skeleton-line" :style="{ width: '40%' }"></div>
            </li>
          </ul>
        </td>
      </tr>
      <tr>
        <td>
          <ul class="content-cell list-unstyled">
            <li>{{ $t('getparc.lineDetail.consummated.internationalConsumption') }}</li>
            <li>{{ $t('getparc.lineDetail.consummated.incoming') }}</li>
            <li>{{ $t('getparc.lineDetail.consummated.outgoing') }}</li>
          </ul>
        </td>
        <td>
          <ul class="content-cell list-unstyled">
            <li><div class="skeleton-line" :style="{ width: '40%' }"></div></li>
            <li>
              <div class="skeleton-line" :style="{ width: '40%' }"></div>
            </li>
            <li>
              <div class="skeleton-line" :style="{ width: '40%' }"></div>
            </li>
          </ul>
        </td>
        <td>
          <ul class="content-cell list-unstyled">
            <li><div class="skeleton-line" :style="{ width: '40%' }"></div></li>
            <li><div class="skeleton-line" :style="{ width: '40%' }"></div></li>
            <li><div class="skeleton-line" :style="{ width: '40%' }"></div></li>
          </ul>
        </td>
        <td>
          <ul class="content-cell list-unstyled">
            <li>
              <div class="skeleton-line" :style="{ width: '40%' }"></div>
            </li>
            <li>
              <div class="skeleton-line" :style="{ width: '40%' }"></div>
            </li>
            <li>
              <div class="skeleton-line" :style="{ width: '40%' }"></div>
            </li>
          </ul>
        </td>
      </tr>
      <tr class="total-line">
        <td>{{ $t('total') }}</td>
        <td><div class="skeleton-line" :style="{ width: '40%' }"></div></td>
        <td><div class="skeleton-line" :style="{ width: '40%' }"></div></td>
        <td><div class="skeleton-line" :style="{ width: '40%' }"></div></td>
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
