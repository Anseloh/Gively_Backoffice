<template>
    <b-overlay :show="pageBusy" variant="transparent">
        <b-card>
            <div class="row pt-0">
                <div class="col-12 pb-1">
                    <span class="font-weight-bolder">Filters</span>
                </div>
                <div class="col-lg-3 col-12 col-md-6">
                    <label>Date Range</label>
                    <flat-pickr v-model="range" class="form-control" :config="{ mode: 'range'}" />
                </div>
                <div class="col-lg-3 col-12 col-md-6">
                    <label>Status</label>
                    <v-select v-model="status" :options="statusOptions"></v-select>
                </div>
                <div class="col-lg-3 col-12 col-md-6">
                    <label>Transactions ID</label>
                    <b-input v-model="transactionId"></b-input>
                </div>
                <div class="col-lg-3 col-12 col-md-6">
                    <label>Event ID</label>
                    <b-input v-model="eventId"></b-input>
                </div>
                <div class="col-lg-3 col-12 col-md-6">
                    <label>Payer email</label>
                    <b-input v-model="payerEmail"></b-input>
                </div>
                <div class="col-lg-3 col-12 col-md-6 pt-2 pt-lg-2">
                    <span class="btn btn-primary" @click="filterTransactions()">
                        <feather-icon icon="SearchIcon" /> Search
                    </span>
                </div>
            </div>
        </b-card>
        <b-card>
            <b-overlay :show="itemBusy">
                <b-table class="rounded border" :items="items" :fields="fields" :per-page="10" :current-page="1"
                    responsive>

                    <template #head()="scope">
                        <div class="text-nowrap text-primary">
                            {{ scope.label }}
                        </div>
                    </template>
                    <template #cell(eventTitle)="data">
                        <div style="min-width: 300px">
                            <span class="three-line-ellipsis" v-if="data.item._id">
                                {{data.item.eventTitle}}
                            </span>
                            <div v-else class="pt-2">
                        </div>

                        </div>
                    </template>
                    <template #cell(status)="data">
                        <span class="text-nowrap" v-if="data.item._id && data.item.status">
                            <b-badge :variant="displayStatus[1][data.item.status]" v-if="displayStatus[0][data.item.status]">
                                {{ displayStatus[0][data.item.status] }}
                            </b-badge>
                            <b-badge variant="dark" v-else>
                                Others
                            </b-badge>
                        </span>
                    </template>
                    <template #cell()="data">
                        <div class="text-nowrap pt-1">
                            {{data.value}}
                        </div>
                    </template>
                    <template #cell(coinsClaimed)="data">
                        <div class="text-nowrap pt-1" v-if="data.item._id">
                            {{data.value == 1? 'Claimed': 'Not claimed'}}
                        </div>
                    </template>
                    <template #cell(coins)="data">
                        <div class="text-nowrap pt-1" v-if="data.item._id">
                            <span class="font-weight-bolder text-dark">{{data.value}}</span><small class="">GLT</small>
                        </div>
                    </template>
                    <template #cell(backer)="data">
                        <span class="text-nowrap" v-if="data.item._id">
                            <div class="d-flex align-items-center">
                                <div class="pr-1">
                                    <b-avatar variant="secondary" :src="data.item.avatar"></b-avatar>
                                </div>
                                <div class="w-100">
                                    <div class="font-weight-bolder">
                                        {{data.item.payerName}}
                                    </div>
                                    <small>{{data.item.payerEmail}}</small>
                                </div>
                            </div>
                        </span>
                    </template>
                    <template #cell(amount)="data">
                        <div class="text-nowrap pt-1 small" v-if="data.item._id">
                            <span style="font-size: 20px;" class="font-weight-bolder text-dark">{{currency(data.item.amount)}}</span> <small>{{data.item.currencyCode}}</small>
                        </div>
                    </template>
                    <template #cell(createdAt)="data">
                        <div class="text-nowrap pt-1" v-if="data.item._id">
                            {{ dayjs(data.value).format("MMM D, YYYY hh:mm") }}
                        </div>
                    </template>
                    <template #cell(updatedAt)="data">
                        <div class="text-nowrap pt-1" v-if="data.item._id">
                            {{ dayjs(data.value).format("MMM D, YYYY hh:mm") }}
                        </div>
                    </template>
                    <template #cell(actions)="data">
                        <!-- <div class="text-nowrap" v-if="data.item._id">
                            <b-button size="sm" pill variant="outline-primary" v-b-toggle.validate @click="triggerProcessing(data.item)">
                        Review
                            </b-button>
                        </div> -->

                        <b-dropdown size="lg" variant="link" toggle-class="text-decoration-none" no-caret
                            v-if="data.item._id">
                            <template #button-content>
                                <feather-icon icon="MoreVerticalIcon"></feather-icon>
                            </template>
                            <b-dropdown-item @click="showTransaction(data.item)">
                                <feather-icon icon="EyeIcon" />
                                Preview
                            </b-dropdown-item>
                            <b-dropdown-item @click="confirmPostTransaction(data.item)" v-if="data.item.status > 20 || data.item.status < -20">
                                <feather-icon icon="CheckCircleIcon" />
                                Trigger post transaction
                            </b-dropdown-item>
                        </b-dropdown>
                    </template>
                    <template #cell(banner)="data">
                        <span class="text-nowrap" v-if="data.item._id">
                            <b-img :src="data.value" style="height: 50px" rounded class="cursor-pointer"
                                @click="triggerViewImage([data.value])">

                            </b-img>
                        </span>
                    </template>
                </b-table>
            </b-overlay>
            <b-modal id="confirm-post-transaction" title="Confirmation" cancel-title="No" cancel-variant="primary" ok-variant="danger" @ok="triggerPostTransaction" ok-title="Yes" size="sm" centered no-close-on-backdrop no-close-on-esc>
                <div class="row">
                    <div class="col-12">
                        Are you sure you want to trigger  post transaction process for event <span class="font-weight-bolder text-primary">{{selectedTransaction.eventTitle}}</span> with transaction number <span class="font-weight-bolder text-dark">{{selectedTransaction.transactionId}}</span>
                    </div>
                </div>
            </b-modal>
            <b-modal id="view-transaction" title="Transaction details" ok-only size="lg" scrollable centered no-close-on-backdrop no-close-on-esc>
                <div class="row">
                    <div class="col-12" v-if="selectedTransaction._id">
                        <b-list-group>
                            <b-list-group-item>
                                <div class="d-flex align-items-center">
                                    <div class="">
                                        <b-avatar size="75" :src="selectedTransaction.avatar"></b-avatar>
                                    </div>
                                    <div class="w-100 text-dark pl-2">
                                        <h4 class="text-capitalize">{{selectedTransaction.backer}}</h4>
                                        <div>{{selectedTransaction.email}}</div>
                                    </div>
                                </div>
                            </b-list-group-item>
                            <b-list-group-item>
                                <div class="d-flex">
                                    <div class="w-100">
                                        Event title
                                    </div>
                                    <div class="w-100 text-dark">
                                        {{selectedTransaction.eventTitle}}
                                    </div>
                                </div>
                            </b-list-group-item>
                            <b-list-group-item>
                                <div class="d-flex">
                                    <div class="w-100">
                                        Amount
                                    </div>
                                    <div class="w-100 text-dark">
                                        <span style="font-size: 20px;" class="font-weight-bolder text-dark">{{currency(selectedTransaction.amount, selectedTransaction.currency)}}</span> <small>{{selectedTransaction.currency}}</small>
                                    </div>
                                </div>
                            </b-list-group-item>
                            <b-list-group-item>
                                <div class="d-flex">
                                    <div class="w-100">
                                        Coins
                                    </div>
                                    <div class="w-100 text-dark">
                                        <span style="font-size: 20px;" class="font-weight-bolder text-dark">{{selectedTransaction.coins}}</span><small>GLT</small>
                                    </div>
                                </div>
                            </b-list-group-item>
                            <b-list-group-item>
                                <div class="d-flex">
                                    <div class="w-100">
                                        Transaction number
                                    </div>
                                    <div class="w-100 text-dark text-uppercase">
                                        {{selectedTransaction.transactionId}}
                                    </div>
                                </div>
                            </b-list-group-item>
                            <b-list-group-item>
                                <div class="d-flex">
                                    <div class="w-100">
                                        Coins claimed?
                                    </div>
                                    <div class="w-100 text-dark">
                                        {{selectedTransaction.coinsClaimed? 'Claimed': 'Not claimed'}}
                                    </div>
                                </div>
                            </b-list-group-item>
                            <b-list-group-item>
                                <div class="d-flex">
                                    <div class="w-100">
                                        Status
                                    </div>
                                    <div class="w-100 text-dark">
                                        <b-badge :variant="displayStatus[1][selectedTransaction.status]" v-if="displayStatus[0][selectedTransaction.status]">
                                            {{ displayStatus[0][selectedTransaction.status] }}
                                        </b-badge>
                                        <b-badge variant="dark" v-else>
                                            Others
                                        </b-badge>
                                    </div>
                                </div>
                            </b-list-group-item>
                            <b-list-group-item>
                                <div class="d-flex">
                                    <div class="w-100">
                                        Event ID
                                    </div>
                                    <div class="w-100 text-dark text-uppercase">
                                        {{selectedTransaction.eventId}}
                                    </div>
                                </div>
                            </b-list-group-item>
                            <b-list-group-item>
                                <div class="d-flex">
                                    <div class="w-100">
                                        Created at
                                    </div>
                                    <div class="w-100 text-dark text-uppercase">
                                        {{dayjs(selectedTransaction.createdAt).format("MMM D, YYYY hh:mm")}}
                                    </div>
                                </div>
                            </b-list-group-item>
                            <b-list-group-item>
                                <div class="d-flex">
                                    <div class="w-100">
                                        Updated at
                                    </div>
                                    <div class="w-100 text-dark text-uppercase">
                                        {{dayjs(selectedTransaction.updatedAt).format("MMM D, YYYY hh:mm")}}
                                    </div>
                                </div>
                            </b-list-group-item>
                        </b-list-group>
                    </div>
                </div>
            </b-modal>
            <div class="d-flex p-1">
                <div class="w-100">
                    Page <span class="text-primary"> {{currentPage}}</span> of <span
                        class="text-primary">{{Math.ceil(totalRows/10)}}</span>
                </div>
                <div class="w-100">
                    <b-pagination v-model="currentPage" :total-rows="totalRows" :per-page="10"
                        aria-controls="users-table" align="right" size="sm" class="my-0" @page-click="loadNewPage" />
                </div>
            </div>
        </b-card>
    </b-overlay>


</template>

<script>

import { useToast } from 'vue-toastification/composition'
import ToastificationContent from '@core/components/toastification/ToastificationContent.vue'
import vSelect from 'vue-select'
import dayjs from "dayjs";
import flatPickr from 'vue-flatpickr-component'
import Utils from '@/utils/index';
import Vue from "vue";
import API from './api'

const vm = new Vue({});
const toast = useToast()
export default {
    name: 'Backings',
    components: {
        flatPickr,
        vSelect,
    },
    data() {
        return {
            currency: Utils.formatCurrency,
            statuses: {
                '10': "Pending",
                '20': "Processing",
                '-30': "Failed",
                '30': "Successful",
                
            },
            link: 'https://www.givelycf.com',
            ftoken: '',
            dayjs: dayjs,
            currentPage: 1,
            totalRows: 10,
            range: '',
            reviews: [],
            searchDate: '',
            eventId: '',
            payerEmail: '',
            dateRange: '',
            searchTitle: '',
            status: '',

            displayStatus: [
                {
                    '10': "Pending",
                    '20': "Processing",
                    '30': "Successful",
                    '-30': "Failed",
                    'undefined': 'Other'
                },
                {
                    '10': "dark",
                    '20': "dark",
                    '-30': "danger",
                    '30': "success",
                    'undefined': 'dark'
                },
            ],
            statusOptions: [
                { label: 'Pending', "value": 10 },
                { label: 'Processing', "value": 20 },
                { label: 'Successful', "value": 30 },
                { label: 'Failed', "value": -30 }
            ],
            mode: '',
            user: {
                text: '',
                status: '',
                id: ''
            },
            account: {
                reviewHistory: []
            },
            checked: '',
            images: [],
            feedbackOptions: [
                { label: 'Invalid story', "value": 1 },
                { label: 'Inappropriate banner', "value": 2 },
                { label: 'Video too long', "value": 3 },
                { label: 'Inappropriate Title', "value": 4 },
                { label: 'Others ', "value": 5 },
            ],
            items: [],
            fields: [
                { key: 'amount', label: 'Amount' },
                // {key: 'backer', label: 'Backer'},
                { key: 'coins', label: 'Coins' },
                { key: 'status', label: 'Status' },
                { key: 'type', label: 'Type' },
                // { key: 'eventTitle', eventTitle: 'Event Tittle' },
                { key: 'id', label: 'Transaction number' },
                // { key: 'coinsClaimed', label: 'Coins claimed' },
                // { key: 'banner', label: 'Banner' },
                { key: 'createdAt', label: 'Created At' },
                { key: 'updatedAt', label: 'Updated At' },
                { key: 'actions', label: 'Actions' },
            ],
            searchParams: '',

            itemBusy: false,
            pageBusy: false,
            showSidebar: false,
            applicationStatus: 0,
            selectedTransaction: {}
        }
    },
    watch: {
        range(newRange, oldRange) {
            newRange = newRange.split(' to ');
            if (newRange.length === 2) {
                this.searchDate = {
                    from: newRange[0],
                    to: newRange[1]
                }
            } else if (newRange[0].length == 10) {
                this.searchDate = {
                    from: newRange[0],
                    to: newRange[0]
                }
            } else {
                this.searchDate = '';
            }
        },
        applicationStatus(data) {
            if (data == 1) {
                this.user.status = {
                    value: 3,
                    label: 'Run',
                }
                this.user.text = '';
            } else {
                this.user.status = '';
            }
        },
    },
    created() {
        this.items = Utils.completeTable();
        this.eventId = this.$route.query.eventId 
        this.payerEmail = this.$route.query.payerEmail 
        this.filterTransactions();
    },
    mounted() {
        if (process.env.NODE_ENV == 'development') this.link = "http://localhost:3000";
        else if (process.env.NODE_ENV == 'staging') this.link = "https://staging.givelycf.com";
        this.ftoken = vm.$fileAccessToKen;
    },
    methods: {
        triggerPostTransaction(e){
            e.preventDefault();
            this.postTransaction()
        },
        confirmPostTransaction(data = {}) {
            this.selectedTransaction = data;
            this.$bvModal.show('confirm-post-transaction');
        },
        showTransaction(data = {}) {
            API.getUser(data.createdBy).then(res=>{
                if(res.success){
                    console.log(res.data.userInfo);
                    const user = res.data.userInfo;
                    this.selectedTransaction = {
                        ...data,
                        backer: user.firstName + ' ' + user.lastName,
                        email: user.email,
                        avatar: user.avatar,
                    }
                    this.$bvModal.show('view-transaction');
                }
            })
        },
        triggerViewImage(image = []) {
            this.images = image;
            this.$bvModal.show('view-images');
        },
        postTransaction(e) {
            API.postTransaction({ transactionId: this.selectedTransaction._id }).then(res => {
                if (res.success) {
                    this.getTransactions(this.currentPage);
                    this.showToast('Post transaction process initiated successfully', 'CheckCircle', 'success');
                    this.$bvModal.hide('confirm-post-transaction');
                }
            }).catch(err => {
                console.log(err);
            })
        },
        resetReview() {
            this.user = {
                text: '',
                status: '',
                id: ''
            }
            this.applicationStatus = 0;
        },
        triggerProcessing(data) {
            this.account = data;
            this.user.id = data._id;
            this.showSidebar = true;
            // this.$bvModal.show('validate');
        },
        loadNewPage(e, page) {
            e.preventDefault();
            this.getTransactions(page);
        },
        getTransactions(pageNum = 1) {
            // this.pageBusy = true;
            API.getTransactions( {pageNum, ...this.searchParams, transactionType: 5 } ).then(res => {
                this.pageBusy = false;
                if (res.success && res.data) {
                    this.currentPage = res.data.currentPage;
                    this.items = Utils.completeTable(res.data.list);
                    this.totalRows = res.data.total || 10;
                }
            }).catch(() => {
                this.pageBusy = false;
                this.showToast();
            })
        },
        filterTransactions() {
            this.searchParams = {};
            if (this.searchTitle) {
                this.searchParams.title = this.searchTitle;
            }
            if (this.eventId) {
                this.searchParams.serviceId = this.eventId;
            }
            if (this.transactionId) {
                this.searchParams.id = this.transactionId;
            }
            if (this.payerEmail) {
                this.searchParams.payerEmail = this.payerEmail;
            }
            if (this.status && this.status.value) {
                this.searchParams.status = this.status.value;
            }
            if (this.searchDate && this.searchDate.from) {
                this.searchParams.from = this.searchDate.from;
                if (!this.searchDate.to) {
                    this.searchDate.to = this.searchDate.from
                }
                this.searchParams.to = this.searchDate.to;
            }

            this.getTransactions(1);
            // this.currentPage = 1;
        },
        showToast(message, icon, variant) {
            this.$toast({
                component: ToastificationContent,
                props: {
                    title: message || 'Error fetching transactions',
                    icon: icon || 'InfoIcon',
                    variant: variant || 'danger',
                },
            })
        },
        showModal(feedback) {
            this.$bvModal.msgBoxOk(feedback, {
                title: 'Feedback',
                size: 'md',
                buttonSize: 'md',
                okVariant: 'primary',
                headerClass: 'p-2 border-bottom-0',
                bodyClass: 'text-break',
                footerClass: 'p-2 border-top-0',
                centered: true
            })
                .then(value => {
                    this.feedback = value
                })
                .catch(err => {
                    // An error occurred
                })
        },
        markAsProcessed(feedbackId) {
            if (feedbackId) {
                this.feedbacks = {};
                // this.pageBusy = true;
                API.markAsProcessed({ _id: feedbackId }).then(res => {
                    this.pageBusy = false;
                    if (res.success) {
                        this.items = this.items.map(item => {
                            if (item._id == feedbackId) {
                                item.status = res.data.status;
                            }
                            return item;
                        })
                        this.showToast('Feedback Marked as processed', 'CheckIcon', 'success');
                    }
                }).catch(() => {
                    this.pageBusy = false;
                    this.showToast('Error processing feedback')
                })
            }
        }
    }
}
</script>

<style lang="scss" scope>
@import '@core/scss/vue/libs/vue-select.scss';
@import '@core/scss/vue/libs/vue-flatpicker.scss';

.feedback-content {

    max-width: 100px !important;
}

.feedback-content:hover {
    transform: scale(1.2);
}

#carousel-main {
    text-align: center !important;

    img {
        height: 480px !important;
        width: auto !important;
    }
}
</style>