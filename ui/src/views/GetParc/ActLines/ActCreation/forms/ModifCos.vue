<template>
  <ActFormContainer :validate-fn="onValidate" no-date disabled-notification-check>
    <h6>{{ $t('getparc.actCreation.cos.select') }}</h6>
    <UiApiAutocomplete
      v-model="selectedYorkCommunity"
      display-results-while-empty
      scroll-for-next
      :api-method="searchCommunities"
      :error="errors"
      search-type="contain"
    />

    <div slot="messages" class="text-info">
      <div v-if="exceptionError">
        <h6 class="text-danger">{{ $t('errors.all') }}</h6>
        <div class="text-danger">
          {{ exceptionError }}
        </div>
      </div>
    </div>
  </ActFormContainer>
</template>

<script>
import ActFormContainer from './parts/ActFormContainer2';
import UiApiAutocomplete from '@/components/ui/UiApiAutocomplete';
import { mapState, mapGetters } from 'vuex';
import { fetchYorkCommunity, updateYorkCommunity } from '@/api/offers';
import { formatBackErrors } from '@/utils/errors';

export default {
  components: {
    ActFormContainer,
    UiApiAutocomplete,
  },
  data() {
    return {
      selectedYorkCommunity: undefined,
      errors: undefined,
      exceptionError: undefined,
    };
  },
  computed: {
    ...mapState('actLines', ['selectedLinesForActCreation', 'actCreationPrerequisites']),
    ...mapGetters('actLines', ['appliedFilters']),
    prerequisiteCommunity() {
      return this.actCreationPrerequisites && this.actCreationPrerequisites.community
        ? this.actCreationPrerequisites.community.label
        : '';
    },
  },
  methods: {
    async searchCommunities(q, partners, params) {
      params = { limit: 10, page: 0 };
      if (this.prerequisiteCommunity) {
        params = {
          limit: 10,
          page: 0,
          notEqualsCommunityCode: this.prerequisiteCommunity,
        };
      }
      const data = await fetchYorkCommunity(q, partners, params);
      if (data) {
        return data.map((d) => ({
          id: d.code,
          label: `${d.code}`,
          data: d,
        }));
      }
    },
    async onValidate(contextValues) {
      const partnerId = this.$loGet(this.actCreationPrerequisites, 'partner.id');
      let simCardInstanceIds = [];
      if (this.selectedLinesForActCreation) {
        simCardInstanceIds = this.selectedLinesForActCreation.map((a) => a.id);
      }
      const response = updateYorkCommunity(
        partnerId,
        this.appliedFilters,
        contextValues.actDate,
        contextValues.notificationCheck,
        this.selectedYorkCommunity.label,
        simCardInstanceIds
      );

      if (response.errors && response.errors.length) {
        let errorMessage = '',
          massActionLimitError = '',
          count;
        const formatted = formatBackErrors(response.errors)
          .map((e) => e.errors)
          .flat();
        formatted.forEach((e) => {
          if (e.key === 'limit') {
            count = e.value;
          }
          if (e.key === 'error') {
            massActionLimitError = `${e.key}.${e.value}`;
          } else if (e.key === 'API_ERROR') {
            errorMessage = `${this.$t('getparc.actCreation.report.' + e.key)}`;
          } else {
            errorMessage = `${e.key}: ${e.value}`;
          }
        });
        if (massActionLimitError) {
          this.exceptionError = `${this.$t(
            'getparc.actCreation.report.errors.' + massActionLimitError,
            {
              count,
            }
          )}`;
        } else {
          this.exceptionError = errorMessage;
        }

        return {
          errors: response.errors,
          validationError: {
            validated: response.validated,
            tempDataUuid: response.tempDataUuid,
          },
        };
      }

      return response;
    },
  },
};
</script>

<style lang="scss" scoped></style>
