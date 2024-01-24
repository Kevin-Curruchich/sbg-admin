<template>
  <el-card shadow="never">
    <template #header>
      <div class="d-flex justify-content-between">
        <div>
          <h5 class="mb-0">Información</h5>
        </div>
        <div v-if="userIsAdmin">
          <argon-button color="primary" @click="onEditMode">{{
            `${editMode ? "Cancelar" : "Editar"}`
          }}</argon-button>
        </div>
      </div>
    </template>
    <el-form
      ref="formRef"
      v-loading="sendingRequest || settingData"
      label-position="top"
      :model="formModel"
      :rules="rules"
    >
      <div class="row">
        <div class="col-md-6">
          <el-form-item label="Nombre" prop="studentName">
            <el-input
              v-model="formModel.studentName"
              type="text"
              placeholder="Nombre"
              :disabled="!editMode"
            />
          </el-form-item>
        </div>
        <div class="col-md-6">
          <el-form-item label="Apellido" prop="studentLastName">
            <el-input
              v-model="formModel.studentLastName"
              type="text"
              placeholder="Apellido"
              :disabled="!editMode"
            />
          </el-form-item>
        </div>
        <div class="col-md-6">
          <el-form-item label="DPI/DNI" prop="studentDni">
            <el-input
              v-model="formModel.studentDni"
              type="text"
              placeholder="DPI/DNI"
              :disabled="!editMode"
            />
          </el-form-item>
        </div>
        <div class="col-md-6">
          <el-form-item label="Telefono" prop="studentPhone">
            <el-input
              v-model="formModel.studentPhone"
              type="text"
              placeholder="Telefono"
              :disabled="!editMode"
            />
          </el-form-item>
        </div>
        <div class="col-md-6">
          <el-form-item label="Correo" prop="studentEmail">
            <el-input
              v-model="formModel.studentEmail"
              type="text"
              placeholder="Correo"
              :disabled="!editMode"
            />
          </el-form-item>
        </div>
        <div class="col-md-6">
          <el-form-item label="Fecha de nacimiento" prop="studentBirthDate">
            <el-date-picker
              v-model="formModel.studentBirthDate"
              placeholder="Fecha de nacimiento"
              format="DD/MM/YYYY"
              style="width: 100%"
              :disabled="!editMode"
            />
          </el-form-item>
        </div>
        <div class="col-md-12">
          <el-form-item label="Lugar de nacimiento" prop="studentAddress">
            <el-input
              v-model="formModel.studentAddress"
              type="text"
              placeholder="Lugar de nacimiento"
              :disabled="!editMode"
            />
          </el-form-item>
        </div>
        <el-divider></el-divider>
        <div class="col-md-6">
          <el-form-item label="Fecha ingreso" prop="studentStartDate">
            <el-date-picker
              v-model="formModel.studentStartDate"
              placeholder="Fecha ingreso"
              format="DD/MM/YYYY"
              style="width: 100%"
              :disabled="!editMode"
            />
          </el-form-item>
        </div>
        <div class="col-md-6">
          <el-form-item label="Tipo estudiante" prop="studentTypeId">
            <el-select
              v-model="formModel.studentTypeId"
              placeholder="Tipo estudiante"
              :disabled="!editMode"
            >
              <el-option
                v-for="item in studentTypes"
                :key="item.studentTypeId"
                :value="item.studentTypeId"
                :label="item.studentTypeName"
              />
            </el-select>
          </el-form-item>
        </div>
        <div class="col-md-6">
          <el-form-item label="Año" prop="studentCurrentYear">
            <el-select
              v-model="formModel.studentCurrentYear"
              placeholder="Año estudiante"
              :disabled="!editMode"
            >
              <el-option
                v-for="item in studentYears"
                :key="item.year"
                :value="item.year"
                :label="item.label"
              />
            </el-select>
          </el-form-item>
        </div>
      </div>
    </el-form>
    <div class="col-12">
      <div class="d-flex justify-content-end">
        <argon-button
          v-show="editMode"
          color="success"
          :loading="sendingRequest"
          @click="onSubmit"
        >
          Guardar
        </argon-button>
      </div>
    </div>
  </el-card>
</template>

<script>
import { onMounted, ref } from "vue";
import { useStudents, useStudent, useAuth } from "@/composables";
import { ArgonButton } from "@/components";
import errorMessages from "@/constants/formErrorMessages";
import { ElMessage } from "element-plus";

export default {
  components: {
    ArgonButton,
  },
  props: {
    studentId: {
      type: String,
      required: true,
    },
  },
  setup(props) {
    //instances
    const {
      requestGetSudentTypes,
      studentTypes,
      studentYears,
      requestPutStudent,
    } = useStudents();

    const { student, requestGetStudentById } = useStudent();
    const { userIsAdmin } = useAuth();

    const requiredMesage = errorMessages.required;
    const inValidEmailMessage = errorMessages.inValidEmail;

    //refs
    const settingData = ref(false);
    const editMode = ref(false);
    const sendingRequest = ref(false);
    const formRef = ref(null);
    const formModel = ref({
      studentName: "",
      studentLastName: "",
      studentDni: "",
      studentPhone: "",
      studentEmail: "",
      studentBirthDate: "",
      studentAddress: "",
      studentStartDate: "",
      studentTypeId: "",
      studentCurrentYear: "",
    });

    const rules = ref({
      studentName: [{ required: true, message: requiredMesage }],
      studentLastName: [{ required: true, message: requiredMesage }],
      studentDni: [{ required: true, message: requiredMesage }],
      studentPhone: [{ required: true, message: requiredMesage }],
      studentEmail: [
        { required: true, message: requiredMesage },
        { type: "email", message: inValidEmailMessage },
      ],
      studentStartDate: [{ required: true, message: requiredMesage }],
      studentTypeId: [
        { required: true, message: requiredMesage, trigger: "change" },
      ],
      studentCurrentYear: [{ required: true, message: requiredMesage }],
    });

    //methods
    const onEditMode = () => {
      editMode.value = !editMode.value;
      if (!editMode.value) {
        onClearData();
      }
    };

    const onClearData = () => {
      formRef.value.resetFields();
      onSetInitialData();
      sendingRequest.value = false;
    };

    const onSetInitialData = () => {
      settingData.value = true;
      formModel.value = {
        ...student.value,
      };
      settingData.value = false;
    };

    const onSubmit = async () => {
      await formRef.value.validate((isValid) => {
        if (isValid) {
          sendingRequest.value = true;
          const studentId = student.value.studentId;

          const data = { ...formModel.value };
          delete data.studentId;
          delete data.StudentStatus;
          delete data.StudentType;

          requestPutStudent({ studentId, data })
            .then(async () => {
              await requestGetStudentById(props.studentId);
              sendingRequest.value = false;
              editMode.value = false;
              ElMessage.success("Estudiante actualizado correctamente");
            })
            .catch(() => {
              sendingRequest.value = false;
              ElMessage.error("Error al actualizar estudiante");
              onEditMode();
            });
        }
      });
    };

    //lifecycle
    onMounted(async () => {
      await requestGetSudentTypes();
      onSetInitialData();
    });

    return {
      formModel,
      formRef,
      onSubmit,
      rules,
      sendingRequest,
      studentTypes,
      studentYears,
      editMode,
      onEditMode,
      settingData,
      userIsAdmin,
    };
  },
};
</script>

<style></style>
