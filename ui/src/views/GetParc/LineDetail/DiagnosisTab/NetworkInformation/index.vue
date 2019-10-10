<template>
  <div>
    <ContentBlock :key="'block1'">
      <template slot="title">
        {{ $t('getparc.lineDetail.tab2.networkInfoContent.dataControl') }}
      </template>
      <template slot="content">
        <div v-if="networkInformation" class="d-flex">
          <div class="item">
            <h6>{{ $t('getparc.lineDetail.tab2.networkInfoContent.gaugeConsumtion') }}:</h6>
            <!-- <p v-if="dataConsumtionAmount">{{ dataConsumtionAmount }}</p> -->
            <p>{{ dataConsumtionAmount }}</p>
          </div>
          <div class="item">
            <h6>{{ $t('getparc.lineDetail.tab2.networkInfoContent.stateStopService') }}:</h6>
            <p>{{ barringStatus }}</p>
          </div>
          <div class="item">
            <h6>{{ $t('getparc.lineDetail.tab2.networkInfoContent.tresholdStopService') }}:</h6>
            <p>{{ barringTreshhold }}</p>
          </div>
          <div class="item">
            <h6>{{ $t('getparc.lineDetail.tab2.networkInfoContent.tmpDebarring') }}:</h6>
            <p>{{ temporaryBarring }}</p>
          </div>
        </div>
        <div class="">
          <button @click="validate" class="btn btn-primary pl-4 pr-4 pt-2 pb-2">
            <span>{{
              $t('getparc.lineDetail.tab2.networkInfoContent.activationEndingStopService')
            }}</span>
          </button>
        </div>
      </template>
    </ContentBlock>
  </div>
</template>

<script>
import ContentBlock from '@/views/GetParc/LineDetail/ContentBlock';
import { unthrottleLine } from '@/api/linesActions';
import { mapMutations } from 'vuex';
import { networkInformationForLine } from '@/api/consumption';
import { formatBytes } from '@/api/utils';

export default {
  components: {
    ContentBlock,
  },

  props: {
    content: Object,
  },

  data() {
    return {
      successMessage: this.$t('getparc.actCreation.sendSMS.successMessage'),
      networkInformation: undefined,
    };
  },

  async mounted() {
    this.networkInformation = await networkInformationForLine(
      this.content.accessPoint.lines[0].msisdn
    );
  },

  methods: {
    ...mapMutations(['flashMessage']),
    async validate() {
      const response = await unthrottleLine(this.content.accessPoint.id);

      if (!response) {
        this.flashMessage({ level: 'danger', message: 'Erreur inconnue' });
      }

      if (response) {
        if (response.needDoubleConfirmation) return;
        if (response.errors) {
          response.errors.forEach(e => {
            this.flashMessage({ level: 'danger', message: e.message });
          });
        } else {
          const successMessage = this.successMessage
            ? this.$t(this.successMessage)
            : 'Opération effectuée avec succès';
          this.flashMessage({ level: 'success', message: successMessage });
        }
      }
    },
  },

  computed: {
    barringStatus() {
      return this.networkInformation.barringStatus ? this.$t('common.YES') : this.$t('common.NO');
    },
    barringTreshhold() {
      return formatBytes(this.networkInformation.barringTreshhold);
    },
    dataConsumtionAmount() {
      return formatBytes(this.networkInformation.dataConsumtionAmount);
    },
    temporaryBarring() {
      return this.networkInformation.temporaryBarring
        ? this.$t('common.YES')
        : this.$t('common.NO');
    },
  },
};
</script>

<style lang="scss" scoped></style>
