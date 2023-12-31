<template>
  <LoaderContainer :is-loading="isLoading">
    <div slot="on-loading">
      <ModalSkeleton :is-loading="isLoading" />
    </div>
    <BaseDetailPanelContent>
      <template v-if="lineDetails">
        <UpcomingChanges :content="lineDetails" />
        <GeneralInfos :content="lineDetails" />
        <AlarmsInfo
          :content="lineDetails"
          v-if="!partnerTypeMVNO && havePermission('alarm', 'read')"
        />
        <PartnerInfo :content="lineDetails" />
      </template>
      <div slot="footer" class="action-buttons">
        <div>
          <UiButton variant="import" block>{{ $t('getparc.actLines.details.EXPORT') }}</UiButton>
        </div>
        <div>
          <UiButton v-if="lineId" variant="primary" block @click="gotoDetail">{{
            $t('getparc.actLines.details.DETAIL')
          }}</UiButton>
          <UiButton
            v-if="lineIccid"
            variant="primary"
            block
            @click="
              $router.push({
                name: 'lineDetail.details.info',
                params: { lineIccid: '' + lineIccid, meta: content },
              })
            "
            >{{ $t('getparc.actLines.details.DETAIL') }}</UiButton
          >
        </div>
      </div>
    </BaseDetailPanelContent>
  </LoaderContainer>
</template>

<script>
import BaseDetailPanelContent from '@/components/BaseDetailPanelContent';
import UpcomingChanges from './UpcomingChanges';
import GeneralInfos from './GeneralInfos';
import AlarmsInfo from './AlarmsInfo';
import PartnerInfo from './PartnerInfo';
import UiButton from '@/components/ui/Button';
import LoaderContainer from '@/components/LoaderContainer';
import ModalSkeleton from '@/components/ui/skeletons/ModalSkeleton';
import { searchLineById, searchLineByIccid } from '@/api/linesActions';
import { mapGetters, mapState } from 'vuex';

import get from 'lodash.get';

export default {
  components: {
    BaseDetailPanelContent,
    UpcomingChanges,
    GeneralInfos,
    AlarmsInfo,
    PartnerInfo,
    UiButton,
    LoaderContainer,
    ModalSkeleton,
  },

  props: {
    content: Object,
  },

  computed: {
    ...mapState({
      panelPayload: (state) => state.ui.panelPayload,
    }),
    partnerTypeMVNO() {
      return get(this.content, 'party.partyType') === 'MVNO';
    },
    ...mapGetters(['havePermission']),
  },

  data() {
    return {
      lineDetails: undefined,
      lineId: undefined,
      lineIccid: undefined,
      isLoading: false,
    };
  },
  methods: {
    gotoDetail() {
      this.$router
        .push({
          name: 'lineDetail.details.info',
          params: { lineId: `${this.lineId}`, meta: this.content },
        })
        .catch(() => {});
    },
  },

  async mounted() {
    this.isLoading = true;
    if (this.panelPayload && this.panelPayload.searchByIccid) {
      this.lineIccid = this.content.meta.iccid;
      this.lineDetails = await searchLineByIccid(this.lineIccid, [
        {
          id: 'filters.iccid',
          value: '' + this.lineIccid,
        },
      ]);
    } else {
      this.lineId = this.content.id;
      this.lineDetails = await searchLineById(this.lineId);
    }
    this.isLoading = false;
  },

  watch: {
    async content(data) {
      this.isLoading = true;
      if (data && data.searchByIccid) {
        this.lineIccid = data.meta.iccid;
        this.lineDetails = await searchLineByIccid(this.lineIccid, [
          {
            id: 'filters.iccid',
            value: '' + this.lineIccid,
          },
        ]);
      } else {
        this.lineId = data.id;
        this.lineDetails = await searchLineById(this.lineId);
      }
      this.isLoading = false;
    },
  },
};
</script>

<style lang="scss" scoped></style>
