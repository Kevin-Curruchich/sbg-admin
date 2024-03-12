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
          <div class="col-5">
            <mini-statistics-card
              title="Aportes registrados"
              :value="formatMoney(dashboardData.totalPayments)"
              description=""
              :icon="{
                component: 'ni ni-money-coins',
                background: 'bg-gradient-primary',
                shape: 'rounded-circle',
              }"
            />
          </div>
          <div class="col-5">
            <mini-statistics-card
              title="Cobros"
              :value="formatMoney(dashboardData.totalOwed)"
              description=""
              :icon="{
                component: 'ni ni-cart',
                background: 'bg-gradient-warning',
                shape: 'rounded-circle',
              }"
            />
          </div>
          <!-- <div class="col-4 ">
            <mini-statistics-card
              title="New Clients"
              value="+3,462"
              description=""
              :icon="{
                component: 'ni ni-paper-diploma',
                background: 'bg-gradient-success',
                shape: 'rounded-circle',
              }"
            />
          </div> -->
          <div class="col-2">
            <mini-statistics-card
              title="Estudiantes"
              :value="dashboardData.totalStudents"
              description=""
              :icon="{
                component: 'fas fa-users',
                background: 'bg-gradient-danger',
                shape: 'rounded-circle',
              }"
            />
          </div>
        </div>
        <div class="row">
          <div class="col-lg-7 mb-lg">
            <gradient-line-chart
              id="chart-line"
              title="Aportes registrados"
              :chart="{
                labels: ['Apr', 'May', 'Jun'],
                datasets: [
                  {
                    label: 'Aportes',
                    data: [50, 40, 300],
                  },
                ],
              }"
            />
          </div>
          <div class="col-lg-5">
            <el-card shadow="never">
              <el-table :data="dashboardData.tableWithStudentName">
                <el-table-column label="Nombre">
                  <template #default="scope">
                    <span class="ml-2">{{
                      scope.row.student.studentFullName
                    }}</span>
                  </template>
                </el-table-column>
                <el-table-column label="Cobros">
                  <template #default="scope">
                    <span class="ml-2">{{
                      formatMoney(scope.row.collectionStudentAmountOwed)
                    }}</span>
                  </template>
                </el-table-column>
              </el-table>
            </el-card>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import { onMounted } from "vue";
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
    const formatMoney = (value) => {
      return value.toLocaleString("en-US", {
        style: "currency",
        currency: "GTQ",
      });
    };

    const { dashboardData, isLoadingDashboard, requestGetDashboard } =
      useDashboard();

    onMounted(() => {
      requestGetDashboard();
    });

    return {
      dashboardData,
      isLoadingDashboard,
      formatMoney,
    };
  },
};
</script>
