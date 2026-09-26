<template>

  <div class="edit-member-page">

    <div class="container">

      <!-- Header -->
      <div class="mb-4">

        <h2 class="fw-bold mb-1">
          Edit Member
        </h2>

        <p class="text-muted mb-0">
          Update member information
        </p>

      </div>


      <!-- Error Message -->
      <div
        v-if="errorMessage"
        class="alert alert-danger"
      >
        {{ errorMessage }}
      </div>


      <!-- Loading -->
      <div
        v-if="isLoading"
        class="text-center py-5"
      >

        <div
          class="spinner-border text-warning"
          role="status"
        ></div>

        <p class="text-muted mt-3 mb-0">
          Loading member...
        </p>

      </div>


      <!-- Form -->
      <div
        v-else
        class="card edit-member-card shadow border-0"
      >

        <div class="card-body p-4 p-md-5">

          <form @submit.prevent="updateMember">


            <!-- User ID -->
            <div class="mb-3">

              <label
                for="userId"
                class="form-label"
              >
                User ID
                <span class="text-muted">
                  (Optional)
                </span>
              </label>

              <input
                id="userId"
                v-model="form.userId"
                type="number"
                class="form-control"
                placeholder="Enter user ID"
              />

            </div>


            <!-- Full Name -->
            <div class="mb-3">

              <label
                for="fullName"
                class="form-label"
              >
                Full Name
                <span class="text-danger">
                  *
                </span>
              </label>

              <input
                id="fullName"
                v-model="form.fullName"
                type="text"
                class="form-control"
                placeholder="Enter full name"
                required
              />

            </div>


            <!-- Email -->
            <div class="mb-3">

              <label
                for="email"
                class="form-label"
              >
                Email
                <span class="text-muted">
                  (Optional)
                </span>
              </label>

              <input
                id="email"
                v-model="form.email"
                type="email"
                class="form-control"
                placeholder="Enter email address"
              />

            </div>


            <!-- Designation -->
            <div class="mb-4">

              <label
                for="designation"
                class="form-label"
              >
                Designation
                <span class="text-danger">
                  *
                </span>
              </label>

              <input
                id="designation"
                v-model="form.designation"
                type="text"
                class="form-control"
                placeholder="Enter designation"
                required
              />

            </div>


            <!-- Buttons -->
            <div class="d-flex gap-2">

              <button
                type="submit"
                class="btn btn-primary"
                :disabled="isSaving"
              >

                <span
                  v-if="isSaving"
                  class="spinner-border spinner-border-sm me-2"
                ></span>

                <i
                  v-else
                  class="bi bi-check-lg me-1"
                ></i>

                {{ isSaving ? "Saving..." : "Save Changes" }}

              </button>


              <button
                type="button"
                class="btn btn-outline-secondary"
                @click="goBack"
                :disabled="isSaving"
              >
                Cancel
              </button>

            </div>


          </form>

        </div>

      </div>

    </div>

  </div>

</template>


<script setup>

import {
  ref,
  onMounted
} from "vue";

import {
  useRoute,
  useRouter
} from "vue-router";

import api from "../api";

import {
  Notyf
} from "notyf";

import "notyf/notyf.min.css";


const route =
  useRoute();

const router =
  useRouter();

const notyf =
  new Notyf();


// =========================
// Form
// =========================

const form = ref({

  userId: "",

  fullName: "",

  email: "",

  designation: ""

});


// =========================
// UI State
// =========================

const isLoading =
  ref(false);

const isSaving =
  ref(false);

const errorMessage =
  ref("");


// =========================
// Get Member
// =========================

const getMember = async () => {

  isLoading.value = true;

  errorMessage.value = "";


  try {

    const response =
      await api.get("/users/all");


    const users =
      response.data;


    const member =
      users.find(
        user =>
          user._id === route.params.id
      );


    if (!member) {

      errorMessage.value =
        "Member not found.";

      notyf.error(
        errorMessage.value
      );

      return;

    }


    // Populate form
    form.value = {

      userId:
        member.userId ??
        "",

      fullName:
        member.fullName ??
        "",

      email:
        member.email ??
        "",

      designation:
        member.designation ??
        ""

    };


  } catch (error) {

    console.error(error);


    errorMessage.value =
      error.response?.data?.message ||
      "Unable to load member.";


    notyf.error(
      errorMessage.value
    );

  } finally {

    isLoading.value = false;

  }

};


// =========================
// Update Member
// =========================

const updateMember = async () => {

  errorMessage.value = "";


  // Full Name
  if (
    !form.value.fullName.trim()
  ) {

    errorMessage.value =
      "Full Name is Required";

    notyf.error(
      errorMessage.value
    );

    return;

  }


  // Designation
  if (
    !form.value.designation.trim()
  ) {

    errorMessage.value =
      "Designation is Required";

    notyf.error(
      errorMessage.value
    );

    return;

  }


  isSaving.value = true;


  try {

    await api.put(
      `/users/${route.params.id}`,
      {

        userId:
          form.value.userId === ""
            ? ""
            : Number(form.value.userId),

        fullName:
          form.value.fullName.trim(),

        email:
          form.value.email.trim(),

        designation:
          form.value.designation.trim()

      }
    );


    notyf.success(
      "Member updated successfully."
    );


    // Return to members page
    router.push("/members");


  } catch (error) {

    console.error(error);


    errorMessage.value =
      error.response?.data?.message ||
      "Unable to update member.";


    notyf.error(
      errorMessage.value
    );

  } finally {

    isSaving.value = false;

  }

};


// =========================
// Cancel
// =========================

const goBack = () => {

  router.push("/members");

};


// =========================
// Load Member
// =========================

onMounted(() => {

  getMember();

});

</script>


<style scoped>

/* =========================
   Edit Member Page
========================= */

.edit-member-page {

  min-height: calc(100vh - 60px);

  padding: 50px 0;

  background: #eef3f7;

}


/* =========================
   Header
========================= */

.edit-member-page h2 {

  color: #1e3a5f;

}


.edit-member-page .text-muted {

  color: #6b7c8f !important;

}


/* =========================
   Card
========================= */

.edit-member-card {

  max-width: 700px;

  margin: 0 auto;

  border-radius: 14px;

  background: #ffffff;

  box-shadow:
    0 8px 25px
    rgba(30, 58, 95, 0.10) !important;

}


/* =========================
   Labels
========================= */

.form-label {

  font-weight: 600;

  color: #34495e;

}


/* =========================
   Inputs
========================= */

.form-control {

  min-height: 45px;

  border-radius: 7px;

  border-color: #dce3e9;

}


.form-control:focus {

  border-color: #1e5a8a;

  box-shadow:
    0 0 0 0.2rem
    rgba(30, 90, 138, 0.12);

}


/* =========================
   Buttons
========================= */

.btn {

  font-weight: 600;

  border-radius: 7px;

}


.btn-primary {

  color: #ffffff;

  background: #1e5a8a;

  border-color: #1e5a8a;

}


.btn-primary:hover {

  background: #17496f;

  border-color: #17496f;

}


/* =========================
   Alert
========================= */

.alert-danger {

  color: #7a3030;

  background: #fbeaea;

  border-color: #efcaca;

  border-radius: 7px;

}


/* =========================
   Mobile
========================= */

@media (max-width: 767.98px) {

  .edit-member-page {

    padding: 35px 15px;

  }

}

</style>