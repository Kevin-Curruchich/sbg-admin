<template>
  <div class="py-3 container-fluid">
    <div class="row">
      <div class="col-12">
        <!-- <div class="card"> -->
        <!-- Card header -->
        <div class="pb-0 card-header">
          <div class="d-lg-flex">
            <div>
              <h5 class="mb-0">Aportes</h5>
            </div>
            <div class="my-auto mt-4 ms-auto mt-lg-0">
              <div class="my-auto ms-auto">
                <div class="d-flex gap-2">
                  <argon-button
                    color="secondary"
                    variant="outline"
                    size="lg"
                    :disabled="isLoadingPayments"
                    @click="showModalDonations = true"
                  >
                    Donaciones
                    <i class="fas fa-donate mx-1"></i>
                  </argon-button>
                  <argon-button
                    color="primary"
                    size="lg"
                    :disabled="isLoadingPayments"
                    @click="showModal = true"
                  >
                    Aporte Estudiante
                    <i class="fas fa-plus mx-1"></i>
                  </argon-button>
                </div>
              </div>
            </div>
          </div>
          <div class="row mt-3">
            <div class="col-md-5">
              <label class="form-label"> Buscar </label>
              <div class="">
                <el-input
                  v-model="search"
                  clearable
                  type="text"
                  placeholder="Buscar"
                />
              </div>
            </div>

            <div class="col-md-5">
              <label class="form-label"> Mes </label>
              <div>
                <el-date-picker
                  v-model="payment_date"
                  type="daterange"
                  format="DD/MM/YYYY"
                  value-format="YYYY-MM-DD"
                  placeholder="Mes"
                  :clearable="true"
                  class="w-100"
                  start-placeholder="Desde"
                  end-placeholder="Hasta"
                  range-separator="a"
                />
              </div>
            </div>

            <div class="col-md-2">
              <div
                class="h-100 d-flex align-items-end justify-content-end gap-1"
              >
                <argon-button :disabled="isLoadingPayments" @click="onFilter">
                  Filtrar
                  <i class="fas fa-filter"></i>
                </argon-button>
                <argon-button
                  variant="outline"
                  color="secondary"
                  :disabled="
                    isDownloadingPaymentsReport ||
                    isLoadingPayments ||
                    payments.total === 0
                  "
                  @click="onExportReport"
                >
                  <i class="fas fa-download"></i>
                </argon-button>
              </div>
            </div>
          </div>
        </div>
        <div class="px-0 pb-0 card-body">
          <el-table
            v-loading="isLoadingPayments"
            :data="payments.data"
            row-key="studentId"
            border
            size="default"
          >
            <el-table-column label="ID" min-width="100px">
              <template #default="{ row }">
                <a
                  href="#"
                  class="text-primary"
                  @click="onNavigateToPayment(row?.payment_id)"
                  >{{ row.public_payment_id }}
                </a>
              </template>
            </el-table-column>

            <el-table-column label="Estudiante" min-width="180px">
              <template #default="{ row }">
                {{ row.students?.first_name }} {{ row.students?.last_name }}
              </template>
            </el-table-column>

            <el-table-column label="Descripción" min-width="180px">
              <template #default="{ row }">
                <ul>
                  <template v-if="row.donation_id">
                    Donación: {{ row.amountFormatted }}
                  </template>
                  <template v-else>
                    <li
                      v-for="item in row?.payment_details"
                      :key="item.collection_id"
                    >
                      {{ item?.charges.charge_types.name }}
                      ({{ item?.due_date_formatted }}):
                      {{ item?.applied_amount }}
                    </li>
                  </template>
                </ul>
              </template>
            </el-table-column>
            <el-table-column label="Fecha" width="120px">
              <template #default="{ row }">
                {{ row?.payment_date }}
              </template>
            </el-table-column>
            <el-table-column width="80px">
              <template #default="{ row }">
                <el-button
                  v-if="!row.donation_id"
                  icon
                  size="small"
                  @click="onDeletePayment(row)"
                >
                  <i class="fas fa-trash"></i>
                </el-button>
              </template>
            </el-table-column>
          </el-table>
        </div>
        <div class="mt-4 d-flex justify-content-end">
          <el-pagination
            v-model:current-page="pagination.page"
            :disabled="isLoadingPayments"
            background
            layout="prev, pager, next"
            :total="payments.total"
            :page-size="pagination.take"
          />
        </div>
      </div>
    </div>
  </div>
  <add-edit-payment
    :show-modal="showModal"
    @hidde-modal="onCloseModal"
    @accept-modal="onAcceptModal"
  />
  <AddDonationToStudents
    :show-modal="showModalDonations"
    @hidde-modal="onCloseModal"
    @accept-modal="onAcceptModal"
  />
  <payment-details
    :payment-data="selectedPayment"
    :show-modal="showModalPaymentDetails"
    @hide-modal="onCloseModal"
    @payment_deleted="onAcceptModal"
  />
</template>

<script>
import { computed, onMounted, reactive, ref, watch } from "vue";
import {
  usePayments,
  useFormatDate,
  useStudents,
  useReports,
} from "@/composables";
import ArgonButton from "@/components/ArgonButton.vue";
import AddEditPayment from "../components/AddEditPayment.vue";
import AddDonationToStudents from "../components/AddDonationToStudents.vue";
import PaymentDetails from "../components/PaymentDetails.vue";

export default {
  name: "Payments",
  components: {
    ArgonButton,
    AddEditPayment,
    AddDonationToStudents,
    PaymentDetails,
  },
  setup() {
    //instances
    const {
      isLoadingPayments,
      requestGetPayments,
      payments,
      getPaymentsId,
      onNavigateToPayment,
    } = usePayments();
    const { formatDateDMY, formatDateDMYH } = useFormatDate();
    const { programLevels } = useStudents();
    const { requestDownloadPaymentsReport, isDownloadingPaymentsReport } =
      useReports();

    //refs
    const showModal = ref(false);
    const showModalPaymentDetails = ref(false);
    const showModalDonations = ref(false);
    const pagination = reactive({
      page: 1,
      take: 10,
    });
    const search = ref("");
    const payment_date = ref("");

    const selectedPayment = ref(null);

    //computed
    const queryParams = computed(() => ({
      page: pagination.page,
      take: pagination.take,
      searchQuery: search.value || null,
      payment_date_start: (payment_date.value && payment_date.value[0]) || null,
      payment_date_end: (payment_date.value && payment_date.value[1]) || null,
    }));

    //methods

    const onDeletePayment = async (payment) => {
      showModalPaymentDetails.value = true;
      selectedPayment.value = payment;
    };

    const onFilter = async () => {
      await requestGetPayments(queryParams.value);
    };

    const onChangePage = async (page) => {
      pagination.page = page;
      await requestGetPayments(queryParams.value);
    };

    const onCloseModal = () => {
      showModal.value = false;
      showModalDonations.value = false;
      showModalPaymentDetails.value = false;
      selectedPayment.value = null;
    };

    const onAcceptModal = () => {
      showModal.value = false;
      showModalDonations.value = false;
      showModalPaymentDetails.value = false;
      selectedPayment.value = null;
      requestGetPayments();
    };

    const onExportReport = async () => {
      const params = {
        searchQuery: search.value || null,
        payment_date_start:
          (payment_date.value && payment_date.value[0]) || null,
        payment_date_end: (payment_date.value && payment_date.value[1]) || null,
      };

      await requestDownloadPaymentsReport(params).then((response) => {
        const url = window.URL.createObjectURL(new Blob([response.data]));
        const link = document.createElement("a");
        link.href = url;
        link.setAttribute("download", `Reporte_Aportes.xlsx`);
        document.body.appendChild(link);
        link.click();
      });
    };

    watch(
      () => pagination.page,
      (newPage) => {
        pagination.page = newPage;
        requestGetPayments(queryParams.value);
      }
    );

    onMounted(() => {
      requestGetPayments(queryParams.value);
    });

    return {
      onFilter,
      formatDateDMY,
      formatDateDMYH,
      getPaymentsId,
      isLoadingPayments,
      onAcceptModal,
      onChangePage,
      onCloseModal,
      onNavigateToPayment,
      payments,
      search,
      showModal,
      showModalDonations,
      payment_date,
      programLevels,
      pagination,
      onExportReport,
      isDownloadingPaymentsReport,
      onDeletePayment,
      selectedPayment,
      showModalPaymentDetails,
    };
  },
};
</script>
