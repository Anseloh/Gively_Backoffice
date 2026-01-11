export default [{
    header: 'apps',
},
{
    title: 'Users',
    icon: 'UsersIcon',
    children: [
        {
          title: 'User List',
          route: 'users-list'
        },
        // {
        //     title: 'User Verification',
        //     icon: 'UserCheckIcon',
        //     route: 'users-verification',
        // },
    ],
},
{
    title: 'Fundraisers',
    icon: "LayersIcon",
    children: [
        {
            title: 'Manage',
            route: 'fundraisers-manage',
            icon: 'GridIcon',
        },
        {
            title: 'Categories',
            route: 'fundraisers-categories',
            icon: 'TargetIcon',
        },
        {
            title: 'Countries',
            route: 'fundraisers-countries',
            icon: 'TargetIcon',
        },
        {
            title: 'Refunds',
            route: 'fundraisers-refunds',
            icon: 'CreditCardIcon',
        },
    ]
},
{
    title: 'Events',
    icon: "LayersIcon",
    children: [
        {
            title: 'Manage',
            route: 'events-manage',
            icon: 'GridIcon',
        }
    ]
},
// {
//     title: 'Campaigns',
//     icon: "LayersIcon",
//     children: [
//         {
//             title: 'Manage',
//             route: 'campaigns-manage',
//             icon: 'GridIcon',
//         },
//         {
//             title: 'Categories',
//             route: 'campaigns-categories',
//             icon: 'TargetIcon',
//         },
//         {
//             title: 'Refunds',
//             route: 'campaigns-refunds',
//             icon: 'CreditCardIcon',
//         },
//     ]
// },
{
    title: 'Transactions',
    icon: "ListIcon",
    children: [
        {
            title: 'Donations',
            route: 'transactions-donations',
            icon: 'FileTextIcon',
        },
        {
            title: 'Tickets',
            route: 'transactions-tickets',
            icon: 'FileTextIcon',
        },
    ]
},
{
    title: "Chat",
    route: "apps-chat",
    icon: "MessageSquareIcon"
}
    // {
    //   title: 'API',
    //   icon: 'CodeIcon',
    // },
]