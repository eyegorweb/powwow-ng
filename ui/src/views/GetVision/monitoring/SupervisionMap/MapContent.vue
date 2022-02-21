<template>
  <div class="markers-container">
    <template v-if="mapOverlay && adjustPosition && markers && markers.length">
      <template v-if="usage === 'COCKPIT'">
        <CockpitMarker
          :key="m.id"
          v-for="m in markers"
          :data="m"
          :map-overlay="mapOverlay"
          :adjust-position="adjustPosition"
          :map-position="mapPosition"
          @clickVoice="() => $emit('cockpitClick', { marker: m, type: 'VOICE' })"
          @clickData="() => $emit('cockpitClick', { marker: m, type: 'DATA' })"
          @clickSms="() => $emit('cockpitClick', { marker: m, type: 'SMS' })"
          @alertClick="() => $emit('cockpitClick', { marker: m, type: 'ALERT' })"
        />
      </template>
      <template v-else-if="usage === 'ALARMS'">
        <AlarmMarker
          :key="m.id"
          v-for="m in alarmMarkersWithValues"
          :data="m"
          :map-overlay="mapOverlay"
          :adjust-position="adjustPosition"
          :map-position="mapPosition"
        />
      </template>
      <template v-else>
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
    </template>
  </div>
</template>

<script>
import SupervisionMarker from './SupervisionMarker';
import CockpitMarker from './CockpitMarker';
import AlarmMarker from './AlarmMarker';
import { isEquivalent } from '@/utils.js';
import { delay } from '@/api/utils.js';

import {
  fetchContinentData,
  fetchCountriesData,
  fetchStatesData,
  fetchFrenchRegionsData,
  fetchFrenchDepartmentsData,
  fetchDataForCells,
  fetchDataForCities,
  fetchCockpitMarkers,
} from '@/api/supervision.js';

import { filterFormatter } from '@/views/GetVision/monitoring/index.vue';

import uuid from 'uuid/v1';

const CONTINENT_ZOOM_LEVEL = 4;
const CITY_ZOOM_LEVEL = 11;
const CELL_ZOOM_LEVEL = 13;
const COUNTRY_ZOOM_LEVEL = 5;
const DEPARTMENT_ZOOM_LEVEL = 9;

const CONTINENTS_CONF = [
  { code: 'NA', label: 'North America', lat: 48.16, lng: -102.14, activeCount: 0, passiveCount: 0 },
  { code: 'SA', label: 'South America', lat: -8.75, lng: -55.46, activeCount: 0, passiveCount: 0 },
  { code: 'EU', label: 'Europe', lat: 48.92, lng: 18.1, activeCount: 0, passiveCount: 0 },
  { code: 'AF', label: 'Africa', lat: 7.0, lng: 24.2, activeCount: 0, passiveCount: 0 },
  { code: 'AS', label: 'Asia', lat: 34.01, lng: 100.61, activeCount: 0, passiveCount: 0 },
  { code: 'OC', label: 'Oceania', lat: -16.0, lng: 130.4, activeCount: 0, passiveCount: 0 },
];

const adjustPositionForContinent = (position) => {
  return {
    x: position.x - 30,
    y: position.y - 30,
  };
};

const adjustPositionForCoutries = (position) => {
  return {
    x: position.x - 20,
    y: position.y - 20,
  };
};

const adjustPositionForStates = (position) => {
  return {
    x: position.x - 20,
    y: position.y - 20,
  };
};

const defaultAdjustment = (position) => {
  return {
    x: position.x - 20,
    y: position.y - 20,
  };
};

const franceCoords = { lat: 44.343482, lng: 3.2814 };

function extractFromAdress(components, type) {
  for (let i = 0; i < components.length; i++)
    for (let j = 0; j < components[i].types.length; j++)
      if (components[i].types[j] == type) return components[i].short_name;
  return '';
}

export default {
  components: {
    SupervisionMarker,
    CockpitMarker,
    AlarmMarker,
  },
  props: {
    google: Object,
    map: Object,
    appliedFilters: Array,
    partyOptions: Object,
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
      isSameFilters: false,
      canSearch: true,
      locationType: 'CONTINENT',
      isZoomClicked: false,
    };
  },

  computed: {
    alarmMarkersWithValues() {
      if (this.markers) {
        return this.markers.filter((m) => m.data && m.data.nbAlarms > 0);
      }
      return [];
    },
    zipCodeFilter() {
      if (this.appliedFilters) {
        const zoneFilter = this.appliedFilters.find((f) => f.id === 'filters.zone');
        return this.$loGet(zoneFilter, 'data.zipCode');
      }

      return undefined;
    },
    idFilter() {
      if (this.appliedFilters) {
        const idFilter = this.appliedFilters.find((f) => f.id === 'common.identifier');
        const data = this.$loGet(idFilter, 'data');
        if (data.msisdn || data.imsi) {
          return data;
        }
      }

      return undefined;
    },
    usageForQuery() {
      if (this.usage === 'ALARMS') {
        return 'ALL';
      }

      return this.usage;
    },
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
        if (this.appliedFilters) {
          this.refreshData(true);
        }
      });
      this.google.maps.event.addListener(this.map, 'zoom_changed', () => {
        if (this.usage !== 'COCKPIT') {
          this.isZoomClicked = true;
        }
      });
    });

    if (this.usage === 'ALARMS') {
      this.refreshData();
    }
  },

  watch: {
    appliedFilters(newFilters, oldFilters) {
      const oldFormattedFilters = filterFormatter(oldFilters);
      const newFormattedFilters = filterFormatter(newFilters);
      if (oldFilters) {
        this.isSameFilters = isEquivalent(oldFormattedFilters, newFormattedFilters);
      }

      this.markers = [];
      if (this.usage !== 'COCKPIT') {
        this.isZoomClicked = false;
      }
      this.refreshData();
    },
  },

  methods: {
    setMaxZoom(maxZoom) {
      if (this.partyOptions) {
        if (this.partyOptions.optionViewCellId) {
          this.map.setOptions({ maxZoom: COUNTRY_ZOOM_LEVEL });
          return;
        }
      }

      this.map.setOptions({ maxZoom });
    },
    setZoom(zoomLevel) {
      if (this.partyOptions && this.partyOptions.optionViewCellId) {
        if (zoomLevel <= COUNTRY_ZOOM_LEVEL) {
          this.map.setZoom(zoomLevel);
        }
      } else {
        this.map.setZoom(zoomLevel);
      }
    },
    async refreshData(isDragging) {
      if (this.isLoading) return;
      if (!this.canSearch) return;

      try {
        this.isLoading = true;
        if (!this.zipCodeFilter) {
          await this.initZoom();
        }

        const countryCode = await this.getCenteredCountry();
        this.$emit('centeredCountry', countryCode);
        const zoomLevel = this.map.getZoom();

        this.setMaxZoom(CELL_ZOOM_LEVEL);
        if (this.usage === 'COCKPIT') {
          this.setMaxZoom(COUNTRY_ZOOM_LEVEL);
          await this.loadDataForM2MCockpit();
        } else if (this.zipCodeFilter) {
          await this.loadDataByZipCode();
        } else if (this.idFilter) {
          await this.loadDataById();
        } else {
          if (zoomLevel < CONTINENT_ZOOM_LEVEL) {
            await this.loadDataForContinents(isDragging);
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
        }

        this.isLoading = false;
      } catch (e) {
        console.log(e);
        this.isLoading = false;
      }
      this.isSameFilters = true;
    },

    centerOnFrance(zoomLevel) {
      if (!zoomLevel) {
        this.map.setCenter(new this.google.maps.LatLng(franceCoords.lat, franceCoords.lng));
      } else {
        this.centerZoom(franceCoords.lng, franceCoords.lat, zoomLevel);
      }
    },

    centerOnCoords(longitude, latitude) {
      // if (this.isSameFilters) return;
      const countryCoords = new this.google.maps.LatLng(latitude, longitude);
      this.map.setCenter(countryCoords);
    },

    async initZoom() {
      // if (this.isSameFilters) return;
      if (!this.appliedFilters) return;

      const zoneFilter = this.appliedFilters.find((f) => f.id === 'filters.zone');
      if (zoneFilter) {
        const zoneName = zoneFilter.data.zone.value;
        if (zoneName === 'france') {
          const franceCoords = new this.google.maps.LatLng(47.343482, 3.2814);
          this.map.setCenter(franceCoords);
          if (!this.isZoomClicked) {
            this.setZoom(6);
            this.isZoomClicked = true;
          }
        } else if (zoneName === 'world') {
          const country = zoneFilter.data.country;
          if (country) {
            const countryCoords = new this.google.maps.LatLng(country.latitude, country.longitude);
            this.map.setCenter(countryCoords);
            if (!this.isZoomClicked) {
              this.setZoom(5);
              this.isZoomClicked = true;
            }
          }
        }
      }
      return await delay(800);
    },

    formatFilters() {
      if (!this.appliedFilters) return {};
      return filterFormatter(this.appliedFilters);
    },

    formatFiltersForCockpit() {
      if (!this.appliedFilters) return {};
      return this.appliedFilters.reduce((filters, item) => {
        if (item.id === 'getadmin.users.filters.partners') {
          if (item.data) {
            filters.partyId = item.data.id;
          }
        }

        if (item.id === 'getadmin.users.filters.partnerGroup') {
          if (item.data) {
            filters.partiesDomain = item.data.value;
          }
        }

        if (item.id === 'filters.offers') {
          if (item.data) {
            filters.offerCode = item.data.id;
          }
        }

        if (item.id === 'filters.country') {
          if (item.data) {
            filters.countryCode = item.data.codeIso3;
          }
        }

        return filters;
      }, {});
    },

    async loadDataByZipCode() {
      const markers = await this.fetchDataForFrenchDepartments(true);
      this.setMarkersAndCenter(markers, DEPARTMENT_ZOOM_LEVEL);
    },

    async loadDataById() {
      const data = await fetchDataForCells(
        this.usageForQuery,
        this.getBounds(),
        this.formatFilters()
      );
      const markers = this.formatMarkers(data);
      this.adjustPosition = defaultAdjustment;

      this.setMarkersAndCenter(markers, CELL_ZOOM_LEVEL);
    },

    async setMarkersAndCenter(markers, zoomLevel, coords) {
      let longitude, latitude;

      if (coords) {
        longitude = coords.longitude;
        latitude = coords.latitude;
      }
      if (markers && markers.length) {
        if (!longitude || !latitude) {
          longitude = this.$loGet(markers[0], 'data.locationLongitude');
          latitude = this.$loGet(markers[0], 'data.locationLatitude');
        }

        if (longitude && latitude && zoomLevel) {
          this.canSearch = false;
          this.centerZoom(longitude, latitude, zoomLevel);
          this.markers = markers;
          await delay(800);
          this.canSearch = true;
        } else {
          this.markers = markers;
        }
      }
    },

    centerZoom(longitude, latitude, zoomLevel) {
      const currentZoomLevel = this.map.getZoom();
      if (currentZoomLevel !== zoomLevel && !this.isZoomClicked) {
        this.centerOnCoords(longitude, latitude);
        this.setZoom(zoomLevel);
      }
    },

    async loadDataForM2MCockpit() {
      this.adjustPosition = defaultAdjustment;

      // center to france

      const data = await fetchCockpitMarkers(this.formatFiltersForCockpit());
      const markers = data.map((d) => {
        return {
          id: uuid(),
          alertNumber: d.alertNumber,
          activeAlertNumber: d.activeAlertNumber,
          enoughValues: d.enoughValues,
          smsTrafic: d.smsTrafic,
          dataTrafic: d.dataTrafic,
          voiceTrafic: d.voiceTrafic,
          position: new this.google.maps.LatLng(
            parseFloat(d.locationLatitude),
            parseFloat(d.locationLongitude)
          ),
          data: d,
        };
      });

      this.isReady = false;

      const countryFilter = this.appliedFilters
        ? this.appliedFilters.find((f) => f.id === 'filters.country')
        : undefined;

      if (!this.markers || !this.markers.length) {
        // if (!this.isSameFilters) {
        if (countryFilter) {
          this.centerZoom(
            countryFilter.data.longitude,
            countryFilter.data.latitude,
            COUNTRY_ZOOM_LEVEL
          );
        } else {
          this.centerOnFrance(COUNTRY_ZOOM_LEVEL);
        }
        // }

        setTimeout(() => {
          this.markers = markers;
          this.isReady = true;
        }, 800);
      } else {
        this.markers = markers;
        this.isReady = true;
      }
    },

    async loadDataForCities(countryCode) {
      this.locationType = 'CITY';

      this.adjustPosition = defaultAdjustment;
      let filters = this.formatFilters();
      if (filters.iso3CountryCode) {
        delete filters.iso3CountryCode;
      }
      filters.iso2CountryCode = countryCode;
      const data = await fetchDataForCities(this.usageForQuery, this.getBounds(), filters);
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
      const data = await fetchDataForCells(this.usageForQuery, this.getBounds(), filters);
      this.markers = this.formatMarkers(data);
    },

    async loadDataForFrenchRegions() {
      this.locationType = 'REGION';

      this.adjustPosition = defaultAdjustment;
      const data = await fetchFrenchRegionsData(
        this.usageForQuery,
        this.getBounds(),
        this.formatFilters()
      );
      const markers = this.formatMarkers(data);
      // this.setMarkersAndCenter(markers, 6);
      this.markers = markers;
    },

    async fetchDataForFrenchDepartments(ignoreBounds) {
      this.locationType = 'DEPARTMENT';
      this.adjustPosition = defaultAdjustment;
      const data = await fetchFrenchDepartmentsData(
        this.usageForQuery,
        ignoreBounds ? {} : this.getBounds(),
        this.formatFilters()
      );
      return this.formatMarkers(data);
    },

    async loadDataForFrenchDepartments() {
      this.markers = await this.fetchDataForFrenchDepartments();
    },

    async loadDataForUsStates() {
      this.locationType = 'COUNTRY'; // maybe STATE ?

      this.adjustPosition = adjustPositionForStates;
      const data = await fetchStatesData(
        this.usageForQuery,
        this.getBounds(),
        this.formatFilters()
      );
      this.markers = this.formatMarkers(data);
    },

    async loadDataForContinents(isDragging) {
      if (!isDragging) {
        this.centerOnFrance();
      }

      this.locationType = 'CONTINENT';
      this.adjustPosition = adjustPositionForContinent;
      const data = await fetchContinentData(this.usageForQuery, this.formatFilters());
      this.markers = data
        .map((d) => {
          const defaultData = CONTINENTS_CONF.find((m) => m.code === d.locationCode);
          if (defaultData) {
            return {
              id: uuid(),
              ...defaultData,
              label: d.locationName,
              activeCount: d.activeCount,
              passiveCount: d.passiveCount,
              position: new this.google.maps.LatLng(defaultData.lat, defaultData.lng),
              data: d,
            };
          }
        })
        .filter((c) => !!c);
    },

    async loadDataForCountries() {
      this.locationType = 'COUNTRY';

      this.adjustPosition = adjustPositionForCoutries;
      const data = await fetchCountriesData(this.usageForQuery, this.formatFilters());
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
      return data.map((d) => {
        return {
          id: uuid(),
          activeCount: d.activeCount,
          passiveCount: d.passiveCount,
          position: new this.google.maps.LatLng(
            parseFloat(d.locationLatitude),
            parseFloat(d.locationLongitude)
          ),
          lat: parseFloat(d.locationLatitude),
          lng: parseFloat(d.locationLongitude),
          data: d,
        };
      });
    },

    async getCenteredCountry() {
      return new Promise((resolve, reject) => {
        // await delay(200);
        setTimeout(() => {
          if (this.map.getBounds()) {
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
          } else {
            reject('No bounds');
          }
        }, 200);
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
