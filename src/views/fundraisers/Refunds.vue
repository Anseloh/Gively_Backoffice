<template>
  <b-overlay :show="pageBusy" variant="transparent">
    <b-card>
      <div class="row pt-0">
        <div class="col-12 pb-1">
          <span class="font-weight-bolder">Filters</span>
        </div>
        <div class="col-lg-4 col-12 col-md-6">
          <label>Refund State</label>
          <v-select v-model="status" :options="statusOptions"></v-select>
        </div>
        <div class="col-lg-2 col-12 col-md-6 pt-2 pt-lg-2" @click="filterFeedback()">
          <span class="btn btn-primary">
            <feather-icon icon="SearchIcon" /> Search
          </span>
        </div>
      </div>
    </b-card>
    <b-card>
      <b-overlay :show="itemBusy">
        <b-table class="rounded border" :items="items" :fields="fields" :per-page="10" :current-page="1" responsive>

          <template #head()="scope">
            <div class="text-nowrap text-primary">
              {{ scope.label }}
            </div>
          </template>
          <template #cell(name)="data">
            <span class="text-nowrap" v-if="data.item._id">
              <div class="d-flex align-items-center">
                <div class="w-100">
                  <div class="font-weight-bolder">
                    {{ data.item.title }}
                  </div>
                </div>
              </div>
            </span>
          </template>
          <template #cell(endDate)="data">
            <span class="text-nowrap" v-if="data.item._id">
              <div class="d-flex align-items-center">
                <div class="w-100">
                  {{ dayjs(data.item.endDate).format("MMM D, YYYY") }}
                </div>
              </div>
            </span>
          </template>
          <template #cell(status)="data">
            <span class="text-nowrap" v-if="data.item._id">
              <b-badge :variant="displayStatus[1][data.item.runningStatus]">
                {{ displayStatus[0][data.item.runningStatus] }}
              </b-badge>
            </span>
          </template>
          <template #cell(actions)="data">
            <div class="text-nowrap" v-if="data.item._id">
              <b-button size="sm" pill variant="outline-primary" v-b-toggle.validate
                @click="triggerProcessing(data.item)">
                More
              </b-button>
            </div>
          </template>
        </b-table>
      </b-overlay>

      <b-modal id="view-campaign" ok-only title="View Campaign Detail" size="xl" centered no-close-on-backdrop
        no-close-on-esc>
        <div class="row">
          <div class="col-12" style="min-height: 600px;">
            <iframe class="w-100" height="100%"
              :src="`http://localhost:3000/preview-campaign/data-only/campaign?id=${account._id}`"
              frameborder="0"></iframe>
            <!-- <campaign :campaign="account" /> -->
          </div>
        </div>
      </b-modal>
      <div class="d-flex p-1">
        <div class="w-100">
          Page <span class="text-primary"> {{ currentPage }}</span> of <span
            class="text-primary">{{ Math.ceil(totalRows / 10) }}</span>
        </div>
        <div class="w-100">
          <b-pagination v-model="currentPage" :total-rows="totalRows" :per-page="10" aria-controls="users-table"
            align="right" size="sm" class="my-0" @page-click="loadNewPage" />
        </div>
      </div>
      <b-sidebar shadow id="validate" sidebar-class="sidebar-lg" bg-variant="white" backdrop right title="Refund info"
        title-background="primary" no-close-on-backdrop>
        <template #default="{ hide }">
          <div>
            <div class="p-2 border-bottom border-top">
              <h5 class="font-weight-bolder">Name</h5>
              <span v-if="refundInfo.campaign">{{ refundInfo.campaign.title }}</span>
              <h5 class="font-weight-bolder mt-2">Status</h5>
              <span class="text-nowrap">
                <b-badge v-if="refundInfo.campaign" :variant="displayStatus[1][refundInfo.campaign.runningStatus]">
                  {{ refundInfo.status }}
                </b-badge>
              </span>
              <h5 class="font-weight-bolder mt-2">Amount to refund</h5>
              <span>{{ refundInfo.totalToRefund }}</span>
              <h5 class="font-weight-bolder mt-2">Amount refunded</h5>
              <span>{{ refundInfo.totalRefunded }}</span>
              <h5 class="font-weight-bolder mt-2">Remaining Amount</h5>
              <span>{{ refundInfo.remainingToRefund }}</span>
              <div v-if="refundInfo.remainingToRefund">
                <b-button class="mt-1" rounded variant="primary" @click="addReview(hide)">
                  Refund now
                </b-button>
              </div>
            </div>
            <h4 class="p-2 text-primary" v-if="refundInfo.transactions && refundInfo.transactions.length">History
            </h4>
            <b-list-group>
              <b-list-group-item v-for="(transaction, j) in refundInfo.transactions" :key="j">
                <div class="alert alert-secondary rounded p-1 mb-0">
                  <div>
                    <b-badge :variant="displayState[1][transaction.refundInfo.state]">
                      {{ displayState[0][transaction.refundInfo.state] }}
                    </b-badge>
                  </div>
                  Amount : {{ transaction.amount }}
                </div>
                <div class="d-flex p-0">
                  <div class="w-100">
                    <small>{{ transaction.createdBy }}</small>
                  </div>
                  <div class="text-right text-nowrap">
                    <small class="text-primary">
                      {{ dayjs(transaction.createdAt).format("MMM D, YYYY h:mm A") }}
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
      refundInfo: {},
      displayStatus: [
        {
          '600': 'Ended', '700': 'Partially Refunded', '800': 'Refunded'
        },
        {
          '600': 'secondary', '800': 'success', '700': 'warning'
        },
      ],
      displayState: [
        {
          '1': 'In Progress', '5': 'Completed', '-5': 'Errored'
        },
        {
          '-5': 'danger', '5': 'success', '1': 'warning'
        },
      ],
      statusOptions: [
        { label: 'Not started', "value": 600 },
        { label: 'Partially', "value": 700 },
        { label: 'Completed', "value": 800 }
      ],
      user: {
        message: '',
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
        { label: 'Rejected', "value": -1 },
        { label: 'Invalid Documents', "value": -2 },
        { label: 'Rejected Permanently', "value": -5 },
      ],
      items: [],
      fields: [
        { key: 'name', label: 'Name' },
        { key: 'endDate', label: 'End Date' },
        { key: 'status', label: 'Status' },
        { key: 'actions', label: 'Actions' },
        // {key: 'bio', label: 'bio'},
        // { key: 'status', label: 'Status' },
        // { key: 'createdAt', label: 'Created At' },
        // { key: 'updatedAt', label: 'Updated At' },
      ],
      genders: {
        '0': 'Rather not say',
        '1': 'Male',
        '2': 'Female',
        '3': 'Others',
      },
      searchParams: {},
      itemBusy: false,
      pageBusy: false,
    }
  },
  watch: {
  },
  created() {
    this.items = Utils.completeTable();
    this.getCampaigns();
  },
  mounted() {
    this.ftoken = vm.$fileAccessToKen;
  },
  methods: {
    showCampaign() {
      this.$bvModal.show('view-campaign');
    },
    triggerViewImage(image = []) {
      this.images = image;
      this.$bvModal.show('view-images');
    },
    addReview(e) {
      API.triggerRefundOnCampaign(this.refundInfo?.campaign?._id).then(res => {
        if (res.success && res.data) {
          this.showToast('Refund process started', 'CheckCircle', 'success');
          e();
        } else {
          this.showToast('Error when initializing refund. Please retry.');
        }
      }).catch(err => {
        this.showToast(err)
        console.log(err);
      })
    },
    triggerProcessing(data) {
      API.getCampaignRefundStatus(data._id)
        .then(res => {
          this.pageBusy = false;

          if (res.success && res.data) {
            this.refundInfo = res.data;
          } else {
            throw new Error();
          }
        })
        .catch(res => {
          this.pageBusy = false;
          this.showToast('Error loading details.');
        });
      // this.account = data;
      // this.user.id = data._id;
    },
    getCampaigns(page = 1) {
      // this.pageBusy = true;
      API.getRefundableCampaigns(this.searchParams).then(res => {
        this.pageBusy = false;
        if (res.success && res.data) {
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
      if (!this.searchDate && !this.userName && !this.status) {
        this.searchParams = {};
      } else {
        this.searchParams = {};
        if (this.userName) {
          this.searchParams.name = this.userName;
        }
        if (this.status && this.status.value) {
          this.searchParams.status = this.status.value;
        }
        if (this.searchDate && this.searchDate.from) {
          this.searchParams.startDate = this.searchDate.from + ' 00:00:00';
          if (!this.searchDate.to) {
            this.this.searchDate.to = this.searchDate.from
          }
          this.searchParams.endDate = this.searchDate.to + ' 23:59:59';
        }
      }
      this.getCampaigns(1);
      this.currentPage = 1;
    },
    showToast(message, icon, variant) {
      this.$toast({
        component: ToastificationContent,
        props: {
          title: message || 'Error fetching campaigns',
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