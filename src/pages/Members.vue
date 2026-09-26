<template>

  <div class="member-page">

    <div class="container">

      <!-- Header -->
      <div class="d-flex justify-content-between align-items-center mb-4">

        <div>

          <h2 class="fw-bold mb-1">
            Members
          </h2>

          <p class="text-muted mb-0">
            View all registered members
          </p>

        </div>


        <div class="d-flex gap-2">

		<router-link
		  to="/contributions"
		  class="btn btn-outline-primary"
		>
		  Contributions
		</router-link>


          <!-- Add Member -->
          <router-link
            to="/members/add"
            class="btn btn-outline-primary"
          >
            Add Member
          </router-link>




        </div>

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
          Loading members...
        </p>

      </div>


      <!-- Members Table -->
      <div
        v-else
        class="card member-card shadow border-0"
      >

        <div class="card-body p-0">

          <div class="table-responsive">

            <table class="table table-hover align-middle mb-0">

              <thead>

                <tr>

                  <th>
                    User ID
                  </th>

                  <th>
                    Full Name
                  </th>

                  <th>
                    Designation
                  </th>

                  <th>
                    Email
                  </th>

                  <th class="text-center">
                    Account
                  </th>

                  <th class="text-center">
                    Action
                  </th>

                </tr>

              </thead>


              <tbody>

                <tr
                  v-for="user in users"
                  :key="user._id"
                >

                  <!-- User ID -->
                  <td>

                    <span
                      v-if="
                        user.userId !== undefined &&
                        user.userId !== null
                      "
                      class="fw-semibold"
                    >
                      {{ user.userId }}
                    </span>

                    <span
                      v-else
                      class="text-muted"
                    >
                      —
                    </span>

                  </td>


                  <!-- Full Name -->
                  <td>

                    <div class="fw-semibold">
                      {{ user.fullName }}
                    </div>

                  </td>


                  <!-- Designation -->
                  <td>

                    <span>
                      {{ user.designation }}
                    </span>

                  </td>


                  <!-- Email -->
                  <td>

                    <span
                      v-if="user.email"
                    >
                      {{ user.email }}
                    </span>

                    <span
                      v-else
                      class="text-muted"
                    >
                      —
                    </span>

                  </td>


                  <!-- Account -->
                  <td class="text-center">

                    <span
                      v-if="user.email"
                      class="account-badge account-active"
                    >

                      <i
                        class="bi bi-person-check-fill me-1"
                      ></i>

                      Account

                    </span>


                    <span
                      v-else
                      class="account-badge account-none"
                    >

                      <i
                        class="bi bi-person-fill me-1"
                      ></i>

                      Member Only

                    </span>

                  </td>


                  <!-- Action -->
                  <td class="text-center">

                    <router-link
                      :to="`/members/edit/${user._id}`"
                      class="btn btn-sm btn-outline-primary"
                    >
                      <i class="bi bi-pencil-square me-1"></i>
                      Edit
                    </router-link>

                  </td>

                </tr>


                <!-- Empty -->
                <tr
                  v-if="users.length === 0"
                >

                  <td
                    colspan="5"
                    class="text-center py-5 text-muted"
                  >
                    No members found.
                  </td>

                </tr>

              </tbody>

            </table>

          </div>

        </div>

      </div>

    </div>

  </div>

</template>


<script setup>

import { ref, onMounted } from "vue";

import api from "../api";

import { Notyf } from "notyf";
import "notyf/notyf.min.css";


const notyf =
  new Notyf();


// =========================
// Users
// =========================

const users =
  ref([]);


// =========================
// UI State
// =========================

const isLoading =
  ref(false);

const errorMessage =
  ref("");


// =========================
// Get All Users
// =========================

const getUsers = async () => {

  isLoading.value = true;

  errorMessage.value = "";


  try {

    const response =
      await api.get("/users/all");


    users.value =
      response.data;


  } catch (error) {

    console.error(error);


    errorMessage.value =
      error.response?.data?.message ||
      "Unable to load members.";


    notyf.error(
      errorMessage.value
    );

  } finally {

    isLoading.value = false;

  }

};


// =========================
// Load Data
// =========================

onMounted(() => {

  getUsers();

});

</script>


<style scoped>

/* =========================
   Member Page
========================= */

.member-page {

  min-height: calc(100vh - 60px);

  padding: 50px 0;

  background: #eef3f7;

}


/* =========================
   Header
========================= */

.member-page h2 {

  color: #1e3a5f;

}


.member-page .text-muted {

  color: #6b7c8f !important;

}


/* =========================
   Card
========================= */

.member-card {

  border-radius: 14px;

  overflow: hidden;

  background: #ffffff;

  box-shadow:
    0 8px 25px
    rgba(30, 58, 95, 0.10) !important;

}


/* =========================
   Table
========================= */

.table {

  color: #263238;

}


.table thead th {

  padding: 15px 18px;

  color: #34495e;

  background: #f5f7f9;

  border-bottom:
    1px solid #dce3e9;

  font-size: 14px;

  white-space: nowrap;

}


.table tbody td {

  padding: 16px 18px;

  border-color: #edf1f4;

}


.table tbody tr:last-child td {

  border-bottom: none;

}


/* =========================
   Account Badge
========================= */

.account-badge {

  display: inline-flex;

  align-items: center;

  padding:
    5px 10px;

  border-radius: 20px;

  font-size: 12px;

  font-weight: 600;

  white-space: nowrap;

}


/* =========================
   Active Account
========================= */

.account-active {

  color: #1e5a8a;

  background: #e8f2fa;

}


/* =========================
   Member Only
========================= */

.account-none {

  color: #75601e;

  background: #fff6d9;

}


/* =========================
   Buttons
========================= */

.btn {

  font-weight: 600;

  border-radius: 7px;

}


/* =========================
   Add Member
========================= */

.btn-outline-primary {

  color: #1e5a8a;

  background: #ffffff;

  border-color: #1e5a8a;

}


.btn-outline-primary:hover {

  color: #ffffff;

  background: #1e5a8a;

  border-color: #1e5a8a;

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

  .member-page {

    padding: 35px 15px;

  }


  .table {

    min-width: 850px;

  }

}

</style>