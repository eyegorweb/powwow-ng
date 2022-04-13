<template>
  <form>
    <div class="form-group">
      <label>{{ $t('adminSection.type') }}</label>
      <UiSelect class="text-gray" block v-model="selectedType" :options="types" />
    </div>

    <div class="form-group">
      <label for="messageContent">
        {{ $t('adminSection.message') }}
        <button class="btn btn-sm btn-primary" @click.prevent="setExample()">
          {{ $t('adminSection.example') }}
        </button>
      </label>
      <textarea v-model="messageTxt" class="form-control" id="messageContent" rows="10"></textarea>
    </div>

    <UiButton :variant="'primary'" @click="saveMessage">
      {{ $t('save') }}
    </UiButton>
    <UiButton :variant="'secondary'" class="ml-2" @click="backToList">
      {{ $t('back') }}
    </UiButton>
  </form>
</template>

<script>
import UiButton from '@/components/ui/Button';
import UiSelect from '@/components/ui/UiSelect';
import { mapMutations } from 'vuex';

import { createHomeMessage } from '@/api/eventMessages.js';
import { formattedCurrentDate } from '@/utils/date.js';

export default {
  components: {
    UiButton,
    UiSelect,
  },

  props: {
    locale: String,
    messageToEdit: {
      type: Object,
      required: false,
    },
  },

  data() {
    return {
      selectedType: undefined,
      messageTxt: undefined,
      types: ['EVENT', 'INFO'],
    };
  },

  async mounted() {
    if (this.messageToEdit) {
      this.selectedType = this.messageToEdit.type;
      this.messageTxt = this.messageToEdit.message;
    } else {
      this.selectedType = this.types[0];
    }
  },

  methods: {
    ...mapMutations(['flashMessage']),
    async saveMessage() {
      const payload = {
        locale: this.locale,
        type: this.selectedType,
        message: this.messageTxt,
        messageDate: formattedCurrentDate(),
      };

      if (this.$loGet(this.messageToEdit, 'id')) {
        payload.id = this.$loGet(this.messageToEdit, 'id');
      }

      await createHomeMessage(payload);
      this.flashMessage({ level: 'success', message: this.$t('genericSuccessMessage') });
    },
    backToList() {
      this.$router.go(-1);
    },

    setExample() {
      this.messageTxt = this.$tl('event.content', this.locale);
    },
  },
};
</script>

<style lang="scss" scoped></style>
