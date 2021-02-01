<template>
  <div class="map-container" :class="{ hidden: !visible }">
    <GoogleMapLoader v-if="mapConfig" :map-config="mapConfig" :css-style="cssStyle">
      <template slot-scope="{ google, map }">
        <MapContent
          :google="google"
          :map="map"
          :applied-filters="appliedFilters"
          :usage="usage"
          :loading.sync="loading"
          :party-options="partyOptions"
          @activeClick="$emit('activeClick', $event)"
          @passiveClick="$emit('passiveClick', $event)"
          @cockpitClick="$emit('cockpitClick', $event)"
          @centeredCountry="$emit('centeredCountry', $event)"
        />
      </template>
    </GoogleMapLoader>
    <LoaderBackdrop :loading="loading" />
  </div>
</template>

<script>
import GoogleMapLoader from '@/components/GoogleMaps/GoogleMapLoader.vue';
import MapContent from './MapContent';
import LoaderBackdrop from '@/components/LoaderBackdrop.vue';
import { mapGetters } from 'vuex';
import { getPartyOptions } from '@/api/partners.js';

export default {
  components: {
    GoogleMapLoader,
    MapContent,
    LoaderBackdrop,
  },

  props: {
    appliedFilters: Array,
    usage: String,
    visible: Boolean,
  },

  data() {
    return {
      loading: false,
      mapConfig: undefined,
      partyOptions: undefined,
    };
  },

  async mounted() {
    const mapConfig = {
      center: {
        lat: 30.51,
        lng: 18.52,
      },
      // mapTypeId: 'roadmap',
      zoom: 2,
      zoomControl: true,
      draggable: true,
    };

    const partyOptions = await this.getPartnerOptions();
    this.partyOptions = partyOptions;

    this.mapConfig = mapConfig;
  },

  methods: {
    async getPartnerOptions() {
      if (this.userInfos.partners && this.userInfos.partners.length) {
        return await getPartyOptions(this.userInfos.partners[0].id);
      }

      return undefined;
    },
  },

  computed: {
    ...mapGetters(['userInfos']),

    cssStyle() {
      return {
        width: '100%',
        height: '50rem',
        position: 'relative',
        overflow: 'hidden',
      };
    },
  },
};
</script>

<style lang="scss" scoped>
.map-container {
  position: relative;
  overflow: hidden;
}
</style>
