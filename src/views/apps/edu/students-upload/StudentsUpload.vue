<template>
  <div>
    <b-card v-if="!uploadCompleted">
      <div class="row pt-0">
        <div class="col-12 pb-1">
          <span class="font-weight-bolder">School scope Id</span>
        </div>
        <div class="col-lg-10 col-12 col-md-9">
          <input
            v-model="scopeId"
            type="text"
            class="form-control"
            placeholder="e.g. John Doe"
            @change="resetAll"
          />
        </div>
        <div class="col-lg-2 col-12 col-md-3" @click="getSchoolAcademicYears()">
          <span class="btn btn-primary btn-block">
            <feather-icon icon="SearchIcon" /> Search</span>
        </div>
      </div>
    </b-card>
    <b-card v-if="showAcademicPane">
      <div class="row pt-0">
        <div class="col-12 pb-1">
          <span class="font-weight-bolder">Year and Class</span>
        </div>
        <div class="col-12 col-md-6">
          <label>Academic year</label>
          <v-select
            v-model="year"
            :options="academicYears"
            @input="selectedYearChanged"
          ></v-select>
        </div>
        <div class="col-12 col-md-6">
          <label>Target class</label>
          <v-select v-model="selectedClass" :options="yearClasses"></v-select>
        </div>
      </div>
    </b-card>
    <b-card v-if="showFilePane">
      <div class="row pt-0">
        <div class="col-12 pb-1">
          <span class="font-weight-bolder">Students file</span>
        </div>
        <div class="col-12" :class="{ 'col-md-10': !file, 'col-md-9': file }">
          <div>
            <!-- Styled -->
            <b-form-file
              v-model="file"
              placeholder="Choose files or drop it here..."
              drop-placeholder="Drop files here..."
              accept="text/csv"
            />
          </div>
        </div>
        <div
          class="col-12 d-md-flex p-md-0"
          :class="{ 'col-md-2': !file, 'col-md-3': file }"
        >
          <div class="pl-md-0" :class="{ 'col-6': file, 'col-12': !file }">
            <b-button
              block
              variant="primary"
              @click="uploadFile()"
            >
              <span class="d-none d-sm-inline">Upload</span>
            </b-button>
          </div>
          <div class="col-6 pl-md-0 mb-1 mb-md-0" v-if="file != null">
            <b-button block variant="secondary" @click="resetFile()">
              <span class="d-none d-sm-inline" v-text="'Reset'"></span>
            </b-button>
          </div>
        </div>
      </div>
    </b-card>
    <template v-if="uploadCompleted">
      <b-card>
        <div class="row">
          <div class="col-12 pb-1">
            <span class="font-weight-bolder">Upload report</span>
          </div>
          <div class="col-12 col-sm-4 col-md-3">
            <span>Total Lines : </span>
            <span class="text-danger">{{uploadResults.totalLines}}</span>
          </div>
          <div class="col-12 col-sm-4 col-md-3">
            <span>Total Processed : </span>
            <span class="text-danger">{{uploadResults.totalUploaded}}</span>
          </div>
          <div class="col-12 col-sm-9 mb-1"></div>
          <div class="col-12 col-sm-3 align-self-end" @click="completeUpload()">
            <span class="btn btn-success btn-block">  Close report </span>
          </div>
        </div>
      </b-card>
      <b-card>
        <div class="row">
          <!-- Report : Added Lines -->
          <template v-if="uploadResults.addedLines.length">
            <div v-b-toggle.addedLines class="col-12 pb-1">
              > <span class="font-weight-bolder">Added Lines : {{uploadResults.addedLines.length}}</span>
            </div>
            <b-collapse id="addedLines" class="col-12 mb-1">
              <div class="d-flex flex-column" style="background: #efefef">
                <span class="p-1 d-block" v-for="(line, idx) in uploadResults.addedLines" :key="idx">
                  {{line.line}}
                </span>
              </div>
            </b-collapse>
          </template>
          <!-- Report : Updated Lines -->
          <template v-if="uploadResults.updatedLines.length">
            <div v-b-toggle.updatedLines class="col-12 pb-1">
              > <span class="font-weight-bolder"> Updated Lines : {{uploadResults.updatedLines.length}}</span>
            </div>
            <b-collapse id="updatedLines" class="col-12 mb-1">
              <div class="d-flex flex-column" style="background: #efefef">
                <span class="p-1 d-block" v-for="(line, idx) in uploadResults.updatedLines" :key="idx">
                  {{line.line}}
                </span>
              </div>
            </b-collapse>
          </template>
          <!-- Report : Parse Error Lines -->
          <template v-if="uploadResults.parseErrors.length">
            <div v-b-toggle.parseErrors class="col-12 pb-1">
              > <span class="font-weight-bolder">Parse error Lines : {{uploadResults.parseErrors.length}}</span>
            </div>
            <b-collapse id="parseErrors" class="col-12 mb-1">
              <div class="d-flex flex-column" style="background: #efefef">
                <span v-for="(line, idx) in uploadResults.parseErrors" :key="idx">
                  {{line}}
                </span>
              </div>
            </b-collapse>
          </template>
          <!-- Report : Upload Errors -->
          <template v-if="uploadResults.uploadErrors.length">
            <div v-b-toggle.uploadErrors class="col-12 pb-1">
              > <span class="font-weight-bolder">Upload error Lines : {{uploadResults.uploadErrors.length}}</span>
            </div>
            <b-collapse id="uploadErrors" class="col-12 mb-1">
              <div class="d-flex flex-column" style="background: #efefef">
                <span v-for="(line, idx) in uploadResults.uploadErrors" :key="idx">
                  {{line}}
                </span>
              </div>
            </b-collapse>
          </template>
          <!-- Report : Unknown Result -->
          <template v-if="uploadResults.unknownResult.length">
            <div v-b-toggle.unknownResult class="col-12 pb-1">
              > <span class="font-weight-bolder">Unknown results Lines : {{uploadResults.unknownResult.length}}</span>
            </div>
            <b-collapse id="unknownResult" class="col-12 mb-1">
              <div class="d-flex flex-column" style="background: #efefef">
                <span v-for="(line, idx) in uploadResults.unknownResult" :key="idx">
                  {{line}}
                </span>
              </div>
            </b-collapse>
          </template>

          <div class="col-12 col-sm-9 mb-1"></div>
          <div v-if="showBottomReportButton" class="col-12 col-md-3" @click="completeUpload()">
            <span class="btn btn-success btn-block">  close report </span>
          </div>
        </div>
      </b-card>
    </template>
  </div>
</template>
<script>
import { 
  BCard, 
  BCardText, 
  BFormFile, 
  BContainer,
  BCollapse
} from "bootstrap-vue";
import vSelect from "vue-select";
import ToastificationContent from "@core/components/toastification/ToastificationContent.vue";
import API from "./api";

export default {
  components: {
    BCard,
    BCardText,
    BContainer,
    BFormFile,
    BCollapse,
    vSelect,
    ToastificationContent,
  },
  data: () => ({
    file: null,
    year: null,
    scopeId: null,
    selectedClass: null,
    yearClasses: [],
    academicYears: [],
    uploadResults: {
      totalUploaded: 0,
      addedLines: [],
      parseErrors: [],
      updatedLines: [],
      uploadErrors: [],
      unknownResult: []
    },
    uploadCompleted: false,
    showBottomReportButton: false
  }),
  computed: {
    showAcademicPane() {
      return !this.uploadCompleted && this.academicYears.length > 0;
    },
    showFilePane() {
      return !this.uploadCompleted && this.year && this.selectedClass;
    },
  },
  methods: {
    completeUpload() {
      this.uploadCompleted = false;
      this.resetAll();
    },
    showToast(message, icon, variant) {
      this.$toast({
        component: ToastificationContent,
        props: {
          title: message || "Error fetching academic years",
          icon: icon || "InfoIcon",
          variant: variant || "danger",
        },
      });
    },
    async getSchoolAcademicYears() {
      try {
        this.resetAll();
        const response = await API.getAcademicYears(this.scopeId);

        if (response.success) {
          if (response.data && response.data.years) {
            this.academicYears = response.data.years.map(x => ({
              value: {
                x,
                classes: x.class
                  .filter(c => c.status == 1)
                  .map(c => ({label: `${c.classLabel} ${c.name}`, value: c})),
              },
              label: `${x.startMonth}-${x.startYear}/${x.endMonth}-${x.endYear}`,
            }));
          }

          if(this.academicYears.length <= 0) {
            this.showToast('No year found', null, 'info');
          }
        } else {
          this.showToast(response.errorMsg);
        }
      } catch (error) {
        this.showToast();
      }
    },
    selectedYearChanged(item) {
      console.log(item);
      this.selectedClass = null;
      this.yearClasses = item.value.classes;
      if(this.yearClasses.length <= 0) {
        this.showToast('No class in the selected year', null, 'info');
      }
    },
    resetAll() {
      this.file = null;
      this.year = null;
      this.yearClasses = [];
      this.academicYears = [];
      this.selectedClass = null;
      this.showBottomReportButton = false;
    },
    resetFile() {
      this.file = null;
    },
    async uploadFile() {
      try {
        if(!this.file) {
          this.showToast('Choose file please.', null, 'warning');
          return;
        }

        const response = await API.uploadStudents(this.year.value.x._id, this.selectedClass.value._id, this.file);
        if(!response.success) {
          this.showToast('Error while uploading students. Please, retry.');
          return;
        }

        this.showToast('Upload done', 'OkIcon', 'success');
        this.uploadResults = response.data;
        this.uploadCompleted = true;
        setTimeout(() => {
          this.showBottomReportButton = true;
        }, 30 * 1000);
      } catch (error) {
        this.showToast('Error while uploading students. Please, retry.');
      }
    }
  }
};
</script>

<style lang="scss" scoped>
</style>
