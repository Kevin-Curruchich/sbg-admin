<template>
  <modal :show="showModal" :on-hide-modal="onHideModal">
    <template #header>
      {{ `${editMode ? "Editar" : "Agregar"} Nivel` }}
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
            <el-form-item label="Nivel" prop="program_level_id">
              <el-select
                v-model="formModel.program_level_id"
                placeholder="Seleccione un programa"
                :disabled="editMode"
              >
                <el-option
                  v-for="program in programLevels"
                  :key="program.program_level_id"
                  :label="program.name"
                  :value="program.program_level_id"
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
import { useGrades } from "@/composables";
import { Modal } from "@/components";
import errorMessages from "@/constants/formErrorMessages";
import { getErrorMessage } from "@/helpers/getErrorMessage";
import { ElMessage } from "element-plus";

export default {
  name: "AddEditStudentProgramLevel",
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
    programId: {
      type: String,
      default: "",
    },
  },
  emits: ["hide-modal", "accept-modal"],
  setup(props, { emit }) {
    const requiredMessage = errorMessages.required;
    //instances

    const {
      requestGetProgramLevels,
      requestPostStudentProgramLevel,
      programLevels,
    } = useGrades();

    //refs
    const studentTypesEligible = ref([]);
    const lockModal = ref(false);
    const formRef = ref(null);
    const formModel = ref({
      program_level_id: "",
    });

    const rules = ref({
      program_level_id: [{ required: true, message: requiredMessage }],
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

      requestPostStudentProgramLevel({ studentId, data })
        .then(() => {
          onClearData();
          emit("accept-modal");
        })
        .catch((error) => {
          //errorMessage handler
          ElMessage({
            type: "error",
            message: getErrorMessage(error, "Error al guardar el nivel."),
          });
          lockModal.value = false;
        });
    };

    //watchers

    watch(
      () => props.rowSelected,
      (value) => {
        if (value) {
          formModel.value.program_level_id = value.program_level_id;
        }
      }
    );

    onMounted(async () => {
      await Promise.all([requestGetProgramLevels(props.programId)]);
    });

    return {
      formModel,
      formRef,
      onHideModal,
      onSubmit,
      rules,
      lockModal,
      props,
      programLevels,

      studentTypesEligible,
      editMode,
    };
  },
};
</script>

<style></style>
