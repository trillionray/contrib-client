
<template>

  <div class="contribution-page">

    <div class="container">

      <!-- Header -->
      <div class="d-flex justify-content-between align-items-center mb-4">

        <div>

          <h2 class="fw-bold mb-1">
            Ledger Report Template
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

          <!-- Report -->
          <router-link
            to="/contributions/report"
            class="btn btn-danger"
          >
            Report
          </router-link>

          <!-- Add Contribution -->
          <router-link
            to="/contributions/add"
            class="btn btn-danger"
          >
            Add Contribution
          </router-link>

          <!-- Export Excel -->
          <button
            type="button"
            class="btn btn-success"
            @click="exportToExcel"
          >
            <i class="bi bi-file-earmark-excel me-1"></i>
            Export Excel
          </button>

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


  if (
    !contributionTable.value
  ) {

    return;

  }


  if (dataTable) {

    dataTable.destroy();

    dataTable =
      null;

  }


  dataTable =
    new DataTable(
      contributionTable.value,
      {

        order: [
          [
            1,
            "desc"
          ]
        ],

        pageLength:
          10,

        lengthMenu: [

          [
            10,
            25,
            50,
            100
          ],

          [
            "10",
            "25",
            "50",
            "100"
          ]

        ],

        columnDefs: [

          {
            targets:
              6,

            orderable:
              false,

            searchable:
              false
          }

        ],

        language: {

          search:
            "Search:",

          lengthMenu:
            "Show _MENU_ entries",

          info:
            "Showing _START_ to _END_ of _TOTAL_ contributions",

          infoEmpty:
            "No contributions found",

          zeroRecords:
            "No matching contributions found",

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
// Destroy DataTable
// =========================

const destroyDataTable = () => {

  if (dataTable) {

    dataTable.destroy();

    dataTable =
      null;

  }

};


// =========================
// Get All Contributions
// =========================

const getContributions = async () => {

  isLoading.value =
    true;

  errorMessage.value =
    "";


  try {

    const response =
      await api.get(
        "/contributions"
      );


    console.log(
      response
    );


    contributions.value =
      response.data;


  } catch (error) {

    console.error(
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
      "Unable to load contributions.";


    notyf.error(
      errorMessage.value
    );

  } finally {

    isLoading.value =
      false;

  }

};


// =========================
// Archive Contribution
// =========================

const archiveContribution = async (
  contributionId
) => {

  if (!contributionId) {

    notyf.error(
      "Contribution ID is missing."
    );

    return;

  }


  const confirmed =
    window.confirm(
      "Are you sure you want to archive this contribution?"
    );


  if (!confirmed) {

    return;

  }


  try {

    destroyDataTable();


    await api.delete(
      `/contributions/${contributionId}`
    );


    notyf.success(
      "Contribution archived successfully."
    );


    contributions.value =
      contributions.value.filter(
        contribution =>
          contribution._id !==
          contributionId
      );


  } catch (error) {

    console.error(
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


    notyf.error(
      error.response?.data?.message ||
      "Unable to archive contribution."
    );


    await initializeDataTable();

  }

};


// =========================
// Group Contributions
// =========================

const groupedContributions =
  computed(() => {

    const groups = {};


    contributions.value.forEach(
      item => {

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


        const key =
          `${item.user._id}-${dateKey}`;


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


        groups[key]
          .contributions
          .push({

            _id:
              item._id,

            crNumber:
              item.crNumber,

            numberOfParticipants:
              Number(
                item.numberOfParticipants
              ) || 1,

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


        groups[key]
          .totalAmount +=
          Number(
            item.amount
          ) || 0;

      }
    );


    return Object.values(
      groups
    ).sort(
      (a, b) =>
        new Date(
          b.date
        ) -
        new Date(
          a.date
        )
    );

  });


const exportToExcel = async () => {

  // =========================================================
  // PREPARE DATA
  // =========================================================

  const data = [];

  groupedContributions.value.forEach(
    item => {

      const groupTotal =
        Number(item.totalAmount) || 0;

      item.contributions.forEach(
        contribution => {

          data.push({

            "CR #":
              contribution.crNumber ||
              "",

            "Date":
              item.date,

            "Contributor":
              item.fullName ||
              "",

            "User ID":
              item.userId ||
              "",

            "Contributed To":
              contribution.contributedTo ||
              "",

            "Collection Type":
              contribution.collectionType ||
              "",

            "Description":
              contribution.description ||
              "",

            "Participants":
              Number(
                contribution.numberOfParticipants
              ) || 1,

            "Amount":
              Number(
                contribution.amount
              ) || 0,

            "Total":
              groupTotal

          });

        }
      );

    }
  );


  if (data.length === 0) {

    notyf.error(
      "No contributions available to export."
    );

    return;

  }


  // =========================================================
  // WORKBOOK
  // =========================================================

  const workbook =
    new ExcelJS.Workbook();


  workbook.calcProperties.fullCalcOnLoad =
    true;

  workbook.calcProperties.forceFullCalc =
    true;

  workbook.calcProperties.calcMode =
    "auto";


  // =========================================================
  // IN RECORDS
  // =========================================================

  const inRecordsSheet =
    workbook.addWorksheet(
      "In Records"
    );


  inRecordsSheet.columns = [

    {
      header: "CR #",
      key: "crNumber",
      width: 15
    },

    {
      header: "Date",
      key: "date",
      width: 18
    },

    {
      header: "Contributor",
      key: "contributor",
      width: 30
    },

    {
      header: "User ID",
      key: "userId",
      width: 15
    },

    {
      header: "Contributed To",
      key: "contributedTo",
      width: 25
    },

    {
      header: "Collection Type",
      key: "collectionType",
      width: 20
    },

    {
      header: "Description",
      key: "description",
      width: 45
    },

    {
      header: "Participants",
      key: "participants",
      width: 15
    },

    {
      header: "Amount",
      key: "amount",
      width: 15
    },

    {
      header: "Total",
      key: "total",
      width: 15
    }

  ];


  // =========================================================
  // ADD IN RECORDS
  // =========================================================

  data.forEach(
    record => {

      inRecordsSheet.addRow({

        crNumber:
          record["CR #"],

        date:
          record["Date"]
            ? new Date(record["Date"])
            : "",

        contributor:
          record["Contributor"],

        userId:
          record["User ID"],

        contributedTo:
          record["Contributed To"],

        collectionType:
          record["Collection Type"],

        description:
          record["Description"],

        participants:
          record["Participants"],

        amount:
          record["Amount"],

        total:
          record["Total"]

      });

    }
  );


  // =========================================================
  // FORMAT IN RECORDS
  // =========================================================

  const inHeader =
    inRecordsSheet.getRow(1);


  inHeader.font = {
    bold: true
  };


  inHeader.alignment = {

    vertical: "middle",

    horizontal: "center"

  };


  inHeader.height =
    22;


  inRecordsSheet
    .getColumn("date")
    .numFmt =
    "mmm d, yyyy";


  inRecordsSheet
    .getColumn("amount")
    .numFmt =
    "₱#,##0.00";


  inRecordsSheet
    .getColumn("total")
    .numFmt =
    "₱#,##0.00";


  inRecordsSheet.autoFilter = {

    from: "A1",

    to: "J1"

  };


  // =========================================================
  // GET UNIQUE CR NUMBERS
  // =========================================================

  const crNumbers = [

    ...new Set(

      data
        .map(
          record =>
            String(
              record["CR #"] || ""
            ).trim()
        )
        .filter(
          value =>
            value !== ""
        )

    )

  ];


  // =========================================================
  // CREATE HIDDEN LISTS SHEET
  // =========================================================

  const listsSheet =
    workbook.addWorksheet(
      "Lists"
    );


  listsSheet.state =
    "hidden";


  // =========================================================
  // LISTS STRUCTURE
  //
  // A = CR #
  // B = ContributedTo
  //
  // D = CR Numbers
  //
  // =========================================================

  listsSheet.getCell(
    "A1"
  ).value =
    "CR #";


  listsSheet.getCell(
    "B1"
  ).value =
    "ContributedTo";


  listsSheet.getCell(
    "D1"
  ).value =
    "CR Numbers";


  // =========================================================
  // BUILD CONTRIBUTION MAP
  // =========================================================

  const contributedByCR =
    {};


  data.forEach(
    record => {

      const crNumber =
        String(
          record["CR #"] || ""
        ).trim();


      const contributedTo =
        String(
          record["Contributed To"] || ""
        ).trim();


      if (
        !crNumber ||
        !contributedTo
      ) {

        return;

      }


      if (
        !contributedByCR[
          crNumber
        ]
      ) {

        contributedByCR[
          crNumber
        ] = [];

      }


      if (
        !contributedByCR[
          crNumber
        ].includes(
          contributedTo
        )
      ) {

        contributedByCR[
          crNumber
        ].push(
          contributedTo
        );

      }

    }
  );


  // =========================================================
  // WRITE CR NUMBERS
  // =========================================================

  crNumbers.forEach(
    (
      crNumber,
      index
    ) => {

      listsSheet.getCell(
        `D${index + 2}`
      ).value =
        crNumber;

    }
  );


  // =========================================================
  // WRITE CONTRIBUTED TO VALUES
  // =========================================================

  let listRow =
    2;


  const crRanges =
    {};


  crNumbers.forEach(
    crNumber => {

      const options =
        contributedByCR[
          crNumber
        ] || [];


      if (
        options.length === 0
      ) {

        return;

      }


      const firstRow =
        listRow;


      options.forEach(
        contributedTo => {

          listsSheet.getCell(
            `A${listRow}`
          ).value =
            crNumber;


          listsSheet.getCell(
            `B${listRow}`
          ).value =
            contributedTo;


          listRow++;

        }
      );


      const lastRow =
        listRow - 1;


      crRanges[
        crNumber
      ] = {

        firstRow,

        lastRow

      };

    }
  );


  listsSheet.getColumn(
    "A"
  ).width =
    20;


  listsSheet.getColumn(
    "B"
  ).width =
    30;


  listsSheet.getColumn(
    "D"
  ).width =
    20;


  // =========================================================
  // CREATE NAMED RANGE FOR EACH CR
  //
  // IMPORTANT:
  //
  // ExcelJS syntax is:
  //
  // workbook.definedNames.add(
  //   RANGE,
  //   NAME
  // );
  //
  // NOT:
  //
  // workbook.definedNames.add(
  //   NAME,
  //   RANGE
  // );
  // =========================================================

  crNumbers.forEach(
    crNumber => {

      const range =
        crRanges[
          crNumber
        ];


      if (!range) {

        return;

      }


      // Convert CR number into
      // a valid Excel defined name.
      //
      // Example:
      //
      // CR-001
      //
      // becomes:
      //
      // CR_CR_001

      const safeName =
        `CR_${String(
          crNumber
        )
          .replace(
            /[^A-Za-z0-9_]/g,
            "_"
          )}`;


      const rangeAddress =
        `Lists!$B$${range.firstRow}:$B$${range.lastRow}`;


      // CORRECT ARGUMENT ORDER
      workbook.definedNames.add(
        rangeAddress,
        safeName
      );

    }
  );


  // =========================================================
  // CREATE NAMED RANGE FOR CR DROPDOWN
  // =========================================================

  if (
    crNumbers.length > 0
  ) {

    const crListRange =
      `Lists!$D$2:$D$${crNumbers.length + 1}`;


    workbook.definedNames.add(
      crListRange,
      "CR_Number_List"
    );

  }


  // =========================================================
  // LEDGER
  // =========================================================

  const ledgerSheet =
    workbook.addWorksheet(
      "Ledger"
    );


  ledgerSheet.columns = [

    {
      header: "Date",
      key: "date",
      width: 18
    },

    {
      header: "CR #",
      key: "crNumber",
      width: 15
    },

    {
      header: "ContributedTo",
      key: "contributedTo",
      width: 25
    },

    {
      header: "IN",
      key: "in",
      width: 15
    },

    {
      header: "Particular",
      key: "particular",
      width: 35
    },

    {
      header: "OUT",
      key: "out",
      width: 15
    },

    {
      header: "Balance",
      key: "balance",
      width: 18
    }

  ];


  // =========================================================
  // LEDGER HEADER
  // =========================================================

  const ledgerHeader =
    ledgerSheet.getRow(1);


  ledgerHeader.font = {
    bold: true
  };


  ledgerHeader.alignment = {

    vertical: "middle",

    horizontal: "center"

  };


  ledgerHeader.height =
    22;


  // =========================================================
  // LEDGER ROWS
  // =========================================================

  const ledgerRows =
    100;


  const lastRecordRow =
    data.length + 1;


  for (
    let rowNumber = 2;
    rowNumber <=
      ledgerRows + 1;
    rowNumber++
  ) {

    // =======================================================
    // CR # DROPDOWN
    // =======================================================

    if (
      crNumbers.length > 0
    ) {

      ledgerSheet
        .getCell(
          `B${rowNumber}`
        )
        .dataValidation = {

          type:
            "list",

          allowBlank:
            true,

          formulae: [
            "CR_Number_List"
          ],

          showErrorMessage:
            true,

          errorTitle:
            "Invalid CR #",

          error:
            "Please select a CR # from the dropdown."

        };

    }


    // =======================================================
    // CONTRIBUTED TO DROPDOWN
    //
    // Depends on CR #
    // =======================================================

    ledgerSheet
      .getCell(
        `C${rowNumber}`
      )
      .dataValidation = {

        type:
          "list",

        allowBlank:
          true,

        formulae: [

          `INDIRECT("CR_"&SUBSTITUTE(SUBSTITUTE(SUBSTITUTE(B${rowNumber},"-","_")," ","_"),"/","_"))`

        ],

        showErrorMessage:
          true,

        errorTitle:
          "Invalid Contribution",

        error:
          "Please select a ContributedTo value belonging to the selected CR #."

      };


    // =======================================================
    // DATE
    // =======================================================

    ledgerSheet
      .getCell(
        `A${rowNumber}`
      )
      .value = {

        formula:

          `IF(` +

          `B${rowNumber}=""` +

          `,""` +

          `,IFERROR(` +

          `INDEX(` +

          `'In Records'!$B$2:$B$${lastRecordRow}` +

          `,MATCH(` +

          `B${rowNumber}` +

          `,'In Records'!$A$2:$A$${lastRecordRow}` +

          `,0)` +

          `)` +

          `,"")` +

          `)`

      };


    // =======================================================
    // IN
    // =======================================================

    ledgerSheet
      .getCell(
        `D${rowNumber}`
      )
      .value = {

        formula:

          `IF(` +

          `OR(` +

          `B${rowNumber}=""` +

          `,C${rowNumber}=""` +

          `)` +

          `,""` +

          `,SUMIFS(` +

          `'In Records'!$I$2:$I$${lastRecordRow}` +

          `,'In Records'!$A$2:$A$${lastRecordRow}` +

          `,B${rowNumber}` +

          `,'In Records'!$E$2:$E$${lastRecordRow}` +

          `,C${rowNumber}` +

          `)` +

          `)`

      };


    // =======================================================
    // BALANCE
    // =======================================================

    if (
      rowNumber === 2
    ) {

      ledgerSheet
        .getCell(
          `G${rowNumber}`
        )
        .value = {

          formula:

            `IF(` +

            `COUNTA(` +

            `A${rowNumber}:F${rowNumber}` +

            `)=0` +

            `,""` +

            `,N(D${rowNumber})` +

            `-N(F${rowNumber})` +

            `)`

        };

    } else {

      ledgerSheet
        .getCell(
          `G${rowNumber}`
        )
        .value = {

          formula:

            `IF(` +

            `COUNTA(` +

            `A${rowNumber}:F${rowNumber}` +

            `)=0` +

            `,""` +

            `,N(G${rowNumber - 1})` +

            `+N(D${rowNumber})` +

            `-N(F${rowNumber})` +

            `)`

        };

    }

  }


  // =========================================================
  // FORMATTING
  // =========================================================

  ledgerSheet
    .getColumn("date")
    .numFmt =
    "mmm d, yyyy";


  ledgerSheet
    .getColumn("in")
    .numFmt =
    "₱#,##0.00";


  ledgerSheet
    .getColumn("out")
    .numFmt =
    "₱#,##0.00";


  ledgerSheet
    .getColumn("balance")
    .numFmt =
    "₱#,##0.00";


  ledgerSheet
    .getColumn("in")
    .alignment = {

      horizontal:
        "right"

    };


  ledgerSheet
    .getColumn("out")
    .alignment = {

      horizontal:
        "right"

    };


  ledgerSheet
    .getColumn("balance")
    .alignment = {

      horizontal:
        "right"

    };


  ledgerSheet.views = [

    {

      state:
        "frozen",

      ySplit:
        1

    }

  ];


  ledgerSheet.autoFilter = {

    from:
      "A1",

    to:
      "G1"

  };


  // =========================================================
  // EXPORT
  // =========================================================

  const today =
    new Date()
      .toISOString()
      .slice(
        0,
        10
      );


  const filename =
    `LedgerReport_${today}.xlsx`;


  try {

    const buffer =
      await workbook.xlsx.writeBuffer();


    const blob =
      new Blob(
        [
          buffer
        ],
        {

          type:
            "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"

        }
      );


    const url =
      window.URL.createObjectURL(
        blob
      );


    const link =
      document.createElement(
        "a"
      );


    link.href =
      url;


    link.download =
      filename;


    document.body.appendChild(
      link
    );


    link.click();


    document.body.removeChild(
      link
    );


    window.URL.revokeObjectURL(
      url
    );


    notyf.success(
      "Excel file exported successfully."
    );


  } catch (error) {

    console.error(
      "Excel export error:",
      error
    );


    notyf.error(
      "Unable to create Excel file."
    );

  }

};


// =========================
// Watch Grouped Data
// =========================

watch(
  groupedContributions,
  async () => {

    await initializeDataTable();

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

