<template>
  <modal scrollable :show="showModal" size="xl" :on-hide-modal="onHideModal">
    <template #header> Registrar Donación </template>
    <template #body>
      <el-form
        ref="formRef"
        v-loading="lockModal"
        label-position="top"
        :model="formModel"
        :rules="rules"
      >
        <div class="row">
          <div class="col-6">
            <el-form-item label="Programa" prop="program_id">
              <el-select
                v-model="formModel.program_id"
                placeholder="Seleccione un programa"
              >
                <el-option
                  v-for="program in programs"
                  :key="program.program_id"
                  :label="program.name"
                  :value="program.program_id"
                />
              </el-select>
            </el-form-item>
          </div>
        </div>

        <div v-show="formModel.program_id" class="row">
          <div class="col-4">
            <el-form-item label="Monto Total a Estudiantes" prop="amount">
              <el-input
                v-model.number="formModel.amount"
                type="number"
                placeholder="Monto"
              />
            </el-form-item>
          </div>
          <div class="col-4">
            <el-form-item label="Método de pago" prop="payment_method_id">
              <el-select
                v-model="formModel.payment_method_id"
                placeholder="Seleccione un método de pago"
              >
                <el-option
                  v-for="method in paymentMethodsArray"
                  :key="method.payment_method_id"
                  :label="method.name"
                  :value="method.payment_method_id"
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
          <div class="col-6">
            <el-form-item label="Fecha de pago" prop="payment_date">
              <el-date-picker
                v-model="formModel.payment_date"
                type="date"
                placeholder="Seleccione una fecha"
                format="DD/MM/YYYY"
                style="width: 100%"
              />
            </el-form-item>
          </div>

          <div class="col-12">
            <el-form-item
              label="Descripción del aporte"
              prop="payment_description"
            >
              <el-input
                v-model="formModel.payment_description"
                placeholder="Descripción del aporte"
              />
            </el-form-item>
          </div>

          <div class="col-md-12">
            <el-form-item label="Estudiantes" prop="student_ids">
              <el-transfer
                v-model="formModel.student_ids"
                :data="studentToTransfer"
                filterable
                filter-placeholder="Estudiante"
                :titles="['Estudiantes', 'Seleccionados']"
              />
            </el-form-item>
          </div>
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
</template>

<script>
import { computed, onMounted, ref, reactive, watch } from "vue";
import { ElMessage } from "element-plus";
import { ArgonButton, Modal } from "@/components";

import { useStudents, useFormatDate, usePayments } from "@/composables";

import errorMessages from "@/constants/formErrorMessages";
import { paymentMethodsArray } from "@/constants/paymentMethod";
import paymentMethods from "@/constants/paymentMethod";

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
    const requiredMessage = errorMessages.required;
    //instances
    const { programs, studentsListWithFilters, requestGetStudentListFiltered } =
      useStudents();

    const { requestPostGlobalStudentsPayment } = usePayments();

    const { formatDateYMD } = useFormatDate();

    //refs

    const lockModal = ref(false);

    const formRef = ref(null);
    const formModel = reactive({
      program_id: "",
      student_ids: [],
      amount: 0,
      payment_date: "",
      payment_description: "",
      payment_method_id: "",
    });

    const studentToTransfer = computed(() => {
      return studentsListWithFilters.value.map((student) => ({
        key: student.student_id,
        label: `${student.first_name} ${student.last_name}`,
      }));
    });

    const disabledReferenceNumber = computed(() => {
      return (
        formModel.payment_method_id == "" ||
        formModel.payment_method_id == paymentMethods.CASH ||
        formModel.payment_method_id == paymentMethods.SCHOLARSHIP
      );
    });
    const rules = ref({
      amount: [
        { required: true, message: requiredMessage },
        { type: "number", message: "El monto debe ser un número válido" },
      ],
      payment_method_id: [{ required: true, message: requiredMessage }],
      payment_date: [{ required: true, message: requiredMessage }],
    });

    //methods
    const onHideModal = () => {
      onClearData();

      emit("hidde-modal");
    };

    const onClearData = () => {
      formRef.value.resetFields();

      formModel.student_ids = [];
      formModel.amount = 0;
      formModel.payment_method_id = "";
      formModel.payment_date = "";
      formModel.payment_description = "";
      lockModal.value = false;
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

      lockModal.value = true;

      const paymentData = {
        student_ids: formModel.student_ids,
        amount: +formModel.amount,
        payment_date: formatDateYMD(formModel.payment_date),
        payment_description: formModel.payment_description,
        payment_method_id: formModel.payment_method_id,
        reference_number: formModel.reference_number || "",
      };

      requestPostGlobalStudentsPayment(paymentData)
        .then(() => {
          ElMessage({
            showClose: true,
            message: "Aporte registrado correctamente",
            type: "success",
          });
          onClearData();
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

    watch(
      () => formModel.program_id,
      (newProgramId) => {
        if (newProgramId) {
          requestGetStudentListFiltered({
            program_id: newProgramId,
          });
        }
      }
    );

    onMounted(() => {});

    return {
      formModel,
      formRef,
      onHideModal,
      onSubmit,
      rules,
      lockModal,
      programs,
      studentToTransfer,
      paymentMethodsArray,
      paymentMethods,
      disabledReferenceNumber,
    };
  },
};
</script>
