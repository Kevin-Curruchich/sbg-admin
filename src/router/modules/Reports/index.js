export default {
  name: "reports",
  path: "/reports",
  component: () =>
    import(
      /* webpackChunkName: "ReportLayout" */ "@/modules/Reports/layout/ReportLayout.vue"
    ),
  children: [
    {
      path: "payments",
      name: "Payments Report",
      component: () =>
        import(
          /* webpackChunkName: "CollectionReport" */ "@/modules/Reports/views/Payments.vue"
        ),
    },
    {
      path: "payments",
      name: "payments-reports",
      component: () =>
        import(
          /* webpackChunkName: "PaymentsReports" */ "@/modules/Reports/views/Payments.vue"
        ),
    },
    // {
    //   path: ":id",
    //   name: "entry",
    //   component: () =>
    //     import(/* webpackChunkName: "EntryView" */ "../views/EntryView.vue"),
    //   props: (route) => {
    //     return {
    //       id: route.params.id,
    //     };
    //   },
    // },
  ],
};
