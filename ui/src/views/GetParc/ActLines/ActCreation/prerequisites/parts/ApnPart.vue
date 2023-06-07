<template>
  <div class="cmp-offer-billing-account-combo">
    <UiSelect
      :disabled="!offer"
      class="text-gray"
      block
      v-model="selectedValue"
      :options="options"
    />
  </div>
</template>

<script>
import UiSelect from '@/components/ui/UiSelect';
import { mapState } from 'vuex';
import { fetchApn } from '@/api/actCreation.js';

export default {
  components: {
    UiSelect,
  },

  props: {
    offer: Object,
    partner: Object,
    apn: Object,
  },

  data() {
    return {
      options: [],
      listTechno: [],
    };
  },
  computed: {
    ...mapState('userContext', [' contextPartnersType', 'contextPartners']),

    selectedValue: {
      get() {
        return this.apn ? this.apn.value : undefined;
      },
      set(value) {
        if (value && value.label === '') {
          this.$emit('update:value', undefined);
          return;
        }
        const selectedObj = this.options.find((o) => o.label === value);
        this.$emit('update:value', selectedObj);
      },
    },
  },

  methods: {
    async refreshList() {
      if (!this.offer) return;
      const partyId = this.$loGet(this.partner, 'id');
      const workflowId = this.$loGet(this.offer, 'data.id');
      const techno = 'APN';
      const data = await fetchApn(partyId, workflowId, techno);
      if (data) {
        this.options = data.apns.map((o) => ({
          value: o.code,
          label: o.code,
          meta: o,
        }));
        if (this.options && this.options.length === 1) {
          this.selectedValue = this.options[0].value;
        }
      } else {
        this.options = [];
      }
    },
  },

  watch: {
    offer(newValue, oldValue) {
      if (newValue !== oldValue) this.refreshList();
    },
  },

  mounted() {
    this.refreshList();
  },
};
</script>

<style lang="scss" scoped></style>
