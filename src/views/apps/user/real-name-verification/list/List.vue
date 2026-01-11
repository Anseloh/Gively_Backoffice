<template>

  <div>
    <review-modal
      v-if="showDetailModal"
      @on-hide="hideReviewModal"
      @on-submit="refetchData"
      :review-item="currentReviewItem"
    />
    <!-- Filters -->
    <top-search
      :status-filter.sync="statusFilter"
      :status-options="statusOptions"
      @onSearch="refetchData"
    />

    <!-- Table Container Card -->
    <b-card
      no-body
      class="mb-0"
    >
      <b-table
        style="margin-top: 1px"
        ref="refUserListTable"
        class="position-relative"
        :items="fetchUsers"
        responsive
        :fields="tableColumns"
        primary-key="id"
        :sort-by.sync="sortBy"
        show-empty
        empty-text="No matching records found"
        :sort-desc.sync="isSortDirDesc"
      >

        <!-- Column: User -->
        <template #cell(user)="data">
          <b-media vertical-align="center">
            <template #aside>
              <b-avatar
                size="32"
                :src="data.item.user.avatar"
                :text="avatarText(data.item.fulvisiblelName)"
                :to="{ name: 'apps-users-view', params: { id: data.item.id } }"
              />
            </template>
            <b-link
              :to="{ name: 'apps-users-view', params: { id: data.item.id } }"
              class="font-weight-bold d-block text-nowrap text-capitalize"
            >
              {{ data.item.firstName }} {{ data.item.lastName }}
            </b-link>
            <small class="text-muted">id: {{ data.item.user.ufId }}</small>
          </b-media>
        </template>

         <!-- Column: date -->
        <template #cell(date)="data">
          <div class="text-nowrap">
            <span class="small align-text-top text-capitalize">{{ formatDate(data.item.createdAt) }}</span>
          </div>
        </template>

         <!-- Column: updated at -->
        <template #cell(updatedAt)="data">
          <div class="text-nowrap">
            <span class="small align-text-top text-capitalize">{{ formatDate(data.item.updatedAt) }}</span>
          </div>
        </template>

        <!-- Column: phone -->
        <template #cell(phone)="data">
          <div class="text-nowrap">
            <span class="align-text-top text-capitalize">{{ data.item.user.phone }}</span>
          </div>
        </template>

        <!-- Column: Status -->
        <template #cell(status)="data">
          <b-badge
            pill
            :variant="`light-${resolveUserStatusVariant(data.item.status)}`"
            class="text-capitalize"
          >
            {{ statusOptionsMap[data.item.status]}}
          </b-badge>
        </template>

        <!-- Column: images -->
        <template #cell(images)="data">
          <a
          v-for="(item, index) in data.item.images"
          :key="index"
          :href="item"
          target="_blank"
          class="mr-1"
          >
                 <b-img
                :src="item"
                :alt="'image'"
                height="55px"
                rounded
                width="55px"
              />
          </a>
        </template>
        <!-- Column: Actions -->
        <template #cell(actions)="data">
          <b-dropdown
            variant="link"
            no-caret
            :right="$store.state.appConfig.isRTL"
          >
            <template #button-content>
              <feather-icon
                icon="MoreVerticalIcon"
                size="16"
                class="align-middle text-body"
              />
            </template>
            <b-dropdown-item  @click="onShowDetailModal($event, data.item)">
              <feather-icon icon="EditIcon" />
              <!-- data.item.id -->
              <span class="align-middle ml-50">Review</span>
            </b-dropdown-item>
            <!-- <b-dropdown-item>
              <feather-icon icon="TrashIcon" />
              <span class="align-middle ml-50">Delete</span>
            </b-dropdown-item> -->
          </b-dropdown>
        </template>
      </b-table>
      <div class="mx-2 mb-2">
        <b-row>

          <b-col
            cols="12"
            sm="6"
            class="d-flex align-items-center justify-content-center justify-content-sm-start"
          >
            <span class="text-muted">Showing {{ dataMeta.from }} to {{ dataMeta.to }} of {{ dataMeta.of }} entries</span>
          </b-col>
          <!-- Pagination -->
          <b-col
            cols="12"
            sm="6"
            class="d-flex align-items-center justify-content-center justify-content-sm-end"
          >

            <b-pagination
              v-model="currentPage"
              :total-rows="totalUsers"
              :per-page="perPage"
              first-number
              last-number
              class="mb-0 mt-1 mt-sm-0"
              prev-class="prev-item"
              next-class="next-item"
            >
              <template #prev-text>
                <feather-icon
                  icon="ChevronLeftIcon"
                  size="18"
                />
              </template>
              <template #next-text>
                <feather-icon
                  icon="ChevronRightIcon"
                  size="18"
                />
              </template>
            </b-pagination>
          </b-col>
        </b-row>
      </div>
    </b-card>
  </div>
</template>

<script>
import vSelect from 'vue-select'
import store from '@/store'
import { ref, onUnmounted } from '@vue/composition-api'
import { avatarText } from '@core/utils/filter'
import utils from "@/utils/index"

import searchHook from './hooks/search'
import listHook from './hooks/list'
import userStoreModule from '../userStoreModule'
import ReviewModal from './ReviewModal.vue'
import TopSearch from './TopSearch.vue'

export default {
  components: {
    TopSearch,
    ReviewModal,
    vSelect,
  },
  setup() {
    const USER_APP_STORE_MODULE_NAME = 'app-user'

    // Register module
    if (!store.hasModule(USER_APP_STORE_MODULE_NAME)) store.registerModule(USER_APP_STORE_MODULE_NAME, userStoreModule)

    // UnRegister on leave
    onUnmounted(() => {
      if (store.hasModule(USER_APP_STORE_MODULE_NAME)) store.unregisterModule(USER_APP_STORE_MODULE_NAME)
    })

    const showDetailModal = ref(false)
    const currentReviewItem = ref({});

      const {
     refUserListTable
    } = listHook()


      const onShowDetailModal = function (event, application) {
        console.log("application+++++++++",application);
        currentReviewItem.value = application;
        showDetailModal.value = true;
        this.$forceUpdate();
        event.stopImmediatePropagation();
      }

      const hideReviewModal = function () {
          showDetailModal.value = false;
      };

    const statusOptions = [
      { label: 'Pending', value:'1' },
      { label: 'Approved', value:'5' },
      { label: 'Rejected', value: '-1' },
      { label: 'All', value: '' }
    ]

    const statusOptionsMap = { '1': 'Pending', '5': 'Approved', '-1': 'Rejected'  }

    return {

      // detail modal
      showDetailModal,
      ...searchHook(),
      ...listHook(),

      // Filter
      avatarText,
      statusOptions,
      statusOptionsMap,
      currentReviewItem,
      onShowDetailModal,
      hideReviewModal,
      formatDate:utils.formatDate,
    }
  },
}
</script>

<style lang="scss" scoped>
.per-page-selector {
  width: 90px;
}
</style>

<style lang="scss">
@import '@core/scss/vue/libs/vue-select.scss';
</style>
