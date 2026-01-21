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
                    <label>Event Types</label>
                    <v-select  v-model="featuredOption" :reduce="e=>e.value" :options="featuredOptions" :searchable="false" :clearable="false"></v-select>
                </div>
                <div class="col-lg-3 col-12 col-md-6" v-if="mode && mode.value != 'draft'">
                    <label>Visibility</label>
                    <v-select  v-model="visible" :reduce="e=>e.value" :options="visibleOptions" :searchable="false" :clearable="false"></v-select>
                </div> -->
                <!-- <div class="col-lg-3 col-12 col-md-6">
                    <label>State</label>
                    <v-select  v-model="status" :options="statusOptions"></v-select>
                </div> -->
                <div class="col-lg-3 col-12 col-md-6">
                    <label>Event title</label>
                    <input v-model="searchTitle" type="text" class="form-control" placeholder="">
                </div>
                <div class="col-lg-3 col-12 col-md-6">
                    <label>Event id</label>
                    <input v-model="eventIt" type="text" class="form-control" placeholder="">
                </div>
                <div class="col-lg-3 col-12 col-md-6 pt-2 pt-lg-2" @click="filterFeedback()">
                    <span class="btn btn-primary"> <feather-icon icon="SearchIcon" /> Search</span>
                </div>
            </div>
        </b-card>
        <b-card>
            <b-overlay :show="itemBusy">
                <div class="p-1">
                    <b-button variant="primary" @click="triggerCreateEvent()"><feather-icon icon="PlusIcon" />  Create event</b-button>
                </div>
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
                           {{eventTargets[data.item.eventType]}}
                        </span>
                    </template>
                    <template #cell(title)="data">
                        <span class="three-line-ellipsis" v-if="data.item._id">
                           {{data.value}}
                        </span>
                        <div v-else class="pt-2">
                        
                        </div>
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
                                    Is a featured event
                                </b-badge>
                            </div>
                        </span>
                    </template>
                    <template #cell()="data">
                        <div class="text-nowrap pt-1">
                            {{data.value}}
                        </div>
                    </template>
                    <template #cell(ticket)="data">
                        <div class="text-nowrap pt-1" v-if="data.value">
                            <div>
                              Price: <span class="font-weight-bolder">{{ data.value.amount }} <small class="text-primary">{{ data.value.currencyCode }}</small></span> 
                            </div>
                            <div>
                              Capacity: <span class="font-weight-bolder">{{ data.value.capacity }} </span> 
                            </div>
                        </div>
                    </template>
                    <template #cell(speakers)="data">
                        <div class="text-nowrap pt-1" v-if="data.value">
                            <div>
                              Speakers: <span class="font-weight-bolder">{{ data.value.length }} </span> 
                            </div>
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
                            <b-dropdown-item :to="`/transactions/tickets?eventId=${data.item.id}`" v-if="mode.value != 'draft'">
                                <feather-icon
                                    icon="NoteIcon"
                                />
                                See attendees
                            </b-dropdown-item>
                            <!-- <b-dropdown-item @click="toggleVisibility(data.item)" v-if="mode.value != 'draft'">
                                <feather-icon
                                    :icon="data.item.isVisible ? 'EyeOffIcon': 'EyeIcon'"
                                />
                                {{ data.item.isVisible? "Hide from website": "Show on website" }}
                            </b-dropdown-item> -->
                            <!-- <b-dropdown-item @click="resetSubmission(data.item)">
                                <feather-icon
                                    :icon="'SettingsIcon'"
                                />
                                Reset submission
                            </b-dropdown-item> -->
                            <!-- <b-dropdown-item @click="toggleFeatured(data.item)" v-if="mode.value != 'draft'">
                                <feather-icon
                                    icon="TagIcon"
                                />
                                {{ data.item.isFeatured? "Remove from featured": "Make as featured" }}
                            </b-dropdown-item> -->
                            <!-- <b-dropdown-item @click="showEvent(data.item)" v-if="mode.value == 'draft'">
                                <feather-icon
                                    icon="EyeIcon"
                                />
                                Preview
                            </b-dropdown-item> -->
                            <!-- <b-dropdown-item v-else target="_blank" :href="`${websiteLink}/event/${data.item._id}`">
                                <feather-icon
                                    icon="EyeIcon"
                                />
                                Preview
                            </b-dropdown-item> -->
                            
                            <!-- <b-dropdown-item variant="danger" v-if="mode.value == 'draft' && data.item.status == statuses.pendingDeletion" @click="deleteEvent(data.item)">
                                <feather-icon
                                    icon="TrashIcon"
                                />
                                Delete event
                            </b-dropdown-item> -->
                        </b-dropdown>
                    </template>
                    <template #cell(coverPhoto)="data">
                        <span class="text-nowrap" v-if="data.item._id">
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
            <b-modal id="view-event" ok-only title="View Event Detail" size="xl" centered no-close-on-backdrop no-close-on-esc>
               <div class="row">
                   <div class="col-12" style="min-height: 600px;">
                       <iframe class="w-100" height="100%" :src="`${link}/preview-event/data-only/event?id=${account._id}&mode=${mode.value}`" frameborder="0"></iframe>
                       <!-- <event :event="account" /> -->
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
                title="Event information"
                title-background="primary"
                no-close-on-backdrop
                >
                <template #footer="{ hide }">
                    <div class="d-flex bg-dark text-light align-items-center p-1">
                        <b-button variant="primary" @click="addEvent(hide)">Submit now</b-button>
                    </div>
                </template>
                <template #default="{  }">
                    <div style="max-width: 400px;">
                        <div class="p-2 border-bottom border-top">
                            <h5 class="font-weight-bolder">Title</h5>
                            <b-input v-model="event.title"></b-input>
                            <div class="mt-2">
                                <h5 class="font-weight-bolder">Description</h5>
                                <b-textarea v-model="event.desc"></b-textarea>
                            </div>
                            <div class="mt-2">
                                <h5 class="font-weight-bolder">Date</h5>
                                <b-input type="datetime-local" v-model="event.date" />
                            </div>
                            <div class="mt-2">
                                <h5 class="font-weight-bolder">Location</h5>
                                <b-input v-model="event.location"></b-input>
                            </div>
                            <div class="mt-2">
                                <h5 class="font-weight-bolder">Cover photo</h5>
                                <img :src="event.coverPhoto" alt="" class="rounded d-inline-block" style="max-width: 300px;">
                            </div>
                            
                            <div class="mt-2 border-rounded border p-1">
                                <h5 class="font-weight-bolder text-primary">Ticket </h5>
                                <h6 class="font-weight-bolder">Amount </h6>
                                <b-input-group >
                                    <b-input v-model="event.ticket.amount" type="number" />
                                    <b-input-group-prepend is-text>
                                        {{ event.ticket.currencyCode }}
                                    </b-input-group-prepend>
                                </b-input-group>
                                <h6 class="font-weight-bolder mt-1">Capacity </h6>
                                <b-input-group >
                                    <b-input v-model="event.ticket.capacity" type="number" />
                                </b-input-group>
                            </div>
                            <div class="mt-2">
                                <h5 class="font-weight-bolder text-primary">Speakers </h5>
                                <div v-for="(item, i) in event.speakers" :key="i" class="border-rounded border p-1 my-1">
                                    <h6 class="font-weight-bolder mt-1">Name </h6>
                                    <b-input v-model="item.name"/>
                                    <h6 class="font-weight-bolder mt-1">Position </h6>
                                    <b-input v-model="item.post" />
                                    <h6 class="font-weight-bolder mt-1">Image </h6>
                                    <img src="https://placehold.co/400" style="height: 75px;" alt="">
                                </div>
                                <div class="mt-1">
                                    <b-button size="sm" variant="success" @click="addSpeaker">Add speaker</b-button>
                                </div>
                            </div>
                        
                            

                        </div>
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
import Event from './SingleEvent.vue'

const vm = new Vue({});
const toast = useToast()
export default {
    name: 'Feedback',
    components: {
        flatPickr,
        vSelect,
        Event
    },
    data() {
        return {
            event: {
                title: '',
                desc: '',
                date: '',
                location: '',
                coverPhoto: 'https://nabdgzjpwhkjfimljnql.supabase.co/storage/v1/object/public/replicate-cache/29d39e5e77cea57baab362511463ae21.webp',
                ticket: {
                    amount: null,
                    capacity: '',
                    currencyCode: 'CAD'
                },
                speakers: [

                ]
            },
            speaker: {
                name: '',
                post: '',
                image: 'https://placehold.co/400'
            },
            eventTargets:{
                '1': 'Yourself',
                '5': 'Someone else',
                '10': 'Charity',
                // rejected: -10,
            },
            link: 'https://www.givelycf.com',
            stagingLink: 'https://staging.givelycf.com',
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
            statuses: {
                initialized: 20,
                notPublished: 1,
                pending: 2,
                approved: 10,
                rejected: -10,
                running: 300,
                stopped: -300,
                approved2: 100,
                paused: 400,
                pendingDeletion: 500,
            },
            displayStatus:[
                {
                    10: "Pending",
                    20: "Paused",
                    30: "Running",
                    40: "Ended",
                    '-30': "Cancelled",
                    'undefined': 'Unknown status'
                },
                {
                    10: "dark",
                    20: "warning",
                    30: "success",
                    40: "primary",
                    '-30': "Cancelled",
                    'undefined': 'dark'
                },
            ],
            statusOptions: [
                {label:'Pending',"value":10},
                {label:'Paused',"value":20},
                {label:'Running',"value":30},
                {label:'Ended',"value":40},
                {label:'Canceled',"value":-30},
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
            eventIt: '',
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
                {key: 'speakers', label: 'Speakers'},
                {key: 'price', label: 'Price'},
                // {key: 'shortDesc', label: 'Description'},
                {key: 'coverPhoto', label: 'Banner'},
                {key: 'createdAt', label: 'Created At'},
                {key: 'updatedAt', label: 'Updated At'},
            ],
            pendingFields: [
                {key: 'actions', label: 'Actions'},
                {key: 'title', label: 'Title'},
                {key: 'visibility', label: 'Visibility'},
                {key: 'speakers', label: 'Speakers'},
                {key: 'ticket', label: 'Price'},
                
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
                // {key: 'shortDesc', label: 'Description'},
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
            // 
        }
        // this.getEvents();
    },
    mounted() {
        this.mode = this.modeOptions[0];
        if(process.env.NODE_ENV == 'development') this.link = "http://localhost:3000";
        else if(process.env.NODE_ENV == 'staging') this.link = "https://staging.givelycf.com";
        this.ftoken = vm.$fileAccessToKen;
    },
    methods: {
        addSpeaker(){
            this.event.speakers.push(
                JSON.parse(JSON.stringify(this.speaker))
            )
        },
        triggerCreateEvent(){
            this.showSidebar = true;
            this.resetEvent();
            this.$nextTick(e=>{
                this.addSpeaker();
            })
        },
        resetSubmission(item){
            API.resetSubmission({}, item._id).then(res=>{
                if(res.success) {
                    this.showToast('Event draft submission reset successfully','CheckCircle','success');
                }
            }).catch(e => {
                console.log(e);
            });
        },
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
        showEvent(data = {}) {
            this.account = data;
            this.$bvModal.show('view-event');
        },
        openEvent(data = {}) {
            this.account = data;
            this.$bvModal.show('view-event');
        },
        triggerViewImage(image = []) {
            this.images = image;
            this.$bvModal.show('view-images');
        },
        runEvent(e) {
            API.runEvent({id: this.account._id}).then(res=>{
                if(res.success) {
                    this.user.status = '';
                    this.user.text = '';
                    setTimeout(()=>{
                        this.getEvents(this.currentPage);
                    },200);
                    e();
                    this.showSidebar = false;
                    this.showToast('Event started successfully','CheckCircle','success');
                }
            }).catch(err=>{
                console.log(err);
            })
        },
        pauseEvent(e) {
            API.pauseEvent({id: this.account._id}).then(res=>{
                if(res.success) {
                    this.user.status = {};
                    this.user.text = '';
                    setTimeout(()=>{
                        this.getEvents(this.currentPage);
                    },200);
                    e();
                    this.showSidebar = false;
                    this.showToast('Event paused successfully','CheckCircle','success');
                }
            }).catch(err=>{
                console.log(err);
            })
        },
        deleteEvent(event) {
            this.$bvModal.msgBoxConfirm(`Are you sure you want to delete this event "${event.title}"`, {
                title: 'Confirm event deletion',
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
                    API.deleteEvent({id: event._id}).then(res=>{
                        if(res.success) {
                            this.user.status = {};
                            this.user.text = '';
                            setTimeout(()=>{
                                this.getEvents(this.currentPage);
                            },200);
                            this.showSidebar = false;
                            this.showToast('Event deleted successfully','CheckCircle','success');
                        }
                    }).catch(err=>{
                        console.log(err);
                    })
                }
            }).catch(err => {
                // An error occurred
            })
        },
        validateEvent(){
            let result = true;

            if(!this.event.title){
                result = false
            }
            if(!this.event.desc) result = false
            if(!this.event.date) result = false
            if(!this.event.location) result = false
            if(!this.event.coverPhoto) result = false
            if(!this.event?.ticket?.amount) result = false
            if(!this.event?.ticket?.capacity) result = false

            for(let i = 0; i<this.event.speakers.length; i++){
                const speaker = this.event.speakers[i];
                if(!speaker.name) result = false;
                if(!speaker.post) result = false;
                if(!speaker.image) result = false;
            }

            return result;

        },
        resetEvent(){
            this.event = {
                title: '',
                desc: '',
                date: '',
                location: '',
                coverPhoto: 'https://nabdgzjpwhkjfimljnql.supabase.co/storage/v1/object/public/replicate-cache/29d39e5e77cea57baab362511463ae21.webp',
                ticket: {
                    amount: null,
                    capacity: '',
                    currencyCode: 'CAD'
                },
                speakers: [

                ]
            }
        },
        addEvent(e) {
            if(!this.validateEvent()){
                this.showToast("All fields are required");
                return;
            }

            const params = {
                ...this.event,
                date: new Date(this.event.date).toISOString()
            }

            API.createEvent(params).then(res=>{

                if(res.success){
                    e();
                    this.resetEvent();
                    this.getEvents();
                }

            }).catch(err=>{
                console.log(err);
                this.showToast('Failed to create event')
            })


            // e();
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
            this.getEvents(page);
        },
        getEvents(page = 1) {
            // this.pageBusy = true;
            API.getEvents({...this.searchParams, page, mode: this.mode.value || 'submitted'}).then(res => {
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
            if(this.eventIt) {
                this.searchParams.eventIt = this.eventIt;
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
            
            this.getEvents(1);
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