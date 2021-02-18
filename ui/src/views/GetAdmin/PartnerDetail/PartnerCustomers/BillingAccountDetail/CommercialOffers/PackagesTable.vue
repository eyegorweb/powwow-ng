<template>
  <table class="table table-blue mt-1 small-text">
    <thead>
      <tr>
        <th>{{ $t('getadmin.partnerDetail.mb.commercialOffers.usage') }}</th>
        <th>{{ $t('getadmin.partnerDetail.mb.commercialOffers.enveloppeLabel') }}</th>
        <th>{{ $t('getadmin.partnerDetail.mb.commercialOffers.enveloppe') }}</th>
        <th>{{ $t('getadmin.partnerDetail.mb.commercialOffers.price') }}</th>
        <th>{{ $t('getadmin.partnerDetail.mb.commercialOffers.discount') }}</th>
      </tr>
    </thead>
    <tbody>
      <tr v-for="offerPackage in offerPackages" :key="offerPackage.usageType">
        <td>{{ offerPackage.usageType }}</td>
        <td>{{ offerPackage.envelopeLabel }}</td>
        <td>{{ offerPackage.envelopeValue }}</td>
        <td>{{ offerPackage.price }}</td>
        <td :style="{ width: '20%' }">
          <UiInput
            v-if="offerPackage.lowerBound !== null && offerPackage.lowerBound !== undefined"
            v-model="offerPackage.discount"
            input-type="number"
            :min-value="offerPackage.lowerBound"
            :max-value="offerPackage.upperBound"
            class="input-block m-0"
            block
            @update:value="$emit('change', offerPackages)"
          />
          <template v-else>
            {{ $t('getadmin.partnerDetail.mb.commercialOffers.notDefined') }}
          </template>
        </td>
      </tr>
    </tbody>
  </table>
</template>

<script>
import UiInput from '@/components/ui/UiInput';

export default {
  components: {
    UiInput,
  },

  props: {
    offerPackages: {
      type: Array,
      default: () => [],
    },
  },
};
</script>

<style lang="scss" scoped></style>
