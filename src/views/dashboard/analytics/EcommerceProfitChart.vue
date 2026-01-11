<template>
    <b-card v-if="data" class="card-tiny-line-stats"  style="padding-top: 5px; padding-bottom: 5px">
        <h6>Peak Backing amount</h6>
        <h2 class="font-weight-bolder mb-1" style="min-height: 28px">
            {{ kFormatter(data.campaigns.peakBackingAmount) || 0 }} <small>USD</small>
        </h2>
          <div style="text-align: right; opacity: 0.75">
         <img height="60"  width="60"  :src="require('@/assets/images/icons/peakvalue.png')">
       </div>
    </b-card>
</template>
<script>
import { BCard } from "bootstrap-vue";
import VueApexCharts from "vue-apexcharts";
import { useUtils as useI18nUtils } from '@core/libs/i18n'
import { $themeColors } from "@themeConfig";
import { kFormatter } from '@core/utils/filter'

const $trackBgColor = "#EBEBEB";

export default {
    components: {
        BCard,
        VueApexCharts,
    },
    props: {
        data: {
            type: Object,
            default: () => {},
        },
    },
    data() {
        return {
            period: 'last24Hours',
            amount: 0,
            chartSeries: [],
            statisticsProfit: {
                chartOptions: {
                    chart: {
                        type: "line",
                        toolbar: {
                            show: false,
                        },
                        zoom: {
                            enabled: false,
                        },
                    },
                    grid: {
                        borderColor: $trackBgColor,
                        strokeDashArray: 5,
                        xaxis: {
                            lines: {
                                show: true,
                            },
                        },
                        yaxis: {
                            lines: {
                                show: false,
                            },
                        },
                        padding: {
                            top: -30,
                            bottom: -10,
                        },
                    },
                    stroke: {
                        width: 3,
                    },
                    colors: [$themeColors.info],
                    markers: {
                        size: 2,
                        colors: $themeColors.info,
                        strokeColors: $themeColors.info,
                        strokeWidth: 2,
                        strokeOpacity: 1,
                        strokeDashArray: 0,
                        fillOpacity: 1,
                        discrete: [
                            {
                                seriesIndex: 0,
                                dataPointIndex: 5,
                                fillColor: "#ffffff",
                                strokeColor: $themeColors.info,
                                size: 5,
                            },
                        ],
                        shape: "circle",
                        radius: 2,
                        hover: {
                            size: 3,
                        },
                    },
                    xaxis: {
                        labels: {
                            show: true,
                            style: {
                                fontSize: "0px",
                            },
                        },
                        axisBorder: {
                            show: false,
                        },
                        axisTicks: {
                            show: false,
                        },
                        categories: [this.$t('last24Hours'), this.$t('last3Days'), this.$t('last7Days'), this.$t('last30Days'), this.$t('allTime')]
                    },
                    yaxis: {
                        show: false,
                    },
                    tooltip: {
                        x: {
                            show: false,
                        },
                    },
                },
            },
        };
    },

    watch:{
        data(info){
            // this.updateData();
        }
    },
    mounted() {
        //  this.$root.$on('filter-transfers', this.updateData);
    },
    methods: {
        updateData(value = 1){
            if(value == 1){
                this.amount = this.data.sales.peakAmount.last24Hours;
                this.period = 'last24Hours';
            }
            if(value == 2){
                this.amount = this.data.sales.peakAmount.last3Days;
                this.period = 'last3Days';
            }
            if(value == 3){
                this.amount = this.data.sales.peakAmount.last7Days;
                this.period = 'last7Days';
            }
            if(value == 4){
                this.amount = this.data.sales.peakAmount.last30Days;
                this.period = 'last30Days';
            }
            if(value == 5){
                this.amount = this.data.sales.peakAmount.allTime;
                this.period = 'allTime';
            }
        },
        kFormatter,
    },
    setup() {
        const { t } = useI18nUtils()
        return {
            t
        }
    }
};
</script>
