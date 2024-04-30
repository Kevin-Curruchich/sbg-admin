<template>
  <div class="container-fluid">
    <div class="row mb-3">
      <el-card shadow="never" class="col-md-12">
        <span class="me-2 fs-6">Saldo total: </span>
        <b>
          {{ `Q.${(totalAmountOwed + 0).toLocaleString("es-GT")}` }}
        </b>
      </el-card>
    </div>
    <div class="row mb-3">
      <div class="col-md-9 col-sm-12">
        <label class="form-label"> Trimestre </label>
        <div>
          <el-select
            v-model="quarterSelected"
            placeholder="Seleccione trimestre"
          >
            <el-option value="" label="Todos" />
            <el-option
              v-for="item in quartersByStudent"
              :key="item.Quartetly.quartetlyId"
              :value="item.Quartetly.quartetlyId"
              :label="item.Quartetly.quartetlyName"
            />
          </el-select>
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

    <div class="row">
      <div class="col-sm-12">
        <el-collapse
          id="collapse-student-collection-history"
          v-loading="isLoadingCollectionsByStudent"
        >
          <el-collapse-item
            v-for="{
              collectionStudentId,
              collection,
              Payment,
              Quartetly,
              collectionStudentAmountOwed,
              collectionStudentAmountPaid,
              collectionStudentDate,
              collectionDescription,
            } in collectionsByStudent"
            :key="collectionStudentId"
          >
            <template #title>
              <div class="d-flex flex-wrap">
                <span class="me-2 fs-6">
                  {{ collection.collectionName }}
                  {{ formatDateDm(collectionStudentDate) }} |
                  {{ Quartetly.quartetlyName }}
                </span>

                <el-tag
                  v-if="userIsAdmin && collectionStudentAmountOwed > 0"
                  type="danger"
                  class="me-2 mt-2"
                >
                  Saldo
                </el-tag>
              </div>
            </template>

            <el-card shadow="never" class="mt-2 mb-4">
              <table class="text-center">
                <tr>
                  <td>
                    <span class="mx-4 fs-6">Cobro</span>
                  </td>
                  <td>
                    <span class="mx-4 fs-6">Abonado</span>
                  </td>
                  <td>
                    <span class="mx-4 fs-6">Saldo</span>
                  </td>
                </tr>
                <tr>
                  <td>
                    <span class="me-2 fs-6">
                      <b>
                        {{
                          `Q.${(
                            collectionStudentAmountOwed +
                            collectionStudentAmountPaid
                          ).toLocaleString("es-GT")}`
                        }}
                      </b>
                    </span>
                  </td>

                  <td>
                    <el-tag type="success" class="me-2"
                      >{{
                        `Q.${collectionStudentAmountPaid.toLocaleString(
                          "es-GT"
                        )}`
                      }}
                    </el-tag>
                  </td>
                  <td>
                    <el-tag type="danger" class="me-2"
                      >{{
                        `Q.${collectionStudentAmountOwed.toLocaleString(
                          "es-GT"
                        )}`
                      }}
                    </el-tag>
                  </td>
                </tr>
              </table>
              <span><b>Descripción:</b> {{ collectionDescription }}</span>
            </el-card>

            <el-card v-if="Payment.length === 0" shadow="never">
              <span class="fs-6 text">No hay aportes registrados</span>
            </el-card>

            <div v-else>
              <el-timeline>
                <el-timeline-item
                  v-for="payment in Payment"
                  :key="payment.paymentId"
                  :timestamp="formatDateDMY(payment.paymentDate)"
                  placement="top"
                  type="primary"
                >
                  <el-card shadow="never">
                    <span class="me-1">ID: </span>
                    <a
                      href="#"
                      class="text-primary"
                      @click="onNavigateToPayment(payment.paymentId)"
                      >{{ collectionId(payment.paymentId) }}
                    </a>
                    <br />
                    <span
                      >Aporte:
                      <b>
                        {{
                          `Q.${payment.paymentAmount.toLocaleString("es-GT")}`
                        }}
                      </b>
                    </span>
                    <br />
                    <span class="me-1 mt-3"
                      >Descripción:
                      {{ payment.paymentDescription }}
                    </span>
                  </el-card>
                </el-timeline-item>
              </el-timeline>
            </div>
          </el-collapse-item>
        </el-collapse>
      </div>
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
  useQuarters,
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
    } = useCollections();
    const { formatDateDMY, formatDateDm } = useFormatDate();
    const { requestGetQuartresByStudent, quartersByStudent } = useQuarters();
    const {
      requestDownloadCollectionHistoryByStudent,
      isDownlodReportByStudent,
    } = useReports();
    const { student } = useStudent();

    //ref
    const quarterSelected = ref("");

    //computed
    const totalAmountOwed = computed(() => {
      return collectionsByStudent.value.reduce(
        (acc, { collectionStudentAmountOwed }) => {
          return acc + collectionStudentAmountOwed;
        },
        0
      );
    });

    const params = computed(() => {
      return {
        quartetlyId: quarterSelected.value,
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
      requestGetCollectionsByStudent(id, params.value);
    };

    //lifecycle
    onMounted(() => {
      // requestGetCollectionsByStudent(id, params.value);
      requestGetQuartresByStudent(id);
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
      quartersByStudent,
      quarterSelected,
      userIsAdmin,
      formatDateDm,
      totalAmountOwed,
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
