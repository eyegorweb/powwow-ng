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
      <tr v-for="offerPackage in offerPackages" :key="offerPackage.usage">
        <td>{{ offerPackage.usage }}</td>
        <td>{{ offerPackage.enveloppeLabel }}</td>
        <td>{{ offerPackage.enveloppe }}</td>
        <td>{{ offerPackage.price }}</td>
        <td>
          <UiInput
            v-if="offerPackage.lowerBound"
            v-model="offerPackage.discount"
            input-type="number"
            :min-value="offerPackage.lowerBound"
            :max-value="offerPackage.upperBound"
            class="input-block m-0"
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

  data() {
    return {
      offerPackages: [
        {
          usage: 'Data',
          enveloppeLabel: '1MO FR',
          enveloppe: 11,
          price: '0.0 €',
          lowerBound: undefined,
          upperBound: undefined,
          discount: undefined,
        },
        {
          usage: 'SMS',
          enveloppeLabel: 'Label SMS',
          enveloppe: 10,
          price: '0.0 €',
          lowerBound: 20,
          upperBound: 40,
          discount: undefined,
        },
      ],
    };
  },
};
</script>

<style lang="scss" scoped></style>
