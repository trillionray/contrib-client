<template>

    <!-- User Contribution Modal -->
    <div
        v-if="selectedUser"
        class="custom-modal-backdrop"
        @click.self="closeUserModal"
    >
        <div class="custom-modal">

            <div class="custom-modal-header">

                <div>
                    <h5 class="fw-bold mb-1">
                        {{ selectedUser.fullName || "Unknown User" }}
                    </h5>

                    <small class="text-muted d-block">
                        {{ selectedUser.email || "No email" }}
                    </small>

                    <small class="text-muted">
                        {{ appliedStartDate || "Beginning" }}
                        →
                        {{ appliedEndDate || "Present" }}
                    </small>
                </div>

                <button
                    type="button"
                    class="btn-close"
                    @click="closeUserModal"
                ></button>

            </div>

            <div class="custom-modal-body">

                <!-- User Summary -->
                <div class="row g-3 mb-4">

                    <div class="col-md-4">

                        <div class="info-box">

                            <small class="text-muted">
                                User ID
                            </small>

                            <div class="fw-bold">
                                {{ selectedUser.userId || "No User ID" }}
                            </div>

                        </div>

                    </div>

                    <div class="col-md-4">

                        <div class="info-box">

                            <small class="text-muted">
                                Contributions
                            </small>

                            <div class="fw-bold">
                                {{ selectedUser.contributionCount || 0 }}
                            </div>

                        </div>

                    </div>

                    <div class="col-md-4">

                        <div class="info-box">

                            <small class="text-muted">
                                Total Contribution
                            </small>

                            <div class="fw-bold text-success">
                                ₱{{
                                    formatAmount(
                                        selectedUser.totalContribution
                                    )
                                }}
                            </div>

                        </div>

                    </div>

                </div>

                <!-- Contribution History Header -->
                <div class="d-flex justify-content-between align-items-center mb-3">

                    <h6 class="fw-bold mb-0">
                        Contribution History
                    </h6>

                    <span class="badge bg-primary">
                        {{ selectedUser.contributions?.length || 0 }}
                        record(s)
                    </span>

                </div>

                <!-- No Contributions -->
                <div
                    v-if="
                        !selectedUser.contributions ||
                        selectedUser.contributions.length === 0
                    "
                    class="text-center text-muted py-5"
                >

                    <div class="fs-1 mb-2">
                        —
                    </div>

                    <div>
                        This user has no contribution records
                        for the selected date range.
                    </div>

                </div>

                <!-- Contribution Table -->
                <div
                    v-else
                    class="table-responsive"
                >

                    <table
                        class="table table-bordered table-hover align-middle"
                    >

                        <thead class="table-light">

                            <tr>

                                <th>
                                    #
                                </th>

                                <th>
                                    Date
                                </th>

                                <th>
                                    Contributed To
                                </th>

                                <th>
                                    Collection Type
                                </th>

                                <th>
                                    Description
                                </th>

                                <th class="text-end">
                                    Amount
                                </th>

                                <th>
                                    Recorded
                                </th>

                            </tr>

                        </thead>

                        <tbody>

                            <tr
                                v-for="(
                                    contribution,
                                    index
                                ) in selectedUser.contributions"
                                :key="contribution._id"
                            >

                                <td>
                                    {{ index + 1 }}
                                </td>

                                <td>
                                    {{ formatDate(contribution.date) }}
                                </td>

                                <td>
                                    <span class="fw-semibold">
                                        {{ contribution.contributedTo }}
                                    </span>
                                </td>

                                <td>
                                    {{ contribution.collectionType }}
                                </td>

                                <td>
                                    {{ contribution.description }}
                                </td>

                                <td
                                    class="text-end fw-bold text-success"
                                >
                                    ₱{{
                                        formatAmount(
                                            contribution.amount
                                        )
                                    }}
                                </td>

                                <td>
                                    {{ formatDateTime(contribution.createdAt) }}
                                </td>

                            </tr>

                        </tbody>

                        <tfoot>

                            <tr>

                                <th
                                    colspan="5"
                                    class="text-end"
                                >
                                    Total
                                </th>

                                <th
                                    class="text-end text-success"
                                >
                                    ₱{{
                                        formatAmount(
                                            selectedUser.totalContribution
                                        )
                                    }}
                                </th>

                                <th></th>

                            </tr>

                        </tfoot>

                    </table>

                </div>

            </div>

            <div class="custom-modal-footer">

                <button
                    type="button"
                    class="btn btn-secondary"
                    @click="closeUserModal"
                >
                    Close
                </button>

            </div>

        </div>
    </div>


    <!-- Main Page -->
    <!-- Main Page -->
    <div class="contribution-page">

        <div class="container">

            <!-- Header -->
            <div class="d-flex justify-content-between align-items-center mb-4">

                <div>

                    <h2 class="fw-bold mb-1">
                        Contribution Marks
                    </h2>

                    <p class="text-muted mb-0">
                        View users and their contribution records by date range
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

                </div>

            </div>


            <!-- Date Range Filter -->
            <div class="card contribution-card shadow border-0 mb-4">

                <div class="card-body">

                    <div class="row g-3 align-items-end">

                        <!-- Start Date -->
                        <div class="col-md-4">

                            <label class="form-label fw-semibold">
                                Start Date
                            </label>

                            <input
                                v-model="startDate"
                                type="date"
                                class="form-control"
                            >

                        </div>


                        <!-- End Date -->
                        <div class="col-md-4">

                            <label class="form-label fw-semibold">
                                End Date
                            </label>

                            <input
                                v-model="endDate"
                                type="date"
                                class="form-control"
                            >

                        </div>


                        <!-- Buttons -->
                        <div class="col-md-4 d-flex gap-2">

                            <button
                                type="button"
                                class="btn btn-primary"
                                :disabled="loading"
                                @click="getUsers"
                            >
                                Apply Date Range
                            </button>

                            <button
                                type="button"
                                class="btn btn-outline-secondary"
                                :disabled="loading"
                                @click="clearDateRange"
                            >
                                Clear
                            </button>

                        </div>

                    </div>


                    <!-- Applied Date Range -->
                    <div
                        v-if="appliedStartDate || appliedEndDate"
                        class="mt-3"
                    >

                        <small class="text-muted">

                            Showing contributions from

                            <strong>
                                {{ appliedStartDate || "Beginning" }}
                            </strong>

                            to

                            <strong>
                                {{ appliedEndDate || "Present" }}
                            </strong>

                        </small>

                    </div>


                    <div
                        v-else
                        class="mt-3"
                    >

                        <small class="text-muted">
                            Showing all available contribution records
                        </small>

                    </div>

                </div>

            </div>


            <!-- Summary -->
            <div class="row g-3 mb-4">

                <div class="col-md-4">

                    <div class="card summary-card shadow border-0 h-100">

                        <div class="card-body">

                            <p class="text-muted mb-1">
                                Total Users
                            </p>

                            <h3 class="fw-bold mb-0">
                                {{ users.length }}
                            </h3>

                        </div>

                    </div>

                </div>


                <div class="col-md-4">

                    <div class="card summary-card shadow border-0 h-100">

                        <div class="card-body">

                            <p class="text-muted mb-1">
                                Users With Contributions
                            </p>

                            <h3 class="fw-bold mb-0">
                                {{ usersWithContributions }}
                            </h3>

                        </div>

                    </div>

                </div>


                <div class="col-md-4">

                    <div class="card summary-card shadow border-0 h-100">

                        <div class="card-body">

                            <p class="text-muted mb-1">
                                Total Contributions
                            </p>

                            <h3 class="fw-bold mb-0">
                                {{ totalContributionCount }}
                            </h3>

                        </div>

                    </div>

                </div>

            </div>


            <!-- Loading -->
            <div
                v-if="loading"
                class="text-center py-5"
            >

                <div
                    class="spinner-border text-warning"
                    role="status"
                ></div>

                <p class="text-muted mt-3 mb-0">
                    Loading users and contributions...
                </p>

            </div>


            <!-- Error -->
            <div
                v-else-if="errorMessage"
                class="alert alert-danger"
            >
                {{ errorMessage }}
            </div>


            <!-- Users Table -->
            <!-- Users Table -->
            <div
                v-else
                class="card contribution-card shadow border-0"
            >

                <div class="card-body p-0">

                    <div class="table-responsive">

                        <table
                            ref="usersTable"
                            class="table table-hover align-middle mb-0"
                        >

                            <thead>
                                <tr>

                                    <th>
                                        User ID
                                    </th>

                                    <th>
                                        Name
                                    </th>

                                    <!-- Dynamic Contribution Columns -->
                                    <th
                                        v-for="contributedTo in contributedToColumns"
                                        :key="contributedTo"
                                        class="text-center contribution-header"
                                    >
                                        {{ contributedTo }}
                                    </th>

                                    <th class="text-end">
                                        Total
                                    </th>

                                    <th class="text-center">
                                        Details
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
                                            v-if="user.userId"
                                            class="fw-semibold"
                                        >
                                            {{ user.userId }}
                                        </span>

                                        <span
                                            v-else
                                            class="text-muted"
                                        >
                                            No User ID
                                        </span>

                                    </td>


                                    <!-- Name -->
                                    <td>

                                        <div class="fw-semibold">
                                            {{ user.fullName || "Unknown User" }}
                                        </div>

                                        <small class="text-muted">
                                            {{ user.email || "No email" }}
                                        </small>

                                    </td>


                                    <!-- Contribution Cells -->
                                    <td
                                        v-for="contributedTo in contributedToColumns"
                                        :key="`${user._id}-${contributedTo}`"
                                        class="text-center contribution-cell-wrapper"
                                    >

                                        <!-- Has Contribution -->
                                        <button
                                            v-if="
                                                hasContribution(
                                                    user,
                                                    contributedTo
                                                )
                                            "
                                            type="button"
                                            class="contribution-cell"
                                            @click="
                                                toggleContributionAmount(
                                                    user._id,
                                                    contributedTo
                                                )
                                            "
                                        >

                                            <!-- Show Amount -->
                                            <span
                                                v-if="
                                                    isAmountVisible(
                                                        user._id,
                                                        contributedTo
                                                    )
                                                "
                                            >
                                                ₱{{
                                                    formatAmount(
                                                        getContributionAmount(
                                                            user,
                                                            contributedTo
                                                        )
                                                    )
                                                }}
                                            </span>


                                            <!-- Show Check -->
                                            <span
                                                v-else
                                                class="check-icon"
                                            >
                                                ✓
                                            </span>

                                        </button>


                                        <!-- No Contribution -->
                                        <span
                                            v-else
                                            class="no-contribution"
                                        >
                                            —
                                        </span>

                                    </td>


                                    <!-- User Total -->
                                    <td class="text-end fw-bold">

                                        ₱{{
                                            formatAmount(
                                                user.totalContribution
                                            )
                                        }}

                                    </td>


                                    <!-- Details -->
                                    <td class="text-center">

                                        <button
                                            type="button"
                                            class="btn btn-sm btn-outline-primary"
                                            @click="viewUser(user)"
                                        >
                                            View
                                        </button>

                                    </td>

                                </tr>

                            </tbody>


                            <!-- Grand Total -->
                            <tfoot>

                                <tr>

                                    <th
                                        colspan="2"
                                        class="text-end"
                                    >
                                        Grand Total
                                    </th>


                                    <!-- Per Contribution Total -->
                                    <th
                                        v-for="contributedTo in contributedToColumns"
                                        :key="`total-${contributedTo}`"
                                        class="text-end"
                                    >

                                        ₱{{
                                            formatAmount(
                                                getContributedToTotal(
                                                    contributedTo
                                                )
                                            )
                                        }}

                                    </th>


                                    <!-- Overall Total -->
                                    <th class="text-end">

                                        ₱{{
                                            formatAmount(
                                                grandTotal
                                            )
                                        }}

                                    </th>


                                    <th></th>

                                </tr>

                            </tfoot>

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
	    onMounted,
	    nextTick
	} from "vue";

	import DataTable from "datatables.net-bs5";
	import "datatables.net-bs5/css/dataTables.bootstrap5.min.css";

	import api from "../api";


	// --------------------------------------------------
	// State
	// --------------------------------------------------

	const users = ref([]);

	const loading = ref(false);

	const errorMessage = ref("");


	// Date filter inputs
	const startDate = ref("");
	const endDate = ref("");


	// Last successfully applied date range
	const appliedStartDate = ref("");
	const appliedEndDate = ref("");


	// Selected user for modal
	const selectedUser = ref(null);


	// DataTable
	const usersTable = ref(null);

	let dataTable = null;


	// Contribution amount visibility
	const visibleContributionAmounts = ref(
	    new Set()
	);


	// --------------------------------------------------
	// Computed
	// --------------------------------------------------

	const usersWithContributions = computed(() => {

	    return users.value.filter(
	        user =>
	            Number(
	                user.contributionCount
	            ) > 0
	    ).length;

	});


	const totalContributionCount = computed(() => {

	    return users.value.reduce(
	        (
	            total,
	            user
	        ) => {

	            return (
	                total +
	                (
	                    Number(
	                        user.contributionCount
	                    ) || 0
	                )
	            );

	        },
	        0
	    );

	});


	const contributedToColumns = computed(() => {

	    const values = new Set();

	    users.value.forEach(
	        user => {

	            (
	                user.contributions || []
	            ).forEach(
	                contribution => {

	                    if (
	                        contribution.contributedTo &&
	                        contribution.contributedTo.trim()
	                    ) {

	                        values.add(
	                            contribution.contributedTo.trim()
	                        );

	                    }

	                }
	            );

	        }
	    );

	    return Array.from(values).sort(
	        (
	            a,
	            b
	        ) =>
	            a.localeCompare(b)
	    );

	});


	const grandTotal = computed(() => {

	    return users.value.reduce(
	        (
	            total,
	            user
	        ) => {

	            return (
	                total +
	                (
	                    Number(
	                        user.totalContribution
	                    ) || 0
	                )
	            );

	        },
	        0
	    );

	});


	// --------------------------------------------------
	// Formatting
	// --------------------------------------------------

	const formatAmount = amount => {

	    return Number(
	        amount || 0
	    ).toLocaleString(
	        "en-PH",
	        {
	            minimumFractionDigits: 2,
	            maximumFractionDigits: 2
	        }
	    );

	};


	const formatDate = date => {

	    if (!date) {
	        return "—";
	    }

	    return new Intl.DateTimeFormat(
	        "en-PH",
	        {
	            timeZone: "Asia/Manila",

	            year: "numeric",

	            month: "short",

	            day: "numeric"
	        }
	    ).format(
	        new Date(date)
	    );

	};


	const formatDateTime = date => {

	    if (!date) {
	        return "—";
	    }

	    return new Intl.DateTimeFormat(
	        "en-PH",
	        {
	            timeZone: "Asia/Manila",

	            year: "numeric",

	            month: "short",

	            day: "numeric",

	            hour: "numeric",

	            minute: "2-digit"
	        }
	    ).format(
	        new Date(date)
	    );

	};


	// --------------------------------------------------
	// Contribution Helpers
	// --------------------------------------------------

	const normalizeContributedTo = value => {

	    return (
	        value || ""
	    )
	        .trim()
	        .toLowerCase();

	};


	const hasContribution = (
	    user,
	    contributedTo
	) => {

	    return (
	        user.contributions || []
	    ).some(
	        contribution => {

	            return (
	                normalizeContributedTo(
	                    contribution.contributedTo
	                ) ===
	                normalizeContributedTo(
	                    contributedTo
	                )
	            );

	        }
	    );

	};


	const getContributionAmount = (
	    user,
	    contributedTo
	) => {

	    return (
	        user.contributions || []
	    )
	        .filter(
	            contribution => {

	                return (
	                    normalizeContributedTo(
	                        contribution.contributedTo
	                    ) ===
	                    normalizeContributedTo(
	                        contributedTo
	                    )
	                );

	            }
	        )
	        .reduce(
	            (
	                total,
	                contribution
	            ) => {

	                return (
	                    total +
	                    (
	                        Number(
	                            contribution.amount
	                        ) || 0
	                    )
	                );

	            },
	            0
	        );

	};


	const getContributionCellKey = (
	    userId,
	    contributedTo
	) => {

	    return (
	        `${userId}::${normalizeContributedTo(contributedTo)}`
	    );

	};


	const isAmountVisible = (
	    userId,
	    contributedTo
	) => {

	    return visibleContributionAmounts.value.has(
	        getContributionCellKey(
	            userId,
	            contributedTo
	        )
	    );

	};


	const toggleContributionAmount = (
	    userId,
	    contributedTo
	) => {

	    const key =
	        getContributionCellKey(
	            userId,
	            contributedTo
	        );

	    const newSet =
	        new Set(
	            visibleContributionAmounts.value
	        );

	    if (
	        newSet.has(key)
	    ) {

	        newSet.delete(key);

	    } else {

	        newSet.add(key);

	    }

	    visibleContributionAmounts.value =
	        newSet;

	};


	const getContributedToTotal = (
	    contributedTo
	) => {

	    return users.value.reduce(
	        (
	            total,
	            user
	        ) => {

	            return (
	                total +
	                getContributionAmount(
	                    user,
	                    contributedTo
	                )
	            );

	        },
	        0
	    );

	};


	// --------------------------------------------------
	// DataTable
	// --------------------------------------------------

	const destroyDataTable = () => {

	    if (dataTable) {

	        try {

	            dataTable.destroy();

	        } catch (error) {

	            console.warn(
	                "DataTable destroy warning:",
	                error
	            );

	        }

	        dataTable = null;

	    }

	};


	const initializeDataTable = async () => {

	    await nextTick();

	    // Always destroy previous instance
	    destroyDataTable();

	    if (
	        !usersTable.value ||
	        users.value.length === 0
	    ) {

	        return;

	    }

	    dataTable = new DataTable(
	        usersTable.value,
	        {

	            pageLength: 10,

	            lengthMenu: [
	                [10, 25, 50, -1],
	                [10, 25, 50, "All"]
	            ],

	            order: [
	                [1, "asc"]
	            ],

	            language: {

	                search:
	                    "Search users:",

	                lengthMenu:
	                    "Show _MENU_ users",

	                info:
	                    "Showing _START_ to _END_ of _TOTAL_ users",

	                infoEmpty:
	                    "No users available",

	                zeroRecords:
	                    "No matching users found"

	            }

	        }
	    );

	};


	// --------------------------------------------------
	// Get Users
	// --------------------------------------------------

	const getUsers = async () => {

	    // Validate date range
	    if (
	        startDate.value &&
	        endDate.value &&
	        startDate.value > endDate.value
	    ) {

	        errorMessage.value =
	            "Start date cannot be later than end date.";

	        return;

	    }


	    loading.value = true;

	    errorMessage.value = "";


	    try {

	        const params = {};


	        // Start date
	        if (startDate.value) {

	            params.startDate =
	                startDate.value;

	        }


	        // End date
	        if (endDate.value) {

	            params.endDate =
	                endDate.value;

	        }


	        // Destroy DataTable before Vue changes table
	        destroyDataTable();


	        const response =
	            await api.get(
	                "/contributions/users",
	                {
	                    params
	                }
	            );


	        users.value =
	            response.data || [];


	        // Save successfully applied date range
	        appliedStartDate.value =
	            startDate.value;

	        appliedEndDate.value =
	            endDate.value;


	        // Reset selected user
	        selectedUser.value = null;


	        // Reset visible contribution amounts
	        visibleContributionAmounts.value =
	            new Set();


	        // Rebuild DataTable
	        await initializeDataTable();

	    } catch (error) {

	        console.error(
	            "Get users with contributions error:",
	            error
	        );

	        errorMessage.value =
	            error?.response?.data?.message ||
	            "Failed to retrieve users and contributions.";

	    } finally {

	        loading.value = false;

	    }

	};


	// --------------------------------------------------
	// Clear Date Range
	// --------------------------------------------------

	const clearDateRange = async () => {

	    startDate.value = "";

	    endDate.value = "";

	    await getUsers();

	};


	// --------------------------------------------------
	// User Modal
	// --------------------------------------------------

	const viewUser = user => {

	    selectedUser.value =
	        user;

	};


	const closeUserModal = () => {

	    selectedUser.value =
	        null;

	};


	// --------------------------------------------------
	// Initial Load
	// --------------------------------------------------

	onMounted(() => {

	    getUsers();

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
   Cards
========================= */

.contribution-card,
.summary-card {

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


.summary-card {

    min-height:
        110px;

}


.summary-card .card-body {

    display:
        flex;

    flex-direction:
        column;

    justify-content:
        center;

}


/* =========================
   Table
========================= */

.table {

    margin-bottom:
        0;

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

    vertical-align:
        middle;

}


.table tbody tr:last-child td {

    border-bottom:
        none;

}


.table tfoot th {

    padding:
        15px 18px;

    background:
        #f5f7f9;

    border-top:
        1px solid #dce3e9;

}


/* =========================
   Contribution Headers
========================= */

.contribution-header {

    min-width:
        140px;

    text-align:
        center;

}


.contribution-cell-wrapper {

    min-width:
        120px;

}


/* =========================
   Contribution Cells
========================= */

.contribution-cell {

    width:
        100%;

    min-width:
        85px;

    min-height:
        38px;

    border:
        1px solid #198754;

    border-radius:
        6px;

    background:
        #d1e7dd;

    color:
        #146c43;

    font-weight:
        700;

    cursor:
        pointer;

    transition:
        background-color 0.15s ease,
        transform 0.1s ease;

}


.contribution-cell:hover {

    background:
        #a3cfbb;

}


.contribution-cell:active {

    transform:
        scale(0.96);

}


.check-icon {

    font-size:
        18px;

    font-weight:
        800;

}


.no-contribution {

    color:
        #adb5bd;

    font-size:
        18px;

}


/* =========================
   Buttons
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


.btn-outline-primary {

    color:
        #1e5a8a;

    border-color:
        #1e5a8a;

}


.btn-outline-primary:hover {

    color:
        #ffffff;

    background:
        #1e5a8a;

    border-color:
        #1e5a8a;

}


/* =========================
   Date Filter
========================= */

.form-label {

    color:
        #34495e;

}


.form-control {

    border:
        1px solid #dce3e9;

    border-radius:
        7px;

}


.form-control:focus {

    border-color:
        #1e5a8a;

    box-shadow:
        0 0 0 0.2rem
        rgba(
            30,
            90,
            138,
            0.12
        );

}


/* =========================
   DataTables
========================= */

:deep(.dataTables_wrapper) {

    width:
        100%;

}


:deep(.dt-search) {

    margin-bottom:
        15px;

}


:deep(.dt-length) {

    margin-bottom:
        15px;

}


:deep(.dt-info) {

    padding-top:
        10px;

}


:deep(.dt-paging) {

    margin-top:
        10px;

}


/* =========================
   DataTables Search
========================= */

:deep(.dt-search input) {

    margin-left:
        8px;

    border:
        1px solid #dce3e9;

    border-radius:
        7px;

    padding:
        6px 10px;

}


:deep(.dt-length select) {

    margin:
        0 5px;

    border:
        1px solid #dce3e9;

    border-radius:
        7px;

    padding:
        5px 25px 5px 8px;

}


/* =========================
   Modal
========================= */

.custom-modal-backdrop {

    position:
        fixed;

    inset:
        0;

    z-index:
        1050;

    display:
        flex;

    align-items:
        center;

    justify-content:
        center;

    padding:
        20px;

    background:
        rgba(
            0,
            0,
            0,
            0.55
        );

}


.custom-modal {

    width:
        100%;

    max-width:
        1200px;

    max-height:
        90vh;

    background:
        #ffffff;

    border-radius:
        12px;

    box-shadow:
        0 10px 40px
        rgba(
            0,
            0,
            0,
            0.25
        );

    display:
        flex;

    flex-direction:
        column;

    overflow:
        hidden;

}


.custom-modal-header {

    display:
        flex;

    align-items:
        center;

    justify-content:
        space-between;

    padding:
        20px 24px;

    border-bottom:
        1px solid #dee2e6;

}


.custom-modal-body {

    padding:
        24px;

    overflow-y:
        auto;

}


.custom-modal-footer {

    display:
        flex;

    justify-content:
        flex-end;

    padding:
        16px 24px;

    border-top:
        1px solid #dee2e6;

}


/* =========================
   Modal Info Boxes
========================= */

.info-box {

    padding:
        15px;

    background:
        #f8f9fa;

    border:
        1px solid #dee2e6;

    border-radius:
        8px;

}


.info-box small {

    display:
        block;

    margin-bottom:
        4px;

}


/* =========================
   Modal Table
========================= */

.custom-modal .table {

    margin-bottom:
        0;

}


.custom-modal .table th {

    white-space:
        nowrap;

}


.custom-modal .table td {

    vertical-align:
        middle;

}


/* =========================
   Error Alert
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
   Loading
========================= */

.spinner-border {

    width:
        2rem;

    height:
        2rem;

}


/* =========================
   Mobile
========================= */

@media (max-width: 767.98px) {

    .contribution-page {

        padding:
            35px 15px;

    }


    .contribution-page
    > .container {

        width:
            100%;

    }


    /* Header */

    .contribution-page
    .d-flex.justify-content-between {

        flex-direction:
            column;

        align-items:
            flex-start !important;

        gap:
            15px;

    }


    .contribution-page
    .d-flex.gap-2 {

        width:
            100%;

        flex-wrap:
            wrap;

    }


    .contribution-page
    .d-flex.gap-2
    .btn {

        flex:
            1 1 auto;

    }


    /* Table */

    .table {

        min-width:
            950px;

    }


    .contribution-header {

        min-width:
            120px;

    }


    .contribution-cell-wrapper {

        min-width:
            100px;

    }


    /* Modal */

    .custom-modal-backdrop {

        padding:
            10px;

    }


    .custom-modal {

        max-height:
            95vh;

    }


    .custom-modal-header {

        padding:
            16px;

    }


    .custom-modal-body {

        padding:
            16px;

    }


    .custom-modal-footer {

        padding:
            12px 16px;

    }

}

</style>

