<template>
  <modal :show="showModal" size="lg" :on-hide-modal="onHideModal">
    <template #header> Detalles del Pago </template>
    <template v-if="paymentData" #body>
      <div class="row">
        <div class="col-6">
          <p>
            <strong>ID del Pago:</strong> {{ paymentData.public_payment_id }}
          </p>
          <p>
            <strong>Estudiante:</strong> {{ paymentData.students.first_name }}
            {{ paymentData.students.last_name }}
          </p>
          <p><strong>Email:</strong> {{ paymentData.students.email }}</p>
        </div>
        <div class="col-6">
          <p><strong>Monto:</strong> {{ paymentData.amountFormatted }}</p>
          <p><strong>Fecha de Pago:</strong> {{ paymentData.payment_date }}</p>
          <p>
            <strong>Método de Pago:</strong>
            {{ paymentData.payment_methods.name }}
          </p>
        </div>
      </div>
      <div class="row">
        <div class="col-12">
          <p><strong>Detalles del Pago:</strong></p>
          <ul>
            <li
              v-for="detail in paymentData.payment_details"
              :key="detail.charges.charge_id"
            >
              {{ detail.description }} ({{ detail.due_date_formatted }}):
              {{ detail.applied_amount }}
            </li>
          </ul>
        </div>
      </div>
    </template>
    <template #footer>
      <argon-button variant="outline" @click="onHideModal">
        Cancelar
      </argon-button>
      <el-popconfirm
        title="¿Estás seguro de que deseas eliminar este pago?"
        @confirm="onDelete"
      >
        <template #reference>
          <argon-button color="danger"> Eliminar </argon-button>
        </template>
      </el-popconfirm>
    </template>
  </modal>
</template>

<script>
import { ref } from "vue";
import { ArgonButton, Modal } from "@/components";
import usePayments from "@/composables/usePayments";
import getErrorMessage from "@/helpers/getErrorMessage";
import { ElMessage } from "element-plus";

export default {
  components: {
    Modal,
    ArgonButton,
  },
  props: {
    showModal: {
      type: Boolean,
      default: false,
    },
    paymentData: {
      type: Object,
      required: true,
    },
  },
  emits: ["hide-modal", "payment_deleted"],
  setup(props, { emit }) {
    const { requestDeletePayment } = usePayments();
    const isLoadingRequest = ref(false);

    const onHideModal = () => {
      emit("hide-modal");
    };

    const onDelete = async () => {
      try {
        isLoadingRequest.value = true;
        await requestDeletePayment(props.paymentData.payment_id);
        emit("payment_deleted");
      } catch (error) {
        const errorMessage = getErrorMessage(
          error,
          "Error al eliminar el pago"
        );

        ElMessage({
          message: errorMessage,
          type: "error",
        });
      } finally {
        isLoadingRequest.value = false;
      }
    };

    return {
      onHideModal,
      onDelete,
      isLoadingRequest,
    };
  },
};
</script>

<style scoped>
.row {
  margin-bottom: 1rem;
}
</style>
