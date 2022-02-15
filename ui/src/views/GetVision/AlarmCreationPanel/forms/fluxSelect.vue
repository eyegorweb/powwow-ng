<template>
    <div class="mb-4" v-if="data && data.streams">
        <SectionTitle :num="4">{{ $t('getvsion.alarm-creation.fluxSelect') }}</SectionTitle>
        <div class="flux">
            <ul>
                <li>
                    <div class="radio-item">
                        <Checkbox
                            input-type="radio"
                            :value="'all'"
                            v-model="fluxSelect"
                            shape="round"
                            :filled="true"
                        >
                            Tous
                        </Checkbox>
                    </div>
                </li>
                
                <li v-for="flux in data.streams" :key="flux.id">                    
                    <div class="radio-item">
                        <Checkbox
                            input-type="radio"
                            :value="flux.label"
                            v-model="fluxSelect"
                            shape="round"
                            :filled="true"
                        >
                            {{ flux.label }}
                        </Checkbox>
                    </div>
                </li>
            </ul>
        </div>
    </div>
</template>

<script>

import SectionTitle from '@/components/SectionTitle';
import Checkbox from '@/components/ui/Checkbox';

export default {
    components: {
        SectionTitle,
        Checkbox,
    },
    props: {
        data: {
            type: Object,
        },
        selectedStream: {
            type: String,
        },
    },
    data() {
        return {
            fluxSelect: undefined,
        }
    },
    watch: {
        fluxSelect(newValue) {
            this.$emit('selectedStream', this.data.streams.find(e => e.label == newValue).id)
        }
    },
}
</script>

<style lang="scss" scoped>
    .flux {
        ul {
            padding: 0;
            margin: 0;
            li {
                list-style-type: none;
            }
        }
    }
    .radio-item {
    display: inline-block;
    position: relative;
    padding: 0 6px;
    margin: 5px 0 0;
    }

    .radio-item input[type='radio'] {
    display: none;
    }

    .radio-item label {
    color: #666;
    font-weight: normal;
    }

    .radio-item label:before {
    content: " ";
    display: inline-block;
    position: relative;
    top: 5px;
    margin: 0 5px 0 0;
    width: 20px;
    height: 20px;
    border-radius: 11px;
    border: 2px solid #009dcc;
    background-color: transparent;
    }

    .radio-item input[type=radio]:checked + label:after {
    border-radius: 11px;
    width: 12px;
    height: 12px;
    position: absolute;
    top: 9px;
    left: 10px;
    content: " ";
    display: block;
    background: #009dcc;
    }

</style>