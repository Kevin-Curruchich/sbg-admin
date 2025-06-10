<template>
  <div class="container-fluid">
    <div class="row mb-3">
      <el-card shadow="never" class="col-md-12">
        <table class="table table-sm" style="width: 100%">
          <thead>
            <tr>
              <th class="text-center">Total Por Cobrar</th>
              <th v-if="studentBalance?.studentHasCredit" class="text-center">
                Saldo a Favor
              </th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td class="text-center">
                <b>{{ studentBalance?.studentAmountOwedFormatted }}</b>
              </td>
              <td v-if="studentBalance?.studentHasCredit" class="text-center">
                <b>{{ studentBalance?.studentCreditFormatted }}</b>
              </td>
            </tr>
          </tbody>
        </table>
      </el-card>
    </div>
    <div class="row mb-3">
      <div class="col-md-4">
        <label class="form-label"> Estado del Cobro </label>
        <div>
          <el-select
            v-model="charge_status_id"
            placeholder="Seleccione trimestre"
            clearable
          >
            <el-option key="" value="" label="Todos" />
            <el-option
              v-for="item in collectionStatuses"
              :key="item.charge_status_id"
              :value="item.charge_status_id"
              :label="item.name"
            />
          </el-select>
        </div>
      </div>
      <div class="col-md-4">
        <label class="form-label"> Fecha </label>
        <div>
          <el-date-picker
            v-model="due_date"
            type="month"
            placeholder="Seleccione fecha"
            format="MM-YYYY"
            value-format="YYYY-MM"
            style="width: 100%"
            clearable
          />
        </div>
      </div>
      <div class="col-md-1 col-sm-6 d-flex align-items-end">
        <el-button type="primary" @click="onFilterHistory">
          Filtrar <i class="fas fa-filter mx-2"></i>
        </el-button>
      </div>
      <div class="col-md-2 col-sm-6 d-flex align-items-end justify-content-end">
        <el-button
          v-if="userIsAdmin"
          :loading="isDownlodReportByStudent"
          @click="onDownloadReport"
        >
          Descargar <i class="fas fa-file-download mx-2"></i>
        </el-button>
      </div>
    </div>

    <el-card shadow="never" class="row">
      <el-table
        v-loading="isLoadingCollectionsByStudent"
        :data="collectionsByStudent"
        style="width: 100%"
        border
      >
        <el-table-column type="expand">
          <template #default="{ row }">
            <el-timeline v-if="row.payment_details.length > 0">
              <el-timeline-item
                v-for="item in row.payment_details"
                :key="item.payment_detail_id"
                :timestamp="item.payment_date_formatted"
                placement="top"
              >
                <div class="border p-2">
                  Monto Aplicado:
                  <span class="text-bold text-uppercase mb-0">
                    {{ item?.applied_amount_formatted }}
                  </span>
                  <br />
                  Pago:
                  <a
                    class="text-sm text-primary cursor-pointer"
                    @click="onNavigateToPayment(item.payments.payment_id)"
                  >
                    {{ item.payments.payment_id }}
                  </a>
                </div>
              </el-timeline-item>
            </el-timeline>
          </template>
        </el-table-column>
        <el-table-column label="Cobro" min-width="200">
          <template #default="{ row }">
            <p class="text-bold text-uppercase mb-0">
              {{ row.charge_types.name }}
            </p>
            <span v-if="row.description" class="text-sm mt-3">
              {{ row.description }}
            </span>
          </template>
        </el-table-column>
        <el-table-column label="Fecha" max-width="80">
          <template #default="{ row }">
            <span>{{ row.due_date_formatted }}</span>
          </template>
        </el-table-column>
        <el-table-column label="Estado">
          <template #default="{ row }">
            <span>{{ row.charge_statuses.name }}</span>
          </template>
        </el-table-column>

        <el-table-column label="Cobro">
          <template #default="{ row }">
            <span>{{ row.current_amount_formatted }}</span>
          </template>
        </el-table-column>

        <el-table-column label="Total Pagado">
          <template #default="{ row }">
            <span>{{ row.totalAmountPaidFormatted }}</span>
          </template>
        </el-table-column>

        <el-table-column label="Saldo">
          <template #default="{ row }">
            <span>{{ row.totalAmountDueFormatted }}</span>
          </template>
        </el-table-column>
      </el-table>
    </el-card>

    <div class="row" else>
      <div class="col-sm-12"></div>
    </div>
  </div>
</template>

<script>
import { computed, onMounted, ref } from "vue";
import { useRoute } from "vue-router";
import {
  useCollections,
  useFormatDate,
  usePayments,
  useReports,
  useStudent,
  useAuth,
} from "@/composables";
export default {
  setup() {
    const route = useRoute();

    const { id } = route.params;
    const { onNavigateToPayment } = usePayments();
    const { userIsAdmin } = useAuth();

    const {
      requestGetCollectionsByStudent,
      collectionsByStudent,
      isLoadingCollectionsByStudent,
      collectionId,
      requestGetCollectionStatuses,
      requestGetStudentBalance,
      collectionStatuses,
      studentBalance,
    } = useCollections();
    const { formatDateDMY, formatDateDm } = useFormatDate();

    const {
      requestDownloadCollectionHistoryByStudent,
      isDownlodReportByStudent,
    } = useReports();
    const { student } = useStudent();

    //ref
    const charge_status_id = ref("");
    const due_date = ref("");

    const params = computed(() => {
      return {
        charge_status_id: charge_status_id.value || null,
        due_date: due_date.value || null,
      };
    });

    //methods

    const onDownloadReport = () => {
      requestDownloadCollectionHistoryByStudent(id, params.value).then(
        (response) => {
          const url = window.URL.createObjectURL(new Blob([response.data]));
          const link = document.createElement("a");
          link.href = url;
          link.setAttribute(
            "download",
            `${student.value.studentFullName}_Reporte.xlsx`
          );
          document.body.appendChild(link);
          link.click();
        }
      );
    };

    const onFilterHistory = () => {
      requestGetStudentBalance(id);
      requestGetCollectionsByStudent(id, params.value);
    };

    //lifecycle
    onMounted(() => {
      requestGetCollectionStatuses();
      requestGetStudentBalance(id);
      onFilterHistory();
    });

    return {
      collectionId,
      collectionsByStudent,
      formatDateDMY,
      isDownlodReportByStudent,
      isLoadingCollectionsByStudent,
      onDownloadReport,
      onFilterHistory,
      onNavigateToPayment,
      collectionStatuses,
      charge_status_id,
      userIsAdmin,
      formatDateDm,
      studentBalance,
      due_date,
    };
  },
};
</script>

<style>
.el-collapse-item__header {
  height: auto !important;
  flex-wrap: wrap !important;
}
</style>
