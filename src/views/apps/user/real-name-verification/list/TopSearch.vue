<template>
  <b-card no-body>
    <b-card-header class="pb-50">
      <h5>
        Filters
      </h5>
    </b-card-header>
    <b-card-body>
      <b-row>
        <b-col
          cols="12"
          md="3"
          class="mb-md-0 mb-2"
        >
          <label>Start and End Dates</label>
           <flat-pickr
          v-model="dateRange"
          class="form-control"
          :config="{ mode: 'range'}"
        />
        </b-col>
        <b-col
          cols="12"
          md="3"
          class="mb-md-0 mb-2"
        >
          <label>Status</label>
          <v-select
            :dir="$store.state.appConfig.isRTL ? 'rtl' : 'ltr'"
            v-model="statusFilter"
            :options="statusOptions"
            class="w-100"
          />
        </b-col>

         <b-col
          cols="12"
          md="3"
          class="mb-md-0 mb-2"
        >
          <label>Phone</label>
            <div class="d-flex align-items-center justify-content-end">
              <b-form-input
                v-model="phone"
                class="d-inline-block mr-1"
                placeholder="eg: 237671923876"
              />
            </div>
        </b-col>
        <b-col>
          <!-- needed for alignment with input boxes on the side -->
          <label></label>
          <div>
              <b-button
          v-ripple.400="'rgba(255, 255, 255, 0.15)'"
          variant="primary"
          style="height: 40px"
          @click="onSearch"
        >
          Search
        </b-button>
          </div>
        </b-col>
      </b-row>
    </b-card-body>
  </b-card>
</template>

<script>
import vSelect from 'vue-select'
import flatPickr from 'vue-flatpickr-component'
import { ref } from '@vue/composition-api'
import Ripple from 'vue-ripple-directive'

export default {
  components: {
    flatPickr,
    vSelect,
  },
    directives: {
    Ripple
  },
  props: {
    statusOptions: {
      type: Array,
      required: true,
    }
  },
  data() {
    return {  rangeDate: null}
  },
  
  setup(props, { emit }) {
     const dateRange = ref('');
     const statusFilter = ref('');
    const phone = ref('');

     const onSearch =  () => emit('onSearch', {date:dateRange.value, status:statusFilter.value.value, phone: phone.value ? '+'+ phone.value:''});

     
    return {
      onSearch,

      dateRange,
      phone,
      statusFilter
    }
  }
}
</script>

<style lang="scss">
@import '@core/scss/vue/libs/vue-select.scss';
@import '@core/scss/vue/libs/vue-flatpicker.scss';
</style>
