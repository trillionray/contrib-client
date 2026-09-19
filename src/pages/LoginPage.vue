
<template>
  <div class="login-page">
    <div class="container">

      <div class="row justify-content-center">

        <div class="col-md-5 col-lg-4">

          <div class="card login-card shadow border-0">

            <div class="card-body p-4 p-md-5">

              <!-- Header -->
              <div class="text-center mb-4">
                <h2 class="fw-bold">
                  Welcome Back
                </h2>

                <p class="text-muted">
                  Login to your account
                </p>
              </div>


              <!-- Error Message -->
              <div
                v-if="errorMessage"
                class="alert alert-danger"
              >
                {{ errorMessage }}
              </div>


              <!-- Login Form -->
              <form @submit.prevent="login">

                <!-- Email -->
                <div class="mb-3">

                  <label class="form-label fw-semibold">
                    Email
                  </label>

                  <input
                    type="email"
                    class="form-control"
                    v-model="email"
                    placeholder="Enter your email"
                    required
                  />

                </div>


                <!-- Password -->
                <div class="mb-3">

                  <label class="form-label fw-semibold">
                    Password
                  </label>

                  <input
                    type="password"
                    class="form-control"
                    v-model="password"
                    placeholder="Enter your password"
                    required
                  />

                </div>


                <!-- Login Button -->
                <button
                  type="submit"
                  class="btn btn-danger w-100 py-2"
                  :disabled="isLoading"
                >
                  {{ isLoading ? "Logging in..." : "Login" }}
                </button>

                <!-- <div class="text-center my-3">
                    <span class="text-muted">OR</span>
                </div>

                <div
                    id="googleSignInButton"
                    class="d-flex justify-content-center"
                ></div> -->

              </form>


              <!-- Register -->
              <div class="text-center mt-4">

                <p class="text-muted mb-0">
                  Don't have an account?

                  <router-link id="registerlink"
                    to="/register"
                    class="text-primary fw-semibold text-decoration-none"
                  >
                    Register
                  </router-link>
                </p>

              </div>

            </div>

          </div>

        </div>

      </div>

    </div>
  </div>
</template>


<script setup>

import { ref, onMounted } from "vue";
import { useRouter } from "vue-router";
import api from "../api";
import { useGlobalStore } from "@/stores/global";
import { Notyf } from "notyf";
const notyf = new Notyf();

const globalStore = useGlobalStore();
const router = useRouter();


// Form data
const email = ref("");
const password = ref("");


// UI state
const isLoading = ref(false);
const errorMessage = ref("");


// Login function
const login = async () => {

  errorMessage.value = "";
  isLoading.value = true;

  try {

    const response = await api.post("/users/login", {
      email: email.value,
      password: password.value
    });

    // console.log(response.data.access)
    const token = response.data.access;

    // Save token to localStorage
    localStorage.setItem("token", token);
    // console.log(localStorage.getItem("token"))

    // Save token + user details to global state
    await globalStore.setUserDetails(token);

    notyf.success("Login successful");
    // Redirect to home
    router.push("/");

  } catch (error) {

    console.error(error);

    if (error.response) {

      errorMessage.value =
        error.response.data.message ||
        "Login failed.";

    } else {

      errorMessage.value =
        "Unable to connect to the server.";

    }

  } finally {

    isLoading.value = false;

  }

};

// google login
const handleGoogleLogin = async (response) => {

    errorMessage.value = "";
    isLoading.value = true;

    try {

        const result = await api.post(
            "/users/google-login",
            {
                credential: response.credential
            }
        );

        console.log(result)

        const token =
            result.data.access;


        // Save JWT
        localStorage.setItem(
            "token",
            token
        );


        // Save token + user details
        await globalStore.setUserDetails(
            token
        );


        // Redirect
        router.push("/");

    } catch (error) {

        console.error(error);

        errorMessage.value =
            error.response?.data?.message ||
            "Google login failed.";

    } finally {

        isLoading.value = false;

    }

};


onMounted(() => {

  const script = document.createElement("script");

  script.src = "https://accounts.google.com/gsi/client";
  script.async = true;
  script.defer = true;

  script.onload = () => {

    google.accounts.id.initialize({
      client_id: import.meta.env.VITE_GOOGLE_CLIENT_ID,
      callback: handleGoogleLogin
    });

    google.accounts.id.renderButton(
      document.getElementById("googleSignInButton"),
      {
        theme: "outline",
        size: "large",
        width: 300
      }
    );

  };

  document.head.appendChild(script);

});

</script>


<style scoped>

	/* =========================
	   Login Page
	========================= */

	.login-page {
	  min-height: calc(100vh - 60px);

	  display: flex;

	  align-items: center;

	  padding: 60px 0;

	  background: #eef3f7;
	}


	/* =========================
	   Login Card
	========================= */

	.login-card {
	  border-radius: 14px;

	  background: #ffffff;

	  box-shadow:
	    0 8px 25px rgba(30, 58, 95, 0.10) !important;
	}


	/* =========================
	   Header
	========================= */

	.login-card h2, #registerlink {
	  color: #1e3a5f !important;
	}


	.login-card .text-muted {
	  color: #6b7c8f !important;
	}


	/* =========================
	   Form Labels
	========================= */

	.form-label {
	  color: #34495e;
	}


	/* =========================
	   Form Controls
	========================= */

	.form-control {
	  padding: 12px 14px;

	  color: #263238;

	  background: #ffffff;

	  border: 1px solid #cbd5df;

	  border-radius: 7px;

	  transition:
	    border-color 0.2s ease,
	    box-shadow 0.2s ease;
	}


	.form-control::placeholder {
	  color: #8a9aaa;
	}


	.form-control:focus {
	  color: #263238;

	  background: #ffffff;

	  border-color: #7d9bb8;

	  box-shadow:
	    0 0 0 0.2rem
	    rgba(30, 58, 95, 0.12);

	  outline: none;
	}


	/* =========================
	   Login Button
	========================= */

	.btn {
	  font-weight: 600;

	  border-radius: 7px;
	}


	.btn-danger {
	  color: #263238;

	  background: #f4c95d;

	  border-color: #f4c95d;
	}


	.btn-danger:hover {
	  color: #263238;

	  background: #e9b949;

	  border-color: #e9b949;
	}


	.btn-danger:focus {
	  color: #263238;

	  background: #e9b949;

	  border-color: #e9b949;

	  box-shadow:
	    0 0 0 0.2rem
	    rgba(244, 201, 93, 0.25);
	}


	.btn-danger:disabled {
	  color: #5f6368;

	  background: #e1e5e8;

	  border-color: #e1e5e8;
	}


	/* =========================
	   OR Divider
	========================= */

	.login-card .my-3 span {
	  color: #7b8b9a !important;
	}


	/* =========================
	   Register Link
	========================= */

	.login-card a {
	  color: #1e5a8a;
	}


	.login-card a:hover {
	  color: #163f63;
	}


	/* =========================
	   Error Message
	========================= */

	.alert-danger {
	  color: #7a3030;

	  background: #fbeaea;

	  border-color: #efcaca;

	  border-radius: 7px;
	}


	/* =========================
	   Google Login
	========================= */

	#googleSignInButton {
	  min-height: 40px;
	}


	/* =========================
	   Mobile
	========================= */

	@media (max-width: 767.98px) {

	  .login-page {
	    min-height: calc(100vh - 60px);

	    padding:
	      40px 15px;
	  }


	  .login-card {
	    border-radius: 12px;
	  }

	}
</style>



