<template>
  <div class="row">
    <div v-if="eventsToShow.length" class="col-12">
      <div class="card">
        <div class="card-body">
          <div class="event-messages">
            <h6>événements:</h6>
            <ul>
              <li :key="'event_' + ev.id" v-for="ev in eventsToShow">
                <span class="date">{{ ev.messageDate }}</span>
                <span class="m-content">{{ ev.message }}</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { fetchEventMessages } from '@/api/eventMessages.js';
import { mapGetters } from 'vuex';

export default {
  data() {
    return {
      mepEvents: [],
      eventsToShow: [],
    };
  },
  async mounted() {
    if (this.userIsAdmin) {
      const response = await fetchEventMessages();
      this.mepEvents = response.filter((e) => e.type === 'MEP');
      this.eventsToShow = this.mepEvents.filter((ev) => ev.locale === this.$i18n.locale);
    }
  },

  methods: {
    ...mapGetters(['userIsAdmin']),
  },

  watch: {
    async '$i18n.locale'(locale) {
      this.eventsToShow = this.mepEvents.filter((ev) => ev.locale === locale);
    },
  },
};
</script>

<style lang="scss" scoped>
.event-messages {
  h6 {
    text-transform: uppercase;
    font-weight: bold;
  }
}

ul {
  list-style: none;
  margin: 0;
  padding: 0;

  .date {
    color: $gray-680;
    font-size: 0.9rem;
    margin-right: 0.5rem;
  }

  .m-content {
    color: $orange;
  }
}
</style>
