<template>
  <!-- Need to add height inherit because Vue 2 don't support multiple root ele -->
  <div class="miniapp-main-container">
    <!-- Search bar -->
    <b-row align-h="center">
      <b-col>
        <b-card no-body>
          <b-card-header class="pb-50">
            <h5>Filters</h5>
          </b-card-header>
          <b-card-body>
            <b-row>
              <b-col>
                <label>Start and End Dates</label>
                <flat-pickr
                  v-model="searchItemDateRange"
                  class="form-control"
                  :config="{ mode: 'range' }"
                  name="searchItemDateRange"
                />
              </b-col>
              <b-col>
                <label>Type</label>
                <v-select
                  v-model="searchItemStatus"
                  :options="reviewType"
                  label="title"
                />
              </b-col>

              <b-col cols="12" md="3" class="mb-md-0 mb-2">
                <label>Merchant</label>
                <div class="d-flex align-items-center justify-content-end">
                  <b-input-group>
                    <b-form-input
                      v-model="searchItemName"
                      placeholder="eg: Tranzak"
                    />
                    <!-- <b-input-group-append>
                        <b-button @click="searchByName()" variant="primary">
                          <feather-icon
                            icon="SearchIcon"
                            size="14"
                          />
                        </b-button>
                      </b-input-group-append> -->
                  </b-input-group>
                </div>
              </b-col>
              <b-col>
                <!-- needed for alignment with input boxes on the side -->
                <label></label>
                <div v-if="$can('read', 'MiniApp')">
                  <b-button @click="searchQuery()" variant="primary">
                    Search</b-button>
                </div>
              </b-col>
            </b-row>
          </b-card-body>
        </b-card>
      </b-col>
    </b-row>

    <review-list :data="reviewData" @changePageNumber="onChangePageNumber" />
  </div>
</template>
<script>
import {
  BRow,
  BCol,
  BCard,
  BCardHeader,
  BCardBody,
  BCardTitle,
  BCalendar,
  BFormText,
} from "bootstrap-vue";
import vSelect from "vue-select";
import flatPickr from "vue-flatpickr-component";
import Ripple from "vue-ripple-directive";
import ReviewList from "./ReviewList.vue";
import API from "./api";

export default {
  components: {
    BRow,
    BCol,
    BCard,
    BCardHeader,
    BCardBody,
    BCardTitle,
    BCalendar,
    BFormText,

    vSelect,
    flatPickr,

    ReviewList,
    API,
  },
  directives: {
    Ripple,
  },
  setup() {},
  data() {
    return {
      miniAppData: {},
      reviewData: {
        list: [],
          total: 0,
          totalPages: 0,
          hasMore: false
      },
      searchQueryStatus: false, // To determine if I am currently searching the db or not
      searchResultsNotFound: false,
      searchItemStatus: null,
      searchItemName: null,
      searchItemDateRange: null,
      reviewType: [
        {
          title: "Online",
          code: 1,
        },
        {
          title: "On site",
          code: 2,
        },
        {
          title: "App",
          code: 100,
        },
      ], // 1, normal, 100 featured(can appear on home page), 101 featured(can appear on search suggestions)
    };
  },
  watch: {
    searchItemName: function (params) {
      if (!params) {
        this.getAllReviews();
      }
    },
    searchItemStatus: function (params) {
      // console.log(params)
      // console.log(JSON.stringify(params.code, undefined, 2));

      if (!params) {
        this.getAllReviews();
      }
    },
    searchItemDateRange: function (params) {
      // console.log(params)
      if (!params) {
        this.getAllReviews();
      }
    },
  },
  mounted() {
      this.getAllReviews()
  },
  methods: {
    async getAllReviews(searchParams = {}, pageNum=1) {
      const response = await API.getReviews({ page: pageNum, pageSize: 10, searchParams: searchParams });
      let dataSet;
      if (this.reviewData.list.length > 0) {
        dataSet = this.reviewData.list.concat(response.data.list);
        if (searchParams) {
          dataSet = response.data.list;
        }
      } else {
        dataSet = response.data.list;
      }
      
      const { total } = response.data;
      const { totalPages } = response.data;
      const { hasMore } = response.data;

      this.reviewData.list = dataSet;
      this.reviewData.total = total;
      this.reviewData.total = totalPages;
      this.reviewData.hasMore = hasMore;

      this.paddRows(pageNum);

      // console.log(JSON.stringify(this.reviewData, undefined, 2))
    },
    searchQuery() {
        // console.log("This is called")
      var params = {};

      if (this.searchItemName) {
        params.merchantName = this.searchItemName;
      }

      if (this.searchItemDateRange) {
        params.startDate = this.searchItemDateRange.split("to")[0].trim();
        params.endDate = this.searchItemDateRange.split("to")[1].trim();
      }

      if (this.searchItemStatus) {
        params.ratingScene = this.searchItemStatus.code;
      }

      this.getAllReviews(params, 1);
    },
    paddRows(params) {
      const rowsDispenser = Math.max(0, ( (params * 10) - this.reviewData.total) );
      // console.log(rowsDispenser);

      for (let index = 0; index < rowsDispenser; index++) {
        this.reviewData.list.push({isBlank: true})
        // console.log(JSON.stringify(this.reviewData.list, undefined, 2)) 
      }
    },
    onChangePageNumber(params) {
      this.getAllReviews({}, params);
    }
  },
};
</script>
<style lang="scss">
@import "@core/scss/vue/libs/vue-select.scss";
@import "@core/scss/vue/libs/vue-flatpicker.scss";
</style>

