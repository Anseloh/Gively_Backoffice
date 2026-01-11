<template>
    <div>
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
                        <label>Role</label>
                        <v-select
                        v-model="searchItemRole"
                        :options="userRole"
                        label="title"
                        />
                    </b-col>

                    <b-col cols="12" md="3" class="mb-md-0 mb-2">
                        <label>User</label>
                        <div class="d-flex align-items-center justify-content-end">
                        <b-input-group>
                            <b-form-input
                                v-model="searchItemName"
                                placeholder=""
                            />
                        </b-input-group>
                        </div>
                    </b-col>
                    <b-col>
                        <label></label>
                        <div>
                            <b-button @click="searchQuery()" variant="primary">
                                Search</b-button>
                        </div>
                    </b-col>
                    </b-row>
                </b-card-body>
                </b-card>
            </b-col>
        </b-row>

        <u-a-c-list :data="userData" :tableState="isTableBusy" @changePageNumber="onChangePageNumber" @refreshUserTable="updateTableContent" />
    </div>
</template>
<script>
import {
    BRow,
    BCol,
    BTable
    } from 'bootstrap-vue';
import vSelect from "vue-select";
import flatPickr from "vue-flatpickr-component";
import Ripple from "vue-ripple-directive";
import UACList from "./UserAccessControlList.vue";
import API from "./api"

export default {
    components: {
        BTable,
        BRow,
        BCol,
        vSelect,
        flatPickr,

        UACList,
        API,
    },
    directives: {
        Ripple,
    },
    data() {
        return {
            userData: {
                list: [],
                total: 0,
                totalPages: 0,
                hasMore: false
            },
            searchItemDateRange: null,
            searchItemRole: null,
            searchItemName: null,
            userRole: [
                {
                    title: "Admin",
                    code: 1000,
                },
                {
                    title: "Manager",
                    code: 130,
                },
                {
                    title: "Analyst",
                    code: 125,
                },
                {
                    title: "Customer Support",
                    code: 120,
                },
                {
                    title: "Auditor",
                    code: 115,
                },
                {
                    title: "IT/Developer",
                    code: 110,
                },
                {
                    title: "Other Staff",
                    code: 105,
                },
                {
                    title: "Non-staff",
                    code: 100,
                }
            ],
            isTableBusy: false
        }
    },
    watch: {
        searchItemName: function (params) {
            if (!params) {
                this.getAllUsers();
            }
        },
        searchItemRole: function (params) {
            if (!params) {
                this.getAllUsers();
            }
        },
        searchItemDateRange: function (params) {
            if (!params) {
                this.getAllUsers();
            }
        },
    },
    mounted() {
        this.getAllUsers()
    },
    methods: {
        async getAllUsers(searchParams = {}, pageNum=1, onRefresh) {
            const response = await API.getUsers({ page: pageNum, pageSize: 10, searchParams: searchParams });
            let dataSet;
            if (this.userData.list.length > 0) {
                dataSet = this.userData.list.concat(response.data.list);
                if (searchParams || onRefresh) {
                    dataSet = response.data.list;
                }
            } else {
                dataSet = response.data.list;
            }
            
            const { total } = response.data;
            const { totalPages } = response.data;
            const { hasMore } = response.data;

            this.userData.list = dataSet;
            this.userData.total = total;
            this.userData.totalPages = totalPages;
            this.userData.hasMore = hasMore;

            this.paddRows(pageNum);
            this.isTableBusy = false;

            // console.log("Reloading the table ----------------", this.isTableBusy)

            // console.log(JSON.stringify(this.userData, undefined, 2))
        },

        // Add additional rows to the table to fill up the page so it doesn't look empty
        paddRows(params) {
            const rowsDispenser = Math.max(0, ( (params * 10) - this.userData.total) );

            for (let index = 0; index < rowsDispenser; index++) {
                this.userData.list.push({isBlank: true}) 
            }
        },
        onChangePageNumber(pageNum) {
            this.getAllUsers({}, pageNum, false);
        },
        updateTableContent(params) {
            if (params) {
                this.isTableBusy = params;
                // console.log("Reloading the table ----------------", this.isTableBusy)
                this.getAllUsers({}, 1, params);
            }
        },
        searchQuery() {
            var searchParams = {};

            if (this.searchItemName) {
                searchParams.firstName = this.searchItemName;
            }

            if (this.searchItemDateRange) {
                searchParams.startDate = this.searchItemDateRange.split("to")[0].trim();
                searchParams.endDate = this.searchItemDateRange.split("to")[1].trim();
            }

            if (this.searchItemRole) {
                searchParams.role = this.searchItemRole.code;
            }

            this.getAllUsers(searchParams, 1, false);
        },
    }
}
</script>
<style lang="scss">
@import "@core/scss/vue/libs/vue-select.scss";
@import "@core/scss/vue/libs/vue-flatpicker.scss";
</style>