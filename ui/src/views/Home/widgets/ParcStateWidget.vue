<template>
  <WidgetBloc :widget="widget" @seeMore="onSeeMore" mocked>
    <div slot="header">
      <div class="d-flex">
        <UiSelect
          v-if="canSelectPartner"
          class="text-gray"
          v-model="selectedPartner"
          :placeholder="$t('getparc.actCreation.ManageCancellation.choose')"
          :options="partners"
          small
        ></UiSelect>
      </div>
    </div>
    <table class="table  table-sm mock-value">
      <thead>
        <tr>
          <th scope="col">{{ $t('status') }}</th>
          <th scope="col">{{ $t('home.widgets.stateParc.currentMonth') }}</th>
          <th scope="col">{{ $t('home.widgets.stateParc.prevMonth') }}</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td>{{ $t('home.widgets.stateParc.stockLines') }}</td>
          <td>
            <span>
              <a href="#" @click.prevent="onClick">
                7
              </a>
            </span>
          </td>
          <td>7</td>
        </tr>
        <tr>
          <td>{{ $t('home.widgets.stateParc.preactivatedLines') }}</td>
          <td>
            <span>
              <a href="#" @click.prevent="onClick">
                6
              </a>
            </span>
          </td>
          <td>9</td>
        </tr>
        <tr>
          <td>{{ $t('home.widgets.stateParc.activatedLines') }}</td>
          <td><span>
              <a href="#" @click.prevent="onClick">
                345
              </a>
            </span></td>
          <td>342</td>
        </tr>
        <tr>
          <td>{{ $t('home.widgets.stateParc.suspendedLines') }}</td>
          <td>
            <span>
              <a href="#" @click.prevent="onClick">
                4
              </a>
            </span>
          </td>
          <td>4</td>
        </tr>
        <tr>
          <td>{{ $t('home.widgets.stateParc.cancellationLines') }}</td>
          <td>
            <span>
              <a href="#" @click.prevent="onClick">
                2
              </a>
            </span>
          </td>
          <td>2</td>
        </tr>
        <tr>
          <td>{{ $t('home.widgets.stateParc.suspendedAndNotBilledLines') }}</td>
          <td>
            <span>
              <a href="#" @click.prevent="onClick">
                0
              </a>
            </span>
          </td>
          <td>0</td>
        </tr>
      </tbody>
    </table>
  </WidgetBloc>
</template>

<script>
import WidgetBloc from './WidgetBloc';
import UiSelect from '@/components/ui/UiSelect';
import { mapGetters } from 'vuex';

export default {
  components: {
    WidgetBloc,
    UiSelect,
  },
  props: {
    widget: Object,
    contextFilters: Array,
  },
  data() {
    return {
      selectedPartner: undefined,
      partners: ['auchan', 'ingenico', 'carrefour'],
      filters: [
        {
          id: 'filters.actStatus',
          values: [
            {
              id: 'IN_PROGRESS',
              label: 'En cours',
            },
          ],
        },
      ],
    };
  },
  methods: {
    onClick() {
      this.$router.push({
        name: 'actLines',
        params: {
          queryFilters: this.filters,
        },
      });
    },
    onSeeMore() {
      this.$router.push({
        name: 'exemples',
        params: {
          queryFilters: [],
        },
      });
    },
  },
  computed: {
    ...mapGetters(['userIsPartner']),
    canSelectPartner() {
      return this.partners && this.partners.length > 0 && !this.userIsPartner;
    },
  },
  watch: {
    selectedPartner(newValue) {
      console.log('select new partner', newValue);
    },
  },
};
</script>

<style lang="scss" scoped>
.table {
  font-size: 0.8rem;
  thead th {
    border-top: none;
    color: $gray-680;
    text-transform: uppercase;
    font-weight: normal;
  }
}
</style>
