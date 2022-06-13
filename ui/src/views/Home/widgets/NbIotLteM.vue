<template>
  <WidgetBloc :widget="widget" :class="'NbIotLteM'">
    <div class="NbIotLteM-img">
      <img src="@/assets/cartenblte.png" />
    </div>
    <a
      v-if="networkNbIotLteMUrl"
      target="_blank"
      :href="networkNbIotLteMUrl"
      class="btn btn-block btn-outline-primary"
      >{{ $t('home.widgets.mapAccess') }}</a
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
      networkNbIotLteMUrl: undefined,
    };
  },
  async mounted() {
    this.networkNbIotLteMUrl = await getNetworkNbIotLteMUrl();
    console.log(this.networkNbIotLteMUrl)
  },
};
</script>

<style lang="scss" scoped>
.NbIotLteM {
  &-img {
    display: flex;
    justify-content: center;
    img {
      width: 80%;
      max-width: 11rem;
      margin-bottom: 1rem;
    }
  }
}
</style>
