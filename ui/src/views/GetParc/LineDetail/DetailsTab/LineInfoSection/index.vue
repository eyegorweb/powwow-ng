<template>
  <div>
    <draggable handle=".handle">
      <transition-group>
        <ContentBlock :key="'block1'">
          <template slot="title">
            Informations sur la ligne
          </template>
          <template slot="content">
            <div class="d-flex">
              <div class="item">
                <h6>MSISDN:</h6>
                <p>
                  33761456934
                </p>
              </div>
              <div class="item">
                <h6>{{ $t('getparc.lineDetail.lineStatus') }}:</h6>
                <p>
                  Activé depuis le 15/11/2018 à 23:45:34
                </p>
              </div>
              <div class="item">
                <h6>{{ $t('getparc.lineDetail.tab1.preactivatedAt') }}:</h6>
                <p>
                  15/11/2016
                </p>
              </div>
              <div class="item">
                <h6>{{ $t('getparc.lineDetail.tab1.activatedAt') }}:</h6>
                <p>
                  13/11/2016
                </p>
              </div>
              <div class="item">
                <h6>{{ $t('col.partner') }}:</h6>
                <p>
                  ENEDIS-LINKY-PROD
                </p>
              </div>
            </div>
          </template>
        </ContentBlock>
        <ContentBlock :key="'block2'">
          <template slot="title">
            CARTE SIM
          </template>
          <template slot="content">
            <div class="row">
              <div class="col-md-1">
                <div class="simtype__item">
                  <img src="@/assets/simtype.png" />
                </div>
              </div>
              <div class="col-md-11">
                <div class="d-flex">
                  <div class="item">
                    <h6>{{ $t('filters.lines.typeSIMCard') }}:</h6>
                    <p>
                      SIM M2M Endurcie 024 (bobine de 3000)
                    </p>
                  </div>
                  <div class="item">
                    <h6>{{ $t('getsim.sim-type-labels.format') }}:</h6>
                    <p>
                      Standard, avec code PIN, avec antivol
                    </p>
                  </div>
                  <div class="item">
                    <h6>{{ $t('getsim.sim-type-labels.patent') }}:</h6>
                    <p>
                      Backup FR + Best network
                    </p>
                  </div>
                </div>
                <div class="d-flex">
                  <div class="item">
                    <h6>{{ $t('orders.detail.orderId') }}:</h6>
                    <p>
                      #5009
                    </p>
                  </div>
                  <div class="item">
                    <h6>ICCID:</h6>
                    <p>
                      #5009
                    </p>
                  </div>
                  <div class="item">
                    <h6>{{ $t('getparc.lineDetail.tab1.pinCode') }}1:</h6>
                    <p>
                      1234
                    </p>
                  </div>
                  <div class="item">
                    <h6>{{ $t('getparc.lineDetail.tab1.pinCode') }}2:</h6>
                    <p>
                      1234
                    </p>
                  </div>
                  <div class="item">
                    <h6>{{ $t('getparc.lineDetail.tab1.pukCode') }}1:</h6>
                    <p>
                      62136465
                    </p>
                  </div>
                  <div class="item">
                    <h6>{{ $t('getparc.lineDetail.tab1.pukCode') }}2:</h6>
                    <p>
                      79841758
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </template>
        </ContentBlock>
        <ContentBlock :key="'block3'">
          <template slot="title">
            {{ $t('getparc.lineDetail.tab1.dualSim') }}
          </template>
          <template slot="content">
            <div class="d-flex">
              <div class="item">
                <h6>{{ $t('secondary', { item: 'ICCID' }) }}:</h6>
                <p>
                  8933222889911003512
                </p>
              </div>
              <div class="item">
                <h6>{{ $t('secondary', { item: 'IMSI' }) }}:</h6>
                <p>
                  209220990842322
                </p>
              </div>
              <div class="item">
                <h6>{{ $t('secondary', { item: 'MSISDN' }) }}:</h6>
                <p>
                  337615673320
                </p>
              </div>
            </div>
          </template>
        </ContentBlock>
        <ContentBlock :key="'block4'">
          <template slot="title">
            {{ $t('getparc.lineDetail.tab1.msisdnHistory') }}
          </template>
          <template slot="content">
            <MSISDNHistoryTable />
          </template>
        </ContentBlock>
        <ContentBlock :key="'block5'">
          <template slot="title">
            {{ $t('getparc.lineDetail.tab1.equipmentsHistory') }}
          </template>
          <template slot="content">
            <EquipmentsHistoryTable />
          </template>
        </ContentBlock>
        <ContentBlock :key="'block6'">
          <template slot="title">
            {{ $t('common.customFields') }}
          </template>
          <template slot="content">
            <div class="d-flex">
              <div class="item">
                <h6>{{ $t('col.customFields', { num: 1 }) }}:</h6>
                <p>
                  62136465
                </p>
              </div>
              <div class="item">
                <h6>{{ $t('col.customFields', { num: 2 }) }}:</h6>
                <p>
                  62136465
                </p>
              </div>
              <div class="item">
                <h6>{{ $t('col.customFields', { num: 3 }) }}:</h6>
                <p>
                  62136465
                </p>
              </div>
              <div class="item">
                <h6>{{ $t('col.customFields', { num: 4 }) }}:</h6>
                <p>
                  62136465
                </p>
              </div>
              <div class="item">
                <h6>{{ $t('col.customFields', { num: 5 }) }}:</h6>
                <p>
                  62136465
                </p>
              </div>
              <div class="item">
                <h6>{{ $t('col.customFields', { num: 6 }) }}:</h6>
                <p>
                  62136465
                </p>
              </div>
            </div>
          </template>
        </ContentBlock>
      </transition-group>
    </draggable>
  </div>
</template>

<script>
import ContentBlock from '@/views/GetParc/LineDetail/ContentBlock';
import MSISDNHistoryTable from './MSISDNHistoryTable';
import EquipmentsHistoryTable from './EquipmentsHistoryTable';
import draggable from 'vuedraggable';

export default {
  components: {
    draggable,
    ContentBlock,
    MSISDNHistoryTable,
    EquipmentsHistoryTable,
  },
};
</script>

<style lang="scss" scoped></style>
