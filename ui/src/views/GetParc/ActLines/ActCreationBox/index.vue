<template>
  <div>
    <Title num="2" title="getparc.actLines.step2Title" />
    <div class="card mb-2">
      <div class="card-body">
        <div class="row">
          <div class="col">
            <UiApiAutocomplete
              :items="billingAccounts"
              v-model="selectedBillingAccount"
              display-results-while-empty
            />
          </div>
          <div class="col">null</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import Title from '../Title';
import UiApiAutocomplete from '@/components/ui/UiApiAutocomplete';

export default {
  components: {
    Title,
    UiApiAutocomplete,
  },
  data() {
    return {
      billingAccounts: [],
      selectedBillingAccount: null,
    };
  },
};
</script>

<style lang="scss" scoped></style>
