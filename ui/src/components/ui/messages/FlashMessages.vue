<template>
  <div class="messages-content">
    <MessageItem
      v-for="msg in messages"
      :key="msg.id"
      :msg-info="msg"
      @remove="id => removeMessageById(id)"
    />
  </div>
</template>

<script>
import { mapState, mapMutations } from 'vuex';
import MessageItem from './MessageItem';

export default {
  components: {
    MessageItem,
  },
  computed: mapState({
    messages: state => state.ui.messages,
  }),

  methods: {
    ...mapMutations(['removeMessageById']),
  },
};
</script>

<style lang="scss" scoped>
.messages-content {
  position: fixed;
  top: 0;
  right: 10px;
}
</style>
