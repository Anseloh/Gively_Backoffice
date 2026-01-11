import { ref, emit } from '@vue/composition-api'

// Notification
import { useToast } from 'vue-toastification/composition'
import ToastificationContent from '@core/components/toastification/ToastificationContent.vue'

import API from '../../api'


export default function reviewModal () {
  // Use toast
  const toast = useToast()

  const selected = ref('');

  const reason = ref('');

  const onSubmit = (reviewItem, callback) => {
    console.log('onSubmit reviewItem-----', reviewItem);
    if (selected.value) {
      if (selected.value == '-1' && !reason.value) {
        toast({
          component: ToastificationContent,
          props: {
            title: 'Enter Reject Reason',
            icon: 'AlertTriangleIcon',
            variant: 'danger',
          },
        })
      }

      API.review({
        status: selected.value,
        reason: reason.value,
        reviewer: 'Admin',
        id: reviewItem._id
      }).then(response => {
        const { application } = response.data
        callback();

        toast({
          component: ToastificationContent,
          props: {
            title: 'Saved Successfully!',
            icon: 'CoffeeIcon',
            variant: 'success',
          },
        })
      })
        .catch(() => {
          toast({
            component: ToastificationContent,
            props: {
              title: 'Error Submitting Review results',
              icon: 'AlertTriangleIcon',
              variant: 'danger',
            },
          })
        })
    }
  }

  return {
    onSubmit,

    selected,
    reason
  }
}
