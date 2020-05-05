<template>
  <BaseDetailPanelContent white>
    <div class="m-3">
      <div class="entries-line">
        <div class="form-entry">
          <FormControl label="getadmin.customize.listName" v-model="form.title" />
        </div>
      </div>

      <div class="entries-line">
        <div class="form-entry emailsTextarea">
          <label for="getadmin.customize.emails">{{ $t('getadmin.customize.emails') }}</label>
          <div>
            <vue-tags-input
              v-model="tag"
              :tags="tags"
              :validation="validation"
              :allow-edit-tags="true"
              :add-on-key="[13, ';']"
              @tags-changed="newTags => (tags = newTags)"
              :placeholder="$t('getadmin.customize.addEmail')"
            />
          </div>
        </div>
      </div>
    </div>
    <div slot="footer" class="action-buttons">
      <div>
        <UiButton variant="import" block @click="closePanel">{{ $t('cancel') }}</UiButton>
      </div>
      <div>
        <UiButton :disabled="!canSave" variant="primary" @click="save" block>{{
          $t('save')
        }}</UiButton>
      </div>
    </div>
  </BaseDetailPanelContent>
</template>

<script>
import BaseDetailPanelContent from '@/components/BaseDetailPanelContent';
import UiButton from '@/components/ui/Button';
import FormControl from '@/components/ui/FormControl';
import { mapGetters, mapMutations } from 'vuex';
import VueTagsInput from '@johmun/vue-tags-input';
import { createBroadcastLists, updateBroadcastLists } from '@/api/partners.js';

export default {
  components: {
    BaseDetailPanelContent,
    UiButton,
    FormControl,
    VueTagsInput,
  },
  props: {
    content: Object,
  },
  data() {
    return {
      tag: '',
      tags: [],
      emails: [],
      validation: [
        {
          classes: 'email',
          rule: /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
          disableAdd: true,
        },
      ],
      form: {
        title: undefined,
      },
    };
  },

  methods: {
    ...mapMutations(['flashMessage', 'closePanel']),

    async save() {
      this.emails = [];
      this.emails = this.tags.map(e => e.text);

      const params = {
        partnerId: this.content.partnerId,
        title: this.form.title,
        emails: this.emails,
      };

      let response;

      if (this.content.duplicateFrom) {
        params.id = this.content.duplicateFrom.id;
        response = await updateBroadcastLists(params);
      } else {
        response = await createBroadcastLists(params);
      }

      if (!response) {
        this.flashMessage({ level: 'danger', message: this.$t('genericErrorMessage') });
      } else {
        this.flashMessage({ level: 'success', message: this.$t('genericSuccessMessage') });
        this.closePanel();
      }
    },
  },

  computed: {
    ...mapGetters(['userInfos']),

    canSave() {
      return this.tags.length > 0 && this.form.title;
    },
  },

  async mounted() {
    if (this.content.duplicateFrom) {
      this.form.title = this.content.duplicateFrom.name;
      this.tags = this.content.duplicateFrom.emails.split(';').map(e => ({ text: e }));
    }
  },
};
</script>

<style lang="scss" scoped>
.emailsTextarea {
  .vue-tags-input {
    max-width: 100%;

    .ti-tags {
      min-height: 80px;
    }
  }
}
</style>
