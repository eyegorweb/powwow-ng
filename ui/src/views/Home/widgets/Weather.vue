<template>
  <WidgetBloc :widget="widget" :class="'weatherWidget'">
    <div class="weatherWidget-img">
      <img src="@/assets/weather.svg" />
    </div>
    <a
      v-if="networkWeatherUrl"
      target="_blank"
      :href="networkWeatherUrl"
      class="btn btn-block btn-outline-primary"
      >{{ $t('accessTo') }} {{ $t('getparc.lineDetail.tab3.networkMeteo') }}</a
    >
  </WidgetBloc>
</template>

<script>
import WidgetBloc from './WidgetBloc';
import { getNetworkWeatherUrl } from '@/api/geographicalLocation';

export default {
  components: {
    WidgetBloc,
  },
  data() {
    return {
      widget: {
        title: 'getparc.lineDetail.tab3.networkMeteo',
        large: false,
      },
      networkWeatherUrl: undefined,
    };
  },
  async mounted() {
    this.networkWeatherUrl = await getNetworkWeatherUrl();
  },
};
</script>

<style lang="scss" scoped>
.weatherWidget {
  &-img {
    display: flex;
    justify-content: center;
    img {
      width: 100%;
      max-width: 12rem;
    }
  }
}
</style>
