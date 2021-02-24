<template>
  <table class="table table-blue mt-1 small-text">
    <thead>
      <tr>
        <th>{{ $t('getadmin.partnerDetail.mb.commercialOffers.offerRanges.lowerBound') }}</th>
        <th>{{ $t('getadmin.partnerDetail.mb.commercialOffers.offerRanges.upperBound') }}</th>
        <th>{{ $t('getadmin.partnerDetail.mb.commercialOffers.offerRanges.unitPrice') }}</th>
        <th v-if="!isWSF">
          {{ $t('getadmin.partnerDetail.mb.commercialOffers.offerRanges.fixedPrice') }}
        </th>
        <th v-if="!isWSF">{{ $t('getadmin.partnerDetail.mb.commercialOffers.discount') }}</th>
      </tr>
    </thead>
    <tbody>
      <tr v-for="offerRange in offerRanges" :key="offerRange.id">
        <td>{{ offerRange.lowerBound }} {{ offerRange.unit }}</td>
        <td>{{ offerRange.upperBound }} {{ offerRange.unit }}</td>
        <td>{{ offerRange.unitPrice }} €/{{ offerRange.unit }}</td>
        <td v-if="!isWSF">{{ offerRange.fixedPrice }} €</td>
        <td v-if="!isWSF" :style="{ width: '20%' }">
          <UiInput
            v-if="
              offerRange.lowerBoundDiscount !== null && offerRange.lowerBoundDiscount !== undefined
            "
            v-model="offerRange.discountValue"
            input-type="number"
            :min-value="offerRange.lowerBoundDiscount"
            :max-value="offerRange.upperBoundDiscount"
            class="input-block m-0"
            block
            @update:value="$emit('change', offerRanges)"
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
    offerRanges: {
      type: Array,
      default: () => [],
    },
  },

  computed: {
    /**
    {
      lowerBound: 4697,
      upperBound: 589,
      unitPrice: 8571,
      fixedPrice: 8058,
      lowerBoundDiscount: 804,
      upperBoundDiscount: 9239,
    },
    //*/
    isWSF() {
      return (
        this.offerRanges.filter(item => {
          return !item.upperBoundDiscount && !item.lowerBoundDiscount && !item.fixedPrice;
        }).length === this.offerRanges.length
      );
    },
  },
};
</script>

<style lang="scss" scoped></style>
