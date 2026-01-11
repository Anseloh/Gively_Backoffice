<template>
  <div>
    <b-table
      id="reviewsTable"
      striped
      hover
      responsive
      small
      outlined
      show-empty
      :items="data.list"
      :fields="tableFields"
      :per-page="perPage"
      :current-page="currentPage"
    >
      <!-- AppId (Temp) -->
      <!-- <template #cell(id)="data">
            <div class="d-flex align-items-center">
                <span>{{ data.item.id }}</span>
            </div>
        </template> -->

      <!-- Ratings -->
      <template #cell(ratings)="data">
        <div class="d-flex align-items-center" v-if="!data.item.isBlank">
          <span>
            <b-form-rating
              readonly
              :value="data.item.ratings"
              color="#e44f25"
              precision="2"
              show-value
            ></b-form-rating>
          </span>
        </div>
      </template>

      <!-- Merchant Id -->
      <template #cell(merchantId)="data">
        <div class="d-flex align-items-center" v-if="!data.item.isBlank">
          <span class="rate-merch-id">{{ data.item.merchantId }} </span>
        </div>
      </template>

      <!-- Merchant Name -->
      <template #cell(merchantName)="data">
        <div class="d-flex align-items-center">
          <span>{{ data.item.merchantName }} </span>
        </div>
      </template>

      <!-- Comments -->
      <template #cell(comment)="data">
        <div v-if="!data.item.isBlank">
          <div v-if="data.item.comment" class="d-flex align-items-center">
            <span>{{ data.item.comment }} </span>
          </div>
          <div v-else class="d-flex align-items-center">
            <span class="data-not-available" style="margin: 0">na</span>
          </div>
        </div>

      </template>

      <!-- Product Ratings -->
      <template #cell(ratingsProduct)="data">
        <div v-if="!data.item.isBlank">
          <div v-if="data.item.ratingsProduct" class="d-flex align-items-center">
            <span>
              <b-form-rating
                readonly
                :value="data.item.ratingsProduct"
                variant="warning"
                precision="2"
                size="sm"
              ></b-form-rating>
            </span>
          </div>
          <div v-else class="d-flex align-items-center">
            <span class="data-not-available">na</span>
          </div>
        </div>
      </template>

      <!-- Ratings Service -->
      <template #cell(ratingsService)="data">
        <div v-if="!data.item.isBlank">
          <div v-if="data.item.ratingsService" class="d-flex align-items-center">
            <span>
              <b-form-rating
                readonly
                :value="data.item.ratingsService"
                variant="warning"
                precision="2"
                size="sm"
              ></b-form-rating>
            </span>
          </div>
          <div v-else class="d-flex align-items-center">
            <span class="data-not-available">na</span>
          </div>
        </div>
      </template>

      <!-- Ratings Environment -->
      <template #cell(ratingsEnvironment)="data">
        <div v-if="!data.item.isBlank">
          <div
            v-if="data.item.ratingsEnvironment"
            class="d-flex align-items-center"
          >
            <span>
              <b-form-rating
                readonly
                :value="data.item.ratingsEnvironment"
                variant="warning"
                precision="2"
                size="sm"
              ></b-form-rating>
            </span>
          </div>
          <div v-else class="d-flex align-items-center">
            <span class="data-not-available">na</span>
          </div>
        </div>
      </template>

      <!-- Transaction scene -->
      <template #cell(ratingScene)="data">
        <div class="d-flex align-items-center" v-if="!data.item.isBlank">
          <span v-if="data.item.ratingScene === 1" class="rate-scene-online">
            Online
          </span>
          <span v-if="data.item.ratingScene === 2" class="rate-scene-onsite">
            On site
          </span>
          <span v-if="data.item.ratingScene === 100" class="rate-scene-app">
            App
          </span>
        </div>
      </template>

      <!-- Date/Time entry was created scene -->
      <template #cell(createdAt)="data">
        <div class="d-flex align-items-center rate-data-date" v-if="!data.item.isBlank">
          <span>{{ dayjs(data.item.createdAt).format("MMM D, YYYY h:mm A") }} </span>
        </div>
      </template>
      <template #empty="scope">
        {{ scope.emptyText }}
      </template>
    </b-table>
    <div class="display-pagination-wrapper">
      <b-pagination
        v-model="currentPage"
        :total-rows="rows"
        :per-page="perPage"
        aria-controls="reviewsTable"
        @change="loadNewPage"
      ></b-pagination>
    </div>
  </div>
</template>
<script>
import { BTable, BPagination } from "bootstrap-vue";
import dayjs from "dayjs";

export default {
  components: {
    BTable,
    BPagination,
    dayjs,
  },
  props: {
    data: {
      type: Object,
      required: true,
    },
  },
  setup() {},
  computed: {
      rows() {
        return this.data.total;
      },
  },
  data() {
    return {
      dayjs: dayjs,
      reviewData: [],
      perPage: 10,
      currentPage: 1,
      tableFields: [
        // {
        //     key: "id",
        //     label: "#",
        //     thClass: "align-middle"
        // },
        {
          key: "ratings",
          label: "Ratings",
          sortable: true,
          thClass: "align-middle",
        },
        {
          key: "merchantId",
          label: "Merchant ID",
          thClass: "align-middle",
        },
        {
          key: "merchantName",
          label: "Merchant",
          sortable: true,
          thClass: "align-middle",
        },
        {
          key: "comment",
          label: "Comments",
          thClass: "align-middle",
        },
        {
          key: "ratingsProduct",
          label: "Product",
          thClass: "align-middle",
          variant: "grey-mode",
        },
        {
          key: "ratingsService",
          label: "Service",
          thClass: "align-middle",
        },
        {
          key: "ratingsEnvironment",
          label: "Environment",
          thClass: "align-middle",
          variant: "grey-mode",
        },
        {
          key: "ratingScene",
          label: "Type",
          sortable: true,
          thClass: "align-middle",
        },
        {
          key: "createdAt",
          label: "Created",
          sortable: true,
          thClass: "align-middle",
        },
      ],
    };
  },
  methods: {
    loadNewPage(pageNum) {
      if (this.data.hasMore) {
        // this.$parent.getAllReviews({}, pageNum);
        this.$emit('changePageNumber', pageNum);

        // console.log('Emitter is through')
      }

      // console.log(this.currentPage);
      // Pad rows in case the page has less than 10 rows displayed

    }
  },
};
</script>