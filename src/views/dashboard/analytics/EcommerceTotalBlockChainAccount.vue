<template>
    <b-card v-if="data"  style="padding-top: 5px; padding-bottom: 5px">
        <h6># Blockchain Accounts</h6>
        <h2 class="font-weight-bolder mb-1 mt-1" style="min-height: 28px">
            {{ data.blockchain.accounts.total }}
        </h2>

       <div style="text-align: right; opacity: 0.65">
         <img height="60"  width="60"  :src="require('@/assets/images/icons/user.png')">
       </div>
    </b-card>
</template>
<script>
import { BCard } from "bootstrap-vue";
import { useUtils as useI18nUtils } from '@core/libs/i18n'
import VueApexCharts from "vue-apexcharts";
import { $themeColors } from "@themeConfig";
import { kFormatter } from '@core/utils/filter'

const $barColor = "#f3f3f3";

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
            amount: 0,
            period: 'last24Hours',
            chartSeries: [],
            statisticsOrder: {
                chartOptions: {
                    chart: {
                        type: "bar",
                        stacked: true,
                        toolbar: {
                            show: false,
                        },
                    },
                    grid: {
                        show: true,
                        padding: {
                            left: 0,
                            right: 0,
                            top: -15,
                            bottom: -15,
                        },
                    },
                    plotOptions: {
                        bar: {
                            horizontal: false,
                            columnWidth: "20%",
                            startingShape: "rounded",
                            colors: {
                                backgroundBarColors: [
                                    $barColor,
                                    $barColor,
                                    $barColor,
                                    $barColor,
                                    $barColor,
                                ],
                                backgroundBarRadius: 5,
                            },
                        },
                    },
                    legend: {
                        show: false,
                    },
                    dataLabels: {
                        enabled: false,
                    },
                    colors: [$themeColors.warning],

                    xaxis: {
                        labels: {
                            show: false,
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
    // mounted() {
    //      this.$root.$on('filter-transfers', this.updateData);
    // },
    methods: {
        updateData(value = 1){
            // if(value == 1){
            //     this.amount = this.data.outbound.transfers.amount.last24Hours;
            //     this.period = 'last24Hours';
            // }
            // if(value == 2){
            //     this.amount = this.data.outbound.transfers.amount.last3Days;
            //     this.period = 'last3Days';
            // }
            // if(value == 3){
            //     this.amount = this.data.outbound.transfers.amount.last7Days;
            //     this.period = 'last7Days';
            // }
            // if(value == 4){
            //     this.amount = this.data.outbound.transfers.amount.last30Days;
            //     this.period = 'last30Days';
            // }
            // if(value == 5){
            //     this.amount = this.data.outbound.transfers.amount.allTime;
            //     this.period = 'allTime';
            // }
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
