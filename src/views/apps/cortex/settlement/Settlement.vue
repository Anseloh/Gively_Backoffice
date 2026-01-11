<template>
    <div class="cortex-container" style="position: relative;">
        <b-card>
            <b-card-text>
                <div class="d-flex justify-content-between">
                    <div>
                        <b-nav fill>
                            <b-nav-item :active="true">
                                Settlements
                            </b-nav-item>
                            <b-nav-item></b-nav-item>
                        </b-nav>
                    </div>
                    <div>
                        <b-button class="mr-1" variant="outline-primary" @click="triggerCreateSettlement">
                            Create Settlement
                        </b-button>
                        <!-- <b-button class="mr-2" variant="outline-primary">
                            Generate Batch
                        </b-button>
                        <b-button variant="outline-primary" @click="initiateComparison">
                            Reconcile
                        </b-button> -->
                        <!-- <b-button-group>
                            <b-button
                                :variant="isListViewActive ? 'primary' : 'flat-primary'" @click="onListView"
                            >
                                <feather-icon size="18" icon="ListIcon"></feather-icon>
                            </b-button>
                            <b-button
                                :variant="isTableViewActive ? 'primary' : 'flat-primary'" @click="onTableView">
                                <feather-icon size="18" icon="GridIcon"></feather-icon>
                            </b-button>
                        </b-button-group> -->
                    </div>
                </div>
                <div>
                    <!-- <h4>Available Columns</h4> -->
                    <!-- <b-row>
                        <b-col cols="6" v-for="(item, index) in listFields" :key="index">
                            <b-form-checkbox
                                v-model="selectedColumns"
                                :value="item"
                                size="md"
                                class="mb-1"
                            >
                            {{ item.label }}
                            </b-form-checkbox>
                        </b-col>
                    </b-row> -->
                </div>
            </b-card-text>
        </b-card>
        <b-row>
            <b-col cols="12">
                <b-card>
                    <b-card-body>
                        <b-table
                            class="rounded border"
                            :items="settlementList"
                            :fields="fields"
                            :per-page="10"
                            :current-page="1"
                            responsive
                            striped
                            hover
                            @row-clicked="triggerDetail"
                        >

                            <template #head()="scope">
                                <div class="text-nowrap text-primary">
                                    {{ scope.label }}
                                </div>
                            </template>

                            <template #cell(name)="data">
                                <span class="text-nowrap" v-if="data.item.id">
                                    <div class="d-flex align-items-center">
                                        <div class="pr-1">
                                            <b-avatar variant="secondary">
                                                <feather-icon icon="FileTextIcon" size="20">

                                                </feather-icon>
                                            </b-avatar>
                                        </div>
                                        <div class="w-100">
                                            {{data.value}}
                                        </div>
                                    </div>
                                </span>
                            </template>
                            <template #cell(type)="data">
                                <span class="text-nowrap badge badge-primary" v-if="data.item.id">
                                    {{(data.item.feedbackType == 1)? 'Hard to Use': (data.item.feedbackType == 2? 'Crash': (data.item.feedbackType == 3? 'Bug': (data.item.feedbackType == 4? 'Transaction': 'Other')))}}
                                </span>
                            </template>
                            <template #cell(userPhone)="data">
                                <span class="text-nowrap" v-if="data.item.id">
                                <span v-if="data.value.trim().length">
                                    {{ data.value }}
                                </span>
                                <small class="font-italic" v-else>
                                    No phone number
                                </small>
                                </span>
                            </template>
                            <template #cell(status)="data">
                                <span class="text-nowrap" v-if="data.item.id">
                                    <b-badge variant="dark" class="text-capitalize">
                                        {{ data.item.statusText }}
                                    </b-badge>
                                    <!-- <b-badge :variant="displayStatus[1][data.value]">
                                        {{ displayStatus[0][data.value] }}
                                    </b-badge> -->
                                </span>
                            </template>
                            <template #cell()="data">
                                <div class="text-nowrap pt-1">
                                    {{data.value}}
                                </div>
                            </template>
                            <template #cell(businessType)="data">
                                <div class="text-nowrap pt-1 small" v-if="data.item.id">
                                    {{data.value == 3? 'Corporate Business': 'Private Business'}}
                                </div>
                            </template>
                            <template #cell(createdAt)="data">
                                <div class="text-nowrap pt-1" v-if="data.item.id">
                                    {{ date(data.value) }}
                                </div>
                            </template>
                            <template #cell(actions)="data">
                                <div class="text-nowrap" v-if="data.item.id">
                                    <b-button size="sm" pill variant="outline-primary" v-b-toggle.validate @click="triggerDetail(data.item)">
                                    View Detail
                                    </b-button>
                                </div>
                            </template>
                            <template #cell(images)="data">
                                <span class="text-nowrap" v-if="data.item.id">
                                    <small class="font-italic" v-if="!data.value.length">
                                    No image
                                    </small>
                                    <b-button v-else variant="outline-primary" size="sm" pill v-b-toggle.images>
                                        See images
                                    </b-button>
                                </span>
                            </template>
                        </b-table>
                    </b-card-body>
                </b-card>
            </b-col>
        </b-row>

        <!-- Create settlement modal -->
        <b-modal centered id="create-settlement" title="Create Settlement" ok-title="Create Settlement" :ok-disabled="!settlementName.length" @ok="createSettlement">
            <div class="row">
                <div class="p-2 col-12">
                    <label for="">Settlement Title</label>
                    <b-form-input v-model="settlementName" autofocus>

                    </b-form-input>
                </div>
            </div>
        </b-modal>

        <!-- batch files sidebar -->
        <b-sidebar
            id="sidebar-from-bank"
            bg-variant="white"
            right
            shadow
            v-model="rightSideBar"
            width="50%"
            no-close-on-esc
        >
            <template #header="{  }">
                <div class="w-100">
                    <strong class="mr-auto text-truncate">{{ selectedSettlement.name }}</strong>
                </div>
                <div class="">
                    <b-button size="sm" @click="hideSidebar" variant="outline-danger">
                        <feather-icon icon="XIcon"></feather-icon>
                    </b-button>
                </div>
            </template>
            <template #footer="">
                <div class="d-flex align-items-center p-1 bg-secondary">
                    <div class="w-100">
                        <b-button variant="light" @click="generateBatch">Generate Batch File</b-button>
                    </div>
                    <div class="w-100 text-right">
                        <b-button @click="reconcileSettlement" variant="danger">
                            Reconcile Settlement
                        </b-button>
                    </div>
                </div>
            </template>
            <b-row class="m-0 sidebar-content">
                <!-- <b-col cols="1" style="background-color: rgba(50, 50, 50, 0.3)"></b-col> -->
                <b-col cols="12 mx-auto">
                    <b-list-group class="rounded bordered">
                        <div v-for="(item, index) in batches" :key="index" class="">
                           <b-list-group-item>
                               <div class="d-flex cursor-pointer" @click="listBatchDetail(item)">
                                   <h4 class="text-capitalize text-primary w-100">{{ item.typeText || 'Nothing to settle' }}</h4>
                                   <div class="pl-1 text-nowrap">{{ date(item.createdAt) }}</div>
                               </div>
                               <div class="d-flex pb-1">
                                   <div class="">
                                       <h3 class="d-inline">{{ currency(item.amount || 0, item.currencyCode || 'XAF') }}</h3><span class="text-primary font-weight-bold">{{ item.currencyCode || 'XAF' }}</span>
                                   </div>
                                   <div class="w-100 text-right">
                                       Batch ID: <h5 class="d-inline pl-1 font-weight-bolder">{{ item.id }}</h5>
                                   </div>
                               </div>
                               <div class="d-flex">
                                   <div class="w-100">
                                       <b-button size="" @click="downloadBatch(item)"> Download File <feather-icon icon="DownloadCloudIcon"></feather-icon></b-button>
                                       <div>{{ item.statusText }}</div>
                                   </div>
                                   <div class="w-100 text-right">
                                       <b-button variant="warning" size="" @click="triggerUpload(item)">Upload Bank Response <feather-icon icon="UploadCloudIcon"></feather-icon></b-button>
                                       <b-form-file id="responseFile" class="d-none" @change="sendResponse">

                                       </b-form-file>
                                   </div>
                               </div>
                            </b-list-group-item>
                        </div>
                    </b-list-group>
                </b-col>
            </b-row>
            <div class="mt-2">
                <div class="d-flex align-items-center p-1">
                    <div class="w-100">
                        <b-button :disabled="!(batchNum>1)" @click="getBatches(batchNum - 1, selectedSettlement.id)">Prev</b-button>
                    </div>
                    <div class="w-100 text-center">
                      Page  {{ batchNum }} of {{ Math.ceil(totalBatches / 10) }}
                    </div>
                    <div class="w-100 text-right">
                        <b-button @click="getBatches(batchNum + 1, selectedSettlement.id)">
                            Next
                        </b-button>
                    </div>
                </div>
            </div>
        </b-sidebar>
        <b-modal centered id="batch-list" size="xl" ok-only no-close-on-backdrop no-close-on-esc title="Display batch details">
            <div class="text-wrap">
                <json-view :data="listBatch" rootKey="view" />
            </div>
        </b-modal>
    </div>
</template>
<script>
import {
  onMounted,
  ref
} from "@vue/composition-api";
import { beautifyObjKey } from '@/@core/utils/utils';
import utils from '@/utils/index'
import ToastificationContent from '@core/components/toastification/ToastificationContent.vue'
import API from "../api"

export default {
    data() {
        return {
            date: utils.formatDate,
            batches: [],
            batchNum: 1,
            totalBatches: 10,
            rightSideBar: false,
            selectedSettlement: {},
            tmpBatch: {},
            listBatch: {},
            settlementName: '',
            currentPage: 1,
            currency: utils.formatCurrency
        }
    },
    mounted() {
        this.settlementList = utils.completeTable();
        this.getSettlementList();
        setInterval(e=>{
            this.getSettlementList(this.currentPage, true);
            if(this.selectedSettlement.id) {
                this.getBatches(this.batchNUM, this.selectedSettlement.id, true);
            }
        }, 5000);
    },
    methods:{
        hideSidebar() {
            this.rightSideBar = false;
            this.selectedSettlement = {};
        },
        reconcileSettlement() {
            API.reconcileSettlement({id: this.selectedSettlement.id}).then(res=>{
                if(res.success) {
                    this.selectedSettlement = res.data;
                    this.settlementList = this.settlementList.map(settlement=>{
                        if(settlement.id == this.selectedSettlement.id) {
                            settlement = this.selectedSettlement;
                        }
                        return settlement;
                    })
                    this.showToast('Settlement reconciled successfully', 'CheckCircleIcon', 'success');
                }
            }).catch(err=>{
                console.log(err);
                this.showToast('Failed to reconcile settlement');
            })
        },
        listBatchDetail(batch) {
            this.listBatch = this.formatObjectKey(batch);
            this.$bvModal.show('batch-list');
        },
        capitalizeText( params) {
            // Format camel-case to standard phrase
            let phrasedKey = params.split(/(?=[A-Z])/).map(s => s.charAt(0).toUpperCase() + s.substring(1)).join(" ");
            return phrasedKey;
        },

        formatObjectKey(params) {
            let result = {};
            Object.keys(params).forEach(key => {
                const elem =  params[key];

                if( elem !== null && elem !== undefined && typeof elem === 'object' && !Array.isArray(elem)) {
                    // For objects only
                    result[this.capitalizeText(key)] = this.formatObjectKey(elem);
                } else if (elem !== null && elem !== undefined && Array.isArray(elem)) {
                    let tempArray = [];
                    for (let x = 0; x < elem.length; x++) {
                        const item = elem[x];
                        tempArray.push(this.formatObjectKey(item))
                        // We can add another internal check here of Array[{Object: {Object}}] and so on and so forth
                    }
                        // console.log(tempArray)
                    result[this.capitalizeText(key)] = tempArray;
                } else {
                    result[this.capitalizeText(key)] = elem;
                }

                // delete params[key];
            });

            // console.log("params====",params);
            return result;
        },
        triggerCreateSettlement() {
            console.log('hello')
            this.$bvModal.show('create-settlement');
        },
        createSettlement(e) {
            e.preventDefault();
            if(this.settlementName.trim().length) {
                API.createBankSettlement({name: this.settlementName}).then(result => {
                    if(result.success) {
                        this.settlementList.unshift(result.data);
                        this.settlementName = '';
                        this.$bvModal.hide('create-settlement');
                        this.showToast('Settlement created successfully', 'CheckCircleIcon', 'success');
                    }
                }).catch(err=>{
                    console.log(err);
                    this.showToast('Failed to create settlement');
                })
            }else{
                this.showToast('Please enter the title / name of the settlement');
            }
        },
        async sendResponse(e) {
            var files = e.target.files || e.dataTransfer.files;
            if (!files.length) {
                return;
            }
            await API.uploadResponse({files: files}, this.tmpBatch.id).then(res=>{
               if(res.success) {
                   this.showToast("Bank response Uploaded successfully", "CheckCircleIcon", "success");
                   this.batches = this.batches.map(batch=>{
                       if(batch.id == this.tmpBatch.if) {
                           batch = res.data;
                       }
                       return batch;
                   })
               }
            }).catch(er=>{
                this.showToast('Unable to upload bank response');
            })
            document.getElementById('responseFile').value = '';
        },
         generateBatch() {
            API.genBatchFiles({id:this.selectedSettlement.id}).then(res=>{
                if(res.success) {
                    this.showToast("Batch file generated successfully", "CheckCircleIcon", "success");
                    this.batches.unshift(res.data);
                }
            })
        },
        triggerUpload(batch) {
            this.tmpBatch = batch;
            document.getElementById('responseFile').click();
        },
        download(filename, text) {
            var element = document.createElement('a');
            element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(text));
            element.setAttribute('download', filename);

            element.style.display = 'none';
            document.body.appendChild(element);

            element.click();

            document.body.removeChild(element);
        },
        downloadBatch(batch) {
            API.downloadBatch(batch.id).then(res=>{
                this.download(`${this.selectedSettlement.name || ''}_${batch.submittedAt || ''}.txt`, res);
            })
        },
        getBatches(page = 1, settlement = '', debounce = false) {
            API.settlementBatchesList(`?page=${page}${settlement.length? '&settlementTreasuryId=' + settlement: ''}`, debounce).then(res=>{
                if(res.success) {
                    if(this.selectedSettlement.id == settlement) {
                        if(page>1) {
                            this.batches = res.data.list;
                        }else {
                            this.batches = res.data.list;
                        }
                        this.totalBatches = res.data.totalItems;
                        this.batchNum = res.data.currentPage;
                        console.log(this.batches)
                        this.rightSideBar = true;
                    }
                }
            }).catch(err=>{
                console.log(err);
            })
        },
        paginateBatch(page = 1) {
            this.getBatches(page, this.selectedSettlement.id);
        },
        triggerDetail(settlement) {
            this.selectedSettlement = settlement;
            this.getBatches(1, settlement.id);
        },
        showToast(message, icon = 'XCircleIcon', variant = 'danger') {
            this.$toast({
                component: ToastificationContent,
                props: {
                    title: message || 'Error fetching applications',
                    icon: icon || 'InfoIcon',
                    variant: variant || 'danger',
                },
            })
        },
        async getSettlementList(pageNum = 1, debounce = false) {
            await API.settlementBankList(`?page=${pageNum}`,debounce).then(res=>{
                if(res.success) {
                    this.settlementList = utils.completeTable(res.data.list);
                    this.currentPage = res.data.currentPage;
                }
            }).catch(error=>{
                if(!debounce) {
                    this.showToast('Failed to get settlement data');
                }
                console.log(error);
            })
        }
    },
    setup() {
        const reconcileDisplay = ref(false);
        const settlementData = ref({});
        const settlementList = ref([]);

        const statuses = ref([
            {},
            {}
        ])

        const fields = ref([
                {key: 'id', label: 'ID'},
                {key: 'name', label: 'Name'},
                {key: 'status', label: 'Status'},
                {key: 'tag', label: 'Tag'},
                {key: 'createdAt', label: 'Created At'},
                {key: 'actions', label: 'Actions'},
            ]);

        const cleanKey = key => {
            if (key) {
                return beautifyObjKey(key);
            }
            return null;
        }

        const initiateComparison = () => {
            reconcileDisplay.value = true;
        }

        const closeReconcile = () => {
            reconcileDisplay.value = false;
        }

        return {
            cleanKey,
            fields,
            closeReconcile,
            settlementData,
            reconcileDisplay,
            initiateComparison,
            settlementList
        }
  },
};
</script>
<style>
    .sidebar-content{
        overflow-y: auto;
    }
    .json-view-item .value-key {
        color: #ffa50099 !important;
    }
</style>