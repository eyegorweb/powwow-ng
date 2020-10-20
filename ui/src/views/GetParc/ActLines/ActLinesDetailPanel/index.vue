<template>
  <BaseDetailPanelContent>
    <div>
      <UpcomingChanges :content="content" />
      <GeneralInfos :content="content" />
      <AlarmsInfo :content="content" v-if="!partnerTypeMVNO" />
      <PartnerInfo :content="content" />
    </div>
    <div slot="footer" class="action-buttons">
      <div>
        <UiButton variant="import" block>{{ $t('getparc.actLines.details.EXPORT') }}</UiButton>
      </div>
      <div>
        <UiButton
          variant="primary"
          block
          @click="$router.push({ name: 'lineDetail', params: { lineId: '' + content.id } })"
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
    partnerTypeMVNO() {
      return get(this.content, 'party.partyType') === 'MVNO';
    },
  },
};
</script>

<style lang="scss" scoped></style>
