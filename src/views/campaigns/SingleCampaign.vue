<template>
<!-- project details area start  -->
<section class="project-details-area pt-40 pb-50">
    <div class="container">
        <div class="row">
            <div class="col-xxl-8 col-xl-8 col-lg-8 col-md-12">
                <div class="" v-if="campaign.videoUrl" style="height: auto;">
                    <div v-html="processedYoutubeVideo" v-if="isYoutube">

                    </div>
                    <div v-else>
                      <video :src="campaign.videoUrl"></video>
                    </div>
                </div>
                <div v-else class="p-1 rounded bg-light">
                    <img :src="campaign.banner" v-if="campaign.banner" class="img-fluid" alt="project_img" style="max-height: 400px"/>
                </div>
                <div class="mb-40">
                    <h3>{{ campaign.title }}</h3>
                    <div class="p-2 d-flex">
                      <div class="w-100" style="text-align: right">
                        <b-button size="lg" class="" variant="warning">
                          Back this campaign
                        </b-button>
                      </div>
                    </div>
                    <p>{{campaign.shortDesc}}</p>
                </div>
                <div>
                <b-tabs content-class="mt-3">
                  <b-tab active class="pt-10">
                    <template #title>
                      <div>
                        <h5 class="theme-color">
                          Story
                        </h5>
                      </div>
                    </template>
                    <p v-html="campaign.desc"></p>
                  </b-tab>
                  <b-tab class="pt-10">
                    <template #title>
                      <div>
                        <h5 class="theme-color">
                          Reviews
                        </h5>
                      </div>
                    </template>
                    <div class="p-1" v-if="!reviews.length">
                      <em>No reviews found  found</em>
                    </div>
                    <div class="recent-reviews">
                      <div v-for="(item, index) in reviews" :key="index">
                        <div class="d-flex border rounded p-1">
                          <div class="mr-10">
                            <b-avatar variant="warning" size="50px" class="alert-secondary text-dark"></b-avatar>
                          </div>
                          <div class="w-100">
                            <div class="h6 text-black">Ansel Ansel</div>
                            <div>
                               <b-form-rating variant="warning" class="p-0" readonly inline v-model="item.note"></b-form-rating>
                            </div>
                            <div>
                              {{item.text}}
                            </div>
                          </div>
                        </div>
                        <div class="border-left ml-40" style="height: 25px; border-left: 1px solid #ddd;">

                        </div>
                      </div>
                      <div v-if="hasMoreReviews">
                        <div class="p-1 border rounded">
                          <b-button variant="dark" size="sm" @click="getReviews(currentPage + 1)">Load more</b-button>
                        </div>
                        <div class="border-left ml-40" style="height: 25px; border-left: 1px solid #ddd;">

                        </div>
                      </div>
                    </div>
                    <div class="contact-form">
                      <h6>Add Review</h6>
                      <div>
                        <b-form-rating inline v-model="review.rating"></b-form-rating>
                      </div>
                      <div class="mt-3">
                        <b-form-textarea v-model="review.text" placeholder="Write a review">

                        </b-form-textarea>
                      </div>
                      <div class="mt-3">
                        <span class="theme-btn theme-btn-small border text-black rounded" @click="addReview">
                          Submit
                        </span>
                      </div>
                    </div>
                  </b-tab>
                  <b-tab class="pt-10" v-if="campaign.isBackersPublic">
                    <template #title>
                      <div>
                        <h5 class="theme-color">
                          Backers
                        </h5>
                      </div>
                    </template>
                    <div class="campaign-backers">
                      <div class="d-flex justify-content-center align-items-center p-1 rounded border ">
                        <div class="mr-10">
                          <b-avatar variant="warning" size="50px" class="alert-secondary text-dark"></b-avatar>
                        </div>
                        <div class="w-100">
                          <div class="h6 text-black">Ansel Ansel</div>
                          <div class="fw-bolder theme-color" style="font-size: 20px; margin-top: -15px">
                            $20
                          </div>
                        </div>
                      </div>
                      <div class="border-left ml-40" style="height: 25px; border-left: 1px solid #ddd;">

                      </div>
                       <div class="d-flex justify-content-center align-items-center p-1 rounded border ">
                        <div class="mr-10">
                          <b-avatar variant="warning" size="50px" class="alert-secondary text-dark"></b-avatar>
                        </div>
                        <div class="w-100">
                          <div class="h6 text-black">Anonymous</div>
                          <div class="fw-bolder theme-color" style="font-size: 20px; margin-top: -15px">
                            $2000
                          </div>
                        </div>
                      </div>
                    </div>
                  </b-tab>
                </b-tabs>
                <div class="mt-20 text-end">
                  <b-button variant="warning" size="lg">
                    <font-awesome-icon :icon="['fas','comments']"></font-awesome-icon> Chat with Creator
                  </b-button>
                </div>
              </div>
            </div>
            <div class="col-xxl-4 col-xl-4 col-lg-4 col-md-6">
                <div class="sidebar-wrap sticky-top">
                    <div class="right-bar pl-10 pb-10 pr-10">
                      <div class="d-block pr-10 pt-2">
                        <b-button :to="`/campaigns?category=${campaign.category}`" variant="success"> <font-awesome-icon :icon="['fas', 'user-tag']"></font-awesome-icon> {{ campaign.categoryName}}</b-button>
                      </div>
                      <div class="d-inline-block pt-2">
                        <font-awesome-icon :icon="['fas', 'map-marker-alt']"></font-awesome-icon>
                        {{campaign.location}}
                      </div>
                      <div class="d-block pt-2">
                        <font-awesome-icon :icon="['fas', 'flag']"></font-awesome-icon>
                        {{country}}
                      </div>
                      <div class="pt-2 d-none">
                        <h4>{{ campaign.title }}</h4>
                      </div>
                      <div class="mt-10 d-flex align-items-stretch">
                        <div class="w-100 align-self-center m-1 text-center rounded bg-dark text-light p-3">
                          <span class="h6">$ {{currency(campaign.currentAmount)}}</span>
                          <span class="h6 d-block text-warning">Pledged<br></span>
                        </div>
                        <div class="w-100 align-self-center m-1 text-center rounded bg-dark text-light p-3">
                          <span class="h6">12</span>
                          <span class="h6 d-block text-warning">Backers<br></span>
                        </div>
                        <div class="w-100 align-self-center m-1 text-center rounded bg-dark text-light p-3">
                          <span class="h6">Ends in </span>
                          <span class="h6 d-block text-warning">{{endDate}}</span>
                        </div>
                      </div>
                      <div class="pt-2 d-flex justify-content-between">
                        <div>
                          Attained
                        </div>
                        <div class="text-end">
                          {{getProgress()}}%
                        </div>
                      </div>
                      <div>
                        <div class="progress bg-secondary" v-b-tooltip :title="`$${currency(campaign.currentAmount)} of $${currency(campaign.targetAmount)}`">
                            <div class="progress-bar progress-bar-striped progress-bar-animated" role="progressbar" :style="{width: getProgress() + '%'}" :aria-valuenow="getProgress()" aria-valuemin="0" aria-valuemax="100"></div>
                          </div>
                      </div>
                      <div class="mt-2">
                        <div class="d-flex">
                          <div class="pr-15">
                            <span class="h5"> Target Amount:</span>
                          </div>
                          <div class="text-dark h4 fw-bolder">
                            ${{currency(campaign.targetAmount)}}
                          </div>
                        </div>
                      </div>
                      <div class="mt-2">
                        <!-- Campaign will be started within <span class="text-dark fw-bolder">{{daysLeft()}}</span> -->
                      </div>
                      <div class="mt-2">
                        <div class="d-flex align-items-center">
                          <div class="pr-10">
                            <b-avatar variant="warning theme-color" class="bg-black"></b-avatar>
                          </div>
                          <div class="w-100">
                            By <span class="fw-bolder"> {{campaign.creator}} </span>
                            <div>
                              <!-- 1 Campaigns -->
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div class="right-bar pt-10 pl-10 pb-10 pr-10 mt-10" v-for="(reward, index) in campaign.rewards" :key="index">
                      <h5>
                        Reward {{index + 1}}
                      </h5>
                      <div>
                        {{reward.desc}}
                      </div>
                      <div class="text-black fw-bolder pt-10">
                        Expected Delivery Date: <span class="theme-color">{{reward.deliveryMonth}}/{{reward.deliveryYear}}</span>
                      </div>
                      <div class="pt-10 text-center" v-if="reward.image">
                        <b-img :src="reward.image" style="height: 100px">

                        </b-img>
                      </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</section>
<!-- project detials area end  -->
</template>

<script>

// import {currency, Utils.formatToDays, getProgress, getCountries};

import Utils from '../../utils';

export default {
    name: '',
    props:{
      campaign: {
        type: Object,
        default() {
          return {}
        }
      }
    },
    data() {
        return {
          currency:Utils.formatCurrency,
          hasMoreReviews: false,
          currentPage: 1,
          review: {
            text: '',
            rating: 0
          },
          reviews: [],
        }
    },
    computed: {
      country(){
        const country = Utils.getCountries().filter(item => item.code == this.campaign.country);
        if(country.length) return country[0].name;
        return ''
      },
      endDate(){
        if(this.campaign.runningStatus == 3 || this.campaign.runningStatus == 4){
          if(!this.campaign.plannedEndDate) return '0 days';
          return Utils.formatToDays(this.campaign.plannedEndDate);
        }

        if(!this.campaign.endDate) return '0 days'
        return Utils.formatToDays(this.campaign.endDate);
      },
      processedYoutubeVideo(){
        var video = '';
        if(this.campaign.videoUrl.substr(0, 7) == '<iframe'){
          video = this.campaign.videoUrl;
        }else{
          if(this.campaign.videoUrl.substr(0,16) == 'https://youtu.be'){
            video = this.campaign.videoUrl.substr(17);
          }else if(this.campaign.videoUrl.includes('youtube.com')){
            const params = new Proxy(new URLSearchParams(new URL(this.campaign.videoUrl).search), {
              get: (searchParams, prop) => searchParams.get(prop),
            });
            video = params.v
          }

          if(video){
            video = ` <iframe  id="display-video-iframe" width="100%" height="auto" style="min-height: 400px;" type="video" src="https://www.youtube.com/embed/${video}?autoplay=0&controls=1&loop=1&rel=0&modestbranding=0&playlist=${video}" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay ; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>`;
          }
        }

        return video;
      }
    },
    mounted(){
      this.getReviews();
      // demo purpose only
      // this.hasMoreReviews = [true,false][Math.floor(Math.random() * 2)];
    },
    methods:{
      getProgress(){
        return Utils.getProgress(this.campaign.targetAmount, this.campaign.currentAmount);
      },
      daysLeft(){
        // return Utils.formatToDays(this.campaign.plannedEndDate);
        return '';
      },
      isYoutube(){
        if(this.campaign.videoUrl.includes('youtube.com') || this.campaign.videoUrl.includes('https://youtu.be')) return true;
        return false;
      },
      getReviews(page = 1){
        this.$api.get(`/v1/campaign/action/review/${this.campaign._id}/list?pag=${page}`).then(res => {
          if(res.data.success){
            this.reviews = [...this.reviews, ...res.data.data.list];
            this.currentPage += 1;
            this.hasMoreReviews = res.data.data.hasMore;
          }
        }).catch(err=>{
          console.log(err);
        })
        // this.reviews.push({rating: Math.floor(Math.random() * 6)});
        // this.hasMoreReviews = [true,false][Math.floor(Math.random() * 2)];
      },
      getBackers(page = 1){
        this.$api.get(`/v1/campaign/action/back/${this.campaign._id}/list?pag=${page}`).then(res => {
          if(res.data.success){
            this.reviews = [...this.reviews, ...res.data.data.list];
            this.currentPage += 1;
            this.hasMoreReviews = res.data.data.hasMore;
          }
        }).catch(err=>{
          console.log(err);
        })
      },
      addReview(){
        if(!this.review.rating){
          this.$toast.error("Leave a rating between 1 and 5 stars");
          return 0;
        }
        if(!this.review.text){
          this.$toast.error("Write a review");
          return 0;
        }

        this.$api.post(`/v1/campaign/action/review/${this.campaign._id}/new`, {...this.review}).then(res => {
          if(res.data.success){
            this.reviews.push({...res.data.data});
            this.review.rating = '';
            this.review.text = 0;
          }
        }).catch(err=>{
          console.log(err);
        })
      }
    }
}
</script>

<style lang="scss">
  #campaign-desc{

  }
</style>
<style lang="scss" scoped>
  .right-bar{
    background-color: #eee
  }
  .recent-reviews {
    .b-rating{
      border: 0;
      justify-content: start;
    }
  }
</style>
