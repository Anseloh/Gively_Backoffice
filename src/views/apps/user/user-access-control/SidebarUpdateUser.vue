<template>
  <div class="p-2">
    <b-form @submit.prevent="updateCurrentUser">
      <b-row>
        <!-- first name -->
        <b-col cols="12">
          <b-form-group label="First Name" label-for="acFirstName">
            <b-form-input
              id="acFirstName"
              placeholder="First Name"
              v-model="updateData.fname"
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
              v-model="updateData.lname"
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
              v-model="updateData.email"
            />
          </b-form-group>
        </b-col>

        <!-- mobile -->
        <b-col cols="12">
          <b-form-group label="Mobile" label-for="acMobile">
            <vue-tel-input
              class="vue-tel-input-custom"
              id="acMobile"
              v-model="updateData.mobile"
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
              v-model="updateData.address"
            />
          </b-form-group>
        </b-col>

        <!-- User role -->
        <b-col cols="12">
          <b-form-group label="Role" label-for="acRole">
            <b-form-select
              id="acRole"
              v-model="updateData.selectedRole"
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
              v-model="updateData.gender"
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
              v-model="updateData.remark"
            />
          </b-form-group>
        </b-col>

        <!-- Avatar -->
        <b-col cols="12">
          <b-form-group label="Upload Profile Picture" label-for="acImage">
            <b-form-file
              v-model="updateData.avatar"
              id="acImage"
              drop-placeholder="Drop avatar here"
              accept="image/*"
              @change="previewAvatar($event)"
            ></b-form-file>
          </b-form-group>
        </b-col>
      </b-row>
      <div
        class="
          d-flex
          justify-content-center
          align-content-center align-items-center
        "
        v-if="updateSelectedAvatar"
      >
        <div class="avatar-thumbnail-wrapper">
          <b-img rounded class="avatar-preview" :src="updateSelectedAvatar" alt="" />
        </div>
      </div>
      <div class="mt-2">
        <b-button type="submit" variant="primary" block>Update User</b-button>
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
      <span>You have successfully updated this user.</span>
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
  BToast
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
    BToast,
    VueTelInput,
    API,
  },
  props: {
    data: {
      type: Object,
      required: true,
    },
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
          value: 115,
        },
        {
          text: "Finance/Data Analyst",
          value: 125,
        },
        {
          text: "Support",
          value: 120,
        },
        {
          text: "Other Staff",
          value: 105,
        },
        {
          text: "Non-staff",
          value: 100,
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
      updateData: {
        userId: "",
        fname: "",
        lname: "",
        email: "",
        address: "",
        mobile: "",
        gender: null,
        selectedRole: null,
        remark: "",
        avatar: [],
      },
      bindProps: {
        mode: "international",
        inputOptions: {
          placeholder: "Phone Number",
          required: true,
        },
      },
      updateSelectedAvatar: "",
      showSuccessToast: false
    };
  },
  watch: {
    data: function (params) {
        // console.log(JSON.stringify(params, undefined, 2));
        this.updateData.userId = params.userId;
        this.updateData.fname = params.firstName;
        this.updateData.lname = params.lastName;
        this.updateData.email = params.email;
        this.updateData.address = params.address;
        this.updateData.mobile = params.phone;
        this.updateData.sex = params.gender;
        this.updateData.remark = params.remark;
        this.updateData.selectedRole = params.role;
        this.updateData.avatar = [];
        this.updateSelectedAvatar = params.avatar;
    },
  },
  methods: {
    updateCurrentUser() {
      const files = [this.updateData.avatar];

        commonApi
        .imageUpload({files: this.files})
        .then(response => {
          const data = {
            userId: this.updateData.userId,
            avatar: response.data.path[0],
            firstName: this.updateData.fname,
            lastName: this.updateData.lname,
            email: this.updateData.email,
            address: this.updateData.address,
            phone: this.updateData.mobile,
            sex: this.updateData.gender,
            role: this.updateData.selectedRole,
            remark: this.updateData.remark,
            orgId: response.orgId,
          };
          API.updateUser(data)
            .then(() => {
              this.$emit("close-sidebar", false);
              this.refreshTable();
              this.showSuccessToast = true;
              // this.resetForm();
            })
            .catch(error => {
              console.log(error);
            });
        })
        .catch(errors => {
          console.log(errors);
        });
    },
    resetForm() {
      this.updateData.fname = "";
      this.updateData.lname = "";
      this.updateData.email = "";
      this.updateData.mobile = "";
      this.updateData.address = "";
      this.updateData.gender = null;
      this.updateData.selectedRole = null;
      this.updateData.avatar = [];
      this.updateSelectedAvatar = "";
    },
    previewAvatar(e) {
      // console.log(this.updateData.avatar)
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
        this.updateSelectedAvatar = e.target.result;
        // this.updateData.avatar = e.target.result;
      };
      reader.readAsDataURL(file);
    },

    // Refresh the table after adding a new user
    refreshTable() {
      this.$emit("refreshUserTable", true);
    },
  },
};
</script>