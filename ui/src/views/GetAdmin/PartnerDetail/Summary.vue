<template>
  <div class="row mb-4">
    <div class="col">
      <div class="bg-white p-4 rounded">
        <div class="d-flex">
          <div class="item">
            <h6>{{ $t('getadmin.partners.name') }}:</h6>
            <p>value</p>
          </div>
          <div class="item">
            <h6>{{ $t('filters.lines.siren') }}:</h6>
            <p>value</p>
          </div>
          <div class="item">
            <h6>{{ $t('filters.lines.typeSIMCard') }}:</h6>
            <p>value</p>
          </div>
          <div class="item">
            <h6>{{ $t('common.customFields') }}:</h6>
            <p>value</p>
          </div>
        </div>
        <div class="d-flex">
          <div class="item">
            <h6>{{ $t('getadmin.partners.mainAdmin') }}:</h6>
            <p>value</p>
          </div>
          <div class="item">
            <h6>{{ $t('getadmin.partners.users') }}:</h6>
            <p>value</p>
          </div>
          <div class="item">
            <h6>{{ $t('getadmin.partners.deliveryPlaces') }}:</h6>
            <p>value</p>
          </div>
          <div class="item">
            <h6>{{ $t('getadmin.partners.broadcastList') }}:</h6>
            <p>value</p>
          </div>
        </div>
      </div>
    </div>
    <div class="col">
      <div class="bg-white p-4 rounded">
        <div class="d-flex">
          <div class="item">
            <h6>{{ $t('getadmin.partners.salesEngineer') }}:</h6>
            <p>value</p>
          </div>
          <div class="item">
            <h6>{{ $t('common.email') }}:</h6>
            <p>value</p>
          </div>
          <div class="item">
            <h6>{{ $t('orders.new.deliveryStep.form.phone') }}</h6>
            <p>value</p>
          </div>
        </div>
        <div class="d-flex">
          <div class="item">
            <h6>{{ $t('getadmin.partners.lastBill') }}:</h6>
            <p>value</p>
          </div>
          <div class="item">
            <h6>{{ $t('filters.offers') }}:</h6>
            <p>value</p>
          </div>
          <div class="item">
            <h6>{{ $t('common.billingAccounts') }}:</h6>
            <p>value</p>
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
