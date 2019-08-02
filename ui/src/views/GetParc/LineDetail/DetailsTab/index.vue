<template>
  <div class="row">
    <div class="col-md-3">
      <ul class="list-group">
        <li v-for="item in menuItems" :key="item.title" class="list-group-item">
          <a
            @click.prevent="section = item.section"
            :class="{ active: section == item.section }"
            href="#"
          >
            {{ $t(item.title) }}
            <i class="ic-Arrow-Next-Icon float-right"></i>
          </a>
        </li>
      </ul>
    </div>
    <div class="col-md-9">
      <LineInfoSection v-if="section === 'line_info'" :content="content" />
      <ActsHistory v-if="section === 'acts_history'" :content="content" />
      <LineServicesSection v-if="section === 'line_services'" :content="content" />
      <BillingSection v-if="section === 'billing'" :content="content" />
    </div>
  </div>
</template>

<script>
import LineInfoSection from './LineInfoSection';
import LineServicesSection from './LineServicesSection';
import BillingSection from './BillingSection';
import ActsHistory from './ActsHistory';

export default {
  components: {
    LineInfoSection,
    LineServicesSection,
    BillingSection,
    ActsHistory,
  },
  props: {
    content: Object,
  },
  data() {
    return {
      section: 'line_info',

      menuItems: [
        {
          section: 'line_info',
          title: 'getparc.lineDetail.tab1.lineInfo',
        },
        {
          section: 'billing',
          title: 'getparc.lineDetail.tab1.billingOffer.title',
        },
        {
          section: 'line_services',
          title: 'getparc.lineDetail.tab1.lineServices',
        },
        {
          section: 'alarm_list',
          title: 'getparc.lineDetail.tab1.alarmsList',
        },
        {
          section: 'acts_history',
          title: 'getparc.lineDetail.tab1.actsHistory',
        },
      ],
    };
  },
};
</script>

<style lang="scss" scoped>
.list-group-item {
  a {
    color: black;

    &.active {
      color: $primary;
    }
  }
}
</style>
