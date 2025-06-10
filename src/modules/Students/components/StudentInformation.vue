<template>
  <el-card shadow="never">
    <template #header>
      <div class="d-flex justify-content-between">
        <div>
          <h5 class="mb-0">Información</h5>
        </div>

        <argon-button color="primary" @click="onEditMode">
          {{ `${editMode ? "Cancelar" : "Editar"}` }}
        </argon-button>
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
          <el-form-item label="Nombre" prop="first_name">
            <el-input
              v-model="formModel.first_name"
              type="text"
              placeholder="Nombre"
              :disabled="!editMode"
            />
          </el-form-item>
        </div>
        <div class="col-md-6">
          <el-form-item label="Apellido" prop="last_name">
            <el-input
              v-model="formModel.last_name"
              type="text"
              placeholder="Apellido"
              :disabled="!editMode"
            />
          </el-form-item>
        </div>
        <div class="col-md-6">
          <el-form-item label="DPI/DNI" prop="document_id">
            <el-input
              v-model="formModel.document_id"
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
            >
              <template #prepend>
                <el-select
                  v-model="formModel.studentPhoneCode"
                  placeholder="Código"
                  style="width: 100px"
                  filterable
                  clearable
                  width="100%"
                >
                  <el-option
                    v-for="item in countries"
                    :key="item.code"
                    :value="item.dial_code"
                    :label="item.dial_code"
                  />
                </el-select>
              </template>
            </el-input>
          </el-form-item>
        </div>
        <div class="col-md-6">
          <el-form-item label="Correo" prop="email">
            <el-input
              v-model="formModel.email"
              type="text"
              placeholder="Correo"
              :disabled="!editMode"
            />
          </el-form-item>
        </div>
        <div class="col-md-6">
          <el-form-item label="Fecha de nacimiento" prop="birthday">
            <el-date-picker
              v-model="formModel.birthday"
              placeholder="Fecha de nacimiento"
              format="DD/MM/YYYY"
              style="width: 100%"
              :disabled="!editMode"
            />
          </el-form-item>
        </div>
        <div class="col-md-12">
          <el-form-item label="Lugar de nacimiento" prop="address">
            <el-input
              v-model="formModel.address"
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
              disabled
            />
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
import { onMounted, reactive, ref } from "vue";
import { useStudents, useStudent } from "@/composables";
import { ArgonButton } from "@/components";
import errorMessages from "@/constants/formErrorMessages";
import countries from "@/constants/countries";

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
      requestGetStudentTypes,
      studentTypes,
      programLevels,
      requestPutStudent,
    } = useStudents();

    const { student, requestGetStudentById } = useStudent();

    const requiredMessage = errorMessages.required;
    const inValidEmailMessage = errorMessages.inValidEmail;

    //refs
    const settingData = ref(false);
    const editMode = ref(false);
    const sendingRequest = ref(false);
    const formRef = ref(null);
    const formModel = reactive({
      first_name: "",
      last_name: "",
      document_id: "",
      studentPhone: "",
      studentPhoneCode: "",
      email: "",
      birthday: "",
      address: "",
      studentStartDate: "",
    });

    const rules = ref({
      first_name: [{ required: true, message: requiredMessage }],
      last_name: [{ required: true, message: requiredMessage }],
      document_id: [{ required: true, message: requiredMessage }],
      studentPhone: [{ required: true, message: requiredMessage }],
      email: [
        { required: true, message: requiredMessage },
        { type: "email", message: inValidEmailMessage },
      ],
      studentStartDate: [{ required: true, message: requiredMessage }],
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
      formModel.first_name = student.value.first_name;
      formModel.last_name = student.value.last_name;
      formModel.document_id = student.value.document_id;
      formModel.email = student.value.email;
      formModel.birthday = student.value.birthday;
      formModel.address = student.value.address;

      formModel.studentStartDate = student.value.created_at;

      const phoneParts = student.value.phone_number.split(" ");
      formModel.studentPhoneCode = phoneParts[0] || "";
      formModel.studentPhone = phoneParts.slice(1).join(" ") || "";

      settingData.value = false;
    };

    const onSubmit = async () => {
      await formRef.value.validate((isValid) => {
        if (!isValid) return;
        sendingRequest.value = true;
        const studentId = props.studentId;

        // Create a new object with only the properties we want to send
        const data = {
          first_name: formModel.first_name,
          last_name: formModel.last_name,
          document_id: formModel.document_id,
          email: formModel.email,
          birthday: formModel.birthday,
          address: formModel.address,

          phone_number: `${formModel.studentPhoneCode} ${formModel.studentPhone}`,
        };

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
      });
    };

    //lifecycle
    onMounted(async () => {
      await requestGetStudentTypes();
      onSetInitialData();
    });

    return {
      formModel,
      formRef,
      onSubmit,
      rules,
      sendingRequest,
      studentTypes,
      programLevels,
      editMode,
      onEditMode,
      settingData,

      countries,
    };
  },
};
</script>

<style></style>
