
<template>

  <div class="contribution-page">

    <div class="container">

      <!-- Header -->
      <div class="d-flex justify-content-between align-items-center mb-4">

        <div>

          <h2 class="fw-bold mb-1">
            Contributions
          </h2>

          <p class="text-muted mb-0">
            View all recorded contributions
          </p>

        </div>

        <!-- HEADER -->
        <div class="d-flex gap-2">

          <!-- Members -->
          <router-link
            to="/members"
            class="btn btn-outline-primary"
          >
            Members
          </router-link>

          <!-- Contribution Marks -->
          <router-link
            to="/contributions/users"
            class="btn btn-outline-primary"
          >
            Marked Contributions
          </router-link>

          <!-- Export Excel -->
          <button
            type="button"
            class="btn btn-success"
            @click="exportToExcel"
          >
            <i class="bi bi-file-earmark-excel me-1"></i>
            LR Template
          </button>


          <!-- Report -->
          <router-link
            to="/contributions/report"
            class="btn btn-danger"
          >
            Contrib Report
          </router-link>

          <!-- Add Contribution -->
          <router-link
            to="/contributions/add"
            class="btn btn-danger"
          >
            Add Contribution
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
          Loading contributions...
        </p>

      </div>

      <!-- Contributions Table -->
      <div
        v-else
        class="card contribution-card shadow border-0"
      >

        <div class="card-body">

          <div class="table-responsive">

            <table
              ref="contributionTable"
              class="table table-hover align-middle mb-0"
              style="width: 100%;"
            >

              <thead>

                <tr>

                  <th>
                    CR #
                  </th>

                  <th>
                    Date
                  </th>

                  <th>
                    Contributions
                  </th>

                  <th>
                    Contributor
                  </th>

                  <th class="text-end">
                    Amount
                  </th>

                  <th class="text-end">
                    Total
                  </th>

                  <th class="text-center">
                    Actions
                  </th>

                </tr>

              </thead>

              <tbody>

                <tr
                  v-for="item in groupedContributions"
                  :key="item.key"
                >

                  <!-- CR # -->
                  <td>

                    <span
                      v-if="item.contributions[0]?.crNumber"
                      class="cr-number"
                    >
                      {{ item.contributions[0].crNumber }}
                    </span>

                    <span
                      v-else
                      class="text-muted"
                    >
                      —
                    </span>

                  </td>

                  <!-- DATE -->
                  <td
                    :data-order="
                      new Date(item.date).getTime()
                    "
                  >

                    <div class="fw-semibold">
                      {{ formatDate(item.date) }}
                    </div>

                  </td>

                  <!-- CONTRIBUTIONS -->
                  <td>

                    <div
                      v-for="(contribution, index) in item.contributions"
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

                      <small class="text-muted">
                        Participants:
                        {{ contribution.numberOfParticipants }}
                      </small>

                    </div>

                  </td>

                  <!-- CONTRIBUTOR -->
                  <td
                    :data-order="
                      item.fullName || ''
                    "
                  >

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

                  <!-- AMOUNT -->
                  <td
                    class="text-end"
                    :data-order="
                      item.contributions.reduce(
                        (total, contribution) =>
                          total +
                          Number(
                            contribution.amount
                          ),
                        0
                      )
                    "
                  >

                    <div
                      v-for="(contribution, index) in item.contributions"
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

                  <!-- TOTAL -->
                  <td
                    class="text-end"
                    :data-order="
                      item.totalAmount
                    "
                  >

                    <span class="total-amount">
                      ₱{{ formatAmount(
                        item.totalAmount
                      ) }}
                    </span>

                  </td>

                  <!-- ACTIONS -->
                  <td class="text-center">

                    <div
                      v-for="(contribution, index) in item.contributions"
                      :key="
                        contribution._id ||
                        index
                      "
                      class="contribution-detail"
                    >

                      <div
                        class="d-flex justify-content-center gap-2"
                      >

                        <!-- Edit -->
                        <router-link
                          :to="
                            `/contributions/edit/${contribution._id}`
                          "
                          class="btn btn-sm edit-btn"
                        >

                          <i
                            class="bi bi-pencil me-1"
                          ></i>

                          Edit

                        </router-link>

                        <!-- Archive -->
                        <button
                          type="button"
                          class="btn btn-sm archive-btn"
                          @click="
                            archiveContribution(
                              contribution._id
                            )
                          "
                        >

                          <i
                            class="bi bi-archive me-1"
                          ></i>

                          Archive

                        </button>

                      </div>

                    </div>

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

import {
  ref,
  computed,
  nextTick,
  onMounted,
  onBeforeUnmount,
  watch
} from "vue";

import {
  useRouter
} from "vue-router";

import api from "../api";

import {
  Notyf
} from "notyf";

import "notyf/notyf.min.css";


// =========================
// DataTables
// =========================

import DataTable from "datatables.net-bs5";

import "datatables.net-bs5/css/dataTables.bootstrap5.min.css";


// =========================
// Excel
// =========================

import ExcelJS from "exceljs";


// =========================
// Router / Notifications
// =========================

const router =
  useRouter();

const notyf =
  new Notyf();


// =========================
// Contributions
// =========================

const contributions =
  ref([]);


// =========================
// DataTable Reference
// =========================

const contributionTable =
  ref(null);

let dataTable =
  null;


// =========================
// UI State
// =========================

const isLoading =
  ref(false);

const errorMessage =
  ref("");


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
// Initialize DataTable
// =========================

const initializeDataTable = async () => {
  await nextTick();

  // Do not initialize while the loading spinner is displayed.
  if (isLoading.value || !contributionTable.value) {
    return;
  }

  // Destroy the previous instance before rebuilding.
  if (dataTable) {
    dataTable.destroy();
    dataTable = null;
  }

  dataTable = new DataTable(contributionTable.value, {
    processing: false,
    serverSide: false,

    paging: true,
    pageLength: 10,
    lengthChange: true,
    searching: true,
    ordering: true,
    info: true,
    autoWidth: false,

    lengthMenu: [
      [10, 25, 50, 100],
      [10, 25, 50, 100]
    ],

    order: [[1, "desc"]],

    columnDefs: [
      {
        targets: 6,
        orderable: false,
        searchable: false
      }
    ],

    language: {
      search: "Search:",
      lengthMenu: "Show _MENU_ entries",
      info: "Showing _START_ to _END_ of _TOTAL_ records",
      infoEmpty: "No records found",
      emptyTable: "No contributions available",
      zeroRecords: "No matching contributions found",

      paginate: {
        first: "First",
        last: "Last",
        next: "Next",
        previous: "Previous"
      }
    }
  });
};


// =========================
// Destroy DataTable
// =========================

const destroyDataTable = () => {
  if (dataTable) {
    dataTable.destroy();
    dataTable = null;
  }
};






// =========================
// Get All Contributions
// =========================

const getContributions = async () => {
  isLoading.value = true;
  errorMessage.value = "";

  // Remove the old DataTable before changing the data.
  destroyDataTable();

  try {
    const response = await api.get("/contributions");

    console.log(
      "Contributions API response:",
      response.data
    );

    // Support either a direct array or a wrapped array.
    const responseData = response.data;

    let records = [];

    if (Array.isArray(responseData)) {
      records = responseData;
    } else if (
      Array.isArray(responseData?.contributions)
    ) {
      records = responseData.contributions;
    } else if (
      Array.isArray(responseData?.data)
    ) {
      records = responseData.data;
    } else {
      console.error(
        "Unexpected contributions response structure:",
        responseData
      );

      throw new Error(
        "The server returned an unexpected contributions format."
      );
    }

    console.log(
      "Total contribution records received:",
      records.length
    );

    contributions.value = records;

  } catch (error) {
    console.error(
      "Error loading contributions:",
      error
    );

    if (
      error.response?.status === 401 ||
      error.response?.status === 403
    ) {
      localStorage.removeItem("token");

      notyf.error("Login as admin");

      router.push("/login");

      return;
    }

    errorMessage.value =
      error.response?.data?.message ||
      error.message ||
      "Unable to load contributions.";

    notyf.error(errorMessage.value);

    // Avoid leaving stale records visible after a failed request.
    contributions.value = [];

  } finally {
    isLoading.value = false;


  }
};



// =========================
// Archive Contribution
// =========================

const archiveContribution = async (contributionId) => {
  if (!contributionId) {
    notyf.error("Contribution ID is missing.");
    return;
  }

  const confirmed = window.confirm(
    "Are you sure you want to archive this contribution?"
  );

  if (!confirmed) {
    return;
  }

  // Remember the current page before destroying DataTables.
  const currentPage =
    dataTable && !dataTable.destroyed
      ? dataTable.page()
      : 0;

  destroyDataTable();

  try {
    await api.delete(
      `/contributions/${contributionId}`
    );

    // Remove only the archived contribution.
    contributions.value =
      contributions.value.filter(
        (contribution) =>
          contribution._id !== contributionId
      );

    notyf.success(
      "Contribution archived successfully."
    );

    // Wait until Vue updates the grouped table rows.
    await nextTick();

    await initializeDataTable();

    // Restore the previous page when possible.
    if (dataTable) {
      const pageInfo = dataTable.page.info();

      if (pageInfo.pages > 0) {
        dataTable
          .page(
            Math.min(
              currentPage,
              pageInfo.pages - 1
            )
          )
          .draw("page");
      }
    }

  } catch (error) {
    console.error(
      "Error archiving contribution:",
      error
    );

    if (
      error.response?.status === 401 ||
      error.response?.status === 403
    ) {
      localStorage.removeItem("token");

      notyf.error("Login as admin");

      router.push("/login");

      return;
    }

    notyf.error(
      error.response?.data?.message ||
      "Unable to archive contribution."
    );

    // Reinitialize the table using the unchanged records.
    await nextTick();

    await initializeDataTable();
  }
};




const groupedContributions = computed(() => {
  const groups = {};

  contributions.value.forEach((item) => {
    if (!item || !item._id) {
      return;
    }

    const user =
      item.user && typeof item.user === "object"
        ? item.user
        : {};

    const userKey =
      user._id ||
      (typeof item.user === "string" ? item.user : null) ||
      "unknown-user";

    const parsedDate = item.date
      ? new Date(item.date)
      : null;

    const validDate =
      parsedDate &&
      !Number.isNaN(parsedDate.getTime());

    const dateKey = validDate
      ? `${parsedDate.getFullYear()}-${String(
          parsedDate.getMonth() + 1
        ).padStart(2, "0")}-${String(
          parsedDate.getDate()
        ).padStart(2, "0")}`
      : "unknown-date";

    // Normalize the CR number.
    const crNumber =
      String(item.crNumber || "").trim();

    const crNumberKey =
      crNumber || "no-cr-number";

    // IMPORTANT: Include CR number in the grouping key.
    const key =
      `${userKey}-${dateKey}-${crNumberKey}`;

    const fullName =
      typeof user.fullName === "string" &&
      user.fullName.trim()
        ? user.fullName.trim()
        : "NO NAME";

    const userId =
      user.userId || "";

    if (!groups[key]) {
      groups[key] = {
        key,
        date: validDate ? item.date : null,
        userId,
        fullName,
        crNumber,
        contributions: [],
        totalAmount: 0
      };
    }

    const amount = Number(item.amount) || 0;

    groups[key].contributions.push({
      _id: item._id,
      crNumber,
      numberOfParticipants:
        Number(item.numberOfParticipants) || 1,
      contributedTo: item.contributedTo || "",
      collectionType: item.collectionType || "",
      description: item.description || "",
      amount
    });

    groups[key].totalAmount += amount;
  });

  return Object.values(groups).sort((a, b) => {
    if (!a.date && !b.date) return 0;
    if (!a.date) return 1;
    if (!b.date) return -1;

    return (
      new Date(b.date).getTime() -
      new Date(a.date).getTime()
    );
  });
});



 // =========================
// Watch Table Data and Loading
// =========================

watch(
  [groupedContributions, isLoading],
  async ([, loading]) => {
    if (loading) {
      return;
    }

    await initializeDataTable();
  },
  {
    flush: "post"
  }
);







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

onMounted(
  async () => {

    if (
      !checkAuthentication()
    ) {

      return;

    }


    await getContributions();

  }
);


// =========================
// Cleanup
// =========================

onBeforeUnmount(
  () => {

    destroyDataTable();

  }
);

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
   CR Number
========================= */

.cr-number {

  display:
    block;

  color:
    #1e5a8a;

  font-size:
    13px;

  font-weight:
    600;

  margin-bottom:
    3px;

}


/* =========================
   Contribution Details
========================= */

.contribution-detail {

  height:
    85px;

  padding:
    5px 0;

  display:
    flex;

  flex-direction:
    column;

  justify-content:
    center;

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
   Individual Amount
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
   Total Amount
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
   DataTables
========================= */

:deep(.dt-container) {

  padding:
    16px 18px;

}


:deep(.dt-search) {

  margin-bottom:
    15px;

}


:deep(.dt-search input) {

  margin-left:
    8px;

  border:
    1px solid #dce3e9;

  border-radius:
    7px;

  padding:
    7px 10px;

}


:deep(.dt-length select) {

  border:
    1px solid #dce3e9;

  border-radius:
    7px;

  padding:
    5px 8px;

}


:deep(.dt-info) {

  color:
    #6b7c8f;

  font-size:
    14px;

}


:deep(.dt-paging .pagination) {

  margin-bottom:
    0;

}


:deep(.dt-paging .page-link) {

  color:
    #1e5a8a;

}


:deep(.dt-paging .active .page-link) {

  color:
    #ffffff;

  background:
    #1e5a8a;

  border-color:
    #1e5a8a;

}


/* =========================
   Edit Button
========================= */

.edit-btn {

  color:
    #1e5a8a;

  background:
    #eef5fb;

  border:
    1px solid #cbddea;

  white-space:
    nowrap;

}


.edit-btn:hover {

  color:
    #ffffff;

  background:
    #1e5a8a;

  border-color:
    #1e5a8a;

}


/* =========================
   Archive Button
========================= */

.archive-btn {

  color:
    #1e3a5f;

  background:
    #eef3f7;

  border:
    1px solid #dce3e9;

  white-space:
    nowrap;

}


.archive-btn:hover {

  color:
    #263238;

  background:
    #f4c95d;

  border-color:
    #f4c95d;

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


/* =========================
   Excel Button
========================= */

.btn-success {

  color:
    #ffffff;

  background:
    #198754;

  border-color:
    #198754;

}


.btn-success:hover {

  color:
    #ffffff;

  background:
    #157347;

  border-color:
    #146c43;

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
   Mobile
========================= */

@media (max-width: 767.98px) {

  .contribution-page {

    padding:
      35px 15px;

  }


  .table {

    min-width:
      950px;

  }

}

</style>

