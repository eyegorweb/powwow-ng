<template>
  <div class="popover-wrapper" :class="{ visible: showActs }">
    <a href="#" @click.prevent="showActs = !showActs">
      <i class="icon ic-Clock-Icon nb-acts"></i>
      <!--span class="total-acts">{{ total }}</span-->
    </a>
    <div class="popover-content ">
      <h5>{{ $t('lastMassActions') }}</h5>

      <div v-if="isLoading" class="acts-container">
        <div class="single-act" :key="`sk_${index}`" v-for="index in 3">
          <div class="act-date"><div class="skeleton-line"></div></div>
          <div class="act-name"><div class="skeleton-line"></div></div>
        </div>
      </div>
      <div v-else class="acts-container">
        <div class="single-act" :key="act.id" v-for="act in acts">
          <div class="act-date">{{ act.massAction.created }}</div>
          <div class="act-name">{{ act.type }}</div>
          <div class="act-info">
            <div class="act-status" :class="`${getStatusColor(act.massAction.status)}`">
              <i class="icon" :class="`${getStatusIcon(act.massAction.status)}`"></i>
              {{ $t('getparc.actLines.massActionsHistory.statuses.' + act.massAction.status) }}
            </div>
            <div class="act-user">{{ act.partyName }} - {{ act.creatorUsername }}</div>
          </div>
        </div>
      </div>

      <div class="action-container">
        <UiButton variant="primary" @click="gotoHistoryPage" block>{{
          $t('showAllHistory')
        }}</UiButton>
      </div>
    </div>
  </div>
</template>

<script>
import UiButton from '@/components/ui/Button';
import { searchMassActions } from '@/api/massActions';
import { clickaway } from '@/directives/clickaway';
import { currentDateMinusMounts } from '@/utils/date';

export default {
  components: {
    UiButton,
  },
  directives: { clickaway },

  data() {
    return {
      showActs: false,
      isLoading: false,
      acts: [],
      total: 0,
    };
  },

  mounted() {
    this.refreshHistory();
  },

  watch: {
    $route() {
      this.showActs = false;
    },
  },

  methods: {
    gotoHistoryPage() {
      this.showActs = false;
      this.$router.push({ name: 'actHistory' });
    },
    async refreshHistory() {
      const startDate = currentDateMinusMounts(3);

      const dateFilter = {
        id: 'filters.actDateStart',
        startDate,
      };

      this.isLoading = true;
      const response = await searchMassActions(
        { key: 'CREATED_DATE', direction: 'DESC' },
        { page: 0, limit: 3 },
        [dateFilter]
      );
      this.isLoading = false;

      this.total = response.total;
      this.acts = response.items;
    },

    getStatus(status) {
      switch (status) {
        case 'WAITING':
        case 'SENT':
        case 'IN_PROGRESS':
          return 'in_progress';

        case 'CANCELLED':
        case 'CANCELED':
          return 'error';

        case 'OK':
        case 'TERMINATED':
        case 'PREACTIVATED':
        case 'ACTIVATED':
          return 'ok';
      }
    },

    getStatusColor(status) {
      const computedStatus = this.getStatus(status);
      switch (computedStatus) {
        case 'in_progress':
          return 'blue';

        case 'error':
          return 'orange';

        case 'ok':
          return 'green';
      }
    },

    getStatusIcon(status) {
      const computedStatus = this.getStatus(status);
      switch (computedStatus) {
        case 'in_progress':
          return 'ic-Clock-Icon';

        case 'error':
          return 'ic-Alert-Icon';

        case 'ok':
          return 'ic-Check-Rounded-Icon';
      }
    },
  },
};
</script>

<style lang="scss" scoped>
.blue {
  color: $primary !important;
  i {
    color: $primary !important;
  }
}
.orange {
  color: $orange;
  i {
    color: $orange !important;
  }
}
.green {
  color: $success;
  i {
    color: $success !important;
  }
}
.single-act {
  padding: 1rem 1.5rem;
  border-bottom: 1px dotted $gray-400;

  .act-date {
    font-size: 0.8rem;
    color: $gray-680;
  }

  .act-name {
    padding: 0.5rem 0;
  }

  .act-status,
  .act-status i {
    font-size: 0.7rem;
  }

  .act-status {
    align-self: flex-end;
  }

  .act-info {
    display: flex;
    justify-content: space-between;

    .act-user {
      color: $gray-680;
      font-size: 0.8rem;
    }
  }
}

.action-container {
  padding: 1rem;
}

.popover-wrapper {
  position: relative;
  display: inline-block;

  a {
    text-decoration: none;
  }
}
.popover-content {
  opacity: 0;
  visibility: hidden;
  position: absolute;
  left: calc(100% - 12rem);
  width: 20rem;
  transform: translate(-5rem, 2rem);

  box-shadow: 0px -1px 13px 1px rgba(0, 0, 0, 0.75);

  background: $white;
  padding: 0;

  h5 {
    font-size: 1.1rem;
    font-weight: bold;
    padding: 1rem 0.5rem;
    border-bottom: 1px dotted $gray-400;
    margin: 0;
  }
}
.popover-content:before {
  position: absolute;
  z-index: -1;
  content: '';
  right: 4rem;
  top: -8px;
  border-style: solid;
  border-width: 0 10px 10px 10px;
  border-color: transparent transparent $white transparent;
  transition-duration: 0.3s;
  transition-property: transform;
}
.popover-wrapper.visible .popover-content {
  z-index: 10;
  opacity: 1;
  visibility: visible;
  transition: all 0.5s cubic-bezier(0.75, -0.02, 0.2, 0.97);
}

.total-acts {
  display: block;
  font-size: 0.7rem;
  color: #ffffff;
  background-color: #ea5b0f;
  position: absolute;
  top: -0.4rem;
  right: 0.7rem;
  font-family: 'Open Sans', sans-serif;
  border-radius: 50%;
  padding-left: 0.25rem;
  width: 0.9rem;
  height: 0.9rem;
}
</style>
