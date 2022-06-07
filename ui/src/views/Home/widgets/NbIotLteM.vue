<template>
  <WidgetBloc :widget="widget" :class="'NbIotLteM'">
    <div class="NbIotLteM-img">
      <img src="@/assets/cartenblte.png" />
    </div>
    <a
      v-if="NetworkNbIotLteMUrl"
      target="_blank"
      :href="NetworkNbIotLteMUrl"
      class="btn btn-block btn-outline-primary"
      >{{ $t('accessTo') }} {{ $t('home.widgets.nbiotltem') }}</a
    >
  </WidgetBloc>
</template>

<script>
import WidgetBloc from './WidgetBloc';
import { getNetworkNbIotLteMUrl } from '@/api/geographicalLocation';

export default {
  components: {
    WidgetBloc,
  },
  data() {
    return {
      widget: {
        title: 'home.widgets.nbiotltem',
        large: false,
      },
      networkWeatherUrl: undefined,
    };
  },
  async mounted() {
    this.NetworkNbIotLteMUrl = await getNetworkNbIotLteMUrl();
  },
};
</script>

<style lang="scss" scoped>
.NbIotLteM {
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
