<template>
  <div class="bottom-space">
    <h4 class="text-primary text-uppercase">
      {{ $t('getparc.lineDetail.tab3.testRequestsHistory') }}
    </h4>
    <LoaderContainer :is-loading="isLoading" loading-key="loading">
      <div slot="on-loading">
        <Skeleton />
      </div>
      <div class="row">
        <div class="col-5">
          <div class="bg-white p-2">
            <SimpleMap :markers="markers" draggable />
          </div>
        </div>
        <div class="col-7">
          <div v-if="items && !items.length" class="alert alert-light" role="alert">
            {{ $t('noResult') }}
          </div>
          <table v-else class="table table-blue mt-1">
            <thead>
              <tr>
                <th>{{ $t('getparc.lineDetail.tab3.localisation.requestDate') }}</th>
                <th>{{ $t('getparc.lineDetail.tab3.localisation.requestStatus') }}</th>
              </tr>
            </thead>
            <tbody>
              <tr
                class="line"
                :class="{ active: item === selectedItem }"
                v-for="item in items"
                :key="item.unitAction.id"
                @click="() => toggleItem(item)"
              >
                <td>{{ item.unitAction.statusDate }}</td>
                <td>
                  <StatusWithLocation :act="item" />
                </td>
              </tr>
            </tbody>
          </table>

          <div class="row">
            <div class="col-2"></div>
            <div class="col-10">
              <div class="row">
                <div class="col">
                  <button @click="refreshTable" class="btn btn-block btn-outline-primary">
                    {{ $t('getparc.lineDetail.tab3.localisation.reload') }}
                  </button>
                </div>
                <div class="col">
                  <button @click="confirmNewDemand" class="btn btn-block btn-primary">
                    {{ $t('getparc.lineDetail.tab3.localisation.addRequest') }}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </LoaderContainer>
  </div>
</template>

<script>
import SimpleMap from '@/components/GoogleMaps/SimpleMap';
import StatusWithLocation from './StatusWithLocation';
import { fetchUnitActions2 } from '@/api/unitActions';
import { mapMutations } from 'vuex';
import { createGeoLocationMassAction } from '@/api/actCreation';
import LoaderContainer from '@/components/LoaderContainer';
import Skeleton from './ContentSkeleton';

export default {
  components: {
    SimpleMap,
    StatusWithLocation,
    LoaderContainer,
    Skeleton,
  },
  props: {
    content: Object,
  },
  data() {
    return {
      items: undefined,
      selectedItem: undefined,
      markers: [],
      isLoading: true,
    };
  },

  methods: {
    ...mapMutations(['confirmAction', 'flashMessage']),

    confirmNewDemand() {
      this.confirmAction({
        message: 'getparc.lineDetail.tab3.localisation.warningMsg',
        actionFn: async () => {
          await createGeoLocationMassAction(this.content.id);
        },
        doAfterFn: () => {
          this.refreshTable();
        },
      });
    },

    async refreshTable() {
      const filters = [
        {
          id: 'filters.actionType',
          value: 'GEO_LOCATION',
        },
      ];
      if (this.content.accessPoint) {
        filters.push({
          id: 'filters.accessPointId',
          value: this.content.accessPoint.id,
        });
      }
      this.isLoading = true;
      try {
        const response = await fetchUnitActions2(
          filters,
          { page: 0, limit: 4 },
          { key: 'ID', direction: 'DESC' }
        );
        this.items = response.items;
      } catch (e) {
        console.log(e);
      }
      this.isLoading = false;
    },

    toggleItem(item) {
      this.selectedItem = item;
      if (this.selectedItem) {
        if (this.selectedItem.geoloc && this.selectedItem.geoloc !== 'null') {
          const parts = this.selectedItem.geoloc.split(',');
          const latitude = parts[0] !== 'null' ? parseFloat(parts[0]) : null;
          const longitude = parts[1] !== 'null' ? parseFloat(parts[1]) : null;
          if (latitude && longitude) {
            this.markers = [
              {
                latitude,
                longitude,
              },
            ];
          } else {
            this.markers = [];
          }
        }
      }
    },
  },
  async mounted() {
    if (this.$route.params.createPingRequest) {
      this.confirmNewDemand();
    }
    await this.refreshTable();
  },
};
</script>

<style lang="scss" scoped>
.find-line-button {
  color: $primary !important;
}

.line {
  box-sizing: border-box;
  height: 5rem;
  &:hover {
    box-sizing: border-box;
    //border: 2px solid #009dcc;
    box-shadow: inset 0px 0px 2px 3px #009dcc;
    cursor: pointer;
  }
  &.active {
    //border: 2px solid #009dcc;
    box-shadow: inset 0px 0px 2px 3px #009dcc;

    background-color: rgba(0, 157, 204, 0.13);
  }
}

.loading {
  height: 20rem;
}
</style>
