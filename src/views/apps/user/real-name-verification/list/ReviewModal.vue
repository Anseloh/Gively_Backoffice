<template>
  <b-sidebar
    id="review-modal"
    bg-variant="white"
    sidebar-class="sidebar-lg"
    :visible="true"
    shadow
    backdrop
    no-header
    right
  >
    <template #default="{ hide }">
      <!-- Header -->
      <div class="d-flex justify-content-between align-items-center content-sidebar-header px-2 py-1">
        <h5 class="mb-0">
          Review User's Infomation
        </h5>

        <feather-icon
          class="ml-1 cursor-pointer"
          icon="XIcon"
          size="16"
          @click="$emit('on-hide');hide()"
        />

      </div>

      <div class="m-2">
      <!-- static text -->
      <b-form-group
        label="First Name"
        label-for="firstName"
      >
        <b-form-input
          id="firstName"
          plaintext
          :value="reviewItem.firstName"
        />
      </b-form-group>

      <!-- static text -->
      <b-form-group
        label="Last Name"
        label-for="lastName"
      >
        <b-form-input
          id="lastName"
          plaintext
          :value="reviewItem.lastName"
        />
      </b-form-group>


         <!-- static text -->
      <b-form-group
        label="ID Number"
        label-for="idNumber"
      >
        <b-form-input
          id="idNumber"
          plaintext
          :value="reviewItem.idNumber"
        />
      </b-form-group>


     <!-- static text -->
      <b-form-group
        label="Gender"
        label-for="gender"
      >
        <b-form-input
          id="gender"
          plaintext
          :value="reviewItem.sex == 0 ?'Male':'Female'"
        />
      </b-form-group>

    <!-- static text -->
      <b-form-group
        label="Submission Date"
        label-for="submissionDate"
      >
        <b-form-input
          id="submissionDate"
          plaintext
          :value="dateFormater(reviewItem.createdAt)"
        />
      </b-form-group>


      <!-- static text -->
      <b-form-group
        label="Last Rewiew Date"
        label-for="lastReviewDate"
      >
         <b-form-input
         v-if="reviewItem.reviewHistory && reviewItem.reviewHistory.length"
          id="lastReviewDate"
          plaintext
          :value="dateFormater(reviewItem.reviewHistory[0].time)"
        />

        <b-form-input
         v-else
          id="lastReviewDate"
          plaintext
          value="N/A"
        />
      </b-form-group>



       <!-- static text -->
      <b-form-group
        label="Images"
        label-for="images"
      >
      <div id="images">
       <div  
          v-for="(o, index) in item.images" 
          :key="index"
            style="max-width: 300px; margin-top:10px"
          >
          <a :href="o" 
          target="_blank"
          >
          <b-img
            :src="o"
            :alt="'image'"
            fluid
          />
          </a>
       </div>
      </div>
      </b-form-group>


   <hr class="mt-5">

        <!-- static text -->
      <b-form-group
        label="Previous Rejections"
        label-for="reviews"
      >
      <div id="reviews">
       <div  
          v-for="(o, index) in item.reviewHistory" 
          :key="index"
            style="max-width: 300px; margin-top:10px"
          >
        <div>
         <p v-if="o.message">{{dateFormater(o.time)}}:  {{o.message}}</p>
        </div>
       </div>
      </div>
      </b-form-group>

      <hr class="mt-5">

      <div>
          <b-form-group label="Review Decision">
      <b-form-radio-group
        v-model="selected"
        :options="reviewResultsOptions"
        class="demo-inline-spacing"
        name="radio-inline"
      />
    </b-form-group>

    <div v-if="selected=='-1'">
      <label for="textarea-default">Reject Reason</label>
      <multiselect 
        class="multiselect" 
        v-model="selectedReasons" 
        :taggable="true" 
        @select="defaultRejectOptionSelected"
        @remove="defaultRejectOptionRemoved"
        :options="defaultRejectReasons" 
        :multiple="true"
        :hide-selected="true"
        :close-on-select="false" 
        :clear-on-select="false" 
        placeholder="Pick some" 
        label="text" 
        track-by="id">
      </multiselect>
      <b-form-textarea
        id="textarea-default"
        placeholder="Enter Reason"
        v-model="reason"
        rows="2"
      />
    </div>

    <div class="mt-5 mb-5">
      <b-button
      @click="onSubmit(reviewItem, onSuccess)"
        v-ripple.400="'rgba(255, 255, 255, 0.15)'"
        variant="primary"
        block
      >
      Submit
    </b-button>
    </div>
      </div>
   </div>
      <!-- BODY -->
    </template>
  </b-sidebar>
</template>

<script>

import { ValidationProvider, ValidationObserver } from 'vee-validate'
import { ref } from '@vue/composition-api'
import { required, alphaNum, email } from '@validations'
import formValidation from '@core/comp-functions/forms/form-validation'
import Ripple from 'vue-ripple-directive'
import vSelect from 'vue-select'
import countries from '@/@fake-db/data/other/countries'
import utils from "@/utils/index"
import Multiselect from 'vue-multiselect';

import { useToast } from 'vue-toastification/composition'
import reviewModal from './hooks/reviewModal'

export default {
  components: {
    vSelect,

    // Form Validation
    ValidationProvider,
    ValidationObserver,
    Multiselect
  },
  directives: {
    Ripple,
  },
  props: {
    reviewItem: {
      type: Object,
      required: true,
      default: function () {
        return { }
      }
    }
  },
  data() {
    return {
      required,
      alphaNum,
      email,
      countries,
    }
  },
  setup(props, { emit }) {
    const { onSubmit, reason, selected } = reviewModal();
    const defaultRejectReasons = [
      {
        id: 1,
        checked: false,
        text: "Identification Document has expired"
      },
      {
        id: 2,
        checked: false,
        text: "Passport mismatch"
      },
      {
        id: 3,
        checked: false,
        text: "Information mismatch"
      },
      {
        id: 4,
        checked: false,
        text: "Insufficient Documents"
      },
      {
        id: 5,
        checked: false,
        text: "Documents not clear"
      },
    ];

    const selectedReasons = ref([]);

    const blankUserData = {
      fullName: '',
      username: '',
      email: '',
      role: null,
      currentPlan: null,
      company: '',
      country: '',
      contact: '',
    }

   const reviewResultsOptions = ref([
        { text: 'Rejected', value: '-1' },
        { text: 'Approved', value: '5' }
      ]);

  const onSuccess = () => {
    emit('on-submit',{});
    emit('on-hide');
  }


    const item = ref(props.reviewItem || {});

  const kv = [];
  /**
   * @param {Object} option new selected option.
   * @param {Number} option.id 
   * @param {String} option.text 
   * @param {Boolean} option.checked 
   */
  const defaultRejectOptionSelected = option => {
    console.log(option);
    option.checked = true;
    reason.value = `${option.text}\n${reason.value}`;
  };


  /**
   * @param {Object} option Removed option.
   * @param {Number} option.id 
   * @param {String} option.text 
   * @param {Boolean} option.checked 
   */
  const defaultRejectOptionRemoved = (option, id) => {
    let found = false;
    do {
      if(!reason.value || !option.checked) return;

      const idx = reason.value.indexOf(option.text);
      found = idx >= 0;
      if(found) {
        reason.value = reason.value.substring(0, idx -1) + reason.value.substring(idx + option.text.length);
      }
    } while (found);

    option.checked = false;
  };

    return {
      onSubmit, 
      reason, 
      selected,
      item,
      onSuccess,
      dateFormater:utils.formatDate,
      reviewResultsOptions,
      defaultRejectReasons,
      selectedReasons,
      defaultRejectOptionSelected,
      defaultRejectOptionRemoved
    }
  },
}
</script>

<style lang="scss">
@import '@core/scss/vue/libs/vue-select.scss';


#review-modal {
  .vs__dropdown-menu {
    max-height: 200px !important;
  }

  label {
    font-weight: bold;
    font-size: 16px;
  }

  input {
    font-size: 16px;
  }

.multiselect {
  box-sizing: content-box;
  display: block;
  position: relative;
  width: calc(100% - 40px);
  min-height: 40px;
  text-align: left;
  color: #35495e;
    border: 1px solid #ccc;
  padding: 8px;
  margin-top: 16px;
  margin-bottom: 16px;

}

.multiselect__select {
  position: absolute;
  width: 40px;
  height: 38px;
  right: 1px;
  top: 1px;
  padding: 4px 8px;
  text-align: center;
  transition: transform .2s ease;
}
.multiselect__select:before {
    position: relative;
    right: 0;
    top: 65%;
    color: #999;
    margin-top: 4px;
    border-style: solid;
    border-width: 5px 5px 0;
    border-color: #999 transparent transparent;
    content: "";
}
.multiselect__tags {
  min-height: 40px;
  display: block;
  padding: 8px 40px 0 8px;
  border-radius: 5px;
  border: 1px solid #e8e8e8;
  background: #fff;
  font-size: 14px;
}
.multiselect__option {
  display: block;
  padding: 12px;
  min-height: 40px;
  line-height: 16px;
  text-decoration: none;
  text-transform: none;
  vertical-align: middle;
  position: relative;
  cursor: pointer;
  white-space: pre-wrap;
}
.multiselect__element {
  list-style-image: none;
  list-style-type: none;
  list-style-position: outside;
  color: rgb(53, 73, 94)
}
.multiselect__input, .multiselect__single {
  position: relative;
  display: inline-block;
  min-height: 20px;
  line-height: 20px;
  border: none;
  border-radius: 5px;
  background: #fff;
  padding: 0 0 0 5px;
  width: 100%;
  transition: border .1s ease;
  box-sizing: border-box;
  margin-bottom: 8px;
  vertical-align: top;
}
.multiselect__single {
  padding-left: 5px;
  margin-bottom: 8px;
}
.multiselect__input:focus, .multiselect__single:focus {
  border-color: #a8a8a8;
  outline: none;
}
.multiselect, .multiselect__input, .multiselect__single {
  font-family: inherit;
  font-size: 16px;
  -ms-touch-action: manipulation;
  touch-action: manipulation;
}
.multiselect__option--highlight {
    background: #41b883;
    background-image: initial;
    background-position-x: initial;
    background-position-y: initial;
    background-size: initial;
    background-repeat-x: initial;
    background-repeat-y: initial;
    background-attachment: initial;
    background-origin: initial;
    background-clip: initial;
    background-color: rgb(65, 184, 131);
    outline: none;
    color: #fff;
}

.multiselect__option--selected.multiselect__option--highlight {
    background: #ff6a6a;
    color: #fff;
}

.multiselect__content {
  list-style: none;
  display: inline-block;
  padding: 0;
  margin: 0;
  min-width: 100%;
  vertical-align: top;
}

.multiselect__content-wrapper {
  position: absolute;
  display: block;
  background: #fff;
  width: 100%;
  max-height: 240px;
  overflow: auto;
  border: 1px solid #e8e8e8;
  border-top: none;
  border-bottom-left-radius: 5px;
  border-bottom-right-radius: 5px;
  z-index: 3;
  -webkit-overflow-scrolling: touch;
}

.multiselect__option:after {
  top: 0;
  right: 0;
  position: absolute;
  line-height: 40px;
  padding-right: 12px;
  padding-left: 20px;
  font-size: 13px
}

.multiselect__option--highlight:after {
  content: attr(data-select);
  background: #41b883;
  color: #fff
}

// .multiselect__option--selected:after {
//   content: attr(data-selected);
//   color: silver
// }

.multiselect__option--selected.multiselect__option--highlight:after {
  background: #ff6a6a;
  content: attr(data-deselect);
  color: #fff
}

.multiselect__tag {
    position: relative;
    display: inline-block;
    padding: 4px 26px 4px 10px;
    border-radius: 5px;
    margin-right: 10px;
    color: #fff;
    line-height: 1;
    background: rgba(153, 0, 153, 0.7);
    margin-bottom: 5px;
    white-space: nowrap;
    overflow: hidden;
    max-width: 100%;
    text-overflow: ellipsis;
}

.multiselect__tag-icon {
    cursor: pointer;
    margin-left: 7px;
    position: absolute;
    right: 0;
    top: 0;
    bottom: 0;
    font-weight: 700;
    font-style: normal;
    width: 22px;
    text-align: center;
    line-height: 22px;
    transition: all .2s ease;
    border-radius: 5px;
    color: white !important;
}

.multiselect__tag-icon:after {
    content: "\D7";
    color: white;
    font-size: 14px;
}
}
</style>
