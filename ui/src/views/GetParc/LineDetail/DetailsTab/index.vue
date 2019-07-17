<template>
  <div class="row">
    <div class="col-md-3">
      <ul class="list-group">
        <li class="list-group-item">
          <a @click.prevent="section = 'line_info'" href="#">
            {{ $t('getparc.lineDetail.tab1.lineInfo') }}
            <i class="ic-Arrow-Next-Icon float-right"></i>
          </a>
        </li>
        <li class="list-group-item">
          <a href="#">
            {{ $t('getparc.lineDetail.tab1.billingOffer') }}
            <i class="ic-Arrow-Next-Icon float-right"></i>
          </a>
        </li>
        <li class="list-group-item">
          <a @click.prevent="section = 'line_services'" href="#">
            {{ $t('getparc.lineDetail.tab1.lineServices') }}
            <i class="ic-Arrow-Next-Icon float-right"></i>
          </a>
        </li>
        <li class="list-group-item">
          <a href="#">
            {{ $t('getparc.lineDetail.tab1.alarmsList') }}
            <i class="ic-Arrow-Next-Icon float-right"></i>
          </a>
        </li>
        <li class="list-group-item">
          <a @click.prevent="section = 'acts_history'" href="#">
            {{ $t('getparc.lineDetail.tab1.actsHistory') }}
            <i class="ic-Arrow-Next-Icon float-right"></i>
          </a>
        </li>
      </ul>
    </div>
    <div class="col-md-9">
      <LineInfoSection v-if="section === 'line_info'" :content="content" />
      <ActsHistory v-if="section === 'acts_history'" :content="content" />
      <LineServicesSection v-if="section === 'line_services'" :content="content" />
    </div>
  </div>
</template>

<script>
import LineInfoSection from './LineInfoSection';
import LineServicesSection from './LineServicesSection';
import ActsHistory from './ActsHistory';

export default {
  components: {
    LineInfoSection,
    LineServicesSection,
    ActsHistory,
  },
  props: {
    content: Object,
  },
  data() {
    return {
      section: 'line_info',
    };
  },
};
</script>

<style lang="scss" scoped></style>
