<template>
    <div>    
        <table>
            <thead>
                <tr>
                    <th>{{$t('col.offer')}}</th>
                    <th>{{$t('col.autodiag')}}</th>
                    <th>{{$t('col.supervision')}}</th>
                    <th v-if="userIsBO">
                        <tr class="headTitle">{{$t('col.dmdGeoloc')}}</tr>
                        <tr>
                            <td>
                                <tr>
                                    <th>{{$t('col.option')}}</th>
                                    <th>{{$t('col.cpt')}}</th>
                                    <th>{{$t('col.limit')}}</th>
                                </tr>
                            </td>
                        </tr>
                    </th>
                    <th v-if="userIsBO">
                        <tr class="headTitle">{{$t('col.requestConsoEnabled')}}</tr>
                        <tr>
                            <td>
                                <tr>
                                    <th>{{$t('col.option')}}</th>
                                    <th>{{$t('col.cpt')}}</th>
                                    <th>{{$t('col.limit')}}</th>
                                </tr>
                            </td>
                        </tr>
                    </th>
                    <th v-if="!userIsBO">{{$t('col.requestConsoEnabled')}}</th>
                    <th>IMEI</th>
                    <th>{{$t('col.reportAvaiPDPEnabled')}}</th>
                    <th>R-Card</th>
                </tr>
            </thead>
            <tbody>
                <SupervisionOptionsLine v-for="row in rows" :key="row.workflowId" :row="row"/>
            </tbody>
        </table>

        <div class="modifyButton">
            <UiButton
                variant="primary"
                block
                @click="modify()"
                >
                    {{ $t('modify') }}
            </UiButton>
        </div>

    </div>

</template>  

<script>
import PaginatedDataTable from '@/components/DataTable/PaginatedDataTable.vue';
import SupervisionOptionsLine from './SupervisionOptionsLine.vue';
import { fetchSupervisionOptions } from '@/api/supervision.js';
import UiButton from '@/components/ui/Button';
import { mapGetters } from 'vuex';

export default {
    components: {
        PaginatedDataTable,
        SupervisionOptionsLine,
        UiButton,
    },
    data() {
        return {
            defaultOrderBy: {
                key: 'id',
                direction: 'DESC',
            },
            supervisionOptions: [],
            columns: [
            ],
            rows: []
        }
    },
    props: {
        partner: {
            type: Object,
        },
    },
    computed: {
        ...mapGetters([
        'userIsBO',
        ]),
    },
    async mounted () {
        const response = await fetchSupervisionOptions(this.partner.id);
        this.rows = response;
    },
    methods: {
        modify() {
            
        }
    },
}
</script>

<style lang="scss" scoped>
    table {
        width: 100%;
        box-sizing: border-box;
        padding: 10px;
        
        thead {
            tr {

                &.headTitle {
                    border-bottom: 1px solid white;
                }
                
                th {
                    background-color: #0055a4;
                    color: white;
                    font-size: 0.9rem;
                    font-weight: normal;
                    padding: 10px;
                    text-align: center;
                }
            }
        }
        tbody {
            background-color: #fff;
        }
    }
    .modifyButton {
        margin-top: 10px;
        width: 250px;
        float: right;
    }
</style>