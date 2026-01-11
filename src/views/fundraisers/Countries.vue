<template>
    <b-overlay :show="pageBusy" variant="transparent">
        <b-card>
            <div class="row pt-0">
                <div class="col-12 pb-1">
                    <span class="font-weight-bolder">Filters</span>
                </div>
                <div class="col-lg-4 col-12 col-md-6">
                    <label>Date Range</label>
                    <flat-pickr
                        v-model="range"
                        class="form-control"
                        :config="{ mode: 'range'}"
                        />
                </div>
                <!-- <div class="col-lg-4 col-12 col-md-6">
                    <label>State</label>
                    <v-select  v-model="status"  :options="statusOptions"></v-select>
                </div> -->
                <div class="col-lg-4 col-12 col-md-6">
                    <label>Name</label>
                    <input v-model="searchName" type="text" class="form-control" placeholder="">
                </div>
                <div class="col-lg-4 col-12 col-md-6 pt-2 pt-lg-2" @click="filterCategories()">
                    <span class="btn btn-primary"> <feather-icon icon="SearchIcon" /> Search</span>
                </div>
            </div>
        </b-card>Í
        <b-card>
            <div class="pb-1">
              <b-button @click="triggerAddCategory()" variant="primary">Add Category</b-button>
            </div>
            <b-modal id="add-category-modal" centered ok-title="Save" @ok="submittedCategory" :title="category._id ? 'Update Category': 'Create Category'" no-close-on-backdrop no-close-on-esc>
              <div class="mt-2">
                <label for="">Name</label>
                <b-form-input v-model="category.name" autofocus />
                <small class="text-danger">Required</small>
              </div>
              <div class="mt-2">
                <label for="">Description</label>
                <b-form-textarea v-model="category.description" />
                <small class="text-danger">Required</small>
              </div>
            </b-modal>
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
                    <template #cell(name)="data">
                        <span class="text-nowrap" v-if="data.item._id">
                            <div class="d-flex align-items-center">
                                <div class="pr-1">
                                    <b-avatar variant="primary" icon="people">
                                      <template #default>
                                        <div>
                                          <feather-icon icon="TargetIcon"></feather-icon>
                                        </div>
                                      </template>
                                    </b-avatar>
                                </div>
                                <div class="w-100">
                                    {{data.value}}
                                </div>
                            </div>
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
                      <b-dropdown
                        variant="link"
                        no-caret
                        :right="$store.state.appConfig.isRTL"
                        v-if="data.item._id"
                      >
                        <template #button-content>
                          <feather-icon
                            icon="MoreVerticalIcon"
                            size="16"
                            class="align-middle text-body"
                          />
                        </template>
                        <b-dropdown-item>
                          <feather-icon icon="EditIcon" />
                          <span class="align-middle ml-50" @click="triggerEditCategory(data.item)">Edit</span>
                        </b-dropdown-item>
                        <b-dropdown-item @click="triggerRemoveCategory(data.item._id)">
                          <feather-icon icon="TrashIcon"  />
                          <span class="align-middle ml-50">Remove</span>
                        </b-dropdown-item>
                      </b-dropdown>
                    </template>
                    <template #cell(description)="data">
                        <span class="pb-1 text-truncate d-block category-content text-primary cursor-pointer text-center" @click="showModal(data.value)">
                            {{data.value}}
                        </span>
                    </template>
                    <template #cell(shortDescription)="data">
                        <span class="pb-1 text-truncate d-block category-content text-primary cursor-pointer text-center" @click="showModal(data.value)">
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
    name: 'Categories',
    components: {
        flatPickr,
        vSelect,
    },
    data() {
        return {
            category: {

            },
            dayjs: dayjs,
            currentPage: 1,
            totalRows: 10,
            range: '',
            searchDate: '',
            dateRange: '',
            searchName: '',
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
                {key: 'actions', label: 'Actions'},
                {key: 'name', label: 'Name'},
                {key: 'description', label: 'Description'},
                // {key: 'totalActiveCampaigns', label: 'Active Campaigns'},
                {key: 'createdAt', label: 'Created At'},
                {key: 'updatedAt', label: 'Updated At'},
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
        this.getCategories();
    },
    methods: {
      triggerAddCategory(){
        this.category = {
          name: '',
          description: '',
        }
        this.$bvModal.show('add-category-modal');
      },
      triggerEditCategory(category){
        this.category = category;
        this.$bvModal.show('add-category-modal');
      },
      submittedCategory(e){
        e.preventDefault();
        if(!this.category.name){
          this.showToast('Please enter name');
          return 0;
        }
        if(!this.category.description){
          this.showToast('Please enter description');
          return 0;
        }
        this.category.shortDescription = this.category.description;
        const api = this.category._id? 'editCategory': 'addCategory';
        API[api]({...this.category}).then(res => {
          if(res.success){
            if(this.category._id){
              this.items = this.items.map(item=>{
                if(item._id == this.category._id){
                  item = res.data;
                }
                return item;
              })
            }else{
            //   this.items.unshift(res.data);
                this.getCategories();
            }
            this.$bvModal.hide('add-category-modal');
          }
        }).catch(err=>{
          console.log(err);
        })
      },
        loadNewPage(e,page) {
            e.preventDefault();
            this.getCategories(page);
        },
        getCategories(page = 1) {
            // this.pageBusy = true;
            API.getCategories({ ...this.searchParams, page}).then(res => {
                this.pageBusy = false;
                if(res.success && res.data) {
                    this.currentPage = page;
                    this.items = Utils.completeTable(res.data.list);
                    this.totalRows = res.data.total;
                }
            }).catch(() => {
                this.pageBusy = false;
                this.showToast('Failed to get categories');
            })
        },
         filterCategories() {
            if(!this.searchDate && !this.searchName && !this.status) {
                this.searchParams = {};
            }else{
                this.searchParams = {};
                if(this.searchName) {
                    this.searchParams.name = this.searchName;
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
            this.getCategories(1);
            this.currentPage = 1;
        },
        showToast(message, icon, variant) {
            this.$toast({
                component: ToastificationContent,
                props: {
                    title: message || 'Error fetching categories',
                    icon: icon || 'InfoIcon',
                    variant: variant || 'danger',
                },
            })
        },
        showModal(description) {
            this.$bvModal.msgBoxOk(description, {
            title: 'Category',
            size: 'md',
            buttonSize: 'md',
            okVariant: 'primary',
            headerClass: 'p-2 border-bottom-0',
            bodyClass: 'text-break',
            footerClass: 'p-2 border-top-0',
            centered: true
            })
            .then(value => {
                // value returns true if ok was clicked
            })
            .catch(err => {
                // An error occurred
            })
        },
        triggerRemoveCategory(id) {
            this.$bvModal.msgBoxConfirm("Are you sure you want to delete this category? any campaign associated with this category will be lost", {
            title: 'Remove Category',
            size: 'md',
            buttonSize: 'sm',
            okVariant: 'danger',
            headerClass: 'p-2 border-bottom-0',
            bodyClass: 'text-break',
            footerClass: 'p-2 border-top-0',
            cancelTitle: 'Cancel',
            centered: true
            })
            .then(value => {
                if(value){
                    this.removeCategory(id);
                }
            })
            .catch(err => {
                // An error occurred
            })
        },
        removeCategory(id) {
          API.removeCategory({_id: id}).then(res => {
            this.pageBusy = false;
            if(res.success) {
              this.items = this.items.filter(item => item._id != id);
                // this.getCategories(this.currentPage);
                this.showToast('Category removed successfully', 'CheckIcon', 'success');
            }
          }).catch(() => {
              this.pageBusy = false;
              this.showToast('Failed to remove category');
          })
        }
    }
}
</script>

<style lang="scss" scope>

    @import '@core/scss/vue/libs/vue-select.scss';
    @import '@core/scss/vue/libs/vue-flatpicker.scss';

    .category-content{

        max-width: 100px !important;
    }
    .category-content:hover{
        transform: scale(1.2);
    }
</style>