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
                <!-- <div class="col-lg-3 col-12 col-md-6">
                    <label>Mode</label>
                    <v-select  v-model="mode"  :options="modeOptions" :clearable="false"></v-select>
                </div> -->
                <!-- <div class="col-lg-3 col-12 col-md-6" v-if="mode && mode.value != 'draft'">
                    <label>Fundraiser Types</label>
                    <v-select  v-model="featuredOption" :reduce="e=>e.value" :options="featuredOptions" :searchable="false" :clearable="false"></v-select>
                </div>
                <div class="col-lg-3 col-12 col-md-6" v-if="mode && mode.value != 'draft'">
                    <label>Visibility</label>
                    <v-select  v-model="visible" :reduce="e=>e.value" :options="visibleOptions" :searchable="false" :clearable="false"></v-select>
                </div> -->
                <div class="col-lg-3 col-12 col-md-6">
                    <label>State</label>
                    <v-select  v-model="status" :options="statusOptions"></v-select>
                </div>
                <div class="col-lg-3 col-12 col-md-6">
                    <label>Fundraiser title</label>
                    <input v-model="searchTitle" type="text" class="form-control" placeholder="">
                </div>
                <div class="col-lg-3 col-12 col-md-6">
                    <label>Creator id</label>
                    <input v-model="userId" type="text" class="form-control" placeholder="">
                </div>
                <div class="col-lg-3 col-12 col-md-6 pt-2 pt-lg-2" @click="filterFeedback()">
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
                        {{ scope.label }}
                        </div>
                    </template>
                    <template #cell(target)="data">
                        <span class="text-nowrap badge badge-primary" v-if="data.item._id">
                           {{fundraiserTargets[data.item.fundraiserType]}}
                        </span>
                    </template>
                    <template #cell(title)="data">
                        <span class="three-line-ellipsis" v-if="data.item._id">
                           {{data.value}}
                        </span>
                        <div v-else class="pt-2">
                        
                        </div>
                    </template>
                    <template #cell(status)="data">
                        <span class="text-nowrap" v-if="data.item._id">
                            <b-badge :variant="displayStatus[1][data.value]">
                                {{ displayStatus[0][data.value] }}
                            </b-badge>
                        </span>
                    </template>
                    <template #cell(visibility)="data">
                        <span class="text-nowrap" v-if="data.item._id">
                            <b-badge variant="danger" v-if="!data.item.isVisible">
                                Not visible 
                            </b-badge>
                            <b-badge variant="success" v-else>
                                Visible 
                            </b-badge>
                            <div  v-if="data.item.isFeatured" class="mt-1">
                                <b-badge variant="dark">
                                    Is a featured fundraiser
                                </b-badge>
                            </div>
                        </span>
                    </template>
                    <template #cell()="data">
                        <div class="text-nowrap small pt-1">
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
                        <!-- <div class="text-nowrap" v-if="data.item._id">
                            <b-button size="sm" pill variant="outline-primary" v-b-toggle.validate @click="triggerProcessing(data.item)">
                        Review
                            </b-button>
                        </div> -->

                        <b-dropdown
                            size="lg"
                            variant="link"
                            toggle-class="text-decoration-none"
                            no-caret
                            v-if="data.item._id"
                        >
                            <template #button-content>
                                <feather-icon
                                    icon="MoreVerticalIcon"
                                ></feather-icon>
                            </template>
                            <!-- <b-dropdown-item :to="`/users/list?user=${data.item.createdBy}`">
                                <feather-icon
                                    icon="UserIcon"
                                />
                                See creator
                            </b-dropdown-item> -->
                            <b-dropdown-item :to="`/transactions/donations?fundraiserId=${data.item.id}`" v-if="mode.value != 'draft'">
                                <feather-icon
                                    icon="NoteIcon"
                                />
                                See donations
                            </b-dropdown-item>
                            <!-- <b-dropdown-item @click="toggleVisibility(data.item)">
                                <feather-icon
                                    :icon="data.item.isVisible ? 'EyeOffIcon': 'EyeIcon'"
                                />
                                {{ data.item.isVisible? "Hide from website": "Show on website" }}
                            </b-dropdown-item> -->
                            <!-- <b-dropdown-item @click="toggleFeatured(data.item)">
                                <feather-icon
                                    icon="TagIcon"
                                />
                                {{ data.item.isFeatured? "Remove from featured": "Make as featured" }}
                            </b-dropdown-item> -->
                            <b-dropdown-item target="_blank" :href="`${websiteLink}/fundraiser/${data.item.permaLink}`">
                                <feather-icon
                                    icon="EyeIcon"
                                />
                                Preview
                            </b-dropdown-item>
                            <b-dropdown-item v-if="data.item.status" @click="triggerProcessing(data.item)">
                                <feather-icon
                                    icon="CheckIcon"
                                />
                                Review fundraiser
                            </b-dropdown-item>
                            <!-- <b-dropdown-item v-if="data.item.status == statuses.pending" @click="triggerProcessing(data.item)">
                                <feather-icon
                                    icon="CheckIcon"
                                />
                                Review fundraiser
                            </b-dropdown-item> -->
                            <!-- <b-dropdown-item variant="danger" v-if="data.item.status == statuses.pending" @click="deleteFundraiser(data.item)">
                                <feather-icon
                                    icon="TrashIcon"
                                />
                                Delete fundraiser
                            </b-dropdown-item> -->
                        </b-dropdown>
                    </template>
                    <template #cell(coverPhoto)="data">
                        <span class="text-nowrap" v-if="data.item.id">
                            <b-img :src="data.value" style="height: 50px" rounded class="cursor-pointer" @click="triggerViewImage([data.value])">

                            </b-img>
                        </span>
                    </template>
                </b-table>
            </b-overlay>
            <b-modal id="view-images" ok-only hide-header size="lg" centered no-close-on-backdrop no-close-on-esc body-bg-variant="dark">
                <div style="min-height: 400px;">
                    <b-carousel id="carousel-main" style="text-shadow: 0px 0px 2px #000" :interval="7000" :controls="images.length > 1" :indicators="images.length>1" img-height="480px">
                        <b-carousel-slide  v-for="(item, index) in images" :key="index" :text="`${item}`" :img-src="item" />
                    </b-carousel>
                </div>
            </b-modal>
            <b-modal id="view-fundraiser" ok-only title="View Fundraiser Detail" size="xl" centered no-close-on-backdrop no-close-on-esc>
               <div class="row">
                   <div class="col-12" style="min-height: 600px;">
                       <iframe class="w-100" height="100%" :src="`${link}/preview-fundraiser/data-only/fundraiser?id=${account.id}&mode=${mode.value}`" frameborder="0"></iframe>
                       <!-- <fundraiser :fundraiser="account" /> -->
                   </div>
               </div>
            </b-modal>
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
                v-model="showSidebar"
                right
                title="Fundraiser Approval"
                title-background="primary"
                no-close-on-backdrop
                >
                <template #footer="{  }">
                    <div class="d-flex bg-dark text-light align-items-center p-1">
                        <!-- @@TODO Make the address dynamic on production  -->
                        <b-button variant="primary" @click="showFundraiser">View Full Fundraiser Details</b-button>
                    </div>
                </template>
                <template #default="{ hide }">
                    <div>
                        <div class="p-2 border-bottom border-top">
                            <h4 class="text-primary">Fundraiser Information</h4>
                            <h5 class="font-weight-bolder">Title</h5>
                            <span>{{account.title}}</span>
                            <h5 class="font-weight-bolder">Country</h5>
                            <span v-if="account && account.country">{{account.country.nameEn}}</span>
                            <h5 class="font-weight-bolder">Target amount</h5>
                            <span v-if="account.targetAmount">{{currency(account.targetAmount)}} CAD</span>
                            <h5 class="font-weight-bolder">Current amount</h5>
                            <span v-if="account.currentAmount">{{currency(account.currentAmount)}} CAD</span>
                            <div>
                                <h5 class="font-weight-bolder">Allow recommendations</h5>
                                <span>{{account.allowRecommendation ? 'Yes' : 'No'}}</span>
                            </div>
                            <div>
                                <h5 class="font-weight-bolder">Disable search</h5>
                                <span>{{account.disableSearch ? 'Yes' : 'No'}}</span>
                            </div>
                            <div>
                                <h5 class="font-weight-bolder">Is Featured fundraiser</h5>
                                <span>{{account.isFeatured ? 'Yes' : 'No'}}</span>
                            </div>
                            <div>
                                <h5 class="font-weight-bolder">Is visible</h5>
                                <b-badge :variant="account.isVisible ? 'success' : 'secondary'">{{account.isVisible ? 'Yes' : 'No'}}</b-badge>
                            </div>
                            <h5 class="font-weight-bolder mt-2">Banner</h5>
                            <b-img rounded style="max-height: 400px; max-width: 100%" :src="account.coverPhoto" class="cursor-pointer" @click="triggerViewImage([account.coverPhoto])">

                            </b-img>
                            <h5 class="font-weight-bolder mt-2">Story</h5>
                            <div v-html="account.story"></div>
                            <h5 class="font-weight-bolder mt-2">Gallery</h5>
                            <div>
                                <div class="d-inline-block mr-1" v-for="item in account.gallery" :key="item">
                                    <b-img :src="item" rounded height="100px" class="cursor-pointer" @click="triggerViewImage(account.gallery)">

                                    </b-img>
                                </div>
                            </div>

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

                            <div v-if="account.status !=5 && account.status !=-5">
                                <h4 class="text-primary mt-2 pt-2 border-top">Add review</h4>
                                <div class="d-flex justify-content-between">
                                    <b-form-radio v-model="applicationStatus" value="1">
                                        Approve
                                    </b-form-radio>
                                    <b-form-radio v-model="applicationStatus" value="2">
                                        Decline
                                    </b-form-radio>
                                    <b-form-radio v-model="applicationStatus" value="3">
                                        Decline permanently
                                    </b-form-radio>
                                </div>
                                <div v-if="applicationStatus > 1" class="mt-1">
                                    <div>
                                        <label class="mt-2"> Reason </label>
                                        <b-textarea v-model="user.text">
                                        </b-textarea>
                                    </div>
                                </div>
                                <div class="mt-2">
                                    <b-button rounded variant="primary" @click="addReview(hide)" :disabled="!applicationStatus || (applicationStatus > 1 && (!user.text.trim().length))">
                                        Submit
                                    </b-button>
                                </div>
                            </div>
                        </div>
                        <h4 class="p-2 text-primary" v-if="account.reviewHistory && account.reviewHistory.length">Recent Rejections</h4>
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
import Fundraiser from './SingleFundraiser.vue'

const vm = new Vue({});
const toast = useToast()
export default {
    name: 'Feedback',
    components: {
        flatPickr,
        vSelect,
        Fundraiser
    },
    data() {
        return {
            fundraiserTargets:{
                '1': 'Yourself',
                '5': 'Someone else',
                '10': 'Charity',
                // rejected: -10,
            },
            link: 'https://www.givelycf.com',
            stagingLink: 'https://test.givelycf.com',
            ftoken: '',
            dayjs: dayjs,
            currentPage: 1,
            totalRows: 10,
            range: '',
            reviews: [],
            searchDate: '',
            dateRange: '',
            searchTitle: '',
            status: '',
            statuses: Object.freeze({
                pending: 10,
                paused: 20,
                running: 30,
                ended: 40,
                cancelled: -30,
                rejected: -10,
                rejectedPermanently: -100,
            }),
            displayStatus:[
                {
                    10: "Pending",
                    20: "Paused",
                    30: "Running",
                    40: "Ended",
                    '-30': "Cancelled",
                    '-10': "Rejected",
                    '-100': "Rejected permanently",
                    'undefined': 'Unknown status'
                },
                {
                    10: "dark",
                    20: "warning",
                    30: "success",
                    40: "primary",
                    '-30': "danger",
                    '-10': "danger",
                    '-100': "danger",
                    'undefined': 'dark'
                },
            ],
            statusOptions: [
                {label:'Pending',"value":10},
                {label:'Paused',"value":20},
                {label:'Running',"value":30},
                {label:'Ended',"value":40},
                {label:'Canceled',"value":-30},
                {label:'Rejected',"value":-10},
                {label:'Rejected permanently',"value":-100},
            ],
            modeOptions: [
                {label:'Published',"value":'submitted'},
                {label:'Draft',"value": 'draft'},
            ],
            featuredOption: '',
            featuredOptions: [
                {label:'All', value: ''},
                {label:'Featured', value: true}
            ],
            visible: '',
            userId: '',
            visibleOptions: [
                {label:'All', value: ''},
                {label:'Visible', value: true},
                {label:'Not visible', value: false}
            ],
            mode: '',
            user: {
                text:'',
                status: '',
                id: ''
            },
            account: {
                reviewHistory: []
            },
            checked: '',
            images: [],
            feedbackOptions: [
                {label:'Invalid story',"value":1},
                {label:'Inappropriate coverPhoto',"value": 2},
                {label:'Video too long',"value": 3},
                {label:'Inappropriate Title',"value": 4},
                {label:'Others ',"value": 5},
                ],
            items: [],
            fields: [
                {key: 'actions', label: 'Actions'},
                {key: 'title', label: 'Title'},
                {key: 'visibility', label: 'Visibility'},
                {key: 'status', label: 'Running Status'},
                {key: 'target', label: 'Target'},
                // {key: 'shortDesc', label: 'Description'},
                {key: 'coverPhoto', label: 'Banner'},
                {key: 'createdAt', label: 'Created At'},
                {key: 'updatedAt', label: 'Updated At'},
            ],
            pendingFields: [
                {key: 'actions', label: 'Actions'},
                {key: 'id', label: 'ID'},
                {key: 'title', label: 'Title'},
                {key: 'visibility', label: 'Visibility'},
                {key: 'status', label: 'Running Status'},
                {key: 'target', label: 'Target'},
                // {key: 'shortDesc', label: 'Description'},
                {key: 'coverPhoto', label: 'Banner'},
                {key: 'createdAt', label: 'Created At'},
                {key: 'updatedAt', label: 'Updated At'},
            ],
            approvedFields: [
                {key: 'actions', label: 'Actions'},
                {key: 'title', label: 'Title'},
                {key: 'status', label: 'Running Status'},
                {key: 'type', label: 'Type'},
                {key: 'coverPhoto', label: 'Banner'},
                {key: 'createdAt', label: 'Created At'},
                {key: 'updatedAt', label: 'Updated At'},
            ],
            searchParams: {},
            itemBusy: false,
            pageBusy: false,
            showSidebar: false,
            applicationStatus: 0,
        }
    },
    computed: {
        websiteLink(){
            return process.env.NODE_ENV == 'production' ? this.link: this.stagingLink
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
                    value: 3,
                    label: 'Run',
                }
                this.user.text = '';
            }else{
                this.user.status = '';
            }
        },
        mode(data){
            if(data && data.value == 'draft'){
                this.fields = this.approvedFields
            }else{
                this.fields = this.pendingFields
            }
            console.log(data);
            this.setStates();
            this.filterFeedback();
        }
    },
    created() {
        this.items = Utils.completeTable();
        const  { user } = this.$route.query;
        if(user){
            this.userId = user;
        }
        // this.getFundraisers();
    },
    mounted() {
        this.mode = this.modeOptions[0];
        if(process.env.NODE_ENV == 'development') this.link = "http://localhost:3000";
        else if(process.env.NODE_ENV == 'staging') this.link = "https://staging.givelycf.com";
        this.ftoken = vm.$fileAccessToKen;
    },
    methods: {
        currency: Utils.formatCurrency,
        toggleVisibility(item){
            const isVisible = item.isVisible ? false : true;
            API.toggleVisibility({isVisible}, item._id).then(res=>{
                if(res.success) {
                    this.items = this.items.map(i=>{
                        if(i._id == item._id) {
                            i = res.data;
                        }
                        return i
                    })
                }
            }).catch(e => {
                console.log(e);
            });
        },
        toggleFeatured(item){
            const isFeatured = item.isFeatured ? false : true;
            API.toggleFeatured({isFeatured}, item._id).then(res=>{
                if(res.success) {
                    this.items = this.items.map(i=>{
                        if(i._id == item._id) {
                            i = res.data;
                        }
                        return i
                    })
                }
            }).catch(e => {
                console.log(e);
            });
        },
        setStates(){
            if(this.mode.value == 'draft'){
                this.statusOptions = [
                    {label:'Not submitted',"value":1},
                    {label:'Pending',"value":2},
                    {label:'Approved',"value":10},
                    // {label:'Initialized',"value":20},
                    {label:'Rejected',"value":-10},
                    {label:'Pending deletion',"value":500},
                ]
            }else{
                this.statusOptions = [
                    {label:'Approved',"value":100},
                    {label:'Running',"value":300}, // running
                    {label:'Paused',"value":400},
                    {label:'Stopped',"value":-300},
                    {label:'Pending Deletion',"value":-500},
                ]
            }
            this.status = '';
        },
        showFundraiser(data = {}) {
            this.account = data;
            this.$bvModal.show('view-fundraiser');
        },
        openFundraiser(data = {}) {
            this.account = data;
            this.$bvModal.show('view-fundraiser');
        },
        triggerViewImage(image = []) {
            this.images = image;
            this.$bvModal.show('view-images');
        },
        runFundraiser(e) {
            API.runFundraiser({id: this.account._id}).then(res=>{
                if(res.success) {
                    this.user.status = '';
                    this.user.text = '';
                    setTimeout(()=>{
                        this.getFundraisers(this.currentPage);
                    },200);
                    e();
                    this.showSidebar = false;
                    this.showToast('Fundraiser started successfully','CheckCircle','success');
                }
            }).catch(err=>{
                console.log(err);
            })
        },
        pauseFundraiser(e) {
            API.pauseFundraiser({id: this.account._id}).then(res=>{
                if(res.success) {
                    this.user.status = {};
                    this.user.text = '';
                    setTimeout(()=>{
                        this.getFundraisers(this.currentPage);
                    },200);
                    e();
                    this.showSidebar = false;
                    this.showToast('Fundraiser paused successfully','CheckCircle','success');
                }
            }).catch(err=>{
                console.log(err);
            })
        },
        deleteFundraiser(fundraiser) {
            this.$bvModal.msgBoxConfirm(`Are you sure you want to delete this fundraiser "${fundraiser.title}"`, {
                title: 'Confirm fundraiser deletion',
                size: 'sm',
                buttonSize: 'sm',
                okVariant: 'danger',
                okTitle: 'YES',
                cancelTitle: 'NO',
                footerClass: 'p-2',
                hideHeaderClose: false,
                centered: true
            }).then(value => {
                if(value){
                    API.deleteFundraiser({id: fundraiser._id}).then(res=>{
                        if(res.success) {
                            this.user.status = {};
                            this.user.text = '';
                            setTimeout(()=>{
                                this.getFundraisers(this.currentPage);
                            },200);
                            this.showSidebar = false;
                            this.showToast('Fundraiser deleted successfully','CheckCircle','success');
                        }
                    }).catch(err=>{
                        console.log(err);
                    })
                }
            }).catch(err => {
                // An error occurred
            })
        },
        addReview(e) {
            // if(this.applicationStatus == 1){
            //     this.runFundraiser(e);
            //     return 0;
            // }
            const data = {
                id: this.account.id,
                message: '',
                status: this.applicationStatus == 1? 30:(this.applicationStatus == 2? -10: -100)
            }
            if(this.user.status.value == 5){
                data.message = this.user.text.trim();
            }else if(this.applicationStatus != 1){
                data.message = this.user.status.label + ". " + this.user.text.trim();
            }
            API.reviewFundraiser({...data}).then(res=>{
                if(res.success && res.data) {
                    this.resetReview();
                    setTimeout(()=>{
                        this.getFundraisers(this.currentPage);
                    },200);
                    e();
                    this.showToast('Review Added successfully','CheckCircle','success');
                }
            }).catch(err=>{
                console.log(err);
            })
        },
        resetReview(){
            this.user = {
                text:'',
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
        loadNewPage(e,page) {
            console.log(page)
            e.preventDefault();
            this.getFundraisers(page);
        },
        getFundraisers(page = 1) {
            // this.pageBusy = true;
            API.getFundraisers({...this.searchParams, page, mode: this.mode.value || 'submitted'}).then(res => {
                this.pageBusy = false;
                if(res.success && res.data) {
                    this.currentPage = res.data.currentPage;
                    this.items = Utils.completeTable(res.data.list);
                    this.totalRows = res.data.total || 10;
                }
            }).catch(() => {
                this.pageBusy = false;
                this.showToast();
            })
        },
         filterFeedback() {
        
            this.searchParams = {};
            if(this.searchTitle) {
                this.searchParams.title = this.searchTitle;
            }
            if(this.featuredOption) {
                this.searchParams.isFeatured = true;
            }
            if(this.userId) {
                this.searchParams.userId = this.userId;
            }
            if(this.visible !== '') {
                this.searchParams.isVisible = this.visible;
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
            
            this.getFundraisers(1);
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
    #carousel-main{
        text-align: center !important;
        img{
            height: 480px !important;
            width: auto !important;
        }
    }
</style>