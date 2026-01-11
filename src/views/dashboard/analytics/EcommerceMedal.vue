<template>
  <b-card
    class="card-congratulation-medal"
  >
      <h5>{{t("Welcome")}}!</h5>
    <b-card-text class="font-small-3 w-75">
      Backed volume
    </b-card-text>
    <h3 class="mb-75 mt-2 pt-50">
      <b-link style="color: #fbc627">{{data.campaigns.totalVolume}}</b-link> <span style="font-size:12px">USD</span>
    </h3>
    <div class="text-black">
      <small>Generated </small>
      <small class="text-warning">
        {{createdAt}}
      </small>
    </div>

    <b-img
      v-if="data.campaigns.totalVolume > 10"
      :src="require('@/assets/images/illustration/badge.svg')"
      class="congratulation-medal"
      alt="Medal Pic"
    />
  </b-card>
</template>
<script>
import {
  BCard, BCardText, BLink, BButton, BImg,
} from 'bootstrap-vue'
import Ripple from 'vue-ripple-directive'
import { kFormatter } from '@core/utils/filter'

import { useUtils as useI18nUtils } from '@core/libs/i18n'
import Utils from '@/utils/index'
import Api from "./api"

export default {
  components: {
    BCard,
    BCardText,
    BLink,
    BImg,
    BButton,
  },
  directives: {
    Ripple,
  },
  props: {
    data: {
      type: Object,
      default: () => {},
    },
  },
  data() {
    return {
      createdAt: '',
      value: 0,
      periods: {
        '1': 'last24Hours',
        '2': 'last3Days',
        '3': 'last7Days',
        '4': 'last30Days',
        '5': 'allTime',
      },
      period: 1,
      app: {}
    }
  },

  watch: {
    data(info){
      this.updateData();
    }
  },
  mounted(){
    this.$root.$on('filter-transfers', this.updateData);
    // this.$root.$on('get-gen-date',this.setDate);
    this.updateData();
  },
  methods: {
    updateData(value = 1){
      // this.period = value;
      // if(value == 1){
      //   this.value = this.data.sales.amount.last24Hours;
      // }
      // if(value == 2){
      //   this.value = this.data.sales.amount.last3Days;
      // }
      // if(value == 3){
      //   this.value = this.data.sales.amount.last7Days;
      // }
      // if(value == 4){
      //   this.value = this.data.sales.amount.last30Days;
      // }
      // if(value == 5){
      //   this.value = this.data.sales.amount.allTime;
      // }
    },
    setDate(date) {
      this.createdAt = Utils.formatDate(date)
      // console.log('got it ====>>>', date, this.createdAt)
    },
    kFormatter,
    refreshData() {
      Api.refreshData().then(res => {
        if(res.success) {
          this.$root.$emit('get-dashboard-data',true);
        }
      })
    }
  },
  setup(props) {
    const { t } = useI18nUtils()
    return {
      // i18n
      t,
     }
  }
}
</script>
