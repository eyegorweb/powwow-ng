<template>
  <div>
    <div class="row mt-4">
      <div class="col-9">
        <h4 class="mt-4">
          <strong>Administration</strong>
          - Ajout / Modification
        </h4>
      </div>
    </div>

    <div class="row">
      <div class="col">
        <UiTabs :tabs="tabs">
          <template slot-scope="{ tab, index }">
            <UiTab
              v-if="tab"
              :is-selected="index === currentTabToShow"
              class="tab-grow"
              :disable-menu="!!messageToEdit"
            >
              <a href="#" @click.prevent="() => (currentTabToShow = index)">{{ tab.title }}</a>
            </UiTab>
          </template>
        </UiTabs>
        <template v-if="canShowForm">
          <div>
            <keep-alive>
              <MessageForm
                :key="'form_fr'"
                v-if="currentTabToShow === 0"
                :locale="tabs[currentTabToShow].section"
                :messageToEdit="messageToEdit"
              />
            </keep-alive>
            <keep-alive>
              <MessageForm
                :key="'form_en'"
                v-if="currentTabToShow === 1"
                :locale="tabs[currentTabToShow].section"
                :messageToEdit="messageToEdit"
              />
            </keep-alive>
          </div>
        </template>
      </div>
    </div>
  </div>
</template>


      </div>
    </div>
  </div>
</template>

<script>
import UiTabs from '@/components/ui/Tabs';
import UiTab from '@/components/ui/Tab';

import MessageForm from './MessageForm';
import { fetchEventMessages } from '@/api/eventMessages.js';

export default {
  components: {
    UiTabs,
    UiTab,
    MessageForm
  },

  data() {
    return {
      currentTabToShow: 0,
      canShowForm: true,
      tabs: [
        {
          section: 'fr',
          title: 'Français'
        },
        {
          section: 'en',
          title: 'English'
        },
      ],
      messageToEdit: undefined
    }
  },

  async mounted() {
    if (this.$loGet(this.$route, 'params.id')) {
      const messages = await fetchEventMessages();
      this.messageToEdit = messages.find(m => '' + m.id === '' + this.$loGet(this.$route, 'params.id'));
      if (this.messageToEdit && this.messageToEdit.locale === 'en') {
        this.currentTabToShow = 1;
      }
      this.canShowForm = false;
      setTimeout(() => {
        this.canShowForm = true;
      });
    }
  },
}
</script>

<style lang="scss" scoped>
.disableTab {
  a {
    color: $primary !important;
  }
}

</style>
