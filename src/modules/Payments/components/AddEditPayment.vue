<template>
  <modal scrollable :show="showModal" size="lg" :on-hide-modal="onHideModal">
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
          <div class="col-md-6">
            <el-form-item label="Estudiante" prop="studentId">
              <el-select
                v-model="formModel.studentId"
                placeholder="Estudiante"
                filterable
              >
                <el-option
                  v-for="student in studentsList.data"
                  :key="student.studentId"
                  :value="student.studentId"
                  :label="student.studentFullName"
                />
              </el-select>
            </el-form-item>
          </div>
          <div class="col-md-6">
            <el-form-item label="Cobro a debitar" prop="collectionStudentId">
              <el-select
                v-model="formModel.collectionStudentId"
                placeholder="Cobro a debitar"
                filterable
              >
                <el-option
                  v-for="collection in collectionsOwedByStudent"
                  :key="collection.collectionStudentId"
                  :value="collection.collectionStudentId"
                  :label="`${collection.collection.collectionName} | ${collection?.collectionStudentDate} | ${collection.Quartetly.quartetlyName} `"
                />
              </el-select>
            </el-form-item>
          </div>
          <div class="col-md-12">
            <el-divider></el-divider>
          </div>
          <div class="col-md-6">
            <el-form-item label="Saldo" prop="collectionStudentAmountOwed">
              <el-input
                v-model="formModel.collectionStudentAmountOwed"
                type="number"
                placeholder="Saldo"
                :disabled="true"
              />
            </el-form-item>
          </div>
          <div class="col-md-6">
            <el-form-item label="Monto aporte" prop="paymentAmount">
              <el-input
                v-model="formModel.paymentAmount"
                type="number"
                placeholder="Monto aporte"
              />
            </el-form-item>
          </div>

          <div class="col-md-6">
            <el-form-item label="Fecha" prop="paymentDate">
              <el-date-picker
                v-model="formModel.paymentDate"
                placeholder="Fecha"
                format="DD/MM/YYYY"
                style="width: 100%"
              />
            </el-form-item>
          </div>

          <div class="col-md-6">
            <el-form-item label="Recibo" prop="paymentSlip">
              <el-input
                v-model="formModel.paymentSlip"
                type="text"
                placeholder="Recibo"
              />
            </el-form-item>
          </div>
          <div class="col-md-12">
            <el-form-item label="Descripcion" prop="paymentDescription">
              <el-input
                v-model="formModel.paymentDescription"
                placeholder="Descripcion"
                type="textarea"
                rows="2"
              />
            </el-form-item>
          </div>
        </div>
      </el-form>
    </template>
    <template #footer>
      <argon-button variant="outline" @click="onHideModal"
        >Cancelar</argon-button
      >
      <argon-button :loading="lockModal" @click="onSubmit"
        >Agregar</argon-button
      >
    </template>
  </modal>

  <el-dialog
    v-model="dialogVisible"
    title="Enviar Correo"
    width="30%"
    :close-on-press-escape="false"
    :close-on-click-modal="false"
  >
    <span>Enviar Recibo por correo</span>
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="onCloseDialog">No enviar</el-button>
        <el-button type="primary" @click="onSendMail"> Enviar </el-button>
      </span>
    </template>
  </el-dialog>
</template>

<script>
import { onMounted, ref, watch } from "vue";
import {
  useStudents,
  useCollections,
  useFormatDate,
  usePayments,
} from "@/composables";
import { ArgonButton, Modal } from "@/components";
import errorMessages from "@/constants/formErrorMessages";
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
  },
  emits: ["hidde-modal", "accept-modal"],
  setup(_, { emit }) {
    const requiredMesage = errorMessages.required;
    //instances
    const { requestGetStudentsList, studentsList } = useStudents();
    const { collectionsOwedByStudent, requestGetCollectionsOwedByStudent } =
      useCollections();
    const { requestPostPayments, requestPostInvoiceMail } = usePayments();

    const { formatDateYMD } = useFormatDate();

    //refs
    const lockModal = ref(false);
    const paymentReponse = ref(null);
    const dialogVisible = ref(false);
    const collectionsToStudent = ref([]);
    const formRef = ref(null);
    const formModel = ref({
      studentId: "",
      collectionStudentId: "",
      paymentDate: "",
      paymentSlip: "",
      collectionStudentAmountOwed: "",
      paymentAmount: "",
      paymentDescription: "",
    });

    const rules = ref({
      studentId: [{ required: true, message: requiredMesage }],
      collectionStudentId: [{ required: true, message: requiredMesage }],
      paymentAmount: [
        {
          required: true,
          message: requiredMesage,
        },
        {
          validator: (rule, value, callback) => {
            if (value > formModel.value.collectionStudentAmountOwed) {
              callback(new Error("El monto a abonar debe ser menor al saldo"));
            } else {
              callback();
            }
          },
        },
      ],
      paymentDate: [{ required: true, message: requiredMesage }],
    });

    //methods
    const onHideModal = () => {
      formRef.value.resetFields();
      emit("hidde-modal");
    };

    const onCloseDialog = () => {
      dialogVisible.value = false;
      onClearData();
      emit("accept-modal");
    };

    const onSendMail = async () => {
      const paymentId = paymentReponse.value[1].paymentId;
      await requestPostInvoiceMail(paymentId);

      onClearData();
      emit("accept-modal");

      ElMessage({
        showClose: true,
        message: "Correo enviado correctamente",
        type: "success",
      });
    };

    const onClearData = () => {
      formRef.value.resetFields();
      paymentReponse.value = null;
      collectionsToStudent.value = [];
      lockModal.value = false;
      dialogVisible.value = false;
    };

    const onSubmit = async () => {
      await formRef.value.validate((isValid) => {
        if (isValid) {
          lockModal.value = true;
          formModel.value.paymentDate = formatDateYMD(
            formModel.value.paymentDate
          );
          formModel.value.paymentAmount = +formModel.value.paymentAmount;

          requestPostPayments(formModel.value)
            .then((data) => {
              paymentReponse.value = data;
              dialogVisible.value = true;
            })
            .catch(() => {
              lockModal.value = false;
            });
        }
      });
    };

    //watchers
    watch(
      () => formModel.value.studentId,
      (studentId) => {
        if (studentId) {
          lockModal.value = true;
          formModel.value.collectionStudentId = "";

          requestGetCollectionsOwedByStudent(studentId)
            .then(() => {
              lockModal.value = false;
            })
            .catch(() => {
              lockModal.value = false;
            });
        }
      }
    );

    watch(
      () => formModel.value.collectionStudentId,
      (collectionStudentId) => {
        if (collectionStudentId) {
          formModel.value.collectionStudentAmountOwed =
            collectionsOwedByStudent.value.find(
              (collection) =>
                collection.collectionStudentId === collectionStudentId
            ).collectionStudentAmountOwed;
        }
      }
    );

    //lifecycle
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
      dialogVisible,
      onCloseDialog,
      onSendMail,
    };
  },
};
</script>

<style></style>
