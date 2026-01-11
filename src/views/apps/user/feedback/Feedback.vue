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
                            <b-badge :variant="data.item.status == 5? 'success': 'secondary'">
                                {{ data.item.status == 1 || !data.item.status? 'Unprocessed': ( data.item.status == 5? 'Processed': '')}}
                            </b-badge>
                        </span>
                    </template>
                    <template #cell()="data">
                        <div class="text-nowrap pt-1">
                            {{data.value}}
                        </div>
                    </template>
                    <template #cell(createdAt)="data">
                        <div class="text-nowrap pt-1" v-if="data.item._id">
                            {{ dayjs(data.value).format("MMM D, YYYY h:mm A") }}
                        </div>
                    </template>
                    <template #cell(actions)="data">
                         <div class="text-nowrap" v-if="data.item._id">
                             <b-button v-if="data.item.status == 1 || !data.item.status" size="sm" pill variant="outline-primary" @click="markAsProcessed(data.item._id)">
                               <feather-icon icon="CheckIcon"></feather-icon> Mark as processed
                             </b-button>
                            <b-button v-if="data.item.status == 5" :disabled="true" variant="secondary" size="sm" pill>
                               <feather-icon icon="CheckCircleIcon" /> <i>Processed</i>
                            </b-button>
                         </div>
                    </template>
                    <template #cell(content)="data">
                        <span class="pb-1 text-truncate d-block feedback-content text-primary cursor-pointer text-center" @click="showModal(data.value)">
                            {{data.value}}
                        </span>
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
                id="images"
                sidebar-class="sidebar-lg"
                bg-variant="white"
                backdrop
                no-close-on-backdrop
                >
                <div v-for="(image, i) in images" :key="i">
                    <div class="p-1">
                        <b-img :src="image" rounded="" fluid center>

                        </b-img>
                    </div>
                </div>
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
import API from './api'

const toast = useToast()
export default {
    name: 'Feedback',
    components: {
        flatPickr,
        vSelect,
    },
    data() {
        return {
            dayjs: dayjs,
            currentPage: 1,
            totalRows: 10,
            range: '',
            searchDate: '',
            dateRange: '',
            userName: '',
            status: 'All',
            statusOptions: [
                {'label':'Pending',"value": 1},
                {'label':'Processed',"value": 2},
                {'label':'All' },

            ],
            checked: '',
            images: [],
            items: [],
            fields: [
                {key: 'userName'},
                {key: 'userPhone'},
                {key: 'type'},
                {key: 'content'},
                {key: 'images'},
                {key: 'status'},
                {key: 'createdAt'},
                {key: 'actions'},
            ],
            searchParams: {},
            itemBusy: false,
            pageBusy: false,
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
    },
    created() {
        this.items = Utils.completeTable();
        this.getFeedbacks();
    },
    methods: {
        loadNewPage(e,page) {
            e.preventDefault();
            this.getFeedbacks(page);
        },
        getFeedbacks(page = 1) {
            // this.pageBusy = true;
            API.getFeedbacks({searchParams: this.searchParams, pageNum: page}).then(res => {
                this.pageBusy = false;
                if(res.success && res.data) {
                    this.currentPage = page;
                    this.items = Utils.completeTable(res.data.list);
                    this.totalRows = res.data.total;
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
                    this.searchParams.userName = this.userName;
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
            this.getFeedbacks(1);
            this.currentPage = 1;
        },
        showToast(message, icon, variant) {
            this.$toast({
                component: ToastificationContent,
                props: {
                    title: message || 'Error fetching feedbacks',
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