<template>
    <tr>
        <td>{{row.workflowCode + ' ' + row.description}}</td>
        <td>{{yesOrNo('autoDiagnosticEnabled')}}</td>
        <td>{{yesOrNo('fleetEnabled')}}</td>
        <td  v-if="userIsBO">
            <tr>
                <td>
                    <tr>
                        <td>{{yesOrNo('geolocalisationEnabled')}}</td>
                        <td>{{row.dmdGeolocCPT}}</td>
                        <td>{{row.dmdGeolocLimit}}</td>
                    </tr>
                </td>
            </tr>
        </td>
        <td v-if="userIsBO">
            <tr>
                <td>
                    <tr> 
                        <td>{{yesOrNo('requestConsoEnabled')}}</td>
                        <td>{{row.dmdConsoCPT}}</td>
                        <td>{{row.dmdConsoLimit}}</td>
                    </tr>
                </td>
            </tr>
        </td>
        <td v-if="!userIsBO">{{yesOrNo('requestConsoEnabled')}}</td>
        <td>
            <select name="imei" v-model="imei" :selected="row.imeiEnabled">
                <option value="true">{{$t('common.YES')}}</option>
                <option value="false">{{$t('common.NO')}}</option>
            </select>
        </td>
        <td>            
            <select name="imei" v-model="reporting" :selected="row.reportAvaiPDPEnabled">
                <option value="true">{{$t('common.YES')}}</option>
                <option value="false">{{$t('common.NO')}}</option>
            </select>
        </td>
        <td>{{yesOrNo('imeiEnabled')}}</td>
    </tr>
</template>

<script>
import get from 'lodash.get';
import { mapGetters } from 'vuex';
export default {
    props: {
        row: {
            type: Object,
        },
    },
    data() {
        return {
            imei: undefined,
            reporting: undefined,
        }
    },
    computed: {
        ...mapGetters([
        'userIsBO',
        ]),
    },
    mounted () {        
        this.imei = this.row.imeiEnabled;
        this.reporting = this.row.reportAvaiPDPEnabled;
    },
    watch: {
        imei: function (val) {
            console.log('imei change ' + val + ' id : ' + this.row.workflowId);
        },
        reporting: function (val) {
            console.log('reporting change ' + val + ' id : ' + this.row.workflowId);
        },
    },
    methods: {
        yesOrNo(element) {
            return get(this.row, element) ? this.$t('common.YES') : this.$t('common.NO')
        }
    },
}
</script>

<style lang="scss" scoped>
    tr {
        > td {
            font-size: 0.9rem;
            font-weight: normal;
            padding: 10px;
            border-top: 1px solid #dee2e6;
            font-size: 1rem;
            
            tr {
                width: 100%;
                display: block;

                td {
                    width: 100%;
                    display: block;
                    border: none;

                    tr td {
                        display: inline-block;
                        width: 33%;
                        border: none;
                        text-align: center;
                    }
                } 
            }
        }
    }
</style>