<template>
  <div class="data-detail-container">
    <div class="overview-container m-3 bg-white" v-if="creator">
      <div class="overview-item">
        <h4 class="font-weight-normal text-uppercase">
          {{ $t('orders.detail.personalInformations') }}
        </h4>
      </div>
      <div class="overview-item">
        <h6>{{ $t('orders.detail.deActivate') }} :</h6>
        <p class="text-uppercase">{{ disabledUser }}</p>
      </div>
      <div class="overview-item">
        <h6>{{ $t('orders.detail.title') }} :</h6>
        <p>{{ $t('common.' + getFromCreator('name.title')) }}</p>
      </div>
      <div class="overview-item">
        <h6>{{ $t('common.lastName') }} :</h6>
        <p>{{ getFromCreator('name.lastName') }}</p>
      </div>
      <div class="overview-item">
        <h6>{{ $t('common.firstName') }} :</h6>
        <p>{{ getFromCreator('name.firstName') }}</p>
      </div>
      <div class="overview-item">
        <h6>{{ $t('common.email') }} :</h6>
        <a :href="getFromCreator('contactInformation.email')">{{ getFromCreator('email') }}</a>
      </div>
      <div class="overview-item">
        <h6>Login :</h6>
        <p>{{ getFromCreator('username') }}</p>
      </div>
    </div>
    <div class="overview-container m-3 bg-white" v-if="partners && roles">
      <div class="overview-item">
        <h4 class="font-weight-normal text-uppercase">{{ $t('orders.detail.partnerAndRoles') }}</h4>
      </div>
      <div class="overview-item">
        <h6>{{ $t('common.lastName') }} :</h6>
        <p>
          <span v-for="(r, index) in partners" :key="r.name"
            >{{ index ? ', ' : '' }}{{ r.description }}</span
          >
        </p>
      </div>
      <div class="overview-item">
        <h6>{{ $t('orders.detail.roles') }} :</h6>
        <p>
          <span v-for="(r, index) in roles" :key="r.name"
            >{{ index ? ', ' : '' }}{{ r.description }}</span
          >
        </p>
      </div>
    </div>
    <div class="overview-container m-3 bg-white">
      {{ $t('noAvailableInformations') }}
    </div>
  </div>
</template>

<script>
import get from 'lodash.get';
import { fetchUserById } from '@/api/users';

export default {
  data() {
    return {
      creator: undefined,
    };
  },
  props: {
    order: Object,
  },
  async mounted() {
    this.creator = await fetchUserById(this.order.auditable.creator.id);
  },
  methods: {
    getFromCreator(path, defaultValue = '') {
      const value = get(this.creator, path, defaultValue);
      // lodash.get only applies defaultValue to undefined
      return value == null ? defaultValue : value;
    },
  },
  computed: {
    roles() {
      if (!this.creator) return;
      return this.creator.roles;
    },
    partners() {
      if (!this.creator) return;
      return this.creator.partners;
    },
    disabledUser() {
      if (!this.creator) return;
      return this.creator.disabled ? this.$t('common.YES') : this.$t('common.NO');
    },
  },
};
</script>

<style scoped lang="scss">
$fontSize: 0.8rem;
.data-detail-container {
  overflow-y: auto;
  height: 100%;
}
.overview-container {
  padding: 2rem;
  .overview-item {
    padding: 7px 10px 7px 0;
    border-bottom: 1px dashed $medium-gray;
    &:first-child {
      border-bottom: none;
    }
    &:last-child {
      border-bottom: none;
    }

    h4 {
      font-size: 0.875rem;
    }

    h6 {
      color: $gray-680;
      font-size: $fontSize;
      font-weight: 500;
    }

    p {
      font-size: $fontSize;
      margin: 0;
    }

    div {
      font-size: $fontSize;
    }
  }
}
</style>
