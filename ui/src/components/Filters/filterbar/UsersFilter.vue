<template>
  <UiApiAutocomplete
    :api-method="fetchApi"
    v-model="selectedUser"
    scroll-for-next
    display-results-while-empty
  />
</template>

<script>
import UiApiAutocomplete from '@/components/ui/UiApiAutocomplete';
import { searchUsers } from '@/api/users';
import uuid from 'uuid/v1';

export default {
  components: {
    UiApiAutocomplete,
  },
  props: {
    selectedData: Object,
    getPageContext: Function,
  },

  data() {
    return {
      selectedUser: undefined,
    };
  },

  watch: {
    selectedData(newValue) {
      if (newValue && this.$loGet(newValue, 'data.id')) {
        this.selectedUser = newValue.data;
      }
    },
    selectedUser(newValue) {
      if (newValue && newValue.id && newValue.label !== '') {
        this.$emit('change', newValue);
      }
    },
  },

  mounted() {
    if (this.selectedData && this.$loGet(this.selectedData, 'data.id')) {
      this.selectedUser = this.selectedData.data;
    }
  },

  computed: {
    selectedUser2: {
      get() {
        if (this.selectedData) {
          return this.selectedData.data;
        }

        return undefined;
      },
      set(newValue) {
        this.$emit('change', newValue);
      },
    },
  },

  methods: {
    async fetchApi(q, page = 0) {
      const orderBy = { key: 'fullname', direction: 'ASC' };
      const data = await searchUsers(q, orderBy, { limit: 10, page }, []);
      if (data) {
        return data.items.map((p) => {
          const formattedUser = {
            key: uuid(),
            id: p.id,
            label: `${p.name.firstName || ''} ${p.name.lastName || ''}`,
            meta: p,
          };
          if (p.party) {
            formattedUser.partnerId = p.party.id;
          }
          return formattedUser;
        });
      }
      //* /
    },
  },
};
</script>

<style lang="scss" scoped></style>
