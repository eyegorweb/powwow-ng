<template>
  <div>
    <template v-if="userIsAdmin">
      <div class="row mt-4">
        <div class="col-9">
          <h4 class="mt-4">
            <strong>Administration</strong>
            - Gestion des messages
          </h4>
        </div>
        <div class="col-3">
          <UiButton variant="secondary" block class="float-right" @click="addNewMessage">
            Ajouter un message
          </UiButton>
        </div>
      </div>

      <div class="row">
        <div class="col">
          <MessagesList />
        </div>
      </div>
    </template>
  </div>
</template>

<script>
import MessagesList from './MessagesList.vue';
import UiButton from '@/components/ui/Button';
import { mapGetters } from 'vuex';

export default {
  components: {
    MessagesList,
    UiButton,
  },

  methods: {
    ...mapGetters(['userIsAdmin']),

    addNewMessage() {
      this.$router.push({ name: 'messagesEdit' });
    },
  },
};
</script>

<style lang="scss" scoped>
</style>
