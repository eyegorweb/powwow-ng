<template>
  <div class="row">
    <div v-if="eventsToShow.length || infosToShow.length" class="col-12">
      <div class="card">
        <div class="card-body">
          <div class="event-messages" v-if="eventsToShow.length">
            <h6>{{ $t('events') }}</h6>
            <ul>
              <li :key="'event_' + ev.id" v-for="ev in eventsToShow">
                <span class="date">{{ ev.messageDate }}</span>
                <span
                  :class="{ 'm-warning': ev.level === 'WARNING', 'm-info': ev.level === 'INFO' }"
                  >{{ ev.message }}</span
                >
              </li>
            </ul>
          </div>
          <div class="event-messages" v-if="infosToShow.length">
            <h6>{{ $t('infos') }}</h6>
            <ul>
              <li :key="'info_' + inf.id" v-for="inf in infosToShow">
                <span class="date">{{ inf.messageDate }}</span>
                <span
                  :class="{ 'm-warning': inf.level === 'WARNING', 'm-info': inf.level === 'INFO' }"
                  >{{ inf.message }}</span
                >
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
      events: [],
      infos: [],
      eventsToShow: [],
      infosToShow: [],
    };
  },
  async mounted() {
    const response = await fetchEventMessages();

    // EVENTS
    this.events = response.filter((e) => e.type === 'EVENT');
    this.eventsToShow = this.events.filter((evt) => evt.locale === this.$i18n.locale);

    // INFOS
    this.infos = response.filter((e) => e.type.startsWith('INFO'));
    this.infosToShow = this.infos.filter((inf) => inf.locale === this.$i18n.locale);
  },
  watch: {
    async '$i18n.locale'(locale) {
      this.eventsToShow = this.events.filter((ev) => ev.locale === locale);
      this.infosToShow = this.infos.filter((inf) => inf.locale === locale);
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

  .m-warning {
    color: $orange;
  }
  .m-info {
    color: $primary;
  }
}
</style>
