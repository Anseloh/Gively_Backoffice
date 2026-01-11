<template>
  <b-row class="match-height">
    <b-col cols="12">
      <b-card-code title="Upload File">

        <b-button
          v-if="paths.length != 0 || files.length !=0"
          variant="primary"
          size="sm"
          class="my-3"
          @click="reset()">
          <span class="d-none d-sm-inline" v-text="paths.length !=0 ? 'New' : 'Reset'"></span>
        </b-button>

    <b-card-text v-text="paths.length == 0 ? 'Select a file to upload' : 'File Uploaded'">
    </b-card-text>

    <div v-if="paths.length == 0">

      <!-- Styled -->
      <b-form-file
        v-model="files"
        placeholder="Choose files or drop it here..."
        drop-placeholder="Drop files here..."
        multiple
      />

      <b-card-text
        class="my-1"
        >
        <strong
          :key="index"
          v-for="(file, index) in files"
          >
            {{ file.name }}
        </strong>
      </b-card-text>
    </div>

    <div class="d-flex flex-wrap" v-if="paths.length == 0 && files.length != 0">
        <b-button
          variant="primary"
          @click="uploadFile()"
          :disabled="isLoading"
          >
          <span class="d-none d-sm-inline">Upload</span>
        </b-button>
        <b-spinner class="mx-3" type="grow" label="Loading..." v-if="isLoading" />
    </div>
    <b-container
      fluid
      v-if="paths.length !=0 "
      class="p-1 bg-dark"
    >
      <div
        class="mt-1 d-flex"
       align-v="center"
          v-for="(path, index) in paths" :key="index">
        <div>
          <div class="alert alert-light rounded text-center">
            <feather-icon icon="FileTextIcon" size="100" class="m-1 text-primary"></feather-icon>
          </div>
        </div>
        <div class="w-100 p-1">
        <strong class="text-light text-truncate">
            {{ path }}
        </strong>
        <div>
          <b-button @click="copyText(path)" variant="primary">
            Copy
          </b-button>
        </div>
        </div>
      </div>
    </b-container>

  </b-card-code>
    </b-col>
  </b-row>
</template>

<script>
import BCardCode from '@core/components/b-card-code'
import ToastificationContent from "@core/components/toastification/ToastificationContent.vue";
import axios from '@axios'
import {
    BRow, BCol, BFormFile, BCardText, BButton, BImg, BContainer, BSpinner,
} from 'bootstrap-vue'
import { codeBasic } from './code'
import Api from "../api";

export default {
  components: {
    BButton,
    BCardCode,
    BRow,
    BCol,
    BCardText,
    BFormFile,
    BImg,
    BContainer,
    BSpinner,
    ToastificationContent,
  },
  data() {
    return {
      files: [],
      paths:[],
      codeBasic,
      isLoading: false,
    }
  },
  methods: {
    copyText (text) {
      navigator.clipboard.writeText(text);
      this.$toast({
          component: ToastificationContent,
          props: {
            title: "File link copied to clipboard",
            icon: "AlertTriangleIcon",
          },
        });
    },
    uploadFile() {
      if (!this.isLoading) {
        this.isLoading = true

        return new Promise((resolve, reject) => {

            Api.imageUpload({files: this.files})
                .then(response => {
                    console.log(response)
                    this.paths = response.data.path // .map(value => value.replace('localhost', '192.168.30.8'))
                    this.isLoading = false
                    resolve(response)
                })
                .catch(error => {
                    console.log(error)
                    this.isLoading = false
                    reject(error)
                })
        })
      }
    },

    reset() {
      if (!this.isLoading) {
        this.paths = []
        this.files = []
      }
    },
  }
}
</script>
