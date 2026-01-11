<template>
    <section id="dashboard-ecommerce">
        <b-card class="head-card">
            <b-row>
                <b-col cols="12" md="8" lg="7" class="mx-auto dashboard-nav-wrapper">
                    <b-nav small class="transaction-card">
                        <b-nav-item
                            :active="activeIem === 1"
                            @click="activeIem = 1;filterData(7)"
                            >Last 7 Days
                            </b-nav-item>
                        <b-nav-item
                            :active="activeIem === 2"
                            @click="activeIem = 2;filterData(30)"
                            >Last 30 Days
                        </b-nav-item>
                        <b-nav-item
                            :active="activeIem === 3"
                            @click="activeIem = 3;filterData(0)"
                            > All time
                        </b-nav-item>
                    </b-nav>
                </b-col>
            </b-row>
        </b-card>
        <b-row class="match-height">
            <b-col xl="4" md="6">
                <ecommerce-medal :data="statsData" />
            </b-col>
            <b-col xl="8" md="6">
                <ecommerce-statistics :data="statsData" />
            </b-col>
        </b-row>
        <b-row class="match-height">
            <b-col lg="4">
                <b-row class="match-height">
                    <!-- Backing Number -->
                    <b-col lg="6" md="3" cols="6">
                        <ecommerce-order-chart :data="statsData" />
                    </b-col>
                    <!--/ Peak Number -->
                    <b-col lg="6" md="3" cols="6">
                        <ecommerce-profit-chart :data="statsData" />
                    </b-col>
                    <!-- <b-col lg="12" md="6">
                        <ecommerce-earnings-chart :data="statsData" />
                    </b-col> -->
                </b-row>
                <b-row class="match-height mb-20">
                    <!-- Backing Number -->
                    <b-col lg="6" md="3" cols="6">
                        <EcommerceTotalBlockChainAccount v-if="statsData && statsData.blockchain" :data="statsData" />
                    </b-col>
                    <!--/ Peak Number -->
                    <b-col lg="6" md="3" cols="6">
                        <EcommerceTotalCoins :data="statsData" />
                    </b-col>
                    <!-- <b-col lg="12" md="6">
                        <ecommerce-earnings-chart :data="statsData" />
                    </b-col> -->
                </b-row>
            </b-col>

            <!-- Backings Chart -->
            <b-col lg="8">
               <div v-if="statsData.users && statsData.users.allCount && statsData.campaigns && statsData.campaigns.timeSeriesData">
                 <ecommerce-revenue-report :data="statsData" />
               </div>
            </b-col>
            <!--/ Revenue Report Card -->
        </b-row>

        <b-row class="match-height">
            <!-- Company Table Card -->
            <b-col lg="12">
                <ecommerce-company-table :table-data="statsData.campaigns.recentTransactions || []" />
            </b-col>
            <!--/ Company Table Card -->

            <!-- Developer Meetup Card -->
            <!-- <b-col
        lg="4"
        md="6"
      >
        <ecommerce-meetup :data="data.meetup" />
      </b-col> -->
            <!--/ Developer Meetup Card -->

            <!-- Browser States Card -->
            <!-- <b-col
        lg="4"
        md="6"
      >
        <ecommerce-browser-states />
      </b-col> -->
            <!--/ Browser States Card -->

            <!-- Goal Overview Card -->
            <!-- <b-col lg="4" md="6">
                <ecommerce-goal-overview :data="data.goalOverview" />
            </b-col> -->
            <!--/ Goal Overview Card -->

            <!-- Transaction Card -->
            <!-- <b-col
        lg="4"
        md="6"
      >
        <ecommerce-transactions :data="data.transactionData" />
      </b-col> -->
            <!--/ Transaction Card -->
        </b-row>
    </section>
</template>

<script>
import { BRow, BCol } from "bootstrap-vue";

import { useUtils as useI18nUtils } from '@core/libs/i18n'
import Ripple from "vue-ripple-directive";

import { getUserData } from "@/auth/utils";
import EcommerceMedal from "./EcommerceMedal.vue";
import EcommerceStatistics from "./EcommerceStatistics.vue";
import EcommerceRevenueReport from "./EcommerceRevenueReport.vue";
import EcommerceOrderChart from "./EcommerceOrderChart.vue";
import EcommerceProfitChart from "./EcommerceProfitChart.vue";
import EcommerceTotalBlockChainAccount from "./EcommerceTotalBlockChainAccount.vue";
import EcommerceTotalCoins from "./EcommerceTotalCoins.vue";
import EcommerceEarningsChart from "./EcommerceEarningsChart.vue";
import EcommerceCompanyTable from "./EcommerceCompanyTable.vue";
import EcommerceMeetup from "./EcommerceMeetup.vue";
import EcommerceBrowserStates from "./EcommerceBrowserStates.vue";
import EcommerceGoalOverview from "./EcommerceGoalOverview.vue";
import EcommerceTransactions from "./EcommerceTransactions.vue";
import Api from "./api";

export default {
    components: {
        BRow,
        BCol,

        EcommerceMedal,
        EcommerceStatistics,
        EcommerceRevenueReport,
        EcommerceOrderChart,
        EcommerceProfitChart,
        EcommerceEarningsChart,
        EcommerceCompanyTable,
        EcommerceMeetup,
        EcommerceBrowserStates,
        EcommerceGoalOverview,
        EcommerceTransactions,
        EcommerceTotalBlockChainAccount,
        EcommerceTotalCoins
    },
    directives: {
        Ripple,
    },
    data() {
        return {
            data: {},
            refreshed: false,
            activeIem:3,
            statsDaysNum: 0, // number of days to show the stats for. 7, 30, 0 or empty(all time)
            statsData:{campaigns: {}, users:{}, blockchain:{}}
        };
    },
    created() {
        // data
        this.$http.get("/ecommerce/data").then(response => {
            this.data = response.data;

            // ? Your API will return name of logged in user or you might just directly get name of logged in user
            // ? This is just for demo purpose
            const userData = getUserData() || {};
            this.data.congratulations.name = userData.displayName;
        });
    },
    mounted() {
       this.getDashBoardData()
    },
    methods: {
        getDashBoardData() {
            console.log("============>>>>getDashBoardData<<<<<<=========");
            this.getCampaigns();
            // this.getBlockchain();
            this.getUsers();
        },    
        filterData(val = 7){
            this.statsDaysNum = val;
            this.getDashBoardData();
        },
        async getCampaigns() {
              this.statsData.campaigns = {};
              
            const { data, success } = await Api.getCampaigns({
                nAgo: this.statsDaysNum
            });

            if (success && data) {
                this.statsData.campaigns = data;
            }
        },
        async getBlockchain() {
            const { data, success } = await Api.getBlockchain({
                nAgo: this.statsDaysNum
            });

            console.log("data========", data);

            if (success && data) {
                this.statsData.blockchain = data;
            }
        },
         async getUsers() {
            this.statsData.users = {};

            const { data, success } = await Api.getUsers({
                 nAgo: this.statsDaysNum
            });

            if (success && data) {
                this.statsData.users = data;
            }
        },
    },
    setup() {
        const { t } = useI18nUtils()
        return {
            t
        }
    }
};
</script>

<style lang="scss">
@import "@core/scss/vue/pages/dashboard-ecommerce.scss";
@import "@core/scss/vue/libs/chart-apex.scss";
.transaction-card .nav-item .nav-link.active {
    border-bottom: 1px solid #990099;
}

.dashboard-nav-wrapper {
    display: flex;
    align-items: center;
}

.head-card {
    .card-body{
        padding: 12px !important;
    }
}
</style>
