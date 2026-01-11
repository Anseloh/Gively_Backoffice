import { ref, computed } from '@vue/composition-api'

// Notification
import { useToast } from 'vue-toastification/composition'

export default function search () {
  // Use toast
  const toast = useToast()

  const perPage = ref(10)
  const totalUsers = ref(0)
  const currentPage = ref(1)
  const perPageOptions = [10, 25, 50, 100]
  const searchQuery = ref('')
  const sortBy = ref('id')
  const isSortDirDesc = ref(true)
  const roleFilter = ref(null)
  const statusFilter = ref(null)


  const resolveUserStatusVariant = status => {
    if (status === '-1') return 'warning'
    if (status === '5') return 'success'
    // if (status === '1') return 'secondary'
    return 'primary'
  }

  return {
    perPage,
    currentPage,
    totalUsers,
    perPageOptions,
    searchQuery,
    sortBy,
    isSortDirDesc,

    resolveUserStatusVariant,

    // Extra Filters
    roleFilter,
    statusFilter,
  }
}
