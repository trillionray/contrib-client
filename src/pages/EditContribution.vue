<template>

  <div class="contribution-page">

    <div class="container">

      <!-- =========================
           Header
      ========================== -->

      <div class="d-flex justify-content-between align-items-center mb-4">

        <div>

          <h2 class="fw-bold mb-1">
            Edit Contribution
          </h2>

          <p class="text-muted mb-0">
            Update contribution information
          </p>

        </div>


        <div class="d-flex gap-2">

          <router-link
            to="/contributions"
            class="btn btn-outline-primary"
          >
            Contributions
          </router-link>


          <router-link
            to="/contributions/report"
            class="btn btn-warning"
          >
            Report
          </router-link>

        </div>

      </div>


      <!-- =========================
           Error
      ========================== -->

      <div
        v-if="errorMessage"
        class="alert alert-danger"
      >

        {{ errorMessage }}

      </div>


      <!-- =========================
           Loading
      ========================== -->

      <div
        v-if="isLoading"
        class="text-center py-5"
      >

        <div
          class="spinner-border text-primary"
          role="status"
        ></div>


        <p class="text-muted mt-3 mb-0">
          Loading contribution...
        </p>

      </div>


      <!-- =========================
           Form
      ========================== -->

      <div
        v-else
        class="card contribution-card shadow border-0"
      >

        <div class="card-body p-4 p-md-5">

          <form
            @submit.prevent="updateContribution"
          >

            <div class="row g-3">

              <!-- =========================
                   Contributor
              ========================== -->

              <div class="col-md-6">

                <label class="form-label fw-semibold">
                  Contributor
                </label>


                <input
                  type="text"
                  class="form-control"
                  v-model="form.user"
                  list="user-options"
                  placeholder="Search contributor..."
                  autocomplete="off"
                  required
                />


                <datalist id="user-options">

                  <option
                    v-for="item in users"
                    :key="item._id"
                    :value="getUserLabel(item)"
                  ></option>

                </datalist>

              </div>


              <!-- =========================
                   Date
              ========================== -->

              <div class="col-md-6">

                <label class="form-label fw-semibold">
                  Date
                </label>


                <input
                  type="date"
                  class="form-control"
                  v-model="form.date"
                  required
                />

              </div>


              <!-- =========================
                   Amount
              ========================== -->

              <div class="col-md-6">

                <label class="form-label fw-semibold">
                  Amount
                </label>


                <input
                  type="number"
                  class="form-control"
                  v-model="form.amount"
                  min="0"
                  step="0.01"
                  placeholder="Enter amount"
                  required
                />

              </div>


              <!-- =========================
                   Contributed To
              ========================== -->

              <div class="col-md-6">

                <label class="form-label fw-semibold">
                  Contributed To
                </label>


                <input
                  type="text"
                  class="form-control"
                  v-model="form.contributedTo"
                  list="contributed-to-options"
                  placeholder="Enter contribution purpose"
                  autocomplete="off"
                  required
                />


                <datalist id="contributed-to-options">

                  <option
                    v-for="item in contributedToOptions"
                    :key="item"
                    :value="item"
                  ></option>

                </datalist>

              </div>


              <!-- =========================
                   Collection Type
              ========================== -->

              <div class="col-md-6">

                <label class="form-label fw-semibold">
                  Collection Type
                </label>


                <input
                  type="text"
                  class="form-control"
                  v-model="form.collectionType"
                  list="collection-type-options"
                  placeholder="Enter collection type"
                  autocomplete="off"
                  required
                />


                <datalist id="collection-type-options">

                  <option
                    v-for="item in collectionTypeOptions"
                    :key="item"
                    :value="item"
                  ></option>

                </datalist>

              </div>


              <!-- =========================
                   Description
              ========================== -->

              <div class="col-12">

                <label class="form-label fw-semibold">
                  Description
                </label>


                <textarea
                  class="form-control"
                  v-model="form.description"
                  rows="4"
                  placeholder="Enter description"
                  required
                ></textarea>

              </div>


              <!-- =========================
                   Data Availability
              ========================== -->

              <div class="col-12">

                <div class="form-check">

                  <input
                    id="isDataAvailable"
                    type="checkbox"
                    class="form-check-input"
                    v-model="form.isDataAvailable"
                  />


                  <label
                    for="isDataAvailable"
                    class="form-check-label"
                  >

                    Data Available

                  </label>

                </div>

              </div>

            </div>


            <!-- =========================
                 Buttons
            ========================== -->

            <div class="d-flex justify-content-end gap-2 mt-4">

              <router-link
                to="/contributions"
                class="btn btn-outline-secondary"
              >
                Cancel
              </router-link>


              <button
                type="submit"
                class="btn btn-danger px-4"
                :disabled="isSaving"
              >

                <span
                  v-if="isSaving"
                  class="spinner-border spinner-border-sm me-2"
                  role="status"
                ></span>


                {{
                  isSaving
                    ? "Saving..."
                    : "Save Changes"
                }}

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
// Contribution ID
// =========================

const contributionId =
  route.params.contributionId;


// =========================
// Form
// =========================

const form =
  ref({

    user:
      "",

    date:
      "",

    contributedTo:
      "",

    collectionType:
      "",

    description:
      "",

    amount:
      "",

    isDataAvailable:
      true

  });


// =========================
// Users
// =========================

const users =
  ref([]);


// =========================
// Options
// =========================

const contributedToOptions =
  ref([]);

const collectionTypeOptions =
  ref([]);


// =========================
// UI State
// =========================

const isLoading =
  ref(true);

const isSaving =
  ref(false);

const errorMessage =
  ref("");


// =========================
// Authentication
// =========================

const checkAuthentication = () => {

  const token =
    localStorage.getItem(
      "token"
    );


  if (!token) {

    notyf.error(
      "Login as admin"
    );


    router.push(
      "/login"
    );


    return false;

  }


  return true;

};


// =========================
// User Label
// =========================

const getUserLabel = (
  item
) => {

  return `${item.fullName}${
    item.userId
      ? ` - ${item.userId}`
      : ""
  }`;

};


// =========================
// Find User
// =========================

const findUser = (
  value
) => {

  if (!value) {

    return null;

  }


  const search =
    value
      .trim()
      .toLowerCase();


  return users.value.find(
    user => {

      const label =
        getUserLabel(
          user
        ).toLowerCase();


      return (
        label === search ||
        user.fullName
          ?.toLowerCase() === search ||
        user._id === value
      );

    }
  );

};


// =========================
// Format Date For Input
// =========================

const formatDateForInput = (
  date
) => {

  if (!date) {

    return "";

  }


  const value =
    new Date(
      date
    );


  const year =
    value.getFullYear();


  const month =
    String(
      value.getMonth() + 1
    ).padStart(
      2,
      "0"
    );


  const day =
    String(
      value.getDate()
    ).padStart(
      2,
      "0"
    );


  return `${year}-${month}-${day}`;

};


// =========================
// Load Users
// =========================

const getUsers = async () => {

  try {

    const response =
      await api.get(
        "/users/all"
      );


    users.value =
      response.data;

  } catch (error) {

    console.error(
      "Unable to load users:",
      error
    );

  }

};


// =========================
// Load Contributed To
// =========================

const getContributedToOptions =
  async () => {

    try {

      const response =
        await api.get(
          "/contributions/contributed-to"
        );


      contributedToOptions.value =
        response.data
          .map(
            item =>
              item.contributedTo
          )
          .filter(
            item =>
              item
          );

    } catch (error) {

      console.error(
        "Unable to load contribution options:",
        error
      );

    }

  };


// =========================
// Load Collection Types
// =========================

const getCollectionTypeOptions =
  async () => {

    try {

      const response =
        await api.get(
          "/contributions/collection-types"
        );


      collectionTypeOptions.value =
        response.data
          .map(
            item =>
              item.collectionType
          )
          .filter(
            item =>
              item
          );

    } catch (error) {

      console.error(
        "Unable to load collection types:",
        error
      );

    }

  };


// =========================
// Get Contribution
// =========================

const getContribution = async () => {

  try {

    const response =
      await api.get(
        `/contributions/${contributionId}`
      );


    const contribution =
      response.data;


    // =========================
    // Get Contributor
    // =========================

    const contributor =
      contribution.user;


    form.value = {

      user:
        contributor
          ? getUserLabel(
              contributor
            )
          : "",

      // Use the new editable contribution date
      date:
        formatDateForInput(
          contribution.date
        ),

      contributedTo:
        contribution.contributedTo ||
        "",

      collectionType:
        contribution.collectionType ||
        "",

      description:
        contribution.description ||
        "",

      amount:
        contribution.amount ??
        "",

      isDataAvailable:
        contribution.isDataAvailable !== false

    };


  } catch (error) {

    console.error(
      "Unable to load contribution:",
      error
    );


    errorMessage.value =
      error.response?.data?.message ||
      "Unable to load contribution.";


    notyf.error(
      errorMessage.value
    );

  } finally {

    isLoading.value =
      false;

  }

};


// =========================
// Update Contribution
// =========================

const updateContribution = async () => {

  errorMessage.value =
    "";


  // =========================
  // Find User
  // =========================

  const selectedUser =
    findUser(
      form.value.user
    );


  if (!selectedUser) {

    notyf.error(
      "Please select a valid contributor."
    );

    return;

  }


  // =========================
  // Validate Date
  // =========================

  if (!form.value.date) {

    notyf.error(
      "Please select a date."
    );

    return;

  }


  // =========================
  // Validate Amount
  // =========================

  if (
    form.value.amount === "" ||
    Number(
      form.value.amount
    ) < 0
  ) {

    notyf.error(
      "Please enter a valid amount."
    );

    return;

  }


  isSaving.value =
    true;


  try {

    const updates = {

      user:
        selectedUser._id,

      // Use the new editable contribution date
      date:
        form.value.date,

      contributedTo:
        form.value.contributedTo
          .trim(),

      collectionType:
        form.value.collectionType
          .trim(),

      description:
        form.value.description
          .trim(),

      amount:
        Number(
          form.value.amount
        ),

      isDataAvailable:
        form.value.isDataAvailable

    };


    await api.put(
      `/contributions/${contributionId}`,
      updates
    );


    notyf.success(
      "Contribution updated successfully."
    );


    router.push(
      "/contributions"
    );


  } catch (error) {

    console.error(
      "Unable to update contribution:",
      error
    );


    if (
      error.response?.status === 401 ||
      error.response?.status === 403
    ) {

      localStorage.removeItem(
        "token"
      );


      notyf.error(
        "Login as admin"
      );


      router.push(
        "/login"
      );


      return;

    }


    errorMessage.value =
      error.response?.data?.message ||
      "Unable to update contribution.";


    notyf.error(
      errorMessage.value
    );

  } finally {

    isSaving.value =
      false;

  }

};


// =========================
// Load Page
// =========================

onMounted(async () => {

  if (
    !checkAuthentication()
  ) {

    return;

  }


  await Promise.all([

    getUsers(),

    getContributedToOptions(),

    getCollectionTypeOptions()

  ]);


  await getContribution();

});

</script>


<style scoped>

.contribution-page {

  min-height:
    calc(100vh - 60px);

  padding:
    50px 0;

  background:
    #eef3f7;

}


.contribution-page h2 {

  color:
    #1e3a5f;

}


.contribution-page .text-muted {

  color:
    #6b7c8f !important;

}


.contribution-card {

  border-radius:
    14px;

  background:
    #ffffff;

  box-shadow:
    0 8px 25px
    rgba(
      30,
      58,
      95,
      0.10
    ) !important;

}


.form-label {

  color:
    #34495e;

}


.form-control {

  padding:
    12px 14px;

  color:
    #263238;

  background:
    #ffffff;

  border:
    1px solid #cbd5df;

  border-radius:
    7px;

}


.form-control:focus {

  color:
    #263238;

  background:
    #ffffff;

  border-color:
    #7d9bb8;

  box-shadow:
    0 0 0 0.2rem
    rgba(
      30,
      58,
      95,
      0.12
    );

  outline:
    none;

}


.btn {

  font-weight:
    600;

  border-radius:
    7px;

}


.btn-danger {

  color:
    #263238;

  background:
    #f4c95d;

  border-color:
    #f4c95d;

}


.btn-danger:hover {

  color:
    #263238;

  background:
    #e9b949;

  border-color:
    #e9b949;

}


.btn-danger:disabled {

  color:
    #5f6368;

  background:
    #e1e5e8;

  border-color:
    #e1e5e8;

}


.alert-danger {

  color:
    #7a3030;

  background:
    #fbeaea;

  border-color:
    #efcaca;

  border-radius:
    7px;

}

</style>