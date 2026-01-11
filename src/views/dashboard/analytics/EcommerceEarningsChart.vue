<template>
    <b-card v-if="data" class="earnings-card">
        <b-row>
            <b-col cols="6">
                <b-card-title class="mb-1"> {{ t('outboundTransactions') }} </b-card-title>
                <div class="font-small-2">{{ t(period) }}</div>
                <h5 class="mb-1">
                    {{ data.accounts.currencyCode }}
                    {{ kFormatter(amount) }}
                </h5>
                <!-- <b-card-text class="text-muted font-small-2">
          <span class="font-weight-bolder">68.2%</span><span> more volumes than last month.</span>
        </b-card-text> -->
            </b-col>
            <b-col cols="6">
                <!-- chart -->
                <vue-apex-charts
                    height="120"
                    :options="earningsChart.chartOptions"
                    :series="chartSeries"
                    v-if="arrayTotal > 0"
                />
            </b-col>
        </b-row>
    </b-card>
</template>

<script>
import { BCard, BRow, BCol, BCardTitle, BCardText } from "bootstrap-vue";
import { useUtils as useI18nUtils } from '@core/libs/i18n'
import VueApexCharts from "vue-apexcharts";
import { $themeColors } from "@themeConfig";
import { kFormatter } from '@core/utils/filter'

const $earningsStrokeColor2 = "#28c76f66";
const $earningsStrokeColor3 = "#28c76f33";
export default {
    components: {
        BCard,
        BRow,
        BCol,
        BCardTitle,
        BCardText,
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
            arrayTotal: 0,
            earningsChart: {
                chartOptions: {
                    chart: {
                        type: "donut",
                        toolbar: {
                            show: false,
                        },
                    },
                    dataLabels: {
                        enabled: false,
                    },
                    legend: { show: false },
                    comparedResult: [2, -3, 8],
                    labels: ["Amount", "Transfers", "Refunds"],
                    stroke: { width: 1 },
                    colors: [
                        $earningsStrokeColor2,
                        $earningsStrokeColor3,
                        $themeColors.success,
                    ],
                    grid: {
                        padding: {
                            right: -20,
                            bottom: -8,
                            left: -20,
                        },
                    },
                    plotOptions: {
                        pie: {
                            startAngle: -10,
                            donut: {
                                labels: {
                                    show: false,
                                    name: {
                                        offsetY: 15,
                                    },
                                    value: {
                                        offsetY: -15,
                                        formatter(val) {
                                            // eslint-disable-next-line radix
                                            return `${parseInt(val)}%`;
                                        },
                                    },
                                    total: {
                                        show: true,
                                        offsetY: 15,
                                        label: "Amount",
                                        formatter(val) {
                                            return val ? val : 0;
                                        },
                                    },
                                },
                            },
                        },
                    },
                    responsive: [
                        {
                            breakpoint: 1325,
                            options: {
                                chart: {
                                    height: 100,
                                },
                            },
                        },
                        {
                            breakpoint: 1200,
                            options: {
                                chart: {
                                    height: 120,
                                },
                            },
                        },
                        {
                            breakpoint: 1045,
                            options: {
                                chart: {
                                    height: 100,
                                },
                            },
                        },
                        {
                            breakpoint: 992,
                            options: {
                                chart: {
                                    height: 120,
                                },
                            },
                        },
                    ],
                },
            },
        };
    },
     watch:{
        data(info){
            this.updateData();
        }
    },
    created() {
        this.chartSeries = [this.data.outbound.amount.allTime || 0, this.data.outbound.transfers.amount.allTime || 0, this.data.outbound.refunds.allTime || 0]
        // this.displayAmount()
    },
    mounted() {
        this.$root.$on('filter-transfers', this.updateData);
        this.displayAmount()
    },
    methods: {
        updateData(value = 1){
            if(value == 1){
                this.amount = this.data.outbound.amount.last24Hours;
                this.period = 'last24Hours';
            }
            if(value == 2){
                this.amount = this.data.outbound.amount.last3Days;
                this.period = 'last3Days';
            }
            if(value == 3){
                this.amount = this.data.outbound.amount.last7Days;
                this.period = 'last7Days';
            }
            if(value == 4){
                this.amount = this.data.outbound.amount.last30Days;
                this.period = 'last30Days';
            }
            if(value == 5){
                this.amount = this.data.outbound.amount.allTime;
                this.period = 'allTime';
            }
        },
        kFormatter,
      displayAmount() {
        this.arrayTotal = this.data.outbound.amount.allTime + this.data.outbound.transfers.amount.allTime + this.data.outbound.refunds.allTime;

      }
    },
    setup() {
        const { t } = useI18nUtils()
        return {
            t
        }
    }
};
</script>
