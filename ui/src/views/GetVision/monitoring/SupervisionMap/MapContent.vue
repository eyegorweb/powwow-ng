<template>
  <div class="markers-container">
    <template v-if="mapOverlay && adjustPosition && markers && markers.length">
      <SupervisionMarker
        :key="m.id"
        v-for="m in markers"
        :data="m"
        :map-overlay="mapOverlay"
        :adjust-position="adjustPosition"
        :map-position="mapPosition"
        @activeClick="() => $emit('activeClick', { marker: m, locationType: locationType })"
        @passiveClick="() => $emit('passiveClick', { marker: m, locationType: locationType })"
      />
    </template>
  </div>
</template>

<script>
import SupervisionMarker from './SupervisionMarker';

import {
  fetchContinentData,
  fetchCountriesData,
  fetchStatesData,
  fetchFrenchRegionsData,
  fetchFrenchDepartmentsData,
  fetchDataForCells,
  fetchDataForCities,
} from '@/api/supervisionIndicators.js';

import { filterFormatter } from '@/views/GetVision/monitoring/index.vue';

import uuid from 'uuid/v1';

const CONTINENT_ZOOM_LEVEL = 4;
const CITY_ZOOM_LEVEL = 11;
const CELL_ZOOM_LEVEL = 13;

const CONTINENTS_CONF = [
  { code: 'NA', label: 'North America', lat: 48.16, lng: -102.14, activeCount: 0, passiveCount: 0 },
  { code: 'SA', label: 'South America', lat: -8.75, lng: -55.46, activeCount: 0, passiveCount: 0 },
  { code: 'EU', label: 'Europe', lat: 48.92, lng: 18.1, activeCount: 0, passiveCount: 0 },
  { code: 'AF', label: 'Africa', lat: 7.0, lng: 24.2, activeCount: 0, passiveCount: 0 },
  { code: 'AS', label: 'Asia', lat: 34.01, lng: 100.61, activeCount: 0, passiveCount: 0 },
  { code: 'OC', label: 'Oceania', lat: -16.0, lng: 130.4, activeCount: 0, passiveCount: 0 },
];

const adjustPositionForContinent = position => {
  return {
    x: position.x - 30,
    y: position.y - 30,
  };
};

const adjustPositionForCoutries = position => {
  return {
    x: position.x - 20,
    y: position.y - 20,
  };
};

const adjustPositionForStates = position => {
  return {
    x: position.x - 20,
    y: position.y - 20,
  };
};

const defaultAdjustment = position => {
  return {
    x: position.x - 20,
    y: position.y - 20,
  };
};

function extractFromAdress(components, type) {
  for (let i = 0; i < components.length; i++)
    for (let j = 0; j < components[i].types.length; j++)
      if (components[i].types[j] == type) return components[i].short_name;
  return '';
}

export default {
  components: {
    SupervisionMarker,
  },
  props: {
    google: Object,
    map: Object,
    appliedFilters: Array,
    usage: String,
    mapPosition: Object,
    loading: Boolean,
  },

  data() {
    return {
      markers: [],
      mapOverlay: undefined,
      adjustPosition: undefined,
      geocoder: undefined,
      isReady: false,

      locationType: 'CONTINENT',
    };
  },

  computed: {
    isLoading: {
      get() {
        return this.loading;
      },
      set(value) {
        this.$emit('update:loading', value);
      },
    },
  },

  mounted() {
    this.geocoder = new this.google.maps.Geocoder();
    this.google.maps.event.addListenerOnce(this.map, 'projection_changed', () => {
      this.mapOverlay = new this.google.maps.OverlayView();
      this.mapOverlay.setMap(this.map);
      this.google.maps.event.addListener(this.map, 'idle', () => {
        if (this.isReady) {
          this.refreshData();
        } else {
          this.isReady = true;
        }
      });
    });
  },

  watch: {
    appliedFilters() {
      this.refreshData();
    },
  },

  methods: {
    async refreshData() {
      if (this.isLoading) return;

      try {
        this.isLoading = true;
        this.markers = [];

        const countryCode = await this.getCenteredCountry();
        const zoomLevel = this.map.getZoom();

        if (zoomLevel < CONTINENT_ZOOM_LEVEL) {
          await this.loadDataForContinents();
        } else if (zoomLevel >= CONTINENT_ZOOM_LEVEL && zoomLevel < 6) {
          if (countryCode == 'US' && zoomLevel == 5) {
            await this.loadDataForUsStates();
          } else {
            await this.loadDataForCountries();
          }
        } else if (zoomLevel >= 6 && zoomLevel < 8) {
          if (countryCode == 'FR') {
            await this.loadDataForFrenchRegions();
          } else if (countryCode == 'US') {
            await this.loadDataForUsStates();
          } else {
            await this.loadDataForCountries();
          }
        } else if (zoomLevel >= 8 && zoomLevel < CITY_ZOOM_LEVEL) {
          if (countryCode == 'FR') {
            await this.loadDataForFrenchDepartments();
          } else if (countryCode == 'US') {
            await this.loadDataForUsStates();
          } else {
            if (zoomLevel > 8) {
              await this.loadDataForCells(countryCode);
            } else {
              await this.loadDataForCountries();
            }
          }
        } else if (zoomLevel >= CITY_ZOOM_LEVEL && zoomLevel < CELL_ZOOM_LEVEL) {
          if (countryCode == 'FR') {
            await this.loadDataForCities(countryCode);
          } else {
            await this.loadDataForCells(countryCode);
          }
        } else if (zoomLevel >= CELL_ZOOM_LEVEL) {
          await this.loadDataForCells(countryCode);
        }

        this.isLoading = false;
      } catch (e) {
        console.log(e);
        this.isLoading = false;
      }
    },

    formatFilters() {
      if (!this.appliedFilters);

      return filterFormatter(this.appliedFilters);
    },

    async loadDataForCities(countryCode) {
      this.locationType = 'CITY';

      this.adjustPosition = defaultAdjustment;
      let filters = this.formatFilters();
      if (filters.iso3CountryCode) {
        delete filters.iso3CountryCode;
      }
      filters.iso2CountryCode = countryCode;
      const data = await fetchDataForCities(this.usage, this.getBounds(), filters);
      this.markers = this.formatMarkers(data);
    },

    async loadDataForCells(countryCode) {
      this.locationType = 'CELL';

      this.adjustPosition = defaultAdjustment;
      let filters = this.formatFilters();

      if (filters.iso3CountryCode) {
        delete filters.iso3CountryCode;
      }
      filters.iso2CountryCode = countryCode;
      const data = await fetchDataForCells(this.usage, this.getBounds(), filters);
      this.markers = this.formatMarkers(data);
    },

    async loadDataForFrenchRegions() {
      this.locationType = 'REGION';

      this.adjustPosition = defaultAdjustment;
      const data = await fetchFrenchRegionsData(this.usage, this.getBounds(), this.formatFilters());
      this.markers = this.formatMarkers(data);
    },

    async loadDataForFrenchDepartments() {
      this.locationType = 'DEPARTMENT';
      this.adjustPosition = defaultAdjustment;
      const data = await fetchFrenchDepartmentsData(
        this.usage,
        this.getBounds(),
        this.formatFilters()
      );
      this.markers = this.formatMarkers(data);
    },

    async loadDataForUsStates() {
      this.locationType = 'COUNTRY'; // maybe STATE ?

      this.adjustPosition = adjustPositionForStates;
      const data = await fetchStatesData(this.usage, this.getBounds(), this.formatFilters());
      this.markers = this.formatMarkers(data);
    },

    async loadDataForContinents() {
      this.locationType = 'CONTINENT';
      this.adjustPosition = adjustPositionForContinent;
      const data = await fetchContinentData(this.usage, this.formatFilters());
      this.markers = data.map(d => {
        const defaultData = CONTINENTS_CONF.find(m => m.code === d.locationCode);
        if (defaultData) {
          return {
            id: uuid(),
            ...defaultData,
            label: d.locationNameFr,
            activeCount: d.activeCount,
            passiveCount: d.passiveCount,
            position: new this.google.maps.LatLng(defaultData.lat, defaultData.lng),
            data: d,
          };
        }
      });
    },

    async loadDataForCountries() {
      this.locationType = 'COUNTRY';

      this.adjustPosition = adjustPositionForCoutries;
      const data = await fetchCountriesData(this.usage);
      this.markers = this.formatMarkers(data);
    },

    getBounds() {
      let currentBounds = this.map.getBounds();
      let ne = currentBounds.getNorthEast();
      let sw = currentBounds.getSouthWest();
      return {
        neLat: ne.lat(),
        neLng: ne.lng(),
        swLat: sw.lat(),
        swLng: sw.lng(),
      };
    },

    formatMarkers(data) {
      return data.map(d => {
        return {
          id: uuid(),
          activeCount: d.activeCount,
          passiveCount: d.passiveCount,
          position: new this.google.maps.LatLng(
            parseFloat(d.locationLatitude),
            parseFloat(d.locationLongitude)
          ),
          data: d,
        };
      });
    },

    async getCenteredCountry() {
      return new Promise(resolve => {
        let latLng = this.map.getBounds().getCenter();
        this.geocoder.geocode(
          {
            latLng,
          },
          (results, status) => {
            let result;
            if (status == this.google.maps.GeocoderStatus.OK) {
              if (results[0]) {
                result = extractFromAdress(results[0].address_components, 'country');
              }
            }
            resolve(result);
          }
        );
      });
    },
  },
};
</script>

<style lang="scss" scoped>
.markers-container {
  position: absolute;
  left: 50%;
  top: 50%;
  width: 100%;
  transform: translate(0px, 0px);
}

.backdrop {
  background: rgba(0, 0, 0, 0.6);
  width: 100%;
  height: 100%;
}
</style>
