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
          @activeClick="() => $emit('activeClick', { marker: m, locationType })"
          @passiveClick="() => $emit('passiveClick', { marker: m, locationType })"
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

import { fetchCockpitMarkers, fetchGeoMapData } from '@/api/supervision.js';

import { filterFormatter } from '@/views/GetVision/monitoring/index.vue';

import uuid from 'uuid/v1';

const CONTINENT_ZOOM_LEVEL = 4;
const CITY_ZOOM_LEVEL = 11;
const CELL_ZOOM_LEVEL = 13;
const MAX_ZOOM_LEVEL = 22;
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

const franceCoords = { lat: 47.343482, lng: 3.2814 };

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
        return 'ALARM';
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
        this.refreshData(true);
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
    getMaxZoom(maxZoom) {
      const latitude = this.map.center.lat();
      const longitude = this.map.center.lng();
      const maxZoomLevel = new this.google.maps.MaxZoomService();
      maxZoomLevel.getMaxZoomAtLatLng({ lat: latitude, lng: longitude }, (result) => {
        if (result.status !== 'OK') {
          console.error('Error in MaxZoomService');
        } else {
          maxZoom = isNaN(Math.min(maxZoom, result.zoom))
            ? MAX_ZOOM_LEVEL
            : Math.min(maxZoom, result.zoom);
        }
      });
      return maxZoom;
    },
    setMaxZoom(maxZoom) {
      if ((this.partyOptions && this.partyOptions.optionViewCellId) || this.usage === 'COCKPIT') {
        this.map.setOptions({ maxZoom: COUNTRY_ZOOM_LEVEL });
        return;
      }
      if (this.usage === 'ALARMS') {
        this.map.setOptions({ maxZoom: CITY_ZOOM_LEVEL });
        return;
      }
      this.map.setOptions({ maxZoom: this.getMaxZoom(maxZoom) });
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
        if (!this.idFilter) {
          await this.initAppliedFiltersZoom(isDragging);
        }

        const countryCode = await this.getCenteredCountry();
        this.$emit('centeredCountry', countryCode);
        const zoomLevel = this.map.getZoom();
        this.setMaxZoom(MAX_ZOOM_LEVEL);
        if (this.usage === 'COCKPIT') {
          this.setMaxZoom();
          await this.loadDataForM2MCockpit();
        } else if (this.idFilter && !this.zipCodeFilter) {
          await this.loadDataById();
        } else if (this.zipCodeFilter && !this.idFilter) {
          this.locationType = 'DEPARTMENT';
          await this.loadDataByZipCode(isDragging, this.locationType);
        } else if (this.idFilter && this.zipCodeFilter) {
          await this.loadDataById();
        } else {
          if (zoomLevel < CONTINENT_ZOOM_LEVEL) {
            this.locationType = 'CONTINENT';
            await this.loadDataForContinents(isDragging, this.locationType);
          } else if (zoomLevel >= CONTINENT_ZOOM_LEVEL && zoomLevel < 6) {
            if (countryCode == 'US' && zoomLevel == 5) {
              this.locationType = 'COUNTRY';
              await this.loadDataForUsStates(this.locationType);
            } else {
              this.locationType = 'COUNTRY';
              await this.loadDataForCountries(this.locationType);
            }
          } else if (zoomLevel >= 6 && zoomLevel < 8) {
            let zoneFilter = undefined;
            if (this.appliedFilters) {
              zoneFilter = this.appliedFilters.find((f) => f.id === 'filters.zone');
            }
            let zoneName;
            if (zoneFilter) {
              zoneName = zoneFilter.data.zone.value;
            }
            if (countryCode == 'FR' || (!countryCode && zoneName === 'france')) {
              this.locationType = 'REGION';
              await this.loadDataForFrenchRegions(this.locationType);
            } else if (countryCode == 'US') {
              this.locationType = 'STATES';
              await this.loadDataForUsStates(this.locationType);
            } else {
              this.locationType = 'COUNTRY';
              await this.loadDataForCountries(this.locationType);
            }
          } else if (zoomLevel >= 8 && zoomLevel < CITY_ZOOM_LEVEL) {
            if (countryCode == 'FR') {
              this.locationType = 'DEPARTMENT';
              await this.loadDataForFrenchDepartments(this.locationType);
            } else if (countryCode == 'US') {
              this.locationType = 'STATES';
              await this.loadDataForUsStates(this.locationType);
            } else {
              if (zoomLevel > 8) {
                this.locationType = 'CELL';
                await this.loadDataForCells(countryCode, this.locationType);
              } else {
                this.locationType = 'COUNTRY';
                await this.loadDataForCountries(this.locationType);
              }
            }
          } else if (zoomLevel >= CITY_ZOOM_LEVEL && zoomLevel < CELL_ZOOM_LEVEL) {
            if (countryCode == 'FR') {
              this.locationType = 'CITY';
              await this.loadDataForCities(countryCode, this.locationType);
            } else {
              this.locationType = 'CELL';
              await this.loadDataForCells(countryCode, this.locationType);
            }
          } else if (zoomLevel >= CELL_ZOOM_LEVEL) {
            this.locationType = 'CELL';
            await this.loadDataForCells(countryCode, this.locationType);
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

    centerZoom(longitude, latitude, zoomLevel) {
      const currentZoomLevel = this.map.getZoom();
      if (currentZoomLevel !== zoomLevel && !this.isZoomClicked) {
        this.centerOnCoords(longitude, latitude);
        this.setZoom(zoomLevel);
      }
    },

    centerOnCoords(longitude, latitude) {
      // if (this.isSameFilters) return;
      const countryCoords = new this.google.maps.LatLng(latitude, longitude);
      this.map.setCenter(countryCoords);
    },

    /**
     * Zoom dit automatique => zoom déclénché par l'application de filtres
     */
    async initAppliedFiltersZoom(isDragging) {
      // if (this.isSameFilters) return;
      if (!this.appliedFilters) return;

      const zoneFilter = this.appliedFilters.find((f) => f.id === 'filters.zone');
      if (zoneFilter) {
        const zoneName = zoneFilter.data.zone.value;
        if (zoneName === 'france') {
          if (!isDragging) {
            const franceCoords = new this.google.maps.LatLng(47.343482, 3.2814);
            this.map.setCenter(franceCoords);
          } else {
            this.centerZoom(franceCoords.lng, franceCoords.lat, 6);
          }
          if (!this.zipCodeFilter && !this.isZoomClicked) {
            this.setZoom(6);
            this.isZoomClicked = true;
          }
        } else if (zoneName === 'world') {
          const country = zoneFilter.data.country;
          if (country) {
            if (!isDragging) {
              const countryCoords = new this.google.maps.LatLng(
                country.latitude,
                country.longitude
              );
              this.map.setCenter(countryCoords);
            } else {
              this.centerZoom(country.longitude, country.latitude, COUNTRY_ZOOM_LEVEL);
            }
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

    buildLocationFilters(type, country) {
      return {
        type,
        country,
      };
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

    async loadDataByZipCode(isDragging, locationType) {
      const markers = await this.fetchDataForFrenchDepartments(true, locationType);
      if (!isDragging) {
        this.setMarkersAndCenter(markers, DEPARTMENT_ZOOM_LEVEL, markers[0]);
      } else {
        this.setMarkersAndCenter(markers, DEPARTMENT_ZOOM_LEVEL);
      }
    },

    async loadDataById() {
      const data = await fetchGeoMapData(
        this.buildLocationFilters('CELL'),
        this.usageForQuery,
        {},
        this.formatFilters()
      );
      const markers = this.formatMarkers(data);
      this.adjustPosition = defaultAdjustment;
      this.setMarkersAndCenter(markers, CELL_ZOOM_LEVEL);
    },

    async setMarkersAndCenter(markers, zoomLevel, coords) {
      let longitude, latitude;

      if (coords) {
        longitude = coords.lng;
        latitude = coords.lat;
        this.centerOnCoords(longitude, latitude);
      }
      if (markers && markers.length) {
        if (!longitude || !latitude) {
          longitude = this.$loGet(markers[0], 'data.locationLongitude');
          latitude = this.$loGet(markers[0], 'data.locationLatitude');
        }

        if (longitude && latitude && zoomLevel) {
          this.canSearch = false;
          this.centerZoom(longitude, latitude, zoomLevel);
          await delay(200);
          this.canSearch = true;
        }
        this.markers = markers;
      }
    },

    async loadDataForM2MCockpit() {
      const countryFilter = this.appliedFilters
        ? this.appliedFilters.find((f) => f.id === 'filters.country')
        : undefined;

      if (!this.markers || !this.markers.length) {
        if (countryFilter) {
          const countryName = countryFilter.data.name;
          this.setZoom(6);
          let longitude, latitude;
          if (countryName === 'France') {
            longitude = 3.2814;
            latitude = 47.343482;
          } else {
            longitude = this.$loGet(countryFilter, 'data.longitude');
            latitude = this.$loGet(countryFilter, 'data.latitude');
          }
          this.centerOnCoords(longitude, latitude);
        } else {
          // center to france
          this.centerOnFrance(COUNTRY_ZOOM_LEVEL);
        }

        await delay(100);
      }

      this.adjustPosition = defaultAdjustment;

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
      this.markers = markers;
    },

    async loadDataForCities(countryCode, locationType) {
      this.adjustPosition = defaultAdjustment;
      let filters = this.formatFilters();
      if (filters.iso3CountryCode) {
        delete filters.iso3CountryCode;
      }
      filters.iso2CountryCode = countryCode;
      const data = await fetchGeoMapData(
        this.buildLocationFilters(locationType),
        this.usageForQuery,
        this.getBounds(),
        filters
      );
      this.markers = this.formatMarkers(data);
    },

    async loadDataForCells(countryCode, locationType) {
      this.adjustPosition = defaultAdjustment;
      let filters = this.formatFilters();

      if (filters.iso3CountryCode) {
        delete filters.iso3CountryCode;
      }
      filters.iso2CountryCode = countryCode;
      const data = await fetchGeoMapData(
        this.buildLocationFilters(locationType),
        this.usageForQuery,
        this.getBounds(),
        filters
      );
      this.markers = this.formatMarkers(data);
    },

    async loadDataForFrenchRegions(locationType) {
      this.adjustPosition = defaultAdjustment;
      const data = await fetchGeoMapData(
        this.buildLocationFilters(locationType, 'FRA'),
        this.usageForQuery,
        this.getBounds(),
        this.formatFilters()
      );
      this.markers = this.formatMarkers(data);
    },

    async fetchDataForFrenchDepartments(ignoreBounds, locationType) {
      this.adjustPosition = defaultAdjustment;
      const data = await fetchGeoMapData(
        this.buildLocationFilters(locationType, 'FRA'),
        this.usageForQuery,
        ignoreBounds ? {} : this.getBounds(),
        this.formatFilters()
      );
      return this.formatMarkers(data);
    },

    async loadDataForFrenchDepartments(locationType) {
      this.markers = await this.fetchDataForFrenchDepartments({}, locationType);
    },

    async loadDataForUsStates(locationType) {
      this.adjustPosition = adjustPositionForStates;
      const data = await fetchGeoMapData(
        this.buildLocationFilters(locationType, 'US'),
        this.usageForQuery,
        this.getBounds(),
        this.formatFilters()
      );
      this.markers = this.formatMarkers(data);
    },

    async loadDataForContinents(isDragging, locationType) {
      if (!isDragging) {
        this.centerOnFrance();
      }

      this.adjustPosition = adjustPositionForContinent;
      const data = await fetchGeoMapData(
        this.buildLocationFilters(locationType),
        this.usageForQuery,
        {},
        this.formatFilters()
      );
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

    async loadDataForCountries(locationType) {
      this.adjustPosition = adjustPositionForCoutries;
      const data = await fetchGeoMapData(
        this.buildLocationFilters(locationType),
        this.usageForQuery,
        {},
        this.formatFilters()
      );
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
