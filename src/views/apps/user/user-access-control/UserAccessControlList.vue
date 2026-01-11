<template>
    <div>
        <div class="d-flex flex-row align-content-center align-items-center justify-content-end py-1 px-1 table-display-opt">
            <b-button-group>
                <b-button v-if="$can('create', 'UAC')" @click="addNewUser" variant="primary">
                    Create User
                </b-button>
            </b-button-group>
        </div>
        <b-table
            id="accessControlTable"
            striped
            responsive
            outlined
            show-empty
            :busy="tableState"
            :per-page="perPage"
            :current-page="currentPage"
            :items="data.list"
            :fields="tableFields"
        >
            <!-- Full names -->
            <template #cell(name)="data">
              <div class="d-flex align-items-center">
                <div class="mr-1" v-if="data.item.firstName">
                    <div>
                        <b-avatar
                            :src="data.item.avatar"
                        ></b-avatar>
                    </div>
                </div>
                <div v-if="data.item.firstName">
                  <div class="font-weight-bolder">
                    <span>{{ data.item.firstName }} </span> <span>{{ data.item.lastName }}</span>
                  </div>
                  <div class="font-small-2 text-muted">
                    <b-link :href="'mailto:data.item.email'" target="_blank" rel="noopener noreferrer">
                        {{ data.item.email }}
                    </b-link>
                  </div>
                </div>
              </div>
            </template>

            <!-- User Mobile Phone -->
            <template #cell(phone)="data">
                <div class="d-flex align-items-center" v-if="data.item.phone">
                    <b-link class="custom-info" :href="'tel:data.item.phone'" target="_blank" rel="noopener noreferrer">
                        {{ data.item.phone }}
                    </b-link>
                </div>
            </template>

            <!-- User Roles -->
            <template #cell(role)="data">
                <div class="d-flex align-items-center">
                    <b-badge v-if="data.item.role === 1000" variant="light-danger">Admin</b-badge>
                    <b-badge v-if="data.item.role === 130" variant="light-info">Manager</b-badge>
                    <b-badge v-if="data.item.role === 125" variant="light-success">Finance/Data Analyst</b-badge>
                    <b-badge v-if="data.item.role === 120" variant="light-primary">Support</b-badge>
                    <b-badge v-if="data.item.role === 115" variant="light-warning">Auditor</b-badge>
                    <b-badge v-if="data.item.role === 110" variant="light-warning">IT/Developer</b-badge>
                    <b-badge v-if="data.item.role === 105" variant="light-primary">Other Staff</b-badge>
                    <b-badge v-if="data.item.role === 100" variant="light">Non Staff</b-badge>
                </div>
            </template>

            <!-- User Address -->
            <template #cell(address)="data">
                <div v-if="!data.item.isBlank">
                    <div class="d-flex align-items-center" v-if="data.item.address">
                        {{ data.item.address }}
                    </div>
                    <div v-else class="d-flex align-items-center">
                        <span class="data-not-available">na</span>
                    </div>
                </div>
            </template>

            <!-- User Remarks -->
            <template #cell(remark)="data">
                <div v-if="!data.item.isBlank">
                    <div class="d-flex align-items-center" v-if="data.item.remark">
                        {{ data.item.remark }}
                    </div>
                    <div v-else class="d-flex align-items-center">
                        <span class="data-not-available">na</span>
                    </div>
                </div>
            </template>

            <!-- Action -->
            <template #cell(actions)="data">
                <div class="d-flex align-items-center justify-content-center" v-if="data.item.userId">
                    <b-dropdown
                        variant="link"
                        toggle-class="text-decoration-none"
                        no-caret
                        >
                        <template v-slot:button-content>
                            <feather-icon
                                icon="MoreVerticalIcon"
                                size="16"
                                class="text-body align-middle mr-25"
                            />
                        </template>
                        <b-dropdown-item v-if="$can('update', 'UAC')" @click="editUser(data.item)">
                            <feather-icon
                                icon="Edit2Icon"
                                class="mr-50"
                            />
                            <span>Edit</span>
                        </b-dropdown-item>
                        <b-dropdown-item v-if="$can('delete', 'UAC')" @click="deleteUser(data.item.userId)">
                            <feather-icon
                                icon="TrashIcon"
                                class="mr-50"
                            />
                            <span>Delete</span>
                        </b-dropdown-item>
                    </b-dropdown>
                </div>
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
        <b-sidebar
            id="addUserSiderbar"
            bg-variant="white"
            right
            backdrop
            shadow
            v-model="addUserSideBar"
            title="Add A New User"
        >
            <sidebar-content-add @refreshUserTable="$emit('refreshUserTable', true)" @close-sidebar="addUserSideBar=false" />
        </b-sidebar>
        <b-sidebar
            id="updateUserSiderbar"
            bg-variant="white"
            right
            backdrop
            shadow
            v-model="updateUserSideBar"
            title="Update Current User"
        >
            <sidebar-content-update :data="rowDataObject" @refreshUserTable="$emit('refreshUserTable', true)" @close-sidebar="updateUserSideBar=false" />
        </b-sidebar>
    </div>
</template>
<script>
import {
    BRow,
    BCol,
    BTable,
    BAvatar,
    BModal,
    BFormGroup,
    BFormInput,
    BFormCheckbox,
    BForm,
    BButton,
    BFormSelect,
    BSidebar
} from 'bootstrap-vue';
import { VueTelInput } from 'vue-tel-input';
import 'vue-tel-input/dist/vue-tel-input.css';
import Ripple from 'vue-ripple-directive';
import SidebarContentAdd from './SidebarAddUser.vue';
import SidebarContentUpdate from './SidebarUpdateUser.vue';
import API from "./api"

export default {
    components: {
        BTable,
        BRow,
        BCol,
        BAvatar,
        BModal,
        BFormGroup,
        BFormInput,
        BFormCheckbox,
        BForm,
        BButton,
        BFormSelect,
        BSidebar,
        VueTelInput,
        SidebarContentAdd,
        SidebarContentUpdate,
        API
    },
    props: {
        data: {
            type: Object,
            required: true,
        },
        tableState: {
            type: Boolean,
            required: true
        }
    },
    directives: {
        Ripple,
    },
    computed: {
        rows() {
            return this.data.total;
        },
    },
    data() {
        return {
            userRole: [
                {
                    text: "Select a role",
                    value: null
                },
                {
                    text: "Admin",
                    value: 101
                },
                {
                    text: "IT/Developer",
                    value: 102
                },
                {
                    text: "Manager",
                    value: 103
                },
                {
                    text: "Finance/Data Analyst",
                    value: 104
                },
                {
                    text: "Guest",
                    value: 105
                }
            ],
            tableFields: [
                // {
                //     key: "userId",
                //     label: "#",
                // },
                {
                    key: "name",
                    label: "User",
                },
                {
                    key: "address",
                    label: "Address",
                },
                {
                    key: "phone",
                    label: "Contact Number",
                },
                {
                    key: "role",
                    label: "Role",
                    sortable: true
                },
                {
                    key: "remark",
                    label: "Remark",
                },
                {
                    key: "actions",
                    label: "Actions"
                },
            ],
            perPage: 10,
            currentPage: 1,
            addUserSideBar: false,
            updateUserSideBar: false,
            rowDataObject: {}
        }
    },
    methods: {
        loadNewPage(pageNum) {
            if (this.data.hasMore) {
                this.$emit('changePageNumber', pageNum);
            }
        },
        addNewUser() {
            this.addUserSideBar = true
        },
        editUser(params) {
            this.updateUserSideBar = true;
            this.rowDataObject = params;
        },
        deleteUser(params) {
            API.deleteUser(params)
        }
    }
}
</script>
