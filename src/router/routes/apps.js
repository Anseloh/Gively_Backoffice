export default [
    {
      path: '/apps/calendar',
      name: 'apps-calendar',
      component: () => import('@/views/apps/calendar/Calendar.vue'),
    },

    // *===============================================---*
    // *--------- EMAIL & IT'S FILTERS N LABELS -------------------------------*
    // *===============================================---*
    {
      path: '/apps/email',
      name: 'apps-email',
      component: () => import('@/views/apps/email/Email.vue'),
      meta: {
        roles:[101, 103],
        contentRenderer: 'sidebar-left',
        contentClass: 'email-application',
      },
    },
    {
      path: '/apps/email/:folder',
      name: 'apps-email-folder',
      component: () => import('@/views/apps/email/Email.vue'),
      meta: {
        contentRenderer: 'sidebar-left',
        contentClass: 'email-application',
        navActiveLink: 'apps-email',
      },
      beforeEnter(to, _, next) {
        if (['sent', 'draft', 'starred', 'spam', 'trash'].includes(to.params.folder)) next()
        else next({ name: 'error-404' })
      },
    },
    {
      path: '/apps/email/label/:label',
      name: 'apps-email-label',
      component: () => import('@/views/apps/email/Email.vue'),
      meta: {
        contentRenderer: 'sidebar-left',
        contentClass: 'email-application',
        navActiveLink: 'apps-email',
      },
      beforeEnter(to, _, next) {
        if (['personal', 'company', 'important', 'private'].includes(to.params.label)) next()
        else next({ name: 'error-404' })
      },
    },

    // *===============================================---*
    // *--------- TODO & IT'S FILTERS N TAGS ---------------------------------------*
    // *===============================================---*
    {
      path: '/apps/todo',
      name: 'apps-todo',
      component: () => import('@/views/apps/todo/Todo.vue'),
      meta: {
        contentRenderer: 'sidebar-left',
        contentClass: 'todo-application',
      },
    },
    {
      path: '/apps/todo/:filter',
      name: 'apps-todo-filter',
      component: () => import('@/views/apps/todo/Todo.vue'),
      meta: {
        contentRenderer: 'sidebar-left',
        contentClass: 'todo-application',
        navActiveLink: 'apps-todo',
      },
      beforeEnter(to, _, next) {
        if (['important', 'completed', 'deleted'].includes(to.params.filter)) next()
        else next({ name: 'error-404' })
      },
    },
    {
      path: '/apps/todo/tag/:tag',
      name: 'apps-todo-tag',
      component: () => import('@/views/apps/todo/Todo.vue'),
      meta: {
        contentRenderer: 'sidebar-left',
        contentClass: 'todo-application',
        navActiveLink: 'apps-todo',
      },
      beforeEnter(to, _, next) {
        if (['team', 'low', 'medium', 'high', 'update'].includes(to.params.tag)) next()
        else next({ name: 'error-404' })
      },
    },

    // *===============================================---*
    // *--------- CHAT  ---------------------------------------*
    // *===============================================---*
    {
      path: '/apps/chat',
      name: 'apps-chat',
      component: () => import('@/views/apps/chat/Chat.vue'),
      meta: {
        contentRenderer: 'sidebar-left',
        contentClass: 'chat-application',
      },
    },

    // *===============================================---*
    // *--------- ECOMMERCE  ---------------------------------------*
    // *===============================================---*
    {
      path: '/apps/e-commerce/shop',
      name: 'apps-e-commerce-shop',
      component: () => import('@/views/apps/e-commerce/e-commerce-shop/ECommerceShop.vue'),
      meta: {
        contentRenderer: 'sidebar-left-detached',
        contentClass: 'ecommerce-application',
        pageTitle: 'Shop',
        breadcrumb: [
          {
            text: 'ECommerce',
          },
          {
            text: 'Shop',
            active: true,
          },
        ],
      },
    },
    {
      path: '/apps/e-commerce/wishlist',
      name: 'apps-e-commerce-wishlist',
      component: () => import('@/views/apps/e-commerce/e-commerce-wishlist/ECommerceWishlist.vue'),
      meta: {
        pageTitle: 'Wishlist',
        contentClass: 'ecommerce-application',
        breadcrumb: [
          {
            text: 'ECommerce',
          },
          {
            text: 'Wishlist',
            active: true,
          },
        ],
      },
    },
    {
      path: '/apps/e-commerce/checkout',
      name: 'apps-e-commerce-checkout',
      component: () => import('@/views/apps/e-commerce/e-commerce-checkout/ECommerceCheckout.vue'),
      meta: {
        pageTitle: 'Checkout',
        contentClass: 'ecommerce-application',
        breadcrumb: [
          {
            text: 'ECommerce',
          },
          {
            text: 'Checkout',
            active: true,
          },
        ],
      },
    },
    {
      path: '/apps/e-commerce/:slug',
      name: 'apps-e-commerce-product-details',
      component: () => import('@/views/apps/e-commerce/e-commerce-product-details/ECommerceProductDetails.vue'),
      meta: {
        pageTitle: 'Product Details',
        contentClass: 'ecommerce-application',
        breadcrumb: [
          {
            text: 'ECommerce',
          },
          {
            text: 'Shop',
            active: true,
          },
          {
            text: 'Product Details',
            active: true,
          },
        ],
      },
    },
    {
      path: '/campaigns/manage',
      name: 'campaigns-manage',
      component: () => import('@/views/campaigns/Campaigns.vue'),
      meta: {
        pageTitle: 'Campaigns',
        contentClass: 'all-campaigns-class',
        breadcrumb: [
          {
            text: 'Manages',
            active: true,
          },
        ],
      },
    },
    {
      path: '/fundraisers/manage',
      name: 'fundraisers-manage',
      component: () => import('@/views/fundraisers/Fundraisers.vue'),
      meta: {
        pageTitle: 'Fundraisers',
        contentClass: 'all-fundraisers-class',
        breadcrumb: [
          {
            text: 'Manages',
            active: true,
          },
        ],
      },
    },
    {
      path: '/transactions',
      redirect: '/transactions/donations'
    },
    {
      path: '/transactions/donations',
      name: 'transactions-donations',
      component: () => import('@/views/Transactions/Donations.vue'),
      meta: {
        pageTitle: 'Transactions',
        contentClass: 'all-donations-transactions-class',
        breadcrumb: [
          {
            text: 'Donations',
            active: true,
          },
        ],
      },
    },
    {
      path: '/transactions/tickets',
      name: 'transactions-tickets',
      component: () => import('@/views/Transactions/Tickets.vue'),
      meta: {
        pageTitle: 'Tickets',
        contentClass: 'all-tickets-tickets-class',
        breadcrumb: [
          {
            text: 'Donations',
            active: true,
          },
        ],
      },
    },
    {
      path: '/fundraisers/categories',
      name: 'fundraisers-categories',
      component: () => import('@/views/fundraisers/Categories.vue'),
      meta: {
        pageTitle: 'Fundraisers',
        contentClass: 'all-fundraisers-class',
        breadcrumb: [
          {
            text: 'Categories',
            active: true,
          },
        ],
      },
    },
    {
      path: '/events/manage',
      name: 'events-manage',
      component: () => import('@/views/events/Events.vue'),
      meta: {
        pageTitle: 'Events',
        contentClass: 'all-events-class',
        breadcrumb: [
          {
            text: 'Events',
            active: true,
          },
        ],
      },
    },
    {
      path: '/fundraisers/Countries',
      name: 'fundraisers-countries',
      component: () => import('@/views/fundraisers/Countries.vue'),
      meta: {
        pageTitle: 'Fundraisers',
        contentClass: 'all-fundraisers-class',
        breadcrumb: [
          {
            text: 'Countries',
            active: true,
          },
        ],
      },
    },
    {
      path: '/campaigns/refunds',
      name: 'campaigns-refunds',
      component: () => import('@/views/campaigns/Refunds.vue'),
      meta: {
        pageTitle: 'Campaign Refunds',
        contentClass: 'user-management-verification-class',
        breadcrumb: [
          {
            text: 'Refunds',
            active: true,
          },
        ],
      },
    },
    {
      path: '/users/verification',
      name: 'users-verification',
      component: () => import('@/views/users/UserVerification.vue'),
      meta: {
        pageTitle: 'User Management',
        contentClass: 'user-management-verification-class',
        breadcrumb: [
          {
            text: 'Verification',
            active: true,
          },
        ],
      },
    },
    {
      path: '/users/list',
      name: 'users-list',
      component: () => import('@/views/users/UsersList.vue'),
      meta: {
        pageTitle: 'User Management',
        contentClass: 'user-management-list-class',
        breadcrumb: [
          {
            text: 'Users',
            active: true,
          },
        ],
      },
    },

    // *===============================================---*
    // *--------- USER MANAGER ---- ---------------------------------------*
    // *===============================================---*


     // *===============================================---*
    // *--------- FILE MANAGER ---- ---------------------------------------*
    // *===============================================---*

     // *===============================================---*
    // *--------- Cortex -------------------------------*
    // *===============================================---*



    // *===============================================---*
    // *--------- EDU stuffs -------------------------------*
    // *===============================================---*
  ]
