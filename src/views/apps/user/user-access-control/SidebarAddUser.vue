<template>
  <div class="p-2">
    <b-form @submit.prevent="createNewUser">
      <b-row>
        <!-- first name -->
        <b-col cols="12">
          <b-form-group label="First Name" label-for="acFirstName">
            <b-form-input
              id="acFirstName"
              placeholder="First Name"
              v-model="createData.fname"
              required
            />
          </b-form-group>
        </b-col>

        <!-- last name -->
        <b-col cols="12">
          <b-form-group label="Last Name" label-for="acLastName">
            <b-form-input
              id="acLastName"
              placeholder="Last Name"
              v-model="createData.lname"
              required
            />
          </b-form-group>
        </b-col>

        <!-- email -->
        <b-col cols="12">
          <b-form-group label="Email" label-for="acEmail">
            <b-form-input
              id="acEmail"
              type="email"
              placeholder="Email"
              v-model="createData.email"
            />
          </b-form-group>
        </b-col>

        <!-- mobile -->
        <b-col cols="12">
          <b-form-group label="Mobile" label-for="acMobile" prepend="+237">
            <vue-tel-input
              class="vue-tel-input-custom"
              id="acMobile"
              v-model="createData.mobile"
              v-bind="bindProps"
            >
              <template slot="arrow-icon">
                <span class="vti__dropdown-arrow">&nbsp;▼ </span>
              </template>
            </vue-tel-input>
          </b-form-group>
        </b-col>

        <!-- Address -->
        <b-col cols="12">
          <b-form-group label="Address" label-for="acAddress">
            <b-form-input
              id="acAddress"
              type="text"
              placeholder="Address"
              v-model="createData.address"
            />
          </b-form-group>
        </b-col>

        <!-- User role -->
        <b-col cols="12">
          <b-form-group label="Role" label-for="acRole">
            <b-form-select
              id="acRole"
              v-model="createData.selectedRole"
              :options="userRole"
              required
            />
          </b-form-group>
        </b-col>

        <!-- Gender -->
        <b-col cols="12">
          <b-form-group label="Gender" label-for="acGender">
            <b-form-select
              id="acGender"
              v-model="createData.gender"
              :options="userGender"
            />
          </b-form-group>
        </b-col>

        <!-- Remark -->
        <b-col cols="12">
          <b-form-group label="Remarks" label-for="acRemark">
            <b-form-textarea
              id="acRemark"
              type="text"
              placeholder="Remarks"
              v-model="createData.remark"
            />
          </b-form-group>
        </b-col>

        <!-- Avatar -->
        <b-col cols="12">
          <b-form-group label="Upload Profile Picture" label-for="acImage">
            <b-form-file
                  v-model="createData.avatar"
                  id="acImage"
                  drop-placeholder="Drop avatar here"
                  accept="image/*"
                  @change="previewAvatar($event)"
                ></b-form-file>
          </b-form-group>
        </b-col>
      </b-row>

      <!-- Preview selected avatar -->
      <div
      class="
        d-flex
        justify-content-center
        align-content-center align-items-center
      "
      v-if="selectedAvatar"
      >
        <div class="avatar-thumbnail-wrapper">
          <b-img
            rounded
            class="avatar-preview"
            :src="selectedAvatar"
            alt=""
          />
        </div>
      </div>
      <div class="mt-2">
        <b-button type="submit" variant="primary" block>Create User</b-button>
      </div>
    </b-form>
    <b-toast id="successToast" v-model="showSuccessToast">
      <template #toast-title>
        <div class="d-flex flex-grow-1 align-items-center mr-1">
          <b-img
            :src="require('@/assets/images/logo/logo.png')"
            class="mr-1"
            width="32"
            alt="Toast image"
          />
          <h5 class="mr-auto mb-0 pb-0">Gively Admin</h5>
          <small class="text-muted">a few seconds ago</small>
        </div>
      </template>
      <span>You have successfully added a new user.</span>
    </b-toast>
  </div>
</template>
<script>
import {
  BRow,
  BCol,
  BImg,
  BFormGroup,
  BFormInput,
  BFormCheckbox,
  BForm,
  BFormFile,
  BButton,
  BFormSelect,
  BSidebar,
} from "bootstrap-vue";
import { VueTelInput } from "vue-tel-input";
import "vue-tel-input/dist/vue-tel-input.css";
import Ripple from "vue-ripple-directive";
import commonApi from "@/services/api";
import API from "./api";

export default {
  components: {
    BRow,
    BCol,
    BImg,
    BFormGroup,
    BFormInput,
    BFormCheckbox,
    BForm,
    BFormFile,
    BButton,
    BFormSelect,
    BSidebar,
    VueTelInput,
    API,
  },
  setup() {},
  data() {
    return {
      userRole: [
        {
          text: "Select a role",
          value: null,
        },
        {
          text: "Admin",
          value: 1000,
        },
        {
          text: "IT/Developer",
          value: 110,
        },
        {
          text: "Manager",
          value: 130,
        },
        {
          text: "Auditor",
          value: 115
        },
        {
          text: "Finance/Data Analyst",
          value: 125,
        },
        {
          text: "Support",
          value: 120
        },
        {
          text: "Other Staff",
          value: 105
        },
        {
          text: "Non-staff",
          value: 100
        },
      ],
      userGender: [
        {
          text: "Select gender",
          value: null,
        },
        {
          text: "Male",
          value: 1,
        },
        {
          text: "Female",
          value: 2,
        },
        {
          text: "Other",
          value: 3,
        },
        {
          text: "Undisclose",
          value: 0,
        },
      ],
      createData: {
        fname: "",
        lname: "",
        email: "",
        address: "",
        mobile: "",
        gender: null,
        selectedRole: null,
        remark: "",
        avatar: []
      },
      bindProps: {
        mode: "international",
        inputOptions: {
          placeholder: "Phone Number",
          required: true
        },
      },
      selectedAvatar: "",
      showSuccessToast: false
    };
  },
  methods: {
    createNewUser() {
      const files = [this.createData.avatar];

      commonApi
        .imageUpload({files: this.files})
        .then(response => {
          const data = {
            avatar: response.data.path[0],
            firstName: this.createData.fname,
            lastName: this.createData.lname,
            email: this.createData.email,
            address: this.createData.address,
            phone: this.createData.mobile,
            sex: this.createData.gender,
            role: this.createData.selectedRole,
            remark: this.createData.remark,
            orgId: "6efccb9633964441a03914fb48f63e30" // orgId of currently loggedin user
          };
          API.createUser(data).then(() => {
            this.$emit('close-sidebar', false)
            this.showSuccessToast = true;
            this.refreshTable();
            this.resetForm();
          }).catch(error => {
            console.log(error);
          });

        })
        .catch(errors => {
          console.log(errors);
        });
    },
    resetForm() {
      this.createData.fname = "";
      this.createData.lname = "";
      this.createData.email = "";
      this.createData.mobile = "";
      this.createData.address = "";
      this.createData.gender = null;
      this.createData.selectedRole = null;
      this.createData.remark = "";
      this.createData.avatar = [];
      this.selectedAvatar = "";
    },
    previewAvatar(e) {
      // console.log(this.createData.avatar)
      // console.log(e.target.files)

      var files = e.target.files || e.dataTransfer.files;
      if (!files.length) {
        return;
      }
      // console.log("Files-----------------", files[0]);
      this.createImage(files[0]);
    },
    createImage(file) {
      var image = new Image();
      var reader = new FileReader();

      reader.onload = e => {
        this.selectedAvatar = e.target.result;
        // this.createData.avatar = e.target.result;
      };
      reader.readAsDataURL(file);
    },

    // Refresh the table after adding a new user
    refreshTable() {
      this.$emit('refreshUserTable', true);
    },
  },
};
</script>