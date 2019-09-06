<template>
  <BaseDetailPanelContent>
    <div>
      <UpcomingChanges :content="content" />
      <GeneralInfos :content="content" />
      <AlarmsInfo :content="content" />
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
          @click="$router.push({ name: 'lineDetail', params: { lineId: content.id } })"
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
};
</script>

<style lang="scss" scoped></style>
