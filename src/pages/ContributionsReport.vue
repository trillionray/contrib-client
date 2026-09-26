
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
                   Contributor
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
                   Group By
              ========================== -->

              <div class="col-md-4">

                <label class="form-label fw-semibold">

                  Group By

                  <small class="text-muted">
                    (Optional)
                  </small>

                </label>


                <select
                  class="form-select"
                  v-model="groupBy"
                >

                  <option value="">
                    No Grouping
                  </option>

                  <option value="user">
                    User
                  </option>

                  <option value="contributedTo">
                    Contributed To
                  </option>

                  <option value="collectionType">
                    Collection Type
                  </option>

                  <option value="date-user">
                    Date + User
                  </option>

                </select>

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
           Column Selector
      ========================== -->

      <div
        v-if="reportGenerated"
        class="card contribution-card shadow border-0 mb-4"
      >

        <div class="card-body p-4">

          <div
            class="d-flex justify-content-between align-items-center mb-3"
          >

            <div>

              <h5 class="fw-bold mb-1">
                Report Columns
              </h5>

              <small class="text-muted">
                Select the information you want to display.
              </small>

            </div>


            <div class="d-flex gap-2">

              <button
                type="button"
                class="btn btn-sm btn-outline-success"
                @click="exportToExcel"
                :disabled="reportRows.length === 0"
              >
                <i class="bi bi-file-earmark-excel me-1"></i>
                Export to Excel
              </button>

              <button
                type="button"
                class="btn btn-sm btn-outline-secondary"
                @click="resetColumns"
              >
                Reset
              </button>

            </div>

          </div>


          <div class="row g-2">

            <div
              v-for="column in selectableColumns"
              :key="column.key"
              class="col-6 col-md-4 col-lg-3"
            >

              <div
                class="form-check column-option"
                :class="{
                  'column-disabled':
                    isGroupingColumn(column.key) ||
                    isRequiredColumn(column.key)
                }"
              >

                <input
                  :id="`column-${column.key}`"
                  class="form-check-input"
                  type="checkbox"
                  :checked="isColumnVisible(column.key)"
                  :disabled="
                    isGroupingColumn(column.key) ||
                    isRequiredColumn(column.key)
                  "
                  @change="toggleColumn(column.key)"
                />


                <label
                  :for="`column-${column.key}`"
                  class="form-check-label"
                >

                  {{ column.label }}


                  <small
                    v-if="isGroupingColumn(column.key)"
                    class="text-muted"
                  >
                    (Group)
                  </small>


                  <small
                    v-else-if="isRequiredColumn(column.key)"
                    class="text-muted"
                  >
                    (Required)
                  </small>

                </label>

              </div>

            </div>

          </div>


          <div class="column-help mt-3">

            <i class="bi bi-info-circle me-1"></i>

            Grouping columns are included automatically.
            Amount is required when no grouping is selected.

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

        <div class="card-body">

          <!--
            IMPORTANT:
            tableReady temporarily removes the table from
            the DOM while DataTables is being rebuilt.
          -->

          <div
            v-if="tableReady"
            :key="tableRenderKey"
            class="table-responsive"
          >

            <table
              ref="reportTable"
              class="table table-hover align-middle mb-0"
              style="width: 100%;"
            >

              <!-- =========================
                   Table Header
              ========================== -->

              <thead>

                <tr>

                  <th
                    v-for="column in visibleColumns"
                    :key="column.key"
                    :class="{
                      'text-end':
                        column.key === 'amount' ||
                        column.key === 'totalAmount'
                    }"
                  >

                    {{ column.label }}

                  </th>

                </tr>

              </thead>


              <!-- =========================
                   Table Body
              ========================== -->

              <tbody>

                <!-- =========================
                     NO GROUPING
                ========================== -->

                <template v-if="!groupBy">

                  <tr
                    v-for="item in reportContributions"
                    :key="item._id"
                  >

                    <td
                      v-for="column in visibleColumns"
                      :key="column.key"
                      :class="{
                        'text-end':
                          column.key === 'amount'
                      }"
                      :data-order="
                        getCellOrder(
                          item,
                          column.key
                        )
                      "
                    >

                      <template
                        v-if="column.key === 'date'"
                      >

                        <span class="fw-semibold">

                          {{ formatDate(item.date) }}

                        </span>

                      </template>


                      <template
                        v-else-if="
                          column.key === 'contributor'
                        "
                      >

                        <div class="fw-semibold">

                          {{
                            item.user?.fullName ||
                            "Unknown User"
                          }}

                        </div>


                        <small
                          v-if="item.user?.userId"
                          class="text-muted"
                        >

                          ID:
                          {{ item.user.userId }}

                        </small>

                      </template>


                      <template
                        v-else-if="
                          column.key === 'contributedTo'
                        "
                      >

                        <span class="fw-semibold">

                          {{ item.contributedTo }}

                        </span>

                      </template>


                      <template
                        v-else-if="
                          column.key === 'collectionType'
                        "
                      >

                        <span class="collection-type">

                          {{ item.collectionType }}

                        </span>

                      </template>


                      <template
                        v-else-if="
                          column.key === 'description'
                        "
                      >

                        <div class="contribution-description">

                          {{ item.description }}

                        </div>

                      </template>


                      <template
                        v-else-if="
                          column.key === 'amount'
                        "
                      >

                        <span class="amount">

                          ₱{{ formatAmount(
                            item.amount
                          ) }}

                        </span>

                      </template>

                    </td>

                  </tr>

                </template>


                <!-- =========================
                     GROUPED REPORTS
                ========================== -->

                <template v-else>

                  <tr
                    v-for="item in groupedContributions"
                    :key="item.key"
                  >

                    <td
                      v-for="column in visibleColumns"
                      :key="column.key"
                      :class="{
                        'text-end':
                          column.key === 'amount' ||
                          column.key === 'totalAmount'
                      }"
                      :data-order="
                        getGroupCellOrder(
                          item,
                          column.key
                        )
                      "
                    >

                      <!-- =========================
                           GROUP COLUMN
                      ========================== -->

                      <template
                        v-if="
                          isGroupingColumn(
                            column.key
                          )
                        "
                      >

                        <!-- DATE -->

                        <template
                          v-if="
                            column.key === 'date'
                          "
                        >

                          <div class="fw-semibold">

                            {{ formatDate(
                              item.date
                            ) }}

                          </div>

                        </template>


                        <!-- CONTRIBUTOR -->

                        <template
                          v-else-if="
                            column.key === 'contributor'
                          "
                        >

                          <div class="fw-semibold">

                            {{
                              item.user?.fullName ||
                              item.groupLabel ||
                              "Unknown User"
                            }}

                          </div>


                          <small
                            v-if="item.user?.userId"
                            class="text-muted"
                          >

                            ID:
                            {{ item.user.userId }}

                          </small>

                        </template>


                        <!-- OTHER GROUP -->

                        <template v-else>

                          <span
                            :class="{
                              'collection-type':
                                column.key ===
                                'collectionType',
                              'fw-semibold':
                                column.key !==
                                'collectionType'
                            }"
                          >

                            {{ item.groupLabel }}

                          </span>

                        </template>

                      </template>


                      <!-- =========================
                           NORMAL GROUP DETAILS
                      ========================== -->

                      <template
                        v-else-if="
                          column.key !== 'totalAmount'
                        "
                      >

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

                          <!-- DATE -->

                          <template
                            v-if="
                              column.key === 'date'
                            "
                          >

                            {{ formatDate(
                              contribution.date
                            ) }}

                          </template>


                          <!-- CONTRIBUTOR -->

                          <template
                            v-else-if="
                              column.key === 'contributor'
                            "
                          >

                            <div class="fw-semibold">

                              {{
                                contribution.user?.fullName ||
                                "Unknown User"
                              }}

                            </div>


                            <small
                              v-if="
                                contribution.user?.userId
                              "
                              class="text-muted"
                            >

                              ID:
                              {{
                                contribution.user.userId
                              }}

                            </small>

                          </template>


                          <!-- CONTRIBUTED TO -->

                          <template
                            v-else-if="
                              column.key ===
                              'contributedTo'
                            "
                          >

                            <span class="fw-semibold">

                              {{
                                contribution.contributedTo
                              }}

                            </span>

                          </template>


                          <!-- COLLECTION TYPE -->

                          <template
                            v-else-if="
                              column.key ===
                              'collectionType'
                            "
                          >

                            <span class="collection-type">

                              {{
                                contribution.collectionType
                              }}

                            </span>

                          </template>


                          <!-- DESCRIPTION -->

                          <template
                            v-else-if="
                              column.key ===
                              'description'
                            "
                          >

                            <div
                              class="contribution-description"
                            >

                              {{
                                contribution.description
                              }}

                            </div>

                          </template>


                          <!-- AMOUNT -->

                          <template
                            v-else-if="
                              column.key === 'amount'
                            "
                          >

                            <span class="amount">

                              ₱{{ formatAmount(
                                contribution.amount
                              ) }}

                            </span>

                          </template>

                        </div>

                      </template>


                      <!-- =========================
                           TOTAL AMOUNT
                      ========================== -->

                      <template
                        v-else-if="
                          column.key ===
                          'totalAmount'
                        "
                      >

                        <span class="total-amount">

                          ₱{{ formatAmount(
                            item.totalAmount
                          ) }}

                        </span>

                      </template>

                    </td>

                  </tr>

                </template>


                <!-- =========================
                     Empty
                ========================== -->

                <tr
                  v-if="reportRows.length === 0"
                  class="empty-row"
                >

                  <td
                    :colspan="tableColumnCount"
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
                v-if="reportRows.length > 0"
              >

                <tr>

                  <th
                    :colspan="
                      Math.max(
                        visibleColumns.length - 1,
                        1
                      )
                    "
                    class="text-end"
                  >

                    Grand Total

                  </th>


                  <th
                    v-if="visibleColumns.length > 1"
                    class="text-end grand-total"
                  >

                    ₱{{ formatAmount(
                      reportTotal
                    ) }}

                  </th>

                  <th
                    v-else
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


          <!-- =========================
               Table Rebuilding
          ========================== -->

          <div
            v-else
            class="text-center py-5"
          >

            <div
              class="spinner-border text-secondary mb-2"
              role="status"
            ></div>

            <div class="text-muted">
              Updating report...
            </div>

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
  onMounted,
  onBeforeUnmount,
  nextTick,
  watch
} from "vue";

import {
  useRouter
} from "vue-router";

import * as XLSX from "xlsx";

import api from "../api";

import {
  Notyf
} from "notyf";

import "notyf/notyf.min.css";

import DataTable from "datatables.net-bs5";

import "datatables.net-bs5/css/dataTables.bootstrap5.min.css";


const router =
  useRouter();

const notyf =
  new Notyf();


// =========================
// DataTable Reference
// =========================

const reportTable =
  ref(null);

let dataTable =
  null;


// =========================
// IMPORTANT TABLE STATE
// =========================

/*
  This prevents Vue and DataTables from trying to
  modify the same table at the same time.
*/

const tableReady =
  ref(false);


const tableRenderKey =
  ref(0);


// =========================
// Prevent Watcher During
// Initial Report Creation
// =========================

const rebuildingReport =
  ref(false);


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
// Group By
// =========================

const groupBy =
  ref("");


// =========================
// Users
// =========================

const users =
  ref([]);


// =========================
// Filter Options
// =========================

const contributedToOptions =
  ref([]);

const collectionTypeOptions =
  ref([]);


// =========================
// Report
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
// Available Columns
// =========================

const availableColumns = [

  {
    key: "date",
    label: "Date",
    default: true
  },

  {
    key: "contributor",
    label: "Contributor",
    default: true
  },

  {
    key: "contributedTo",
    label: "Contributed To",
    default: true
  },

  {
    key: "collectionType",
    label: "Collection Type",
    default: false
  },

  {
    key: "description",
    label: "Particulars",
    default: false
  },

  {
    key: "amount",
    label: "Amount",
    default: true
  }

];


// =========================
// Selected Columns
// =========================

const getDefaultColumns = () => {

  return availableColumns
    .filter(
      column =>
        column.default
    )
    .map(
      column =>
        column.key
    );

};


const selectedColumns =
  ref(
    getDefaultColumns()
  );


// =========================
// Selectable Columns
// =========================

const selectableColumns =
  computed(() => {

    return availableColumns;

  });


// =========================
// Grouping Columns
// =========================

const groupingColumns =
  computed(() => {

    if (
      groupBy.value === "user"
    ) {

      return [
        "contributor"
      ];

    }


    if (
      groupBy.value ===
      "contributedTo"
    ) {

      return [
        "contributedTo"
      ];

    }


    if (
      groupBy.value ===
      "collectionType"
    ) {

      return [
        "collectionType"
      ];

    }


    if (
      groupBy.value ===
      "date-user"
    ) {

      return [
        "date",
        "contributor"
      ];

    }


    return [];

  });


// =========================
// Is Grouping Column
// =========================

const isGroupingColumn = (
  columnKey
) => {

  return groupingColumns.value.includes(
    columnKey
  );

};


// =========================
// Required Column
// =========================

const isRequiredColumn = (
  columnKey
) => {

  if (
    !groupBy.value &&
    columnKey === "amount"
  ) {

    return true;

  }


  return false;

};


// =========================
// Is Column Visible
// =========================

const isColumnVisible = (
  columnKey
) => {

  if (
    isGroupingColumn(columnKey)
  ) {

    return true;

  }


  return selectedColumns.value.includes(
    columnKey
  );

};


// =========================
// Toggle Column
// =========================

const toggleColumn = (
  columnKey
) => {

  if (
    isGroupingColumn(columnKey)
  ) {

    return;

  }


  if (
    isRequiredColumn(columnKey)
  ) {

    notyf.error(
      "Amount is required for an ungrouped report."
    );

    return;

  }


  const exists =
    selectedColumns.value.includes(
      columnKey
    );


  if (exists) {

    if (
      selectedColumns.value.length === 1
    ) {

      notyf.error(
        "Select at least one column."
      );

      return;

    }


    selectedColumns.value =
      selectedColumns.value.filter(
        column =>
          column !== columnKey
      );

    return;

  }


  /*
    IMPORTANT:

    Do not simply append the column.

    Rebuild the selected list using the original
    availableColumns order.

    Therefore:

    Date
    Contributor
    Contributed To
    Collection Type
    Description
    Amount

    Date will return to its original position
    after being checked again.
  */

  const newSelectedColumns = [
    ...selectedColumns.value,
    columnKey
  ];


  selectedColumns.value =
    availableColumns
      .filter(
        column =>
          newSelectedColumns.includes(
            column.key
          )
      )
      .map(
        column =>
          column.key
      );

};


// =========================
// Visible Columns
// =========================

const visibleColumns =
  computed(() => {

    const groupKeys =
      groupingColumns.value;


    if (
      groupBy.value
    ) {

      const groupColumns =
        groupKeys
          .map(
            key =>
              availableColumns.find(
                column =>
                  column.key === key
              )
          )
          .filter(Boolean);


      const otherColumns =
        availableColumns.filter(
          column =>
            selectedColumns.value.includes(
              column.key
            ) &&
            !groupKeys.includes(
              column.key
            )
        );


      return [
        ...groupColumns,
        ...otherColumns,
        {
          key: "totalAmount",
          label: "Total Amount"
        }
      ];

    }


    return availableColumns.filter(
      column =>
        selectedColumns.value.includes(
          column.key
        )
    );

  });


// =========================
// Table Column Count
// =========================

const tableColumnCount =
  computed(() => {

    return visibleColumns.value.length;

  });


// =========================
// Reset Columns
// =========================

const resetColumns = () => {

  selectedColumns.value =
    getDefaultColumns();

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
// Get Contributed To
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
// Get Collection Types
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
// Destroy DataTable
// =========================

const destroyDataTable = () => {

  if (
    dataTable
  ) {

    try {

      dataTable.destroy();

    } catch (error) {

      console.warn(
        "DataTable destroy warning:",
        error
      );

    }


    dataTable =
      null;

  }

};


// =========================
// DataTable Ordering
// =========================

const getDataTableOrder = () => {

  const dateIndex =
    visibleColumns.value.findIndex(
      column =>
        column.key === "date"
    );


  if (
    dateIndex >= 0
  ) {

    return [
      [
        dateIndex,
        "desc"
      ]
    ];

  }


  return [];

};


// =========================
// Initialize DataTable
// =========================

const initializeDataTable =
  async () => {

    await nextTick();


    if (
      !reportTable.value
    ) {

      return;

    }


    destroyDataTable();


    dataTable =
      new DataTable(
        reportTable.value,
        {

          pageLength:
            10,

          lengthMenu: [
            [10, 25, 50, 100, -1],
            [10, 25, 50, 100, "All"]
          ],

          searching:
            true,

          ordering:
            true,

          info:
            true,

          paging:
            true,

          autoWidth:
            false,

          order:
            getDataTableOrder(),

          language: {

            search:
              "Search:",

            searchPlaceholder:
              "Search report...",

            lengthMenu:
              "Show _MENU_ entries",

            info:
              "Showing _START_ to _END_ of _TOTAL_ entries",

            infoEmpty:
              "Showing 0 to 0 of 0 entries",

            zeroRecords:
              "No matching contributions found",

            emptyTable:
              "No contributions found",

            paginate: {

              first:
                "First",

              last:
                "Last",

              next:
                "Next",

              previous:
                "Previous"

            }

          }

        }
      );

  };


// =========================
// Rebuild DataTable
// =========================

const rebuildDataTable =
  async () => {

    /*
      1. Remove the table from Vue's DOM.
    */

    tableReady.value =
      false;


    /*
      2. Destroy DataTables while
         the old table still exists.
    */

    destroyDataTable();


    /*
      3. Let Vue remove the old table.
    */

    await nextTick();


    /*
      4. Force a completely new table
         instance.
    */

    tableRenderKey.value++;


    /*
      5. Put a fresh table into the DOM.
    */

    tableReady.value =
      true;


    /*
      6. Let Vue render the new table.
    */

    await nextTick();


    /*
      7. Initialize DataTables on
         the new table.
    */

    await initializeDataTable();

  };


// =========================
// Create Report
// =========================

const createReport =
  async () => {

    errorMessage.value =
      "";


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


    // =========================
    // Find Contributor
    // =========================

    let contributorName;


    if (
      name.value.trim()
    ) {

      const search =
        name.value
          .trim()
          .toLowerCase();


      const selectedUser =
        users.value.find(
          user => {

            const label =
              getUserLabel(
                user
              ).toLowerCase();


            return (
              label === search ||
              user.fullName
                ?.toLowerCase() === search ||
              user._id === name.value
            );

          }
        );


      if (
        !selectedUser
      ) {

        notyf.error(
          "Please select a valid contributor."
        );

        return;

      }


      contributorName =
        selectedUser.fullName;

    }


    isLoading.value =
      true;


    /*
      Do NOT destroy DataTables here.

      We only rebuild it after the API request
      succeeds.
    */

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
              contributorName ||
              undefined,

            collectionType:
              collectionType.value.trim() ||
              undefined,

            contributedTo:
              contributedTo.value.trim() ||
              undefined,

            groupBy:
              groupBy.value ||
              undefined

          }
        );


      /*
        Axios already parses JSON.

        Therefore DO NOT do:

        response.json()

        here.
      */

      if (
        !response ||
        !response.data
      ) {

        throw new Error(
          "The server returned an empty response."
        );

      }


      report.value =
        response.data;


      /*
        Set the default columns for
        the newly generated report.
      */

      rebuildingReport.value =
        true;


      resetColumns();


      reportGenerated.value =
        true;


      /*
        Fresh table.
      */

      await rebuildDataTable();


      rebuildingReport.value =
        false;


      notyf.success(
        "Report generated successfully."
      );

    } catch (error) {

      console.error(
        "Unable to generate report:",
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


      /*
        Axios errors can contain the backend's
        actual message here.
      */

      const serverMessage =
        error.response?.data?.message;


      errorMessage.value =
        serverMessage ||
        error.message ||
        "Unable to generate report.";


      notyf.error(
        errorMessage.value
      );


    } finally {

      rebuildingReport.value =
        false;

      isLoading.value =
        false;

    }

  };


// =========================
// Report Contributions
// =========================

const reportContributions =
  computed(() => {

    if (
      !report.value ||
      !Array.isArray(
        report.value.contributions
      )
    ) {

      return [];

    }


    return report.value.contributions;

  });


// =========================
// Philippine Date Key
// =========================

const getPhilippineDateKey = (
  date
) => {

  if (!date) {

    return "";

  }


  return new Intl.DateTimeFormat(
    "en-CA",
    {

      timeZone:
        "Asia/Manila",

      year:
        "numeric",

      month:
        "2-digit",

      day:
        "2-digit"

    }
  ).format(
    new Date(date)
  );

};


// =========================
// Grouped Contributions
// =========================

const groupedContributions =
  computed(() => {

    const contributions =
      reportContributions.value;


    if (
      !groupBy.value ||
      contributions.length === 0
    ) {

      return [];

    }


    const groups =
      new Map();


    contributions.forEach(
      contribution => {

        let key =
          "";

        let groupLabel =
          "";

        let user =
          null;

        let date =
          null;


        // =========================
        // USER
        // =========================

        if (
          groupBy.value === "user"
        ) {

          const userId =
            contribution.user?._id ||
            contribution.user?.userId ||
            contribution.user?.fullName ||
            "unknown-user";


          key =
            String(userId);


          groupLabel =
            contribution.user?.fullName ||
            "Unknown User";


          user =
            contribution.user ||
            null;

        }


        // =========================
        // CONTRIBUTED TO
        // =========================

        else if (
          groupBy.value ===
          "contributedTo"
        ) {

          groupLabel =
            contribution.contributedTo ||
            "Unknown";


          key =
            groupLabel
              .trim()
              .toLowerCase();

        }


        // =========================
        // COLLECTION TYPE
        // =========================

        else if (
          groupBy.value ===
          "collectionType"
        ) {

          groupLabel =
            contribution.collectionType ||
            "Unknown";


          key =
            groupLabel
              .trim()
              .toLowerCase();

        }


        // =========================
        // DATE + USER
        // =========================

        else if (
          groupBy.value ===
          "date-user"
        ) {

          const dateKey =
            getPhilippineDateKey(
              contribution.date
            );


          const userId =
            contribution.user?._id ||
            contribution.user?.userId ||
            contribution.user?.fullName ||
            "unknown-user";


          key =
            `${dateKey}-${userId}`;


          groupLabel =
            contribution.user?.fullName ||
            "Unknown User";


          user =
            contribution.user ||
            null;


          date =
            contribution.date;

        }


        if (
          !groups.has(key)
        ) {

          groups.set(
            key,
            {

              key,

              groupLabel,

              user,

              date,

              contributions:
                [],

              totalAmount:
                0

            }
          );

        }


        const group =
          groups.get(
            key
          );


        group.contributions.push(
          contribution
        );


        group.totalAmount +=
          Number(
            contribution.amount
          ) || 0;


        if (
          !group.date &&
          contribution.date
        ) {

          group.date =
            contribution.date;

        }

      }
    );


    const result =
      Array.from(
        groups.values()
      );


    if (
      groupBy.value ===
      "date-user"
    ) {

      result.sort(
        (a, b) => {

          const dateA =
            new Date(
              a.date || 0
            ).getTime();


          const dateB =
            new Date(
              b.date || 0
            ).getTime();


          if (
            dateA !== dateB
          ) {

            return dateB - dateA;

          }


          return (
            a.groupLabel || ""
          ).localeCompare(
            b.groupLabel || ""
          );

        }
      );

    } else {

      result.sort(
        (a, b) => {

          return (
            a.groupLabel || ""
          ).localeCompare(
            b.groupLabel || ""
          );

        }
      );

    }


    return result;

  });


// =========================
// Report Rows
// =========================

const reportRows =
  computed(() => {

    if (
      !report.value
    ) {

      return [];

    }


    if (
      !groupBy.value
    ) {

      return reportContributions.value;

    }


    return groupedContributions.value;

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
// Cell Order
// =========================

const getCellOrder = (
  item,
  columnKey
) => {

  if (
    columnKey === "date"
  ) {

    return item.date || "";

  }


  if (
    columnKey === "amount"
  ) {

    return Number(
      item.amount
    ) || 0;

  }


  if (
    columnKey === "contributor"
  ) {

    return (
      item.user?.fullName ||
      ""
    );

  }


  if (
    columnKey === "contributedTo"
  ) {

    return (
      item.contributedTo ||
      ""
    );

  }


  if (
    columnKey === "collectionType"
  ) {

    return (
      item.collectionType ||
      ""
    );

  }


  if (
    columnKey === "description"
  ) {

    return (
      item.description ||
      ""
    );

  }


  return "";

};


// =========================
// Group Cell Order
// =========================

const getGroupCellOrder = (
  item,
  columnKey
) => {

  if (
    columnKey === "date"
  ) {

    return item.date || "";

  }


  if (
    columnKey === "contributor"
  ) {

    return (
      item.user?.fullName ||
      item.groupLabel ||
      ""
    );

  }


  if (
    columnKey === "amount"
  ) {

    return Number(
      item.totalAmount
    ) || 0;

  }


  if (
    columnKey === "totalAmount"
  ) {

    return Number(
      item.totalAmount
    ) || 0;

  }


  return (
    item.groupLabel ||
    ""
  );

};


// =========================
// Format Date
// =========================

const formatDate = (
  date
) => {

  if (!date) {

    return "";

  }


  const parsedDate =
    new Date(date);


  if (
    isNaN(
      parsedDate.getTime()
    )
  ) {

    return "";

  }


  return parsedDate.toLocaleDateString(
    "en-PH",
    {

      timeZone:
        "Asia/Manila",

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
    amount || 0
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
// Watch Table Configuration
// =========================


// =========================
// Export Report to Excel
// =========================

const exportToExcel = () => {

  if (
    !report.value ||
    reportRows.value.length === 0
  ) {

    notyf.error(
      "There is no report data to export."
    );

    return;

  }


  const rows = [];


  // =========================
  // Report Title
  // =========================

  rows.push([
    "CONTRIBUTION REPORT"
  ]);


  // =========================
  // Date Range
  // =========================

  rows.push([
    "Date Range",
    `${startDate.value} → ${endDate.value}`
  ]);


  // =========================
  // Filters
  // =========================

  const filters = [];

  if (name.value.trim()) {
    filters.push(
      `Contributor: ${name.value.trim()}`
    );
  }

  if (contributedTo.value.trim()) {
    filters.push(
      `Contributed To: ${contributedTo.value.trim()}`
    );
  }

  if (collectionType.value.trim()) {
    filters.push(
      `Collection Type: ${collectionType.value.trim()}`
    );
  }

  if (groupBy.value) {
    filters.push(
      `Group By: ${
        groupBy.value === "date-user"
          ? "Date + User"
          : groupBy.value
      }`
    );
  }


  if (filters.length > 0) {

    rows.push([
      "Filters",
      filters.join(" | ")
    ]);

  }


  rows.push([]);


  // =========================
  // Headers
  // =========================

  const headers =
    visibleColumns.value.map(
      column =>
        column.label
    );

  rows.push(headers);


  // =========================
  // Cell Value
  // =========================

  const getExportValue = (
    item,
    columnKey
  ) => {

    // DATE

    if (
      columnKey === "date"
    ) {

      return formatDate(
        item.date
      );

    }


    // CONTRIBUTOR

    if (
      columnKey === "contributor"
    ) {

      return (
        item.user?.fullName ||
        item.groupLabel ||
        "Unknown User"
      );

    }


    // CONTRIBUTED TO

    if (
      columnKey === "contributedTo"
    ) {

      return (
        item.contributedTo ||
        item.groupLabel ||
        ""
      );

    }


    // COLLECTION TYPE

    if (
      columnKey === "collectionType"
    ) {

      return (
        item.collectionType ||
        item.groupLabel ||
        ""
      );

    }


    // DESCRIPTION

    if (
      columnKey === "description"
    ) {

      return (
        item.description ||
        ""
      );

    }


    // AMOUNT

    if (
      columnKey === "amount"
    ) {

      return Number(
        item.amount
      ) || 0;

    }


    // TOTAL AMOUNT

    if (
      columnKey === "totalAmount"
    ) {

      return Number(
        item.totalAmount
      ) || 0;

    }


    return "";

  };


  // =========================
  // Rows
  // =========================

  reportRows.value.forEach(
    item => {

      const row = [];


      visibleColumns.value.forEach(
        column => {

          /*
            For grouped reports, normal detail
            columns can contain multiple contributions.
          */

          if (
            groupBy.value &&
            !isGroupingColumn(
              column.key
            ) &&
            column.key !== "totalAmount"
          ) {

            const values =
              (item.contributions || [])
                .map(
                  contribution =>
                    getExportValue(
                      contribution,
                      column.key
                    )
                )
                .filter(
                  value =>
                    value !== ""
                );


            row.push(
              values.join("\n")
            );

          } else {

            row.push(
              getExportValue(
                item,
                column.key
              )
            );

          }

        }
      );


      rows.push(row);

    }
  );


  // =========================
  // Grand Total
  // =========================

  const grandTotalRow =
    new Array(
      visibleColumns.value.length
    ).fill("");


  if (
    visibleColumns.value.length === 1
  ) {

    grandTotalRow[0] =
      reportTotal.value;

  } else {

    grandTotalRow[
      visibleColumns.value.length - 2
    ] =
      "GRAND TOTAL";

    grandTotalRow[
      visibleColumns.value.length - 1
    ] =
      reportTotal.value;

  }


  rows.push([]);

  rows.push(
    grandTotalRow
  );


  // =========================
  // Create Worksheet
  // =========================

  const worksheet =
    XLSX.utils.aoa_to_sheet(
      rows
    );


  // =========================
  // Column Width
  // =========================

  const columnCount =
    visibleColumns.value.length;

  const columnWidths = [];


  for (
    let colIndex = 0;
    colIndex < columnCount;
    colIndex++
  ) {

    let maxLength = 0;


    rows.forEach(
      row => {

        const value =
          row[colIndex] !== undefined &&
          row[colIndex] !== null
            ? String(
                row[colIndex]
              )
            : "";


        const longestLine =
          value
            .split("\n")
            .reduce(
              (
                longest,
                line
              ) =>
                Math.max(
                  longest,
                  line.length
                ),
              0
            );


        maxLength =
          Math.max(
            maxLength,
            longestLine
          );

      }
    );


    columnWidths.push({
      wch: Math.min(
        Math.max(
          maxLength + 2,
          12
        ),
        40
      )
    });

  }


  worksheet["!cols"] =
    columnWidths;


  // =========================
  // Format Amount Columns
  // =========================

  visibleColumns.value.forEach(
    (
      column,
      columnIndex
    ) => {

      if (
        column.key !== "amount" &&
        column.key !== "totalAmount"
      ) {

        return;

      }


      for (
        let rowIndex = 4;
        rowIndex < rows.length;
        rowIndex++
      ) {

        const cellAddress =
          XLSX.utils.encode_cell({
            r: rowIndex,
            c: columnIndex
          });


        if (
          worksheet[cellAddress] &&
          typeof worksheet[cellAddress].v ===
            "number"
        ) {

          worksheet[cellAddress].z =
            '₱#,##0.00';

        }

      }

    }
  );


  // =========================
  // Workbook
  // =========================

  const workbook =
    XLSX.utils.book_new();


  XLSX.utils.book_append_sheet(
    workbook,
    worksheet,
    "Contribution Report"
  );


  // =========================
  // Filename
  // =========================

  const filename =
    `Contribution-Report-${startDate.value}-to-${endDate.value}.xlsx`;


  XLSX.writeFile(
    workbook,
    filename
  );


  notyf.success(
    "Report exported to Excel."
  );

};


watch(
  [
    selectedColumns,
    groupBy
  ],
  async () => {

    if (
      !reportGenerated.value
    ) {

      return;

    }


    /*
      createReport() already rebuilds the table
      after generating a new report.

      This prevents the resetColumns() operation
      from causing a second rebuild.
    */

    if (
      rebuildingReport.value
    ) {

      return;

    }


    await rebuildDataTable();

  },
  {
    deep: true
  }
);


// =========================
// Mounted
// =========================

onMounted(() => {

  if (
    !checkAuthentication()
  ) {

    return;

  }


  getUsers();

  getContributedToOptions();

  getCollectionTypeOptions();

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


.form-control,
.form-select {

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


.form-control:focus,
.form-select:focus {

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
   Column Selector
========================= */

.column-option {

  padding:
    9px 12px;

  background:
    #f5f7f9;

  border:
    1px solid #edf1f4;

  border-radius:
    7px;

  transition:
    background 0.2s ease,
    border-color 0.2s ease;

}


.column-option:hover {

  background:
    #eef3f7;

  border-color:
    #dce3e9;

}


.column-option
.form-check-input {

  cursor:
    pointer;

}


.column-option
.form-check-input:checked {

  background-color:
    #1e5a8a;

  border-color:
    #1e5a8a;

}


.column-option
.form-check-input:disabled {

  opacity:
    0.75;

}


.column-option
.form-check-label {

  color:
    #34495e;

  font-weight:
    600;

  cursor:
    pointer;

}


.column-disabled {

  background:
    #f1f3f5;

}


.column-disabled
.form-check-label {

  cursor:
    default;

}


.column-help {

  padding:
    10px 14px;

  color:
    #6b7c8f;

  background:
    #f5f7f9;

  border:
    1px solid #edf1f4;

  border-radius:
    7px;

  font-size:
    13px;

}


/* =========================
   DataTable
========================= */

:deep(.dataTables_wrapper) {

  padding:
    4px 0 0;

}


:deep(.dataTables_wrapper .dt-search) {

  margin-bottom:
    15px;

}


:deep(.dataTables_wrapper .dt-search label) {

  color:
    #34495e;

  font-weight:
    600;

}


:deep(.dataTables_wrapper .dt-search input) {

  margin-left:
    8px;

  padding:
    8px 12px;

  color:
    #263238;

  background:
    #ffffff;

  border:
    1px solid #cbd5df;

  border-radius:
    7px;

}


:deep(.dataTables_wrapper .dt-search input:focus) {

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


:deep(.dataTables_wrapper .dt-length) {

  margin-bottom:
    15px;

}


:deep(.dataTables_wrapper .dt-length label) {

  color:
    #34495e;

  font-weight:
    600;

}


:deep(.dataTables_wrapper .dt-length select) {

  margin:
    0 5px;

  padding:
    6px 30px 6px 10px;

  color:
    #263238;

  border:
    1px solid #cbd5df;

  border-radius:
    7px;

}


:deep(.dataTables_wrapper .dt-info) {

  padding-top:
    15px;

  color:
    #6b7c8f;

  font-size:
    14px;

}


:deep(.dataTables_wrapper .dt-paging) {

  padding-top:
    12px;

}


:deep(.dataTables_wrapper .dt-paging .pagination) {

  margin:
    0;

}


:deep(.dataTables_wrapper .dt-paging .page-link) {

  color:
    #1e5a8a;

  border-color:
    #dce3e9;

}


:deep(.dataTables_wrapper .dt-paging .page-link:hover) {

  color:
    #1e3a5f;

  background:
    #eef3f7;

}


:deep(.dataTables_wrapper .dt-paging .active .page-link) {

  color:
    #ffffff;

  background:
    #1e5a8a;

  border-color:
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
   DataTable Sorting
========================= */

.table thead th.dt-orderable-asc,
.table thead th.dt-orderable-desc {

  cursor:
    pointer;

}


.table thead th.dt-ordering-asc,
.table thead th.dt-ordering-desc {

  color:
    #1e5a8a;

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


  :deep(.dataTables_wrapper .dt-search input) {

    width:
      100%;

    margin:
      8px 0 0;

  }


  :deep(.dataTables_wrapper .dt-search) {

    width:
      100%;

  }


  .table {

    min-width:
      850px;

  }

}

</style>