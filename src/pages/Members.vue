
<template>
  <div class="member-page">
    <div class="container">
      <!-- Header -->
      <div class="d-flex justify-content-between align-items-center mb-4 flex-wrap gap-3">
        <div>
          <h2 class="fw-bold mb-1">
            Members
          </h2>

          <p class="text-muted mb-0">
            View all registered members
          </p>
        </div>

        <div class="d-flex gap-2 flex-wrap">
          <router-link
            to="/contributions"
            class="btn btn-outline-primary"
          >
            Contributions
          </router-link>

          <router-link
            to="/members/add"
            class="btn btn-outline-primary"
          >
            <i class="bi bi-person-plus me-1"></i>
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
            <table
              ref="memberTable"
              class="table table-hover align-middle mb-0"
              style="width: 100%;"
            >
              <thead>
                <tr>
                  <th>User ID</th>
                  <th>Full Name</th>
                  <th>Designation</th>
                  <th>Email</th>
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
                  <td
                    :data-order="user.userId ?? ''"
                  >
                    <span
                      v-if="
                        user.userId !== undefined &&
                        user.userId !== null &&
                        user.userId !== ''
                      "
                      class="user-id"
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
                  <td
                    :data-order="user.fullName || ''"
                  >
                    <div class="fw-semibold">
                      {{ user.fullName || "—" }}
                    </div>
                  </td>

                  <!-- Designation -->
                  <td>
                    {{ user.designation || "—" }}
                  </td>

                  <!-- Email -->
                  <td>
                    <span v-if="user.email">
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
                      <i class="bi bi-person-check-fill me-1"></i>
                      Account
                    </span>

                    <span
                      v-else
                      class="account-badge account-none"
                    >
                      <i class="bi bi-person-fill me-1"></i>
                      Member Only
                    </span>
                  </td>

                  <!-- Action -->
                  <td class="text-center">
                    <router-link
                      :to="`/members/edit/${user._id}`"
                      class="btn btn-sm edit-btn"
                    >
                      <i class="bi bi-pencil-square me-1"></i>
                      Edit
                    </router-link>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          <!-- Empty State -->
          <div
            v-if="users.length === 0"
            class="text-center py-4 text-muted"
          >
            No members found.
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import {
  ref,
  nextTick,
  onMounted,
  onBeforeUnmount
} from "vue";

import api from "../api";

import { Notyf } from "notyf";
import "notyf/notyf.min.css";

// =========================
// DataTables
// =========================
import DataTable from "datatables.net-bs5";
import "datatables.net-bs5/css/dataTables.bootstrap5.min.css";

// =========================
// Notifications
// =========================
const notyf = new Notyf();

// =========================
// Users
// =========================
const users = ref([]);

// =========================
// UI State
// =========================
const isLoading = ref(false);
const errorMessage = ref("");

// =========================
// DataTable Reference
// =========================
const memberTable = ref(null);
let dataTable = null;

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
// Initialize DataTable
// =========================
const initializeDataTable = async () => {
  await nextTick();

  if (
    isLoading.value ||
    !memberTable.value ||
    users.value.length === 0
  ) {
    return;
  }

  destroyDataTable();

  dataTable = new DataTable(memberTable.value, {
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

    order: [[1, "asc"]],

    columnDefs: [
      {
        targets: 5,
        orderable: false,
        searchable: false
      }
    ],

    language: {
      search: "Search:",
      lengthMenu: "Show _MENU_ entries",
      info: "Showing _START_ to _END_ of _TOTAL_ records",
      infoEmpty: "No records found",
      emptyTable: "No members available",
      zeroRecords: "No matching members found",

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
// Get All Users
// =========================
const getUsers = async () => {
  isLoading.value = true;
  errorMessage.value = "";

  destroyDataTable();

  try {
    const response = await api.get("/users/all");

    // Support direct arrays or wrapped responses.
    const responseData = response.data;

    if (Array.isArray(responseData)) {
      users.value = responseData;
    } else if (Array.isArray(responseData?.users)) {
      users.value = responseData.users;
    } else if (Array.isArray(responseData?.data)) {
      users.value = responseData.data;
    } else {
      throw new Error(
        "The server returned an unexpected members format."
      );
    }
  } catch (error) {
    console.error("Error loading members:", error);

    users.value = [];

    errorMessage.value =
      error.response?.data?.message ||
      error.message ||
      "Unable to load members.";

    notyf.error(errorMessage.value);
  } finally {
    isLoading.value = false;

    await nextTick();
    await initializeDataTable();
  }
};

// =========================
// Load Data
// =========================
onMounted(() => {
  getUsers();
});

// =========================
// Cleanup
// =========================
onBeforeUnmount(() => {
  destroyDataTable();
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
  box-shadow: 0 8px 25px rgba(30, 58, 95, 0.10) !important;
}

/* =========================
   Table
========================= */
.member-page .table {
  color: #263238;
}

.member-page .table thead th {
  padding: 15px 18px;
  color: #34495e;
  background: #f5f7f9;
  border-bottom: 1px solid #dce3e9;
  font-size: 14px;
  white-space: nowrap;
}

.member-page .table tbody td {
  padding: 16px 18px;
  border-color: #edf1f4;
}

.member-page .table tbody tr:last-child td {
  border-bottom: none;
}

/* =========================
   User ID
========================= */
.user-id {
  display: block;
  color: #1e5a8a;
  font-size: 13px;
  font-weight: 600;
}

/* =========================
   DataTables
   Matches Contributions Page
========================= */
:deep(.dt-container) {
  padding: 16px 18px;
}

:deep(.dt-search) {
  margin-bottom: 15px;
}

:deep(.dt-search input) {
  margin-left: 8px;
  border: 1px solid #dce3e9;
  border-radius: 7px;
  padding: 7px 10px;
}

:deep(.dt-length select) {
  border: 1px solid #dce3e9;
  border-radius: 7px;
  padding: 5px 8px;
}

:deep(.dt-info) {
  color: #6b7c8f;
  font-size: 14px;
}

:deep(.dt-paging .pagination) {
  margin-bottom: 0;
}

:deep(.dt-paging .page-link) {
  color: #1e5a8a;
}

:deep(.dt-paging .active .page-link) {
  color: #ffffff;
  background: #1e5a8a;
  border-color: #1e5a8a;
}

/* =========================
   Account Badges
========================= */
.account-badge {
  display: inline-flex;
  align-items: center;
  padding: 5px 10px;
  border-radius: 20px;
  font-size: 12px;
  font-weight: 600;
  white-space: nowrap;
}

.account-active {
  color: #1e5a8a;
  background: #e8f2fa;
}

.account-none {
  color: #75601e;
  background: #fff6d9;
}

/* =========================
   Buttons
========================= */
.member-page .btn {
  font-weight: 600;
  border-radius: 7px;
}

.member-page .btn-outline-primary {
  color: #1e5a8a;
  background: #ffffff;
  border-color: #1e5a8a;
}

.member-page .btn-outline-primary:hover {
  color: #ffffff;
  background: #1e5a8a;
  border-color: #1e5a8a;
}

/* =========================
   Edit Button
========================= */
.edit-btn {
  color: #1e5a8a;
  background: #eef5fb;
  border: 1px solid #cbddea;
  white-space: nowrap;
}

.edit-btn:hover {
  color: #ffffff;
  background: #1e5a8a;
  border-color: #1e5a8a;
}

/* =========================
   Alert
========================= */
.member-page .alert-danger {
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

  .member-page .table {
    min-width: 850px;
  }
}
</style>
