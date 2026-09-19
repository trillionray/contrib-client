
<template>
  <div class="register-page">
    <div class="container">
      <div class="row justify-content-center">
        <div class="col-md-6 col-lg-5">
          <div class="card register-card shadow border-0">
            <div class="card-body p-4 p-md-5">

              <!-- Header -->
              <div class="text-center mb-4">
                <h2 class="fw-bold">
                  Create an Account
                </h2>

                <p class="text-muted">
                  Join the Motwo Wheels community
                </p>
              </div>

              <!-- Error Message -->
              <div
                v-if="errorMessage"
                class="alert alert-danger"
              >
                {{ errorMessage }}
              </div>

              <!-- Success Message -->
              <div
                v-if="successMessage"
                class="alert alert-success"
              >
                {{ successMessage }}
              </div>

              <!-- Registration Form -->
              <form @submit.prevent="register">

                <!-- User ID -->
                <div class="mb-3">
                  <label class="form-label fw-semibold">
                    User ID
                  </label>

                  <input
                    type="number"
                    class="form-control"
                    v-model="userId"
                    placeholder="Enter your User ID (optional)"
                  />

                  <small class="text-muted">
                    Optional. Leave blank if you don't have one yet.
                  </small>
                </div>

                <!-- Full Name -->
                <div class="mb-3">
                  <label class="form-label fw-semibold">
                    Full Name
                  </label>

                  <input
                    type="text"
                    class="form-control"
                    v-model="fullName"
                    placeholder="Enter your full name"
                    required
                  />
                </div>

                <!-- Designation -->
                <div class="mb-3">
                  <label class="form-label fw-semibold">
                    Designation
                  </label>

                  <input
                    type="text"
                    class="form-control"
                    v-model="designation"
                    placeholder="Enter your designation"
                    required
                  />
                </div>

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

                <!-- Confirm Password -->
                <div class="mb-3">
                  <label class="form-label fw-semibold">
                    Confirm Password
                  </label>

                  <input
                    type="password"
                    class="form-control"
                    v-model="confirmPassword"
                    placeholder="Confirm your password"
                    required
                  />
                </div>

                <!-- Register Button -->
                <button
                  type="submit"
                  class="btn btn-danger w-100 py-2"
                  :disabled="isLoading"
                >
                  {{ isLoading ? "Creating Account..." : "Register" }}
                </button>

              </form>

              <!-- Login -->
              <div class="text-center mt-4">
                <p class="text-muted mb-0">
                  Already have an account?

                  <router-link
                    id="loginlink"
                    to="/login"
                    class="text-danger fw-semibold text-decoration-none"
                  >
                    Login
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

import { ref } from "vue";
import { useRouter } from "vue-router";
import api from "../api";


const router = useRouter();


// Form data
const userId = ref("");
const fullName = ref("");
const designation = ref("");
const email = ref("");
const password = ref("");
const confirmPassword = ref("");


// UI state
const isLoading = ref(false);
const errorMessage = ref("");
const successMessage = ref("");


// Registration function
const register = async () => {

  errorMessage.value = "";
  successMessage.value = "";


  // Check if passwords match
  if (password.value !== confirmPassword.value) {

    errorMessage.value = "Passwords do not match.";

    return;

  }


  isLoading.value = true;


  try {

    const userData = {

      fullName: fullName.value,
      designation: designation.value,
      email: email.value,
      password: password.value

    };


    // Only include User ID if the user entered one
    if (userId.value !== "") {

      userData.userId = Number(userId.value);

    }


    await api.post("/users/register", userData);


    successMessage.value =
      "Registration successful! Redirecting to login...";


    // Redirect to login page
    setTimeout(() => {

      router.push("/login");

    }, 1500);


  } catch (error) {

    console.error(error);


    if (error.response) {

      errorMessage.value =
        error.response.data.message ||
        "Registration failed.";

    } else {

      errorMessage.value =
        "Unable to connect to the server.";

    }

  } finally {

    isLoading.value = false;

  }

};

</script>

