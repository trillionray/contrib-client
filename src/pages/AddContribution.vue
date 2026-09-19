<template>
  <div class="contribution-page">
    <div class="container">

      <div class="row justify-content-center">

        <div class="col-md-6 col-lg-5">

          <div class="card contribution-card shadow border-0">

            <div class="card-body p-4 p-md-5">

              <!-- Header -->
              <div class="text-center mb-4">

                <h2 class="fw-bold">
                  Add Contribution
                </h2>

                <p class="text-muted">
                  Record a new contribution
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


              <!-- Contribution Form -->
              <form @submit.prevent="addContribution">

                <!-- User -->
                <div class="mb-3">

                  <label class="form-label fw-semibold">
                    User
                  </label>

                  <select
                    class="form-select"
                    v-model="user"
                    required
                  >

                    <option
                      value=""
                      disabled
                    >
                      Select a user
                    </option>

                    <option
                      v-for="item in users"
                      :key="item._id"
                      :value="item._id"
                    >
                      {{ item.fullName }}
                      {{ item.userId ? `- ${item.userId}` : "" }}
                    </option>

                  </select>

                </div>


                <!-- Contributed To -->
                <div class="mb-3">

                  <label class="form-label fw-semibold">
                    Contributed To
                  </label>

                  <select
                    class="form-select"
                    v-model="selectedContributedTo"
                    required
                  >

                    <option
                      value=""
                      disabled
                    >
                      Select contribution
                    </option>

                    <option
                      v-for="item in contributedToOptions"
                      :key="item"
                      :value="item"
                    >
                      {{ item }}
                    </option>

                    <option value="__other__">
                      Other / New Contribution
                    </option>

                  </select>

                </div>


                <!-- New Contributed To -->
                <div
                  v-if="selectedContributedTo === '__other__'"
                  class="mb-3"
                >

                  <label class="form-label fw-semibold">
                    Others / New Contribution
                  </label>

                  <input
                    type="text"
                    class="form-control"
                    v-model="newContributedTo"
                    placeholder="Enter contribution purpose"
                    required
                  />

                </div>


                <!-- Description -->
                <div class="mb-3">

                  <label class="form-label fw-semibold">
                    Particulars / Description
                  </label>

                  <textarea
                    class="form-control"
                    v-model="description"
                    placeholder="Enter contribution details"
                    rows="4"
                    required
                  ></textarea>

                </div>


                <!-- Amount -->
                <div class="mb-3">

                  <label class="form-label fw-semibold">
                    Amount
                  </label>

                  <div class="input-group">

                    <span class="input-group-text">
                      ₱
                    </span>

                    <input
                      type="number"
                      class="form-control"
                      v-model="amount"
                      placeholder="0.00"
                      min="0"
                      step="0.01"
                      required
                    />

                  </div>

                </div>


                <!-- Add Button -->
                <button
                  type="submit"
                  class="btn btn-danger w-100 py-2"
                  :disabled="isLoading"
                >
                  {{
                    isLoading
                      ? "Saving Contribution..."
                      : "Add Contribution"
                  }}
                </button>

              </form>


              <!-- Back -->
              <div class="text-center mt-4">

                <router-link
                  to="/contributions"
                  class="text-primary fw-semibold text-decoration-none"
                >
                  Back to Contributions
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

import { ref, onMounted } from "vue";
import { useRouter } from "vue-router";
import api from "../api";


const router = useRouter();


// =========================
// Form Data
// =========================

const user = ref("");

const selectedContributedTo =
  ref("");

const newContributedTo =
  ref("");

const description =
  ref("");

const amount =
  ref("");


// =========================
// Users
// =========================

const users =
  ref([]);


// =========================
// Contribution Options
// =========================

const contributedToOptions =
  ref([]);


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
// Get Users
// =========================

const getUsers = async () => {

  try {

    const response =
      await api.get("/users/all");


    users.value =
      response.data;

  } catch (error) {

    console.error(error);

    errorMessage.value =
      "Unable to load users.";

  }

};


// =========================
// Get Contribution Options
// =========================

const getContributedToOptions = async () => {

  try {

    const response =
      await api.get(
        "/contributions/contributed-to"
      );

    console.log(response)



    contributedToOptions.value =
      response.data.map(
        item => item.contributedTo
      );

  } catch (error) {

    console.error(error);

    errorMessage.value =
      "Unable to load contribution options.";

  }

};


// =========================
// Add Contribution
// =========================

const addContribution = async () => {

  errorMessage.value = "";
  successMessage.value = "";


  isLoading.value = true;


  try {

    // Determine contribution purpose
    const finalContributedTo =
      selectedContributedTo.value === "__other__"
        ? newContributedTo.value.trim()
        : selectedContributedTo.value;


    // Make sure it has a value
    if (!finalContributedTo) {

      errorMessage.value =
        "Please enter a contribution purpose.";

      isLoading.value = false;

      return;

    }


    await api.post(
      "/contributions/create",
      {
        user:
          user.value,

        contributedTo:
          finalContributedTo,

        description:
          description.value,

        amount:
          Number(amount.value)
      }
    );


    successMessage.value =
      "Contribution added successfully!";


    // Clear form
    user.value = "";

    selectedContributedTo.value = "";

    newContributedTo.value = "";

    description.value = "";

    amount.value = "";


    // Redirect after saving
    setTimeout(() => {

      router.push(
        "/contributions"
      );

    }, 1500);


  } catch (error) {

    console.error(error);


    if (error.response) {

      errorMessage.value =
        error.response.data.message ||
        "Failed to add contribution.";

    } else {

      errorMessage.value =
        "Unable to connect to the server.";

    }

  } finally {

    isLoading.value = false;

  }

};


// =========================
// Load Data
// =========================

onMounted(() => {

  getUsers();

  getContributedToOptions();

});

</script>


<style scoped>

/* =========================
   Contribution Page
========================= */

.contribution-page {
  min-height: calc(100vh - 60px);

  display: flex;

  align-items: center;

  padding: 60px 0;

  background: #eef3f7;
}


/* =========================
   Contribution Card
========================= */

.contribution-card {
  border-radius: 14px;

  background: #ffffff;

  box-shadow:
    0 8px 25px
    rgba(30, 58, 95, 0.10) !important;
}


/* =========================
   Header
========================= */

.contribution-card h2 {
  color: #1e3a5f !important;
}


.contribution-card .text-muted {
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

.form-control,
.form-select {
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


.form-control:focus,
.form-select:focus {
  color: #263238;

  background: #ffffff;

  border-color: #7d9bb8;

  box-shadow:
    0 0 0 0.2rem
    rgba(30, 58, 95, 0.12);

  outline: none;
}


textarea.form-control {
  resize: vertical;
}


/* =========================
   Input Group
========================= */

.input-group-text {
  color: #34495e;

  background: #f5f7f9;

  border: 1px solid #cbd5df;

  border-radius: 7px 0 0 7px;
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

.contribution-card a {
  color: #1e5a8a;
}


.contribution-card a:hover {
  color: #163f63;
}


/* =========================
   Mobile
========================= */

@media (max-width: 767.98px) {

  .contribution-page {
    min-height: calc(100vh - 60px);

    padding: 40px 15px;
  }


  .contribution-card {
    border-radius: 12px;
  }

}

</style>