import { ref, computed } from '@vue/composition-api'

// Notification
import { useToast } from 'vue-toastification/composition';
import ToastificationContent from '@core/components/toastification/ToastificationContent.vue';
import Vue from "vue";
import API from '../../api';

const vm = new Vue({});

export default function useUsersList () {
  // Use toast
  const toast = useToast()

  const refUserListTable = ref(null)

  // Table Handlers
  const tableColumns = [
    { key: 'user', sortable: true },
    { key: 'phone' },
    {
      key: 'date'
    },
    {
      key: 'updatedAt'
    },
    { key: 'status', sortable: true },
    {
      key: 'images'
    },
    { key: 'actions' },
  ]
  const perPage = ref(10)
  const totalUsers = ref(0)
  const currentPage = ref(1)
  const perPageOptions = [10, 25, 50, 100]
  const searchQuery = ref('')
  const sortBy = ref('id')
  const isSortDirDesc = ref(true)
  const roleFilter = ref(null)
  const statusFilter = ref(null)

  const dataMeta = computed(() => {
    const localItemsCount = refUserListTable.value ? refUserListTable.value.localItems.length : 0
    return {
      from: perPage.value * (currentPage.value - 1) + (localItemsCount ? 1 : 0),
      to: perPage.value * (currentPage.value - 1) + localItemsCount,
      of: totalUsers.value,
    }
  })

  let currentSearchParams = {};

  const refetchData = params => {
    currentSearchParams = params;
    refUserListTable.value.refresh();
  }

  const fetchUsers = (ctx, callback) => {
    let startDate = "";
    let endDate = "";

    if (currentSearchParams.date) {
      startDate = currentSearchParams.date.split("to")[0].trim();
      endDate = currentSearchParams.date.split("to")[1].trim();
    }

    const bodyParams = {
      q: searchQuery.value,
      pageSize: perPage.value,
      pageNum: currentPage.value,
      // sortBy: sortBy.value,
      phone: currentSearchParams.phone,
      startDate: startDate,
      endDate: endDate,
      status: currentSearchParams.status
    }

    API.getList(bodyParams)
      .then(response => {
        const { applications, total } = response.data

        if (applications) {
          applications.map(o => {
            for (let index = 0; index < o.images.length; index++) {
              // let element = o.images[index];
              o.images[index] += "?" + vm.$fileAccessToKen;
            }

            return o;
          })
        }

        totalUsers.value = applications ? applications.length : 0;

        callback(applications);
      })
      .catch(() => {
        toast({
          component: ToastificationContent,
          props: {
            title: 'Error fetching applications list',
            icon: 'AlertTriangleIcon',
            variant: 'danger',
          },
        })
      })
  }

  return {
    fetchUsers,
    tableColumns,
    perPage,
    currentPage,
    totalUsers,
    dataMeta,
    perPageOptions,
    searchQuery,
    sortBy,
    isSortDirDesc,
    refUserListTable,
    refetchData,

    // Extra Filters
    roleFilter,
    statusFilter,
  }
}
