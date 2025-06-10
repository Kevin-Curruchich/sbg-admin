<template>
  <div class="container top-0 position-sticky z-index-sticky">
    <div class="row">
      <div class="col-12"></div>
    </div>
  </div>
  <main class="mt-0 main-content">
    <section>
      <div class="page-header min-vh-100">
        <div class="container">
          <div class="row">
            <div
              class="mx-auto col-xl-4 col-lg-5 col-md-7 d-flex flex-column mx-lg-0"
            >
              <div class="card card-plain">
                <div class="pb-0 card-header text-start">
                  <h4 class="font-weight-bolder">Iniciar sesión</h4>
                  <p class="mb-0">Ingresa tu correo y contraseña</p>
                </div>
                <div class="card-body">
                  <el-form
                    ref="formRef"
                    role="form"
                    :model="userForm"
                    :rules="rules"
                    label-position="top"
                  >
                    <div class="mb-3">
                      <el-form-item label="Correo electronico" prop="email">
                        <el-input
                          id="email"
                          v-model="userForm.email"
                          type="email"
                          placeholder="Correo electronico"
                        />
                      </el-form-item>
                    </div>
                    <div class="mb-3 mt-2">
                      <el-form-item label="Contraseña" prop="password">
                        <el-input
                          id="password"
                          v-model="userForm.password"
                          type="password"
                          placeholder="Contraseña"
                        />
                      </el-form-item>
                    </div>
                    <!-- <argon-switch id="rememberMe" name="rememberMe">
                      Remember me
                    </argon-switch> -->
                    <div class="text-center">
                      <argon-button
                        class="mt-4"
                        variant="gradient"
                        color="success"
                        full-width
                        :loading="sendingRequest"
                        type="submit"
                        @click="onSubmit"
                        >Iniciar</argon-button
                      >
                    </div>
                  </el-form>
                </div>
                <div class="px-1 pt-0 text-center card-footer px-lg-2">
                  <p class="mx-auto mb-4 text-sm">
                    ¿No tienes una cuenta?
                    <router-link
                      :to="{ name: 'Signup' }"
                      class="text-success text-gradient font-weight-bold"
                      >Registrate</router-link
                    >
                  </p>
                </div>
              </div>
            </div>
            <div
              class="col-6 d-lg-flex d-none h-100 my-auto pe-0 position-absolute top-0 end-0 text-center justify-content-center flex-column"
            >
              <div
                class="position-relative h-100 m-3 px-7 border-radius-lg d-flex flex-column justify-content-center overflow-hidden"
                :style="{
                  backgroundImage: `url(${sbgImage})`,
                  backgroundSize: 'cover',
                }"
              >
                <span class="mask bg-gradient-success opacity-6"></span>

                <h4
                  class="mt-5 text-white font-weight-bolder position-relative"
                >
                  "Seminario Biblico Guatemalteco"
                </h4>
                <p class="text-white position-relative">Preparando Siervos</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  </main>
</template>

<script>
import { mapMutations } from "vuex";
import { useRouter } from "vue-router";
import { ref } from "vue";
import { ElMessage } from "element-plus";
import ArgonButton from "@/components/ArgonButton.vue";
const body = document.getElementsByTagName("body")[0];
import useAuth from "@/composables/useAuth";
import sbgImage from "../../../../public/sbg-image.jpg";
// import userRole from "../../../constants/userRole";

export default {
  name: "SigninIllustration",
  components: {
    ArgonButton,
  },
  setup() {
    const router = useRouter();
    const { loginUser /*userData*/ } = useAuth();

    const formRef = ref(null);
    const sendingRequest = ref(false);

    const userForm = ref({
      email: "",
      password: "",
    });

    const rules = ref({
      email: [
        {
          required: true,
          message: "Por favor ingrese su correo",
          trigger: "blur",
        },
        {
          type: "email",
          message: "Por favor ingrese un correo valido",
          trigger: "blur",
        },
      ],
      password: [
        {
          required: true,
          message: "Por favor ingrese su contraseña",
          trigger: "blur",
        },
      ],
    });

    const onSubmit = async () => {
      sendingRequest.value = true;
      await formRef.value.validate(async (isValid) => {
        if (!isValid) {
          sendingRequest.value = false;
          return;
        }
        loginUser(userForm.value)
          .then(({ ok }) => {
            console.log(ok);

            if (ok) {
              // if (userData.value?.roleId === userRole.ACADEMIC) {
              //   router.push({ name: "List of Students" });
              // } else if (userData.value.studentId) {
              //   router.push({
              //     name: "Student",
              //     params: { id: userData.value.studentId },
              //   });
              // } else {
              console.log("Navegando a estudiantes");
              router.push({ name: "List of Students" });
              // }
            }
          })
          .catch(({ error }) => {
            //display message error
            ElMessage({
              message: error.message,
              type: "error",
              showClose: true,
            });

            sendingRequest.value = false;
          });
      });
    };

    return { onSubmit, userForm, sbgImage, formRef, rules, sendingRequest };
  },
  created() {
    this.$store.state.hideConfigButton = true;
    // this.toggleDefaultLayout();
    this.toggleDefaultLayoutFalse();

    body.classList.remove("bg-gray-100");
  },
  beforeUnmount() {
    this.$store.state.hideConfigButton = false;
    // this.toggleDefaultLayout();
    this.toggleDefaultLayoutTrue();
    body.classList.add("bg-gray-100");
  },
  methods: {
    ...mapMutations([
      "toggleDefaultLayout",
      "toggleDefaultLayoutFalse",
      "toggleDefaultLayoutTrue",
    ]),
  },
};
</script>
