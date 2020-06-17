<template>
  <button class="btn btn-link p-0" @click.stop="onClick">{{ row.creatorUsername }}</button>
</template>

<script>
import { mapMutations } from 'vuex';
import { setTimeout } from 'timers';
import { fetchUserFromUsername } from '@/api/users';

export default {
  name: 'CreatorCell',
  props: {
    row: {
      type: Object,
    },
  },
  data() {
    return {
      user: undefined,
      creator: undefined,
    };
  },
  methods: {
    ...mapMutations(['openPanel']),

    onClick() {
      const openTrigger = () => {
        this.openPanel({
          title: this.$t('getsim.creator.title', this.creator),
          panelId: 'getparc.creator.title',
          payload: this.user,
          wide: false,
        });
      };
      if (this.isOpen) {
        setTimeout(openTrigger, 500);
      } else {
        openTrigger();
      }
    },
  },
  async mounted() {
    this.user = await fetchUserFromUsername(this.row.creatorUsername);
    this.creator = this.user.name;
  },
};
</script>

<style scoped></style>
