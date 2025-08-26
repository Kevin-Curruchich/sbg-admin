<template>
  <div class="py-3 container-fluid">
    <div class="row">
      <div class="col-12">
        <!-- Card header -->
        <div class="pb-0 card-header">
          <div class="d-lg-flex">
            <h5 class="mb-0">Reporte Aportes</h5>
          </div>
          <div class="row mt-3">
            <div class="col-md-3">
              <label class="form-label"> Nombre </label>

              <el-input v-model="searchQuery" placeholder="Nombre" clearable />
            </div>
            <div class="col-md-6">
              <label class="form-label"> Mes Inicial </label>
              <div>
                <el-date-picker
                  v-model="payment_date"
                  type="daterange"
                  start-placeholder="Mes Inicial"
                  end-placeholder="Mes Final"
                  value-format="YYYY-MM-DD"
                  format="DD/MM/YYYY"
                  placeholder="Selecccione Mes Inicial"
                />
              </div>
            </div>

            <div class="col-md-3">
              <div
                class="h-100 d-flex align-items-end justify-content-between px-2"
              >
                <argon-button
                  color="primary"
                  :disabled="payment_date === ''"
                  @click="onFilter"
                >
                  Filtrar
                  <i class="fas fa-filter"></i>
                </argon-button>

                <argon-button
                  color="secondary"
                  :disabled="paymentsReport.total === 0"
                  :loading="isDownloadingPaymentsReport"
                  @click="onExportReport"
                >
                  Descargar
                  <i class="fas fa-file-export"></i>
                </argon-button>
              </div>
            </div>
          </div>
        </div>
        <div class="px-0 pb-0 card-body">
          <el-table
            v-loading="isLoadingPaymentsReport"
            :data="paymentsReport.data"
          >
            <el-table-column label="ID Pago" width="100px">
              <template #default="{ row }">
                <span>{{ getPaymentsId(row.paymentId) }}</span>
              </template>
            </el-table-column>
            <el-table-column label="Estudiante" prop="searchQuery" />
            <el-table-column label="Monto" prop="paymentAmount" />
            <el-table-column label="Fecha" prop="paymentDate" />
            <el-table-column label="Cobro" prop="collectionStudent" />
          </el-table>
        </div>
        <div class="mt-4 d-flex justify-content-end">
          <el-pagination
            v-model:current-page="pagination.page"
            background
            layout="prev, pager, next"
            :total="paymentsReport.total"
            :page-size="pagination.take"
          />
        </div>
        <!-- </div> -->
      </div>
    </div>
  </div>
</template>

<script>
import { computed, onMounted, ref, watch } from "vue";
import { useStore } from "vuex";
import ArgonButton from "@/components/ArgonButton.vue";
import { useReports, useFormatDate, usePayments } from "@/composables";

export default {
  name: "PaymentsReport",
  components: { ArgonButton },
  setup() {
    //instances
    const store = useStore();

    const {
      requestGetPaymentsReport,

      paymentsReport,
      isLoadingPaymentsReport,
      isDownloadingPaymentsReport,
    } = useReports();

    const { formatDateYM } = useFormatDate();

    const { getPaymentsId } = usePayments();

    const searchQuery = ref("");
    const payment_date = ref("");
    const endDate = ref("");
    const pagination = ref({
      page: 1,
      take: 10,
    });

    const params = computed(() => ({
      searchQuery: searchQuery.value,
      payment_date: formatDateYM(payment_date.value),
      page: pagination.value.page,
      take: pagination.value.take,
    }));

    //methods

    const onFilter = async () => {
      await requestGetPaymentsReport(params.value);
    };

    onMounted(() => {
      store.commit("reports/setPaymentsReport", { data: [], total: 0 });
    });

    watch(
      () => params.value.page,
      async () => {
        await requestGetPaymentsReport(params.value);
      }
    );

    return {
      searchQuery,
      payment_date,
      endDate,
      pagination,
      paymentsReport,
      isLoadingPaymentsReport,
      isDownloadingPaymentsReport,
      onFilter,
      getPaymentsId,
    };
  },
};
</script>

<style>
.el-select {
  width: 100%;
}

.el-date-editor {
  --el-date-editor-width: 100%;
}
</style>
