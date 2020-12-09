<template>
  <BaseDetailPanelContent>
    <div v-if="lineDetails">
      <UpcomingChanges :content="lineDetails" />
      <GeneralInfos :content="lineDetails" />
      <AlarmsInfo :content="lineDetails" v-if="!partnerTypeMVNO" />
      <PartnerInfo :content="lineDetails" />
    </div>
    <div slot="footer" class="action-buttons">
      <div>
        <UiButton variant="import" block>{{ $t('getparc.actLines.details.EXPORT') }}</UiButton>
      </div>
      <div>
        <UiButton
          v-if="lineId"
          variant="primary"
          block
          @click="
            $router.push({
              name: 'lineDetail',
              params: { lineId: '' + lineId, meta: content },
            })
          "
          >{{ $t('getparc.actLines.details.DETAIL') }}</UiButton
        >
        <UiButton
          v-if="lineIccid"
          variant="primary"
          block
          @click="
            $router.push({
              name: 'lineDetail',
              params: { lineIccid: '' + lineIccid, meta: content },
            })
          "
          >{{ $t('getparc.actLines.details.DETAIL') }}</UiButton
        >
      </div>
    </div>
  </BaseDetailPanelContent>
</template>

<script>
import BaseDetailPanelContent from '@/components/BaseDetailPanelContent';
import UpcomingChanges from './UpcomingChanges';
import GeneralInfos from './GeneralInfos';
import AlarmsInfo from './AlarmsInfo';
import PartnerInfo from './PartnerInfo';
import UiButton from '@/components/ui/Button';
import { searchLineById, searchLineByIccid } from '@/api/linesActions';
import { mapState } from 'vuex';

import get from 'lodash.get';

export default {
  components: {
    BaseDetailPanelContent,
    UpcomingChanges,
    GeneralInfos,
    AlarmsInfo,
    PartnerInfo,
    UiButton,
  },

  props: {
    content: Object,
  },

  computed: {
    ...mapState({
      panelPayload: state => state.ui.panelPayload,
    }),
    partnerTypeMVNO() {
      return get(this.content, 'party.partyType') === 'MVNO';
    },
  },

  data() {
    return {
      lineDetails: undefined,
      lineId: undefined,
      lineIccid: undefined,
    };
  },

  async mounted() {
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
  },

  watch: {
    async content(data) {
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
    },
  },
};
</script>

<style lang="scss" scoped></style>
