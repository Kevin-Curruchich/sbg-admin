<template>
  <modal scrollable :show="showModal" size="lg" :on-hide-modal="onHideModal">
    <template #header> Agregar Estudiante </template>
    <template #body>
      <el-form
        ref="formRef"
        v-loading="sendingRequest"
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
              />
            </el-form-item>
          </div>
          <div class="col-md-6">
            <el-form-item label="Apellido" prop="last_name">
              <el-input
                v-model="formModel.last_name"
                type="text"
                placeholder="Apellido"
              />
            </el-form-item>
          </div>
          <div class="col-md-6">
            <el-form-item label="Sexo" prop="sex">
              <el-select v-model="formModel.sex" placeholder="Sexo">
                <el-option label="Masculino" :value="1" />
                <el-option label="Femenino" :value="0" />
              </el-select>
            </el-form-item>
          </div>
          <div class="col-md-6">
            <el-form-item label="DPI/DNI" prop="document_id">
              <el-input
                v-model="formModel.document_id"
                type="text"
                placeholder="DPI/DNI"
              />
            </el-form-item>
          </div>
          <div class="col-md-6">
            <el-form-item label="Teléfono" prop="phone_number">
              <el-input
                v-model="formModel.phone_number"
                type="text"
                placeholder="Teléfono"
                style="width: 100%"
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
              />
            </el-form-item>
          </div>
          <div class="col-md-6">
            <el-form-item label="Fecha de nacimiento" prop="birthday">
              <el-date-picker
                v-model="formModel.birthday"
                placeholder="Fecha de nacimiento"
                format="DD/MM/YYYY"
                value-format="YYYY-MM-DD"
                type="date"
                style="width: 100%"
              />
            </el-form-item>
          </div>
          <div class="col-md-12">
            <el-form-item label="Lugar de nacimiento" prop="address">
              <el-input
                v-model="formModel.address"
                type="text"
                placeholder="Lugar de nacimiento"
              />
            </el-form-item>
          </div>
          <el-divider> Informacion académica </el-divider>
          <div class="col-6">
            <el-form-item label="Programa" prop="program_id">
              <el-select
                v-model="formModel.program_id"
                placeholder="Programa"
                filterable
                clearable
              >
                <el-option
                  v-for="program in programs"
                  :key="program.program_id"
                  :value="program.program_id"
                  :label="program.name"
                />
              </el-select>
            </el-form-item>
          </div>
          <div class="col-6">
            <el-form-item label="Tipo de estudiante" prop="student_type_id">
              <el-select
                v-model="formModel.student_type_id"
                placeholder="Tipo de estudiante"
                filterable
                clearable
              >
                <el-option
                  v-for="type in studentTypeEligibleByProgram"
                  :key="type.student_type_id"
                  :value="type.student_type_id"
                  :label="type.name"
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
      <argon-button :loading="sendingRequest" @click="onSubmit">
        Agregar
      </argon-button>
    </template>
  </modal>
</template>

<script>
import { onMounted, ref, watch } from "vue";
import { useStudents, useGrades } from "@/composables";
import { ArgonButton, Modal } from "@/components";
import errorMessages from "@/constants/formErrorMessages";
import countries from "../../../constants/countries";

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
    const inValidEmailMessage = errorMessages.inValidEmail;
    //instances
    const { requestPostStudent, studentTypes } = useStudents();

    const { programs, requestPostStudentProgram } = useGrades();
    //refs
    const sendingRequest = ref(false);
    const formRef = ref(null);
    const formModel = ref({
      first_name: "",
      last_name: "",
      sex: "",
      document_id: "",
      studentPhoneCode: "",
      phone_number: "",
      email: "",
      birthday: "",
      address: "",

      program_id: "",
      student_type_id: "",
    });
    const studentTypeEligibleByProgram = ref([]);

    const rules = ref({
      first_name: [{ required: true, message: requiredMessage }],
      last_name: [{ required: true, message: requiredMessage }],
      sex: [{ required: true, message: requiredMessage }],
      document_id: [{ required: true, message: requiredMessage }],
      studentPhoneCode: [{ required: true, message: requiredMessage }],
      phone_number: [{ required: true, message: requiredMessage }],
      email: [
        { required: true, message: requiredMessage },
        { type: "email", message: inValidEmailMessage },
      ],

      birthday: [{ required: true, message: requiredMessage }],
      address: [{ required: true, message: requiredMessage }],

      program_id: [{ required: true, message: requiredMessage }],
      student_type_id: [{ required: true, message: requiredMessage }],
    });

    //methods
    const onHideModal = () => {
      formRef.value.resetFields();
      emit("hidde-modal");
    };

    const onClearData = () => {
      formRef.value.resetFields();
      studentTypeEligibleByProgram.value = [];
      sendingRequest.value = false;
    };

    const onSubmit = async () => {
      const isValid = await formRef.value.validate((isValid) => {
        return isValid ? true : false;
      });

      if (!isValid) {
        return;
      }

      sendingRequest.value = true;

      try {
        const studentData = {
          first_name: formModel.value.first_name,
          last_name: formModel.value.last_name,
          sex: formModel.value.sex,
          document_id: formModel.value.document_id,
          email: formModel.value.email,
          phone_number: `${formModel.value.studentPhoneCode} ${formModel.value.phone_number}`,
          address: formModel.value.address,
          birthday: formModel.value.birthday,
        };

        delete studentData.studentPhoneCode;

        const studentDataCreated = await requestPostStudent(studentData);

        if (!studentDataCreated || !studentDataCreated.student_id) {
          throw new Error("Error al crear el estudiante");
        }

        const studentProgramData = {
          program_id: formModel.value.program_id,
          student_type_id: formModel.value.student_type_id,
        };

        await requestPostStudentProgram({
          studentId: studentDataCreated.student_id,
          data: studentProgramData,
        });

        emit("accept-modal");
        onClearData();
      } catch (error) {
        console.error("Error al agregar estudiante:", error);

        sendingRequest.value = false;
      }
    };

    watch(
      () => formModel.value.program_id,
      (newValue) => {
        if (newValue) {
          formModel.value.student_type_id = "";

          studentTypeEligibleByProgram.value = studentTypes.value.filter(
            (type) => type.program_id === newValue
          );
        }
      }
    );

    //lifecycle
    onMounted(() => {});

    return {
      formModel,
      formRef,
      onHideModal,
      onSubmit,
      rules,
      sendingRequest,
      countries,
      programs,
      studentTypeEligibleByProgram,
    };
  },
};
</script>
