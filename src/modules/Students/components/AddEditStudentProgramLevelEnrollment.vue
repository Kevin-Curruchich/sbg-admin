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
            <el-form-item label="Cursos" class="row">
              <!-- Filter input for courses -->

              <div class="col-12">
                <el-input
                  v-model="courseFilter"
                  placeholder="Buscar curso por nombre"
                  clearable
                />
              </div>

              <div
                v-for="course in filteredCourses"
                :key="course.course_id"
                class="col-12 row mt-4"
              >
                <div class="col-8">
                  <div class="row">
                    <div class="col-8">
                      <el-checkbox
                        :id="course.course_id"
                        v-model="course.selected"
                        :label="course.name"
                      ></el-checkbox>
                    </div>
                    <div class="col-4">
                      <span v-if="course.credits"
                        >Créditos: {{ course.credits }}</span
                      >
                      <span v-if="course.price"
                        >Precio: {{ course.price }}</span
                      >
                    </div>
                  </div>
                </div>
                <div class="col-4">
                  <el-select
                    v-model="course.enrollment_course_type_id"
                    placeholder="Tipo de matrícula"
                    :disabled="!course.selected"
                  >
                    <el-option
                      label="Regular"
                      value="34780a80-a639-4e36-adfd-5ff978ff63fc"
                    />
                    <el-option
                      label="Oyente"
                      value="ae85dcf3-4dd7-4798-b98b-68d71b68c7cf"
                    />
                  </el-select>
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
          <strong>Total a cobrar por matrícula:</strong>
          {{ enrollmentPreviewResponse.totalEnrollmentCharge }}
        </p>
        <p>
          <strong>Detalle:</strong>
          {{ enrollmentPreviewResponse.enrollmentChargeDescription }}
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
import { useQuarters, useCourses, useGrades } from "@/composables";
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

    const { requestGetCoursesByProgram } = useCourses();
    const {
      requestPostStudentGradeEnrollmentPreview,
      requestPostStudentGradeEnrollment,
      requestGetEnrollmentDetails,
      requestPutStudentGradeEnrollment,
    } = useGrades();

    //refs
    const coursesByProgramId = ref([]);

    const lockModal = ref(false);
    const lockModalConfirm = ref(false);
    const formRef = ref(null);
    const formModel = ref({
      term_id: "",
      include_registration: false,
      enrollment_date: "",
      description: "",
    });
    const showConfirmEnrollment = ref(false);
    const enrollmentPreviewResponse = ref({
      totalEnrollmentCharge: 0,
      enrollmentChargeDescription: "",
    });

    const rules = ref({
      term_id: [{ required: true, message: requiredMessage }],
      enrollment_date: [{ required: true, message: requiredMessage }],
    });

    const editMode = computed(() => {
      return props.enrollmentId !== "";
    });

    const courseFilter = ref("");

    const filteredCourses = computed(() => {
      return coursesByProgramId.value.filter((course) =>
        course.name.toLowerCase().includes(courseFilter.value.toLowerCase())
      );
    });

    //methods

    const onHideModal = () => {
      onClearData();
      emit("hide-modal");
    };

    function onClearData() {
      formRef.value.resetFields();

      enrollmentPreviewResponse.value = {
        totalEnrollmentCharge: 0,
        enrollmentChargeDescription: "",
      };

      coursesByProgramId.value = coursesByProgramId.value.map((course) => ({
        ...course,
        selected: false,
        enrollment_course_type_id: "",
      }));

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

      const data = {
        term_id: formModel.value.term_id,
        include_registration: formModel.value.include_registration,
        enrollment_date: formModel.value.enrollment_date,
        description: formModel.value.description,
        courses: coursesByProgramId.value
          .filter((course) => course.selected)
          .map((course) => ({
            course_id: course.course_id,
            enrollment_course_type_id: course.enrollment_course_type_id,
          })),
      };

      try {
        const enrollmentPreview =
          await requestPostStudentGradeEnrollmentPreview(data);

        enrollmentPreviewResponse.value = {
          totalEnrollmentCharge: enrollmentPreview.totalEnrollmentCharge,
          enrollmentChargeDescription:
            enrollmentPreview.enrollmentChargeDescription,
        };

        showConfirmEnrollment.value = true;
      } catch (error) {
        ElMessage.error(getErrorMessage(error));
      } finally {
        lockModal.value = false;
      }
    }

    async function onConfirmEnrollment() {
      try {
        lockModalConfirm.value = true;
        const data = {
          term_id: formModel.value.term_id,
          include_registration: formModel.value.include_registration,
          enrollment_date: formModel.value.enrollment_date,
          description: formModel.value.description,
          courses: coursesByProgramId.value
            .filter((course) => course.selected)
            .map((course) => ({
              course_id: course.course_id,
              enrollment_course_type_id: course.enrollment_course_type_id,
            })),
        };

        if (editMode.value) {
          await requestPutStudentGradeEnrollment({
            enrollmentId: props.enrollmentId,
            data,
          });
          ElMessage.success("Inscripción editada");
          emit("accept-modal");
          onClearData();
          return;
        }

        await requestPostStudentGradeEnrollment({
          studentId: props.studentId,
          studentGradeId: props.studentGradeId,
          data,
        });
        ElMessage.success("Inscripción confirmada");
        emit("accept-modal");
        onClearData();
      } catch (error) {
        ElMessage.error(getErrorMessage(error));
      } finally {
        lockModalConfirm.value = false;
        showConfirmEnrollment.value = false;
      }
    }

    watch(
      () => props.programId,
      async (value) => {
        if (value) {
          const response = await requestGetCoursesByProgram(value);
          coursesByProgramId.value = response.map((course) => ({
            ...course,
            selected: false,
            enrollment_course_type_id: course?.enrollment_course_type_id || "",
          }));
        }
      },
      {
        immediate: true,
      }
    );

    watch(
      () => props.enrollmentId,
      async (value) => {
        //if enrollmentId is because the student is editing an existing enrollment
        if (value) {
          lockModal.value = true;
          const response = await requestGetEnrollmentDetails(value);

          formModel.value.term_id = response.term.term_id;
          formModel.value.enrollment_date = response.enrollment_date;

          formModel.value.description = response.description;

          coursesByProgramId.value.forEach((course) => {
            const enrollmentCourse = response.enrollment_courses.find(
              (enrollment) => enrollment.course_id === course.course_id
            );
            if (enrollmentCourse) {
              course.selected = true;
              course.enrollment_course_type_id =
                enrollmentCourse.enrollment_course_type_id;
            }
          });
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

      coursesByProgramId,
      editMode,
      courseFilter,
      filteredCourses,
      enrollmentPreviewResponse,
      showConfirmEnrollment,
      onConfirmEnrollment,
      lockModalConfirm,
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
