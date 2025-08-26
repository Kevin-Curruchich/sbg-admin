<template>
  <div
    v-if="isLoadingDashboard"
    class="card d-flex p-5 justify-content-center container-fluid"
  >
    <i class="fas fa-spinner"></i>
  </div>
  <div v-else class="py-4 container-fluid">
    <div class="row">
      <div class="col-lg-12">
        <div class="row">
          <div class="col-3">
            <mini-statistics-card
              title="Estudiantes"
              :value="dashboardData?.studentsCount"
              description=""
              :icon="{
                component: 'fas fa-users',
                background: 'bg-gradient-danger',
                shape: 'rounded-circle',
              }"
            />
          </div>
          <div class="col-3">
            <mini-statistics-card
              title="Aportes registrados"
              :value="dashboardData?.totalCurrentMonth?.total"
              :description="dashboardData?.totalCurrentMonth?.month"
              :icon="{
                component: 'ni ni-money-coins',
                background: 'bg-gradient-primary',
                shape: 'rounded-circle',
              }"
            />
          </div>
          <div class="col-3">
            <mini-statistics-card
              title="Cobros Actuales"
              :value="dashboardData?.collectionRate?.totalCharges"
              :description="dashboardData?.totalCurrentMonth?.month"
              :icon="{
                component: 'ni ni-cart',
                background: 'bg-gradient-warning',
                shape: 'rounded-circle',
              }"
            />
          </div>
          <div class="col-3">
            <mini-statistics-card
              title="Tasa de cobro"
              :value="dashboardData?.collectionRate?.collectionRate"
              description="
                % de los aportes registrados"
              :icon="{
                component: 'ni ni-paper-diploma',
                background: 'bg-gradient-success',
                shape: 'rounded-circle',
              }"
            />
          </div>
        </div>
        <div class="row">
          <div class="col-12 mb-lg">
            <gradient-line-chart
              id="chart-line"
              title="Aportes registrados"
              :chart="{
                labels: labelPaymentsByMonth,
                datasets: [
                  {
                    label: 'Aportes',
                    data: totalPaymentsByMonth,
                  },
                ],
              }"
            />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import { computed, onMounted } from "vue";
import { useDashboard } from "../../composables";
import MiniStatisticsCard from "../../examples/Cards/MiniStatisticsCard.vue";
import GradientLineChart from "../../examples/Charts/GradientLineChart.vue";
// import AuthorsTable from "./components/AuthorsTable.vue";

export default {
  name: "DashboardDefault",
  components: {
    MiniStatisticsCard,
    GradientLineChart,
    // AuthorsTable,
  },
  setup() {
    const { dashboardData, isLoadingDashboard, requestGetDashboard } =
      useDashboard();

    const labelPaymentsByMonth = computed(() => {
      return (
        dashboardData.value?.totalPaymentsByMonth.map((item) => item.month) ||
        []
      );
    });

    const totalPaymentsByMonth = computed(() => {
      return (
        dashboardData.value?.totalPaymentsByMonth.map((item) => item.total) ||
        []
      );
    });

    onMounted(() => {
      requestGetDashboard();
    });

    return {
      dashboardData,
      isLoadingDashboard,
      labelPaymentsByMonth,
      totalPaymentsByMonth,
    };
  },
};
</script>
