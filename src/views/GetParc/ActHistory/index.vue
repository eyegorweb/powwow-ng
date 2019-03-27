<template>
  <div class="mt-4">
    <div class="row mb-5">
      <div class="col-md-9">
        <h4>
          <b>GetParc</b>
          - {{ $t('getparc.management-act') }}
          <i class="ic-Info-Icon" />
        </h4>
      </div>
    </div>
    <div class="row">
      <div class="col-md-3">
        <FilterBar />
      </div>
      <div class="col-md-9">
        Table ici
        <SearchByIdInput></SearchByIdInput>
      </div>
    </div>
  </div>
</template>

<script>
import FilterBar from './FilterBar';
import SearchByIdInput from './SearchByIdInput';

export default {
  components: {
    FilterBar,
    SearchByIdInput,
  },
};
</script>

<style scoped></style>
