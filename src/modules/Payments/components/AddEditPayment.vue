<template>
  <modal scrollable :show="showModal" size="xl" :on-hide-modal="onHideModal">
    <template #header> Registrar Aporte </template>
    <template #body>
      <el-form
        ref="formRef"
        v-loading="lockModal"
        label-position="top"
        :model="formModel"
        :rules="rules"
      >
        <div class="row">
          <div class="col-md-12">
            <el-form-item label="Estudiante" prop="student_id">
              <el-select
                v-model="formModel.student_id"
                placeholder="Estudiante"
                filterable
              >
                <el-option
                  v-for="student in studentsList"
                  :key="student.student_id"
                  :value="student.student_id"
                  :label="student.first_name + ' ' + student.last_name"
                />
              </el-select>
            </el-form-item>
          </div>

          <div v-if="formModel.student_id" class="col-md-12">
            <el-divider style="margin-top: 5px; margin-bottom: 5px" />

            <el-radio-group v-if="false" v-model="typeToCreatePayment">
              <el-radio label="1">Especificos</el-radio>
              <el-radio label="2">
                Cobros Sugeridos
                <el-popover
                  style="width: 200px; max-width: 300px"
                  title="Cobros Sugeridos"
                  content="El monto total de aporte sera distribuido entre los cobros pendientes del estudiante. Si solventa el primer cobro, el resto se aplicara al siguiente cobro pendiente."
                >
                  <template #reference>
                    <i class="fas fa-info-circle" />
                  </template>
                </el-popover>
              </el-radio>
            </el-radio-group>
          </div>
          <template v-if="typeToCreatePayment === '1'">
            <div class="col-12 mb-3">
              <collections-owed-by-student
                v-if="formModel.student_id"
                ref="collectionsToPayForm"
                :student-id="formModel.student_id"
              />
            </div>
          </template>

          <template v-if="formModel.student_id">
            <div class="col-md-4">
              <el-form-item label="Tipo de Pago" prop="payment_method_id">
                <el-select
                  v-model="formModel.payment_method_id"
                  placeholder="Tipo de Pago"
                  filterable
                >
                  <el-option
                    v-for="method in paymentMethodsArray"
                    :key="method.payment_method_id"
                    :value="method.payment_method_id"
                    :label="method.name"
                  />
                </el-select>
              </el-form-item>
            </div>

            <div v-if="!disabledReferenceNumber" class="col-md-4">
              <el-form-item label="Recibo" prop="reference_number">
                <el-input
                  v-model="formModel.reference_number"
                  type="text"
                  placeholder="Recibo"
                />
              </el-form-item>
            </div>

            <div class="col-md-4">
              <el-form-item label="Fecha Aporte" prop="payment_date">
                <el-date-picker
                  v-model="formModel.payment_date"
                  placeholder="Fecha"
                  format="DD/MM/YYYY"
                  style="width: 100%"
                />
              </el-form-item>
            </div>

            <div class="col-md-12">
              <el-form-item label="Descripción" prop="description">
                <el-input
                  v-model="formModel.paymentDescription"
                  type="textarea"
                  :min="3"
                />
              </el-form-item>
            </div>
          </template>
        </div>
      </el-form>
    </template>
    <template #footer>
      <argon-button variant="outline" @click="onHideModal">
        Cancelar
      </argon-button>
      <argon-button :disabled="lockModal" @click="onSubmit">
        Agregar
      </argon-button>
    </template>
  </modal>
  <el-dialog v-model="showCreditDialog" title="Crédito disponible">
    <span>
      El estudiante tiene un crédito disponible de
      {{ studentBalance.studentCreditFormatted }}.

      <br />

      Utiliza el crédito disponible para solventar cobros pendientes antes de
      registrar un nuevo pago.
    </span>

    <template #footer>
      <argon-button variant="outline" @click="showCreditDialog = false">
        Cerrar
      </argon-button>
      <argon-button :disabled="lockModal" @click="onNavigateToStudentPage">
        Agregar
      </argon-button>
    </template>
  </el-dialog>
</template>

<script>
import { computed, onMounted, ref, watch, reactive } from "vue";
import { ElMessage } from "element-plus";
import { ArgonButton, Modal } from "@/components";
import CollectionsOwedByStudent from "./CollectionsOwedByStudent.vue";
import {
  useStudents,
  useCollections,
  useFormatDate,
  usePayments,
} from "@/composables";
import errorMessages from "@/constants/formErrorMessages";
import { paymentMethodsArray } from "@/constants/paymentMethod";
import paymentMethods from "@/constants/paymentMethod";
import { useRouter } from "vue-router";

export default {
  components: {
    Modal,
    ArgonButton,
    CollectionsOwedByStudent,
  },
  props: {
    showModal: {
      type: Boolean,
      default: false,
    },
  },
  emits: ["hidde-modal", "accept-modal"],
  setup(_, { emit }) {
    const requiredMessage = errorMessages.required;
    //instances
    const router = useRouter();
    const { requestGetStudentsList, studentsList, programs } = useStudents();
    const {
      collectionsOwedByStudent,
      requestGetStudentBalance,
      studentBalance,
    } = useCollections();
    const { requestPostPayments } = usePayments();

    const { formatDateYMD } = useFormatDate();

    //refs
    const collectionsToPayForm = ref(null);
    const lockModal = ref(false);
    const typeToCreatePayment = ref("1");
    const paymentResponse = ref(null);
    const showCreditDialog = ref(false);

    const formRef = ref(null);
    const formModel = reactive({
      student_id: "",
      payment_method_id: "",
      charge_id: "",
      payment_date: "",
      reference_number: "",

      paymentDescription: "",
    });

    const totalAmountDueFormatted = ref("");

    const disabledReferenceNumber = computed(() => {
      return (
        formModel.payment_method_id == "" ||
        formModel.payment_method_id == paymentMethods.CASH ||
        formModel.payment_method_id == paymentMethods.SCHOLARSHIP
      );
    });

    const rules = ref({
      student_id: [{ required: true, message: requiredMessage }],
      payment_method_id: [{ required: true, message: requiredMessage }],
      payment_date: [{ required: true, message: requiredMessage }],
    });

    //methods
    const onHideModal = () => {
      onClearData();
      onClearCollectionsForm();
      emit("hidde-modal");
    };

    const onNavigateToStudentPage = () => {
      router.push({
        name: "Student",
        params: { id: formModel.student_id },
      });
    };

    const onClearData = () => {
      formRef.value.resetFields();
      paymentResponse.value = null;

      formModel.student_id = "";
      formModel.charge_id = "";
      formModel.payment_method_id = "";
      formModel.payment_date = "";
      formModel.reference_number = "";
      formModel.paymentDescription = "";
      lockModal.value = false;
    };

    const onClearCollectionsForm = () => {
      if (!collectionsToPayForm.value) return;

      collectionsToPayForm.value.onClear();
    };

    const onSubmit = async () => {
      const isGeneralFormValid = await formRef.value.validate((isValid) => {
        if (!isValid) {
          ElMessage({
            showClose: true,
            message: "Por favor, complete correctamente el formulario",
            type: "error",
          });
          return false;
        }

        return true;
      });

      if (!isGeneralFormValid) return;

      const collectionsToPay = await collectionsToPayForm.value.onValidate();

      if (!collectionsToPay) {
        ElMessage({
          showClose: true,
          message: "Por favor, complete correctamente el formulario",
          type: "error",
        });
        return false;
      }

      lockModal.value = true;

      const paymentDetails = collectionsToPay.collectionWithPayments.map(
        (charge) => ({
          charge_id: charge.charge_id,
          applied_amount: +charge.paymentAmount,
          description: formModel.paymentDescription,
        })
      );

      const paymentData = {
        student_id: formModel.student_id,
        payment_date: formatDateYMD(formModel.payment_date),
        payment_method_id: formModel.payment_method_id,
        reference_number: formModel.reference_number,
        amount: +collectionsToPay.paymentTotalAmount,

        payment_details: paymentDetails,
      };

      requestPostPayments(paymentData)
        .then((data) => {
          paymentResponse.value = data;

          onClearData();
          onClearCollectionsForm();
          emit("accept-modal");
        })
        .catch(() => {
          ElMessage({
            showClose: true,
            message: "Error al registrar el aporte",
            type: "error",
          });
        })
        .finally(() => {
          lockModal.value = false;
        });
    };

    //watchers
    watch(
      () => formModel.student_id,
      (student_id) => {
        if (student_id) {
          lockModal.value = true;
          formModel.charge_id = "";

          Promise.all([requestGetStudentBalance(student_id)])
            .then(() => {
              console.log(studentBalance.value);

              if (studentBalance.value.studentHasCredit) {
                showCreditDialog.value = true;
              }
            })
            .finally(() => {
              lockModal.value = false;
            });
        }
      }
    );

    watch(
      () => formModel.charge_id,
      (collectionId) => {
        if (!collectionId) return;
        const collection = collectionsOwedByStudent.value.find(
          (collection) => collection.charge_id === formModel.charge_id
        );

        totalAmountDueFormatted.value = collection.totalAmountDueFormatted;
      }
    );

    onMounted(() => {
      requestGetStudentsList();
    });

    return {
      formModel,
      formRef,
      onHideModal,
      onSubmit,
      rules,
      lockModal,
      studentsList,
      collectionsOwedByStudent,
      programs,
      typeToCreatePayment,
      totalAmountDueFormatted,
      paymentMethodsArray,
      paymentMethods,
      disabledReferenceNumber,
      studentBalance,
      collectionsToPayForm,
      showCreditDialog,
      onNavigateToStudentPage,
    };
  },
};
</script>
