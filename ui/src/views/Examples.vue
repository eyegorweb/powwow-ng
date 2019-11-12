<template>
  <div class="home">
    <div class="mb-4">
      <SearchTranslationKey />
    </div>
    <div class="row">
      <div class="col-md-6">
        <ServicesBlock2 :services="services" />
      </div>
      <div class="col-md-6">
        <UiInput
          :placeholder="null"
          v-model="testvar"
          value
          class="d-block w-50 mx-auto"
          input-type="number"
        />

        <input :placeholder="null" type="number" :min="1" v-model="testvar" />
      </div>
    </div>

    <TableSkeleton :columns="columns" />
  </div>
</template>

<script>
// Composant sandbox, ne pas faire de review, c'est du jetable :)
import SearchTranslationKey from '@/components/utils/SearchTranslationKey';
import ServicesBlock2 from '@/components/Services/ServicesBlock2.vue';
import UiInput from '@/components/ui/UiInput';
import TableSkeleton from '@/components/ui/skeletons/TableSkeleton';

export default {
  name: 'Home',
  components: {
    SearchTranslationKey,
    ServicesBlock2,
    UiInput,
    TableSkeleton,
  },
  methods: {
    onChane(e) {
      console.log('AAA>', e);
    },
  },
  data() {
    return {
      testvar: undefined,
      columns: [
        {
          id: 1,
          label: this.$t('col.id'),
        },
        {
          id: 2,
          label: this.$t('col.externalId'),
        },
      ],
      services: [
        { code: 'INCOMING_VOICE', checked: true, editable: false, optional: false },
        { code: 'OUTGOING_VOICE', checked: true, editable: false, optional: false },
        { code: 'INCOMING_SMS', checked: true, editable: false, optional: false },
        { code: 'OUTGOING_SMS', checked: true, editable: false, optional: false },
        { code: 'DATA_CSD_NUMBER', checked: false, editable: false, optional: false },
        { code: 'INCOMING_DATA_CSD', checked: true, editable: false, optional: false },
        { code: 'ROAMING', checked: true, editable: false, optional: false },
        { code: 'OUTGOING_DATA_CSD', checked: true, editable: false, optional: false },
        {
          code: '878',
          checked: true,
          editable: false,
          optional: false,
          parameters: [
            { active: false, label: 'manaty3.fr', editable: true, code: 'APN3', name: 'APN3' },
          ],
        },
        { code: '1147', checked: false, editable: true, optional: false },
        { code: '1247', checked: false, editable: true, optional: false },
        { code: '15', checked: true, editable: true, optional: false },
        { code: '77', checked: false, editable: true, optional: false },
        { code: '1290', checked: true, editable: false, optional: false },
        { code: '9001', checked: true, editable: false, optional: false },
        { code: '9004', checked: false, editable: true, optional: false },
        { code: '2', checked: false, editable: true, optional: false },
        { code: '9', checked: false, editable: false, optional: false },
        { code: '18', checked: true, editable: true, optional: false },
        { code: '107', checked: false, editable: true, optional: false },
        { code: '799', checked: false, editable: false, optional: false },
        { code: '10', checked: true, editable: true, optional: false },
        { code: '1168', checked: true, editable: false, optional: false },
        { code: 'X', checked: true, editable: true, optional: false },
      ],
    };
  },
};
</script>
