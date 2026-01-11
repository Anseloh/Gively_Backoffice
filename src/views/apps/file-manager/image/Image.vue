<template>
  <b-row class="match-height">
    <b-col cols="12">
      <b-card-code title="Images">

        <b-button
          v-if="paths.length != 0 || files.length !=0"
          variant="primary"
          size="sm"
          class="my-3"
          @click="reset()">
          <span class="d-none d-sm-inline" v-text="paths.length !=0 ? 'New' : 'Reset'"></span>
        </b-button>

    <b-card-text v-text="paths.length == 0 ? 'Select an images and upload' : 'Images uploaded'">
    </b-card-text>

    <div v-if="paths.length == 0">

      <!-- Styled -->
      <b-form-file
        v-model="files"
        placeholder="Choose files or drop it here..."
        drop-placeholder="Drop files here..."
        accept="image/*"
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
      <b-row 
        class="mt-1"
       align-v="center"
          v-for="(path, index) in paths" :key="index">
        <b-col sm="3" md="2">
          <b-img
            thumbnail
            fluid
            width="100px"
            height="100px"
            :src="path"
            alt="Image 1"
          />
        </b-col>
        <b-col sm="9" md="10">
        <strong style="color: white">
            {{ path }}  
        </strong>
        </b-col>
      </b-row>
    </b-container>

  </b-card-code>
    </b-col>
  </b-row>
</template>

<script>
import BCardCode from '@core/components/b-card-code'
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
