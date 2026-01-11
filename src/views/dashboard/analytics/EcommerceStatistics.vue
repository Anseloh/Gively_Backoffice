<template>
    <b-card v-if="data" no-body class="card-statistics">
        <b-card-header>
            <b-card-title>{{ t('statistics') }}</b-card-title>
            <b-card-text class="font-small-2 mr-25 mb-0">
                <!-- {{ t('updatedToday') }} -->
            </b-card-text>
        </b-card-header>
        <b-card-body class="statistics-body">
            <!-- Volume -->
            <b-row>
                <b-col xl="3" sm="6" class="mb-2 mb-xl-0">
                    <b-media no-body>
                        <b-media-aside class="mr-2">
                            <b-avatar size="48" variant="light-primary">
                                <feather-icon size="24" icon="BoxIcon" />
                            </b-avatar>
                        </b-media-aside>
                        <b-media-body class="my-auto">
                            <h4 class="font-weight-bolder mb-0">
                                {{ kFormatter(data.campaigns.totalCount) }}
                            </h4>
                            <b-card-text class="font-small-3 mb-0">
                                Total Campaigns
                            </b-card-text>
                        </b-media-body>
                    </b-media>
                </b-col>

                <!-- Customers -->
                <b-col xl="3" sm="6" class="mb-2 mb-xl-0">
                    <b-media no-body>
                        <b-media-aside class="mr-2">
                                    <b-avatar size="48" variant="light-success">
                                <feather-icon size="24" icon="HashIcon" />
                            </b-avatar>
                        </b-media-aside>
                        <b-media-body class="my-auto">
                            <h4 class="font-weight-bolder mb-0">
                                {{ data.campaigns.runningCount }}
                            </h4>
                            <b-card-text class="font-small-3 mb-0">
                                Running Campaigns
                            </b-card-text>
                        </b-media-body>
                    </b-media>
                </b-col>

                <!-- Countries -->
                <b-col xl="3" sm="6" class="mb-2 mb-sm-0">
                    <b-media no-body>
                        <b-media-aside class="mr-2">
                            <b-avatar size="48" variant="light-danger">
                                <feather-icon size="24" icon="FlagIcon" />
                            </b-avatar>
                        </b-media-aside>
                        <b-media-body class="my-auto">
                            <h4 class="font-weight-bolder mb-0">
                                {{ data.campaigns.pendingReviewCount }}
                            </h4>
                            <b-card-text class="font-small-3 mb-0">
                                Pending Campaigns
                            </b-card-text>
                        </b-media-body>
                    </b-media>
                </b-col>
                <!-- Currencies -->
                <b-col xl="3" sm="6">
                    <b-media no-body>
                        <b-media-aside class="mr-2">
                                  <b-avatar size="48" variant="light-info">
                                <feather-icon size="24" icon="UserIcon" />
                            </b-avatar>
                        </b-media-aside>
                        <b-media-body class="my-auto">
                            <h4 class="font-weight-bolder mb-0">
                                {{ data.users.allCount }}
                            </h4>
                            <b-card-text class="font-small-3 mb-0">
                                Total Users
                            </b-card-text>
                        </b-media-body>
                    </b-media>
                </b-col>
            </b-row>
        </b-card-body>
    </b-card>
</template>

<script>
import {
    BCard,
    BCardHeader,
    BCardTitle,
    BCardText,
    BCardBody,
    BRow,
    BCol,
    BMedia,
    BMediaAside,
    BAvatar,
    BMediaBody,
} from "bootstrap-vue";
import { useUtils as useI18nUtils } from '@core/libs/i18n'
import { kFormatter } from '@core/utils/filter'


export default {
    components: {
        BRow,
        BCol,
        BCard,
        BCardHeader,
        BCardTitle,
        BCardText,
        BCardBody,
        BMedia,
        BAvatar,
        BMediaAside,
        BMediaBody,
    },
    props: {
        data: {
            type: Object,
            default: () => {},
        },
    },
    data(){
        return{
            totalCount: 0,
            runningCount: 0,
            pendingReviewCount: 1,
            currency: 1
        }
    },
     watch:{
        data(info){
            this.updateData();
        }
    },
    mounted() {
        this.$root.$on('filter-transfers', this.updateData);
        // this.updateData();
    },
    methods: {
        updateData(value = 1){
            // if(value == 1){
            //     this.volume = this.data.sales.volume.last24Hours;
            //     this.customer = this.data.customer.last24Hours;
            // }
            // if(value == 2){
            //     this.volume = this.data.sales.volume.last3Days;
            //     this.customer = this.data.customer.last3Days;
            // }
            // if(value == 3){
            //     this.volume = this.data.sales.volume.last7Days;
            //     this.customer = this.data.customer.last7Days;
            // }
            // if(value == 4){
            //     this.volume = this.data.sales.volume.last30Days;
            //     this.customer = this.data.customer.last30Days;
            // }
            // if(value == 5){
            //     this.volume = this.data.sales.volume.allTime;
            //     this.customer = this.data.customer.allTime;
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
