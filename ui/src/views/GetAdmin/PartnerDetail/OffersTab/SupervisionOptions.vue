<template>
    <PaginatedDataTable
        :columns="columns"
        :order="defaultOrderBy"
        :fetch-data-fn="getFetchFn()"
        :size="5"
    />
</template>

<script>
import PaginatedDataTable from '@/components/DataTable/PaginatedDataTable.vue';
import { fetchSupervisionOptions } from '@/api/supervision.js';
import { mapGetters } from 'vuex';
import get from 'lodash.get';

export default {
    components: {
        PaginatedDataTable,
    },
    data() {
        return {
            defaultOrderBy: {
                key: 'id',
                direction: 'DESC',
            },
            supervisionOptions: [],
            columns: [
            ]
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
    mounted () {
        if(this.userIsBO) {
            this.columns = [
                                {
                    id: 1,
                    label: this.$t('col.id'),
                    name: 'workflowId',
                    orderable: true,
                    visible: true,
                },
                {
                    id: 2,
                    label: this.$t('col.description'),
                    name: 'description',
                    orderable: true,
                    visible: true,
                },  
                {
                    id: 3,
                    label: this.$t('col.autodiag'),
                    name: 'autoDiagnosticEnabled',
                    orderable: true,
                    visible: true,
                    format: {
                        type: 'Getter',
                        getter: (row) => {
                            return get(row, 'autoDiagnosticEnabled') ? this.$t('common.YES') : this.$t('common.NO');
                        },
                    },
                },
                {
                    id: 4,
                    label: this.$t('col.supervision'),
                    name: 'fleetEnabled',
                    orderable: true,
                    visible: true,
                    format: {
                        type: 'Getter',
                        getter: (row) => {
                            return get(row, 'fleetEnabled') ? this.$t('common.YES') : this.$t('common.NO');
                        },
                    },
                },
                {
                    id: 5,
                    label: this.$t('col.geolocalisationEnabled'),
                    name: 'geolocalisationEnabled',
                    orderable: true,
                    visible: true,
                    format: {
                        type: 'Getter',
                        getter: (row) => {
                            return get(row, 'fleetEnabled') ? this.$t('common.YES') : this.$t('common.NO');
                        },
                    },
                },
                {
                    id: 6,
                    label: this.$t('col.dmdGeolocCPT'),
                    name: 'dmdGeolocCPT',
                    orderable: true,
                    visible: false,
                },
                {
                    id: 7,
                    label: this.$t('col.dmdGeolocLimit'),
                    name: 'dmdGeolocLimit',
                    orderable: true,
                    visible: false,
                },
                {
                    id: 8,
                    label: this.$t('col.requestConsoEnabled'),
                    name: 'requestConsoEnabled',
                    orderable: true,
                    visible: false,
                    format: {
                        type: 'Getter',
                        getter: (row) => {
                            return get(row, 'fleetEnabled') ? this.$t('common.YES') : this.$t('common.NO');
                        },
                    },
                },
                {
                    id: 9,
                    label: this.$t('col.dmdConsoCPT'),
                    name: 'dmdConsoCPT',
                    orderable: true,
                    visible: false,
                },
                {
                    id: 10,
                    label: this.$t('col.dmdConsoLimit'),
                    name: 'dmdConsoLimit',
                    orderable: true,
                    visible: false,
                },
                {
                    id: 11,
                    label: this.$t('col.supervision'),
                    name: 'fleetEnabled',
                    orderable: true,
                    visible: false,
                    format: {
                        type: 'Getter',
                        getter: (row) => {
                            return get(row, 'fleetEnabled') ? this.$t('common.YES') : this.$t('common.NO');
                        },
                    },
                },
                {
                    id: 12,
                    label: this.$t('col.reportAvaiPDPEnabled'),
                    name: 'reportAvaiPDPEnabled',
                    orderable: true,
                    visible: false,
                    format: {
                        type: 'Getter',
                        getter: (row) => {
                            return get(row, 'fleetEnabled') ? this.$t('common.YES') : this.$t('common.NO');
                        },
                    },
                },
                {
                    id: 13,
                    label: this.$t('col.rCard'),
                    name: 'rCard',
                    orderable: true,
                    visible: false,
                    format: {
                        type: 'Getter',
                        getter: (row) => {
                            return get(row, 'fleetEnabled') ? this.$t('common.YES') : this.$t('common.NO');
                        },
                    },
                },
            ]
        }
        else {
            this.columns = [
                {
                    id: 1,
                    label: this.$t('col.id'),
                    name: 'workflowId',
                    orderable: true,
                    visible: true,
                },
                {
                    id: 2,
                    label: this.$t('col.description'),
                    name: 'description',
                    orderable: true,
                    visible: true,
                },  
                {
                    id: 3,
                    label: this.$t('col.autodiag'),
                    name: 'autoDiagnosticEnabled',
                    orderable: true,
                    visible: true,
                    format: {
                        type: 'Getter',
                        getter: (row) => {
                            return get(row, 'autoDiagnosticEnabled') ? this.$t('common.YES') : this.$t('common.NO');
                        },
                    },
                },
                {
                    id: 4,
                    label: this.$t('col.supervision'),
                    name: 'fleetEnabled',
                    orderable: true,
                    visible: true,
                    format: {
                        type: 'Getter',
                        getter: (row) => {
                            return get(row, 'fleetEnabled') ? this.$t('common.YES') : this.$t('common.NO');
                        },
                    },
                },
                {
                    id: 5,
                    label: this.$t('col.localisation'),
                    name: 'geolocalisationEnabled',
                    orderable: true,
                    visible: true,
                    format: {
                        type: 'Getter',
                        getter: (row) => {
                            return get(row, 'geolocalisationEnabled') ? this.$t('common.YES') : this.$t('common.NO');
                        },
                    },
                },
                {
                    id: 6,
                    label: this.$t('col.consoEnabled'),
                    name: 'requestConsoEnabled',
                    orderable: true,
                    visible: false,
                    format: {
                        type: 'Getter',
                        getter: (row) => {
                            return get(row, 'requestConsoEnabled') ? this.$t('common.YES') : this.$t('common.NO');
                        },
                    },
                },
                {
                    id: 7,
                    label: this.$t('col.imei'),
                    name: 'imeiEnabled',
                    orderable: true,
                    visible: false,
                    format: {
                        type: 'Getter',
                        getter: (row) => {
                            return get(row, 'imeiEnabled') ? this.$t('common.YES') : this.$t('common.NO');
                        },
                    },
                },
            ]
        }
    },
    methods: {
        getFetchFn() {
        return async () => {
            const response = await fetchSupervisionOptions(this.partner.id);
            console.log(response);
            return {
            rows: response,
            total: response.length,
            };
        };
        },
    },
}
</script>

<style>

</style>