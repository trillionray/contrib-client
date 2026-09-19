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
                  Add Member
                </h2>

                <p class="text-muted">
                  Add a new Motwo Wheels member
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


              <!-- Add Member Form -->
              <form @submit.prevent="addMember">

                <!-- User ID -->
                <div class="mb-3">

                  <label class="form-label fw-semibold">
                    User ID
                  </label>

                  <input
                    type="number"
                    class="form-control"
                    v-model="userId"
                    placeholder="Enter User ID (optional)"
                  />

                  <small class="text-muted">
                    Optional. Leave blank if the member does not have one.
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
                    placeholder="Enter full name"
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
                    placeholder="Enter designation"
                    required
                  />

                </div>


                <!-- Add Member Button -->
                <button
                  type="submit"
                  class="btn btn-danger w-100 py-2"
                  :disabled="isLoading"
                >
                  {{
                    isLoading
                      ? "Adding Member..."
                      : "Add Member"
                  }}
                </button>

              </form>


              <!-- Back -->
              <div class="text-center mt-4">

                <router-link
                  to="/members"
                  class="text-primary fw-semibold text-decoration-none"
                >
                  Back to Dashboard
                </router-link>

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


// =========================
// Form Data
// =========================

const userId =
  ref("");

const fullName =
  ref("");

const designation =
  ref("");


// =========================
// UI State
// =========================

const isLoading =
  ref(false);

const errorMessage =
  ref("");

const successMessage =
  ref("");


// =========================
// Add Member
// =========================

const addMember = async () => {

  errorMessage.value = "";
  successMessage.value = "";


  isLoading.value = true;


  try {

    const userData = {

      fullName:
        fullName.value,

      designation:
        designation.value

    };


    // Only include User ID if entered
    if (userId.value !== "") {

      userData.userId =
        Number(userId.value);

    }


    await api.post(
      "/users/add-member",
      userData
    );


    successMessage.value =
      "Member added successfully!";


    // Clear form
    userId.value = "";

    fullName.value = "";

    designation.value = "";


    // Redirect to members page
    setTimeout(() => {

      router.push("/members");

    }, 1500);


  } catch (error) {

    console.error(error);


    if (error.response) {

      errorMessage.value =
        error.response.data.message ||
        "Failed to add member.";

    } else {

      errorMessage.value =
        "Unable to connect to the server.";

    }

  } finally {

    isLoading.value = false;

  }

};

</script>


<style scoped>

/* =========================
   Register Page
========================= */

.register-page {

  min-height: calc(100vh - 60px);

  display: flex;

  align-items: center;

  padding: 60px 0;

  background: #eef3f7;

}


/* =========================
   Register Card
========================= */

.register-card {

  border-radius: 14px;

  background: #ffffff;

  box-shadow:
    0 8px 25px
    rgba(30, 58, 95, 0.10) !important;

}


/* =========================
   Header
========================= */

.register-card h2 {

  color: #1e3a5f !important;

}


.register-card .text-muted {

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
   Button
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
   Alerts
========================= */

.alert-danger {

  color: #7a3030;

  background: #fbeaea;

  border-color: #efcaca;

  border-radius: 7px;

}


.alert-success {

  color: #315f4a;

  background: #eaf5ef;

  border-color: #c9e5d4;

  border-radius: 7px;

}


/* =========================
   Links
========================= */

.register-card a {

  color: #1e5a8a;

}


.register-card a:hover {

  color: #163f63;

}


/* =========================
   Mobile
========================= */

@media (max-width: 767.98px) {

  .register-page {

    min-height: calc(100vh - 60px);

    padding: 40px 15px;

  }


  .register-card {

    border-radius: 12px;

  }

}

</style>