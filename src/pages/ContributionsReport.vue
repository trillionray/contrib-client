
<template>

  <div class="contribution-page">

    <div class="container">

      <!-- =========================
           Header
      ========================== -->

      <div class="d-flex justify-content-between align-items-center mb-4">

        <div>

          <h2 class="fw-bold mb-1">
            Contribution Report
          </h2>

          <p class="text-muted mb-0">
            Generate a contribution report by date and optional filters
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
            to="/contributions/add"
            class="btn btn-danger"
          >
            Add Contribution
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
           Filter Card
      ========================== -->

      <div class="card contribution-card shadow border-0 mb-4">

        <div class="card-body p-4">

          <h5 class="fw-bold mb-3">
            Report Filters
          </h5>


          <form
            @submit.prevent="createReport"
          >

            <div class="row g-3">

              <!-- =========================
                   Start Date
              ========================== -->

              <div class="col-md-6">

                <label class="form-label fw-semibold">
                  Start Date
                </label>

                <input
                  type="date"
                  class="form-control"
                  v-model="startDate"
                  required
                />

              </div>


              <!-- =========================
                   End Date
              ========================== -->

              <div class="col-md-6">

                <label class="form-label fw-semibold">
                  End Date
                </label>

                <input
                  type="date"
                  class="form-control"
                  v-model="endDate"
                  required
                />

              </div>


              <!-- =========================
                   Name
              ========================== -->

              <div class="col-md-4">

                <label class="form-label fw-semibold">

                  Contributor

                  <small class="text-muted">
                    (Optional)
                  </small>

                </label>


                <input
                  type="text"
                  class="form-control"
                  v-model="name"
                  list="user-options"
                  placeholder="Search contributor..."
                  autocomplete="off"
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
                   Collection Type
              ========================== -->

              <div class="col-md-4">

                <label class="form-label fw-semibold">

                  Collection Type

                  <small class="text-muted">
                    (Optional)
                  </small>

                </label>


                <input
                  type="text"
                  class="form-control"
                  v-model="collectionType"
                  list="collection-type-options"
                  placeholder="Search collection type..."
                  autocomplete="off"
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
                   Contributed To
              ========================== -->

              <div class="col-md-4">

                <label class="form-label fw-semibold">

                  Contributed To

                  <small class="text-muted">
                    (Optional)
                  </small>

                </label>


                <input
                  type="text"
                  class="form-control"
                  v-model="contributedTo"
                  list="contributed-to-options"
                  placeholder="Search contribution..."
                  autocomplete="off"
                />


                <datalist id="contributed-to-options">

                  <option
                    v-for="item in contributedToOptions"
                    :key="item"
                    :value="item"
                  ></option>

                </datalist>

              </div>

            </div>


            <!-- =========================
                 Generate Button
            ========================== -->

            <div class="d-flex justify-content-end mt-4">

              <button
                type="submit"
                class="btn btn-danger px-4"
                :disabled="isLoading"
              >

                <span
                  v-if="isLoading"
                  class="spinner-border spinner-border-sm me-2"
                  role="status"
                ></span>


                {{
                  isLoading
                    ? "Generating Report..."
                    : "Generate Report"
                }}

              </button>

            </div>

          </form>

        </div>

      </div>


      <!-- =========================
           Report Summary
      ========================== -->

      <div
        v-if="reportGenerated"
        class="row g-3 mb-4"
      >

        <!-- =========================
             Number of Contributions
        ========================== -->

        <div class="col-md-6">

          <div class="card summary-card shadow-sm border-0">

            <div class="card-body">

              <div class="summary-label">
                Contributions
              </div>

              <div class="summary-value">
                {{ reportCount }}
              </div>

            </div>

          </div>

        </div>


        <!-- =========================
             Total Amount
        ========================== -->

        <div class="col-md-6">

          <div class="card summary-card shadow-sm border-0">

            <div class="card-body">

              <div class="summary-label">
                Total Amount
              </div>

              <div class="summary-value total">

                ₱{{ formatAmount(reportTotal) }}

              </div>

            </div>

          </div>

        </div>

      </div>


      <!-- =========================
           Report Table
      ========================== -->

      <div
        v-if="reportGenerated"
        class="card contribution-card shadow border-0"
      >

        <div class="card-body p-0">

          <div class="table-responsive">

            <table class="table table-hover align-middle mb-0">

              <thead>

                <tr>

                  <th>
                    Date
                  </th>

                  <th>
                    Contributor
                  </th>

                  <th>
                    Contributions
                  </th>

                  <th class="text-end">
                    Amount
                  </th>

                  <th class="text-end">
                    Total
                  </th>

                </tr>

              </thead>


              <tbody>

                <!-- =========================
                     Contribution Groups
                ========================== -->

                <tr
                  v-for="item in groupedContributions"
                  :key="item.key"
                >

                  <!-- =========================
                       Date
                  ========================== -->

                  <td>

                    <span class="fw-semibold">
                      {{ formatDate(item.date) }}
                    </span>

                  </td>


                  <!-- =========================
                       Contributor
                  ========================== -->

                  <td>

                    <div class="fw-semibold">
                      {{ item.fullName }}
                    </div>


                    <small
                      v-if="item.userId"
                      class="text-muted"
                    >

                      ID: {{ item.userId }}

                    </small>

                  </td>


                  <!-- =========================
                       Contributions
                  ========================== -->

                  <td>

                    <div
                      v-for="(
                        contribution,
                        index
                      ) in item.contributions"

                      :key="
                        contribution._id ||
                        index
                      "

                      class="contribution-detail"
                    >

                      <div class="fw-semibold">

                        {{ contribution.contributedTo }}

                      </div>


                      <small class="collection-type">

                        {{ contribution.collectionType }}

                      </small>


                      <div
                        class="text-muted contribution-description"
                      >

                        {{ contribution.description }}

                      </div>

                    </div>

                  </td>


                  <!-- =========================
                       Individual Amounts
                  ========================== -->

                  <td class="text-end">

                    <div
                      v-for="(
                        contribution,
                        index
                      ) in item.contributions"

                      :key="
                        contribution._id ||
                        index
                      "

                      class="contribution-detail amount"
                    >

                      ₱{{ formatAmount(
                        contribution.amount
                      ) }}

                    </div>

                  </td>


                  <!-- =========================
                       Group Total
                  ========================== -->

                  <td class="text-end">

                    <span class="total-amount">

                      ₱{{ formatAmount(
                        item.totalAmount
                      ) }}

                    </span>

                  </td>

                </tr>


                <!-- =========================
                     Empty
                ========================== -->

                <tr
                  v-if="
                    groupedContributions.length === 0
                  "
                >

                  <td
                    colspan="5"
                    class="text-center py-5 text-muted"
                  >

                    No contributions found
                    for the selected filters.

                  </td>

                </tr>

              </tbody>


              <!-- =========================
                   Grand Total
              ========================== -->

              <tfoot
                v-if="
                  groupedContributions.length > 0
                "
              >

                <tr>

                  <th
                    colspan="4"
                    class="text-end"
                  >

                    Grand Total

                  </th>


                  <th
                    class="text-end grand-total"
                  >

                    ₱{{ formatAmount(
                      reportTotal
                    ) }}

                  </th>

                </tr>

              </tfoot>

            </table>

          </div>

        </div>

      </div>


      <!-- =========================
           No Report Yet
      ========================== -->

      <div
        v-if="!reportGenerated"
        class="card contribution-card shadow border-0"
      >

        <div class="card-body text-center py-5">

          <i
            class="bi bi-file-earmark-text report-icon"
          ></i>


          <h5 class="fw-bold mt-3">
            No Report Generated
          </h5>


          <p class="text-muted mb-0">
            Select a date range and generate a report.
          </p>

        </div>

      </div>

    </div>

  </div>

</template>


<script setup>

import {
  ref,
  computed,
  onMounted
} from "vue";

import {
  useRouter
} from "vue-router";

import api from "../api";

import {
  Notyf
} from "notyf";

import "notyf/notyf.min.css";


const router =
  useRouter();

const notyf =
  new Notyf();


// =========================
// Filters
// =========================

const startDate =
  ref("");

const endDate =
  ref("");

const name =
  ref("");

const collectionType =
  ref("");

const contributedTo =
  ref("");


// =========================
// Users
// =========================

const users =
  ref([]);


// =========================
// Previous Options
// =========================

const contributedToOptions =
  ref([]);

const collectionTypeOptions =
  ref([]);


// =========================
// Report Data
// =========================

const report =
  ref(null);


// =========================
// UI State
// =========================

const isLoading =
  ref(false);

const errorMessage =
  ref("");

const reportGenerated =
  ref(false);


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
// Check Authentication
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
// Get Users
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
// Get Contributed To Options
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
// Get Collection Type Options
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
        "Unable to load collection type options:",
        error
      );

    }

  };


// =========================
// Create Report
// =========================

const createReport = async () => {

  errorMessage.value =
    "";


  // =========================
  // Validate Dates
  // =========================

  if (
    !startDate.value ||
    !endDate.value
  ) {

    notyf.error(
      "Please select a start date and end date."
    );

    return;

  }


  if (
    startDate.value >
    endDate.value
  ) {

    notyf.error(
      "Start date cannot be later than end date."
    );

    return;

  }


  isLoading.value =
    true;


  reportGenerated.value =
    false;


  try {

    const response =
      await api.post(
        "/contributions/report",
        {

          startDate:
            startDate.value,

          endDate:
            endDate.value,

          name:
            name.value.trim() ||
            undefined,

          collectionType:
            collectionType.value.trim() ||
            undefined,

          contributedTo:
            contributedTo.value.trim() ||
            undefined

        }
      );


    console.log(
      "Report:",
      response.data
    );


    report.value =
      response.data;


    reportGenerated.value =
      true;


    notyf.success(
      "Report generated successfully."
    );


  } catch (error) {

    console.error(
      "Unable to generate report:",
      error
    );


    // =========================
    // Unauthorized
    // =========================

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
      "Unable to generate report.";


    notyf.error(
      errorMessage.value
    );

  } finally {

    isLoading.value =
      false;

  }

};


// =========================
// Group Contributions
// =========================

const groupedContributions =
  computed(() => {

    if (
      !report.value ||
      !report.value.contributions
    ) {

      return [];

    }


    const groups = {};


    report.value.contributions
      .forEach(item => {

        // Backend returns `date`
        // instead of `createdAt`

        if (
          !item.user ||
          !item.date
        ) {

          return;

        }


        const date =
          new Date(
            item.date
          );


        // =========================
        // Create Date Key
        // =========================

        const dateKey =
          `${date.getFullYear()}-${String(
            date.getMonth() + 1
          ).padStart(
            2,
            "0"
          )}-${String(
            date.getDate()
          ).padStart(
            2,
            "0"
          )}`;


        // Group by User + Date

        const key =
          `${item.user._id}-${dateKey}`;


        // =========================
        // Create Group
        // =========================

        if (
          !groups[key]
        ) {

          groups[key] = {

            key,

            date:
              item.date,

            userId:
              item.user.userId,

            fullName:
              item.user.fullName,

            contributions: [],

            totalAmount:
              0

          };

        }


        // =========================
        // Add Contribution
        // =========================

        groups[key]
          .contributions
          .push({

            _id:
              item._id,

            contributedTo:
              item.contributedTo,

            collectionType:
              item.collectionType,

            description:
              item.description,

            amount:
              Number(
                item.amount
              ) || 0

          });


        // =========================
        // Add To Group Total
        // =========================

        groups[key]
          .totalAmount +=
            Number(
              item.amount
            ) || 0;

      });


    // =========================
    // Sort Groups
    // =========================

    return Object.values(
      groups
    ).sort(
      (a, b) =>
        new Date(b.date) -
        new Date(a.date)
    );

  });


// =========================
// Report Count
// =========================

const reportCount =
  computed(() => {

    if (
      !report.value
    ) {

      return 0;

    }


    return Number(
      report.value.count
    ) || 0;

  });


// =========================
// Report Total
// =========================

const reportTotal =
  computed(() => {

    if (
      !report.value
    ) {

      return 0;

    }


    return Number(
      report.value.totalAmount
    ) || 0;

  });


// =========================
// Format Date
// =========================

const formatDate = (
  date
) => {

  if (!date) {

    return "";

  }


  return new Date(
    date
  ).toLocaleDateString(
    "en-PH",
    {

      year:
        "numeric",

      month:
        "short",

      day:
        "numeric"

    }
  );

};


// =========================
// Format Amount
// =========================

const formatAmount = (
  amount
) => {

  return Number(
    amount
  ).toLocaleString(
    "en-PH",
    {

      minimumFractionDigits:
        2,

      maximumFractionDigits:
        2

    }
  );

};


// =========================
// Load Data
// =========================

onMounted(() => {

  // Stop if not authenticated

  if (
    !checkAuthentication()
  ) {

    return;

  }


  getUsers();

  getContributedToOptions();

  getCollectionTypeOptions();

});

</script>


<style scoped>

/* =========================
   Contribution Page
========================= */

.contribution-page {

  min-height:
    calc(100vh - 60px);

  padding:
    50px 0;

  background:
    #eef3f7;

}


/* =========================
   Header
========================= */

.contribution-page h2 {

  color:
    #1e3a5f;

}


.contribution-page .text-muted {

  color:
    #6b7c8f !important;

}


/* =========================
   Card
========================= */

.contribution-card {

  border-radius:
    14px;

  overflow:
    hidden;

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


/* =========================
   Form
========================= */

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

  transition:
    border-color 0.2s ease,
    box-shadow 0.2s ease;

}


.form-control::placeholder {

  color:
    #8a9aaa;

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


/* =========================
   Summary Cards
========================= */

.summary-card {

  border-radius:
    14px;

  background:
    #ffffff;

  box-shadow:
    0 5px 18px
    rgba(
      30,
      58,
      95,
      0.08
    ) !important;

}


.summary-label {

  color:
    #6b7c8f;

  font-size:
    14px;

  font-weight:
    600;

}


.summary-value {

  margin-top:
    5px;

  color:
    #1e3a5f;

  font-size:
    28px;

  font-weight:
    700;

}


.summary-value.total {

  color:
    #1e5a8a;

}


/* =========================
   Table
========================= */

.table {

  color:
    #263238;

}


.table thead th {

  padding:
    15px 18px;

  color:
    #34495e;

  background:
    #f5f7f9;

  border-bottom:
    1px solid #dce3e9;

  font-size:
    14px;

  white-space:
    nowrap;

}


.table tbody td {

  padding:
    16px 18px;

  border-color:
    #edf1f4;

}


.table tbody tr:last-child td {

  border-bottom:
    none;

}


/* =========================
   Contribution Details
========================= */

.contribution-detail {

  padding:
    5px 0;

}


.contribution-detail
+ .contribution-detail {

  margin-top:
    6px;

  padding-top:
    8px;

  border-top:
    1px solid #edf1f4;

}


/* =========================
   Collection Type
========================= */

.collection-type {

  display:
    block;

  margin-top:
    2px;

  color:
    #1e5a8a;

  font-size:
    13px;

  font-weight:
    600;

}


/* =========================
   Description
========================= */

.contribution-description {

  margin-top:
    2px;

  font-size:
    13px;

}


/* =========================
   Amount
========================= */

.amount {

  color:
    #34495e;

  font-size:
    15px;

  font-weight:
    600;

}


/* =========================
   Total
========================= */

.total-amount {

  color:
    #1e3a5f;

  font-size:
    16px;

  font-weight:
    700;

}


/* =========================
   Grand Total
========================= */

.grand-total {

  color:
    #1e3a5f;

  background:
    #f5f7f9;

  font-size:
    17px;

}


/* =========================
   Button
========================= */

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


/* =========================
   Alert
========================= */

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


/* =========================
   Report Icon
========================= */

.report-icon {

  color:
    #7d9bb8;

  font-size:
    42px;

}


/* =========================
   Mobile
========================= */

@media (max-width: 767.98px) {

  .contribution-page {

    padding:
      35px 15px;

  }


  .table {

    min-width:
      850px;

  }

}

</style>

