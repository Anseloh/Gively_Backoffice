<template>
    <b-overlay :show="pageBusy" variant="transparent">
        <b-card>
            <div class="row pt-0">
                <div class="col-12 pb-1">
                    <span class="font-weight-bolder">Filters</span>
                </div>
                <div class="col-lg-3 col-12 col-md-6">
                    <label>Date Range</label>
                    <flat-pickr
                        v-model="range"
                        class="form-control"
                        :config="{ mode: 'range'}"
                        />
                </div>
                <div class="col-lg-4 col-12 col-md-6">
                    <label>State</label>
                    <v-select  v-model="status"  :options="statusOptions"></v-select>
                </div>
                <div class="col-lg-3 col-12 col-md-6">
                    <label>User Name</label>
                    <input v-model="userName" type="text" class="form-control" placeholder="e.g. John Doe">
                </div>
                <div class="col-lg-2 col-12 col-md-6 pt-2 pt-lg-2" @click="filterFeedback()">
                    <span class="btn btn-primary"> <feather-icon icon="SearchIcon" /> Search</span>
                </div>
            </div>
        </b-card>
        <b-card>
            <b-overlay :show="itemBusy">
                <b-table
                    class="rounded border"
                    :items="items"
                    :fields="fields"
                    :per-page="10"
                    :current-page="1"
                    responsive
                >

                    <template #head()="scope">
                        <div class="text-nowrap text-primary">
                        {{ scope.column }}
                        </div>
                    </template>
                    <template #cell(userName)="data">
                        <span class="text-nowrap" v-if="data.item._id">
                            <div class="d-flex align-items-center">
                                <div class="pr-1">
                                    <b-avatar variant="primary"></b-avatar>
                                </div>
                                <div class="w-100">
                                    {{data.value}}
                                </div>
                            </div>
                        </span>
                    </template>
                    <template #cell(type)="data">
                        <span class="text-nowrap badge badge-primary" v-if="data.item._id">
                            {{(data.item.feedbackType == 1)? 'Hard to Use': (data.item.feedbackType == 2? 'Crash': (data.item.feedbackType == 3? 'Bug': (data.item.feedbackType == 4? 'Transaction': 'Other')))}}
                        </span>
                    </template>
                    <template #cell(userPhone)="data">
                        <span class="text-nowrap" v-if="data.item._id">
                           <span v-if="data.value.trim().length">
                               {{ data.value }}
                           </span>
                           <small class="font-italic" v-else>
                               No phone number
                           </small>
                        </span>
                    </template>
                    <template #cell(status)="data">
                        <span class="text-nowrap" v-if="data.item._id">
                            <b-badge :variant="displayStatus[1][data.value]">
                                {{ displayStatus[0][data.value] }}
                            </b-badge>
                        </span>
                    </template>
                    <template #cell()="data">
                        <div class="text-nowrap pt-1">
                            {{data.value}}
                        </div>
                    </template>
                    <template #cell(businessType)="data">
                        <div class="text-nowrap pt-1 small" v-if="data.item._id">
                            {{data.value == 3? 'Corporate Business': 'Private Business'}}
                        </div>
                    </template>
                    <template #cell(createdAt)="data">
                        <div class="text-nowrap pt-1" v-if="data.item._id">
                            {{ dayjs(data.value).format("MMM D, YYYY h:mm A") }}
                        </div>
                    </template>
                    <template #cell(updatedAt)="data">
                        <div class="text-nowrap pt-1" v-if="data.item._id">
                            {{ dayjs(data.value).format("MMM D, YYYY h:mm A") }}
                        </div>
                    </template>
                    <template #cell(actions)="data">
                         <div class="text-nowrap" v-if="data.item._id">
                             <b-button size="sm" pill variant="outline-primary" v-b-toggle.validate @click="triggerProcessing(data.item)">
                            Review
                             </b-button>
                         </div>
                    </template>
                    <template #cell(images)="data">
                        <span class="text-nowrap" v-if="data.item._id">
                            <small class="font-italic" v-if="!data.value.length">
                               No image
                            </small>
                            <b-button v-else variant="outline-primary" size="sm" pill v-b-toggle.images @click="images = data.value">
                                See images
                            </b-button>
                        </span>
                    </template>
                </b-table>
            </b-overlay>
            <div class="d-flex p-1">
                <div class="w-100">
                    Page <span class="text-primary"> {{currentPage}}</span> of <span class="text-primary">{{Math.ceil(totalRows/10)}}</span>
                </div>
                <div class="w-100">
                    <b-pagination
                        v-model="currentPage"
                        :total-rows="totalRows"
                        :per-page="10"
                        aria-controls="users-table"
                        align="right"
                        size="sm"
                        class="my-0"
                        @page-click="loadNewPage"
                    />
                </div>
            </div>
            <b-sidebar
                shadow
                id="validate"
                sidebar-class="sidebar-lg"
                bg-variant="white"
                backdrop
                right
                title="Review Application"
                title-background="primary"
                no-close-on-backdrop
                >
                <template #default="{ hide }">
                    <div>
                        <div class="p-2 border-bottom border-top">
                            <h4 class="text-primary">User Information</h4>
                            <h5 class="font-weight-bolder">Business Name</h5>
                            <span>{{account.name}}</span>
                            <h5 class="font-weight-bolder mt-1">Business Phone</h5>
                            <span>{{account.phone}}</span>
                            <h5 class="font-weight-bolder mt-1">Business Address</h5>
                            <span>{{account.address}}</span>
                            <h5 class="font-weight-bolder mt-1">Tax Payer ID</h5>
                            <span>{{account.taxPayerId || 'N/A'}}</span>
                            <h5 class="font-weight-bolder mt-1">Registration Number</h5>
                            <span>{{account.registrationNumber || 'N/A'}}</span>
                            <h5 class="font-weight-bolder mt-1">Business Type</h5>
                            <span>{{account.businessType == 2? 'Private Business' : 'Corporate Business'}}</span>
                            <div v-if="account.businessType == 3">
                                <h5 class="font-weight-bolder mt-1">
                                    Registration Documents
                                </h5>
                                <b-list-group>
                                    <b-list-group-item v-for="(i,j) in account.regDocument" :key="j">
                                        <a :href="i + '?' +ftoken" target="_blank" class="d-block">
                                            <b-img fluid rounded :src="i + '?' +ftoken" v-if="i.includes('.png') || i.includes('.gif') || i.includes('.jpeg') || i.includes('.jpg')"></b-img>
                                            <small class="text-muted text-nowrap d-block mt-1 text-truncate">
                                                {{i + '?' +ftoken}}
                                            </small>
                                        </a>
                                    </b-list-group-item>
                                </b-list-group>
                            </div>

                            <h5 class="font-weight-bolder mt-1">Business Description</h5>
                            <span>{{account.description || 'N/A'}}</span>
                            <h5 class="font-weight-bolder mt-1">Business Logo</h5>
                            <div v-if="account.logo" class="text-center">
                                <b-img style="width: 300px" :src="account.logo">

                                </b-img>
                            </div>
                            <span v-else>N/A</span>

                            <div v-if="account.status !=5 && account.status !=-5">
                                <h4 class="text-primary mt-2 pt-2 border-top">Add review</h4>
                                <div class="d-flex justify-content-between">
                                    <b-form-radio v-model="applicationStatus" value="1">
                                        Approve
                                    </b-form-radio>
                                    <b-form-radio v-model="applicationStatus" value="2">
                                        Decline
                                    </b-form-radio>
                                </div>
                                <div v-if="applicationStatus == 2" class="mt-1">
                                    <label class=""> Status </label>
                                    <v-select  v-model="user.status"  :options="feedbackOptions"></v-select>
                                    <div>
                                        <label class="mt-2"> Reason </label>
                                        <b-textarea v-model="user.message">
                                        </b-textarea>
                                    </div>
                                </div>
                                <div class="mt-2">
                                    <b-button rounded variant="primary" @click="addReview(hide)" :disabled="!applicationStatus || (applicationStatus == 2 && (!user.status.value || (user.status.value != 5 && !user.message.trim().length)))">
                                        Submit
                                    </b-button>
                                </div>
                            </div>
                        </div>
                        <h4 class="p-2 text-primary" v-if="account.reviewHistory.length">Recent Rejections</h4>
                        <b-list-group>
                            <b-list-group-item v-for="(review, j) in account.reviewHistory" :key="j">
                                <div class="alert alert-secondary rounded p-1 mb-0">
                                    <div>
                                        <b-badge :variant="displayStatus[1][review.status]">
                                            {{ displayStatus[0][review.status] }}
                                        </b-badge>
                                    </div>
                                    {{review.message}}
                                </div>
                                <div class="d-flex p-0">
                                    <div class="w-100">
                                        <small>{{review.reviewer}}</small>
                                    </div>
                                    <div class="text-right text-nowrap">
                                        <small class="text-primary">
                                            {{ dayjs(review.time).format("MMM D, YYYY h:mm A") }}
                                        </small>
                                    </div>
                                </div>
                            </b-list-group-item>
                        </b-list-group>
                    </div>
                </template>
            </b-sidebar>
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
    name: 'Feedback',
    components: {
        flatPickr,
        vSelect,
    },
    data() {
        return {
            ftoken: '',
            dayjs: dayjs,
            currentPage: 1,
            totalRows: 10,
            range: '',
            reviews: [],
            searchDate: '',
            dateRange: '',
            userName: '',
            status: 'All',
            displayStatus:[
                {
                    '1':'Pending', '5': 'Approved', '-1':'Rejected', '-5': 'Rejected Permanently', '-2': 'Invalid Documents'
                },
                {
                    '1':'secondary', '5': 'primary', '-1':'warning', '-5': 'danger', '-2': 'warning'
                },
            ],
            statusOptions: [
                {label:'Pending',"value":1},
                {label:'Approved',"value":5},
                {label:'Rejected',"value":-1},
                {label:'Invalid Documents',"value":-2},
                {label:'Rejected Permanently',"value":-5},
            ],
            user: {
                message:'',
                status: '',
                id: ''
            },
            account: {
                reviewHistory: []
            },
            checked: '',
            images: [],
            feedbackOptions: [
                // {label:'Approved',"value":5},
                {label:'Rejected',"value":-1},
                {label:'Invalid Documents',"value":-2},
                // {label:'Rejected Permanently',"value":-5},
                ],
            items: [],
            fields: [
                {key: 'actions'},
                {key: 'name'},
                {key: 'phone'},
                {key: 'businessType'},
                {key: 'address'},
                {key: 'status'},
                {key: 'createdAt'},
                {key: 'updatedAt'},
            ],
            searchParams: {},
            itemBusy: false,
            pageBusy: false,
            applicationStatus: 0,
        }
    },
    watch: {
        range(newRange, oldRange) {
            newRange = newRange.split(' to ');
            if(newRange.length === 2) {
                this.searchDate = {
                    from: newRange[0],
                    to: newRange[1]
                }
            }else if(newRange[0].length == 10) {
                 this.searchDate = {
                    from: newRange[0],
                    to: newRange[0]
                }
            }else {
                this.searchDate = '';
            }
        },
        applicationStatus(data) {
            if(data == 1) {
                this.user.status = {
                    value: 5,
                    label: 'Approved',
                }
                this.user.message = '';
            }else{
                this.user.status = '';
            }
        }
    },
    created() {
        this.items = Utils.completeTable();
        this.getApplications();
    },
    mounted() {
        this.ftoken = vm.$fileAccessToKen;
    },
    methods: {
        addReview(e) {
            API.addReview({message: this.user.message.trim(), status: this.user.status.value, id: this.user.id}).then(res=>{
                if(res.success && res.data) {
                    this.user.status = {};
                    this.user.message = '';
                    this.items = this.items.map(item=>{
                        if(item._id == res.data.application._id) {
                            item = res.data.application;
                        }
                        return item;
                    });
                    e();
                    this.showToast('Review Added successfully','CheckCircle','success');
                }
            }).catch(err=>{
                console.log(err);
            })
        },
        triggerProcessing(data) {
            this.account = data;
            this.user.id = data._id;
        },
        loadNewPage(e,page) {
            console.log(page)
            e.preventDefault();
            this.getApplications(page);
        },
        getApplications(page = 1) {
            // this.pageBusy = true;
            API.getApplications({searchParams: this.searchParams, pageNum: page}).then(res => {
                this.pageBusy = false;
                if(res.success && res.data) {
                    this.currentPage = page;
                    this.items = Utils.completeTable(res.data.list);
                    this.totalRows = res.data.total || 10;
                }
            }).catch(() => {
                this.pageBusy = false;
                this.showToast();
            })
        },
         filterFeedback() {
            if(!this.searchDate && !this.userName && !this.status) {
                this.searchParams = {};
            }else{
                this.searchParams = {};
                if(this.userName) {
                    this.searchParams.name = this.userName;
                }
                if(this.status && this.status.value) {
                    this.searchParams.status = this.status.value;
                }
                if(this.searchDate && this.searchDate.from) {
                    this.searchParams.startDate = this.searchDate.from + ' 00:00:00';
                    if(!this.searchDate.to) {
                        this.this.searchDate.to = this.searchDate.from
                    }
                    this.searchParams.endDate = this.searchDate.to + ' 23:59:59';
                }
            }
            this.getApplications(1);
            this.currentPage = 1;
        },
        showToast(message, icon, variant) {
            this.$toast({
                component: ToastificationContent,
                props: {
                    title: message || 'Error fetching applications',
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
            if(feedbackId) {
                this.feedbacks = {};
                // this.pageBusy = true;
                API.markAsProcessed({_id: feedbackId}).then(res => {
                    this.pageBusy = false;
                    if(res.success) {
                        this.items = this.items.map(item =>{
                            if(item._id == feedbackId) {
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

    .feedback-content{

        max-width: 100px !important;
    }
    .feedback-content:hover{
        transform: scale(1.2);
    }
</style>