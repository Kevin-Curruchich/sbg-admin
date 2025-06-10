<template>
  <modal scrollable :show="showModal" size="lg" :on-hide-modal="onHideModal">
    <template #header>
      {{ `${editMode ? "Editar" : "Agregar"} Programa` }}
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
            <el-form-item label="Programa" prop="program_id">
              <el-select
                v-model="formModel.program_id"
                placeholder="Seleccione un programa"
                :disabled="editMode"
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
          <div class="col-md-6">
            <el-form-item label="Tipo de estudiante" prop="student_type_id">
              <el-select
                v-model="formModel.student_type_id"
                placeholder="Seleccione un tipo de estudiante"
              >
                <el-option
                  v-for="type in studentTypesEligible"
                  :key="type.student_type_id"
                  :label="type.name"
                  :value="type.student_type_id"
                />
              </el-select>
            </el-form-item>
          </div>
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
</template>

<script>
import { computed, onMounted, ref, watch } from "vue";
import { useGrades, useStudents } from "@/composables";
import { Modal } from "@/components";
import errorMessages from "@/constants/formErrorMessages";

export default {
  components: {
    Modal,
  },
  props: {
    showModal: {
      type: Boolean,
      default: false,
    },
    rowSelected: {
      type: Object,
      default: () => ({}),
    },
    studentId: {
      type: String,
      default: "",
    },
  },
  emits: ["hide-modal", "accept-modal"],
  setup(props, { emit }) {
    const requiredMessage = errorMessages.required;
    //instances

    const {
      requestGetPrograms,
      programs,
      requestPostStudentProgram,
      requestPutStudentType,
    } = useGrades();

    const { requestGetStudentTypes, studentTypes } = useStudents();

    //refs
    const studentTypesEligible = ref([]);
    const lockModal = ref(false);
    const formRef = ref(null);
    const formModel = ref({
      program_id: "",
      student_type_id: "",
    });

    const rules = ref({
      program_id: [{ required: true, message: requiredMessage }],
      student_type_id: [{ required: true, message: requiredMessage }],
    });

    const editMode = computed(() => {
      return !!props.rowSelected && Object.keys(props.rowSelected).length > 0;
    });

    //methods
    const onHideModal = () => {
      formRef.value.resetFields();
      emit("hide-modal");
    };

    const onClearData = () => {
      formRef.value.resetFields();
      lockModal.value = false;
    };

    const onSubmit = async () => {
      const isValid = await formRef.value.validate((isValid) => {
        return isValid ? true : false;
      });

      if (!isValid) {
        lockModal.value = false;
        return;
      }

      lockModal.value = true;

      const data = { ...formModel.value };

      const studentId = props.studentId;

      if (editMode.value) {
        requestPutStudentType({ studentId, data })
          .then(() => {
            onClearData();
            emit("accept-modal");
          })
          .catch(() => {
            lockModal.value = false;
          });
      } else {
        requestPostStudentProgram({ studentId, data: formModel.value })
          .then(() => {
            onClearData();
            emit("accept-modal");
          })
          .catch(() => {
            lockModal.value = false;
          });
      }
    };

    //watchers

    watch(
      () => formModel.value.program_id,
      async (value) => {
        if (!value) return;

        lockModal.value = true;

        await requestGetStudentTypes(value);

        formModel.value.student_type_id = "";

        studentTypesEligible.value = studentTypes.value.filter((type) => {
          return type.program_id === value;
        });

        lockModal.value = false;
      }
    );

    watch(
      () => props.rowSelected,
      (value) => {
        if (value) {
          formModel.value.program_id = value.program_id;
          formModel.value.student_type_id = value.student_type_id;
        }
      }
    );

    onMounted(async () => {
      await Promise.all([requestGetPrograms()]);
    });

    return {
      formModel,
      formRef,
      onHideModal,
      onSubmit,
      rules,
      lockModal,
      props,
      programs,
      studentTypes,
      studentTypesEligible,
      editMode,
    };
  },
};
</script>

<style></style>
