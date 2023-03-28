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
    dnn : Object,
    profileData: Object,
  },

  data() {
    return {
      dnns: [],
      options: [],
      listTechno: [],
    };
  },
  computed: {
    ...mapState('userContext', [' contextPartnersType', 'contextPartners']),

    selectedValue: {
      get() {
        return this.dnn ? this.dnn.value : undefined;
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
      if (!this.profileData) return;
      const partyId = this.$loGet(this.partner, 'id');
      const workflowId = this.$loGet(this.offer, 'data.id');
      console.info("this.profileData"+this.profileData);
      const profileDataId = this.$loGet(this.profileData, 'meta.name');
      const techno = 'DNN';
      const data = await fetchApn(partyId, workflowId,techno);
      console.info("this.profileData"+this.profileData);
      if (data) {
        this.dnns = data.profilesData.filter((s) => s.name === profileDataId);
        this.options = this.dnns[0].dnns.map((o) => ({
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
    profileData(newValue, oldValue) {
      if (newValue !== oldValue) this.refreshList();
    },
  },

  mounted() {
    this.refreshList();
   },
};
</script>

<style lang="scss" scoped>
</style>
