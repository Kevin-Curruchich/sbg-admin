<template>
  <div>
    <modal :show="showModal" :on-hide-modal="onHideModal" size="lg" scrollable>
      <template #header>
        {{ `${editMode ? "Editar" : "Agregar"} Matricula` }}
      </template>
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
              <el-form-item label="Ciclo" prop="term_id">
                <el-select
                  v-model="formModel.term_id"
                  placeholder="Seleccione un Ciclo"
                >
                  <el-option
                    v-for="program in quartersList"
                    :key="program.term_id"
                    :label="program.term_name"
                    :value="program.term_id"
                  />
                </el-select>
              </el-form-item>
            </div>
            <div class="col-md-6">
              <el-form-item label="Fecha" prop="term_id">
                <el-date-picker
                  v-model="formModel.enrollment_date"
                  format="DD/MM/YYYY"
                  value-format="YYYY-MM-DD"
                  type="date"
                  placeholder="Seleccione una fecha"
                  style="width: 100%"
                />
              </el-form-item>
            </div>
            <div class="col-md-6">
              <el-form-item label="Creditos" prop="credits">
                <el-input
                  v-model="formModel.credits"
                  type="number"
                  placeholder="Ingrese la cantidad de créditos"
                />
              </el-form-item>
            </div>
            <div class="col-md-6">
              <el-form-item
                label="Monto de Cobro"
                prop="enrollment_charge_total"
              >
                <el-input
                  v-model="formModel.enrollment_charge_total"
                  type="number"
                  placeholder="Ingrese el monto de cobro"
                >
                  <template #prepend>Q</template>
                </el-input>
              </el-form-item>
            </div>
            <div class="col-md-6">
              <el-form-item
                label="Incluir Inscripción"
                prop="include_registration"
              >
                <el-switch
                  v-model="formModel.include_registration"
                  active-text="Sí"
                  inactive-text="No"
                />
              </el-form-item>
            </div>
          </div>

          <div class="col-12">
            <el-form-item label="Documento" prop="courses">
              <div v-if="enrollment_evidence">
                <img
                  :src="enrollment_evidence"
                  alt="Evidencia de matrícula"
                  style="max-width: 400px; display: block; margin: 10px auto"
                />
                <argon-button
                  variant="outline"
                  @click="enrollment_evidence = null"
                >
                  Reemplazar evidencia
                </argon-button>
              </div>
              <div v-else>
                <input
                  id="document-upload"
                  type="file"
                  class="form-control"
                  accept="image/png, image/jpeg, image/jpg"
                  @change="onFileChange"
                />
                <div class="form-text">
                  Solo se aceptan archivos JPG/PNG/JPEG.
                </div>
                <div v-if="selectedFile" class="mt-2">
                  <strong>Archivo seleccionado:</strong>
                  {{ selectedFile?.name }}
                </div>
              </div>
            </el-form-item>
          </div>

          <div class="col-12">
            <el-form-item label="Descripción" prop="description">
              <el-input
                v-model="formModel.description"
                type="textarea"
                placeholder="Ingrese una descripción"
                rows="4"
              />
            </el-form-item>
          </div>
        </el-form>
      </template>
      <template #footer>
        <argon-button variant="outline" @click="onHideModal">
          Cancelar
        </argon-button>
        <argon-button :loading="lockModal" @click="onSubmit">
          {{ editMode ? "Editar" : "Agregar" }}
        </argon-button>
      </template>
    </modal>

    <el-dialog
      v-model="showConfirmEnrollment"
      title="Confirmar Matrícula"
      align-center
    >
      <div>
        <p>
          <strong>¿Estás seguro de crear la matrícula?</strong>
        </p>
      </div>

      <template #footer>
        <div class="d-flex justify-content-end gap-3">
          <argon-button
            variant="outline"
            @click="showConfirmEnrollment = false"
          >
            Cancelar
          </argon-button>
          <argon-button
            :loading="lockModalConfirm"
            @click="onConfirmEnrollment"
          >
            Confirmar
          </argon-button>
        </div>
      </template>
    </el-dialog>
  </div>
</template>

<script>
import { computed, onMounted, ref, watch } from "vue";
import { useQuarters, useGrades } from "@/composables";
import { Modal } from "@/components";
import errorMessages from "@/constants/formErrorMessages";

import { getErrorMessage } from "@/helpers/getErrorMessage";
import { ElMessage } from "element-plus";

export default {
  name: "AddEditStudentProgramLevelEnrollment",
  components: {
    Modal,
  },
  props: {
    showModal: {
      type: Boolean,
      default: false,
    },

    studentId: {
      type: String,
      default: "",
    },

    studentGradeId: {
      type: String,
      default: "",
    },

    programId: {
      type: String,
      default: "",
    },

    enrollmentId: {
      type: String,
      default: "",
    },
  },
  emits: ["hide-modal", "accept-modal"],
  setup(props, { emit }) {
    const requiredMessage = errorMessages.required;
    //instances

    const { quartersList, requestGetTermsList } = useQuarters();

    const {
      requestPostStudentGradeEnrollment,
      requestGetEnrollmentDetails,
      requestPutStudentGradeEnrollment,
      requestPostEnrollmentEvidence,
    } = useGrades();

    //refs
    const lockModal = ref(false);
    const lockModalConfirm = ref(false);
    const formRef = ref(null);
    const formModel = ref({
      term_id: "",
      enrollment_charge_total: "",
      credits: "",
      include_registration: false,
      enrollment_date: "",
      description: "",
    });
    const selectedFile = ref(null);
    const enrollment_evidence = ref(null);
    const showConfirmEnrollment = ref(false);

    const rules = ref({
      term_id: [{ required: true, message: requiredMessage }],
      enrollment_date: [{ required: true, message: requiredMessage }],
    });

    const editMode = computed(() => {
      return props.enrollmentId !== "";
    });

    //methods
    const onHideModal = () => {
      onClearData();
      emit("hide-modal");
    };

    function onClearData() {
      formRef.value.resetFields();
      selectedFile.value = null;

      lockModal.value = false;
      lockModalConfirm.value = false;
    }

    async function onSubmit() {
      const isValid = await formRef.value.validate((isValid) => {
        return isValid ? true : false;
      });

      if (!isValid) {
        lockModal.value = false;
        return;
      }

      lockModal.value = true;

      try {
        showConfirmEnrollment.value = true;
      } catch (error) {
        ElMessage.error(getErrorMessage(error));
      } finally {
        lockModal.value = false;
      }
    }

    function onFileChange(event) {
      const file = event.target.files[0];
      if (file) {
        selectedFile.value = file;
      }
    }

    async function onConfirmEnrollment() {
      try {
        lockModalConfirm.value = true;
        const data = {
          term_id: formModel.value.term_id,
          credits: +formModel.value.credits,
          enrollment_charge_total: +formModel.value.enrollment_charge_total,
          include_registration: formModel.value.include_registration,
          enrollment_date: formModel.value.enrollment_date,
          description: formModel.value.description,
        };

        if (editMode.value) {
          await requestPutStudentGradeEnrollment({
            enrollmentId: props.enrollmentId,
            data,
          });
          if (selectedFile.value) {
            const formData = new FormData();
            formData.append("file", selectedFile.value);

            try {
              const enrollmentIdToAddEvidence = props.enrollmentId;

              await requestPostEnrollmentEvidence({
                enrollmentId: enrollmentIdToAddEvidence,
                formData,
              });

              ElMessage.success("Matricula editada correctamente");
              emit("accept-modal");
              onClearData();
            } catch {
              ElMessage.error(
                "Error al subir el archivo. Puedes intentarlo una vez mas"
              );
              emit("accept-modal");
              onClearData();
            }
          }
          return;
        }

        const enrollmentCreated = await requestPostStudentGradeEnrollment({
          studentId: props.studentId,
          studentGradeId: props.studentGradeId,
          data,
        });

        //if selected file is not null we can upload a documento for this enrollment
        if (selectedFile.value) {
          const formData = new FormData();
          formData.append("file", selectedFile.value);

          try {
            const enrollmentIdToAddEvidence =
              enrollmentCreated?.enrollment?.enrollment_id ||
              props.enrollmentId;

            await requestPostEnrollmentEvidence({
              enrollmentId: enrollmentIdToAddEvidence,
              formData,
            });

            emit("accept-modal");
            onClearData();
          } catch {
            ElMessage.error(
              "Error al subir el archivo. Puedes intentarlo una vez mas"
            );
            emit("accept-modal");
            onClearData();
          }
        }
      } catch (error) {
        ElMessage.error(getErrorMessage(error));
      } finally {
        lockModalConfirm.value = false;
        showConfirmEnrollment.value = false;
      }
    }

    watch(
      () => props.enrollmentId,
      async (value) => {
        //if enrollmentId is because the student is editing an existing enrollment
        if (value) {
          lockModal.value = true;
          const response = await requestGetEnrollmentDetails(value);

          formModel.value.term_id = response.term.term_id;
          formModel.value.enrollment_date = response.enrollment_date;
          formModel.value.credits = response.credits;
          formModel.value.enrollment_charge_total =
            response.enrollment_charge_total;
          formModel.value.description = response.description;
          formModel.value.include_registration = response.include_registration;

          enrollment_evidence.value = response.enrollment_evidence;

          lockModal.value = false;
        }
      },
      {
        immediate: true,
      }
    );

    onMounted(async () => {
      await requestGetTermsList();
    });

    return {
      formModel,
      formRef,
      onHideModal,
      onSubmit,
      rules,
      lockModal,
      props,
      quartersList,

      editMode,

      showConfirmEnrollment,
      onConfirmEnrollment,

      lockModalConfirm,
      onFileChange,
      enrollment_evidence,
    };
  },
};
</script>

<style scoped>
.course-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 10px;
}
.course-details {
  flex: 1;
}
.course-actions {
  display: flex;
  align-items: center;
  gap: 10px;
}
</style>
