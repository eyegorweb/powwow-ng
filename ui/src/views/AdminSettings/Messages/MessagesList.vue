<template>
  <div>
    <table v-if="items && items.length" class="table">
      <thead class="thead-dark">
        <tr>
          <th>Date</th>
          <th>Type</th>
          <th>Locale</th>
          <th>Message</th>
          <th>Action</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="msg in items" :key="'item' + msg.id">
          <td>{{ msg.messageDate }}</td>
          <td>{{ msg.type }}</td>
          <td>{{ msg.locale }}</td>
          <td>
            <template v-if="msg && msg.message">
              {{ msg.message.substring(0, 100) }}
              {{ msg.message.length > 100 ? '...' : '' }}
            </template>
          </td>
          <td>
            <router-link :to="'/admin-settings/messages/edit/' + msg.id" class="btn btn-warning">
              <i class="ic-Edit-Icon"></i>
            </router-link>
            <button class="ml-2 btn btn-danger" @click.prevent="deleteMessage(msg.id)">
              <span class="ic-Trash-Icon"></span>
            </button>
          </td>
        </tr>
      </tbody>
    </table>
    <div v-else class="alert alert-warning" role="alert">Aucun Message</div>
  </div>
</template>

<script>

import { fetchEventMessages, deleteEventMessage } from '@/api/eventMessages.js';
import Truncate from '@/components/ui/Truncate';

import { mapMutations } from 'vuex';

export default {
  mounted() {
    this.refreshList();
  },

  components: {
    Truncate,
  },

  data() {
    return {
      items: []
    }
  },

  methods: {
    ...mapMutations(['confirmAction']),

    async refreshList() {
      this.items = await fetchEventMessages();
    },

    async deleteMessage(id) {

      this.confirmAction({
        message: 'confirm',
        actionFn: async () => {
          const response = await deleteEventMessage(id);
          this.refreshList();
        },
      });
    }
  },

}
</script>

<style lang="scss" scoped>

</style>
