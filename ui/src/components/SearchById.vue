<template>
  <SearchIdInput
    :types="idsOptions"
    :selected-search-type.sync="selectedSearchType"
    :input-placeholder="$t(placeholder)"
    :init-value="initValue"
    :inline="inline"
    :no-search-button="noSearchButton"
    :disable-when-empty="disableWhenEmpty"
    @findType="findType"
    @searchById="searchById"
    @valueChange="$emit('valueChange', $event)"
  />
</template>

<script>
import SearchIdInput from '@/components/SearchIdInput';
import startsWith from 'lodash.startswith';
import { mapGetters } from 'vuex';

export default {
  components: {
    SearchIdInput,
  },
  props: {
    inline: {
      type: Boolean,
      default: true,
    },
    initValue: {
      type: String,
      required: false,
    },

    additionalIds: {
      type: Array,
      default: () => {
        return [];
      },
    },
    eidIds: {
      type: Array,
      default: () => {
        return [
          {
            code: 'c7',
            label: 'eid',
            value: 'eid',
          },
        ];
      },
    },

    placeholder: {
      type: String,
      default: '',
    },

    noSearchButton: Boolean,
    disableWhenEmpty: Boolean,
  },

  computed: {
    ...mapGetters(['userInfos']),
    idsOptions() {
      if (!this.inline && this.userInfos.esimEnabled) {
        return [...this.valuesForSelectOptions, ...this.additionalIds, ...this.eidIds];
      } else return [...this.valuesForSelectOptions, ...this.additionalIds];
    },
  },
  data() {
    return {
      selectedSearchType: undefined,

      valuesForSelectOptions: [
        {
          code: 'c1',
          value: 'iccid',
          label: 'ICCID',
          checkFn: (value) => !isNaN(value) && value.length === 19 && startsWith(value, '893320'),
        },
        {
          code: 'c2',
          value: 'imsi',
          label: 'IMSI',
          checkFn: (value) =>
            !isNaN(value) &&
            value.length === 15 &&
            (startsWith(value, '20820') ||
              startsWith(value, '27007') ||
              startsWith(value, '90177')),
        },
        {
          code: 'c3',
          value: 'msisdn',
          label: 'MSISDN',
          checkFn: (value) =>
            !isNaN(value) &&
            (value.length === 15 || value.length === 11) &&
            startsWith(value, '33'),
        },
        {
          code: 'c4',
          value: 'msisdnA',
          label: 'A-MSISDN',
        },
        {
          code: 'c5',
          value: 'imei',
          label: 'IMEI',
          checkFn: (value) => !isNaN(value) && value.length === 15,
        },
      ],
    };
  },
  methods: {
    findType(newValue) {
      const value = newValue.trim();
      const matched = this.idsOptions.filter((o) => {
        if (o.checkFn) {
          return o.checkFn(value);
        }
        return false;
      });
      if (matched && matched.length) {
        this.selectedSearchType = matched[0].value;
      }
    },
    searchById(params) {
      this.$emit('searchById', params);
    },
  },
};
</script>

<style scoped></style>
