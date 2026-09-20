<template>
  <nav class="navbar navbar-expand-lg">
    <div class="container">

      <!-- =========================
           Brand
      ========================== -->
      <router-link
        class="navbar-brand fw-bold"
        :to="globalStore.user.token ? '/contributions' : '/login'"
      >
        Mother Earth
      </router-link>


      <!-- =========================
           Mobile Toggle
      ========================== -->
      <button
        class="navbar-toggler"
        type="button"
        data-bs-toggle="collapse"
        data-bs-target="#navbarNav"
        aria-controls="navbarNav"
        aria-expanded="false"
        aria-label="Toggle navigation"
      >
        <span class="navbar-toggler-icon"></span>
      </button>


      <!-- =========================
           Navigation
      ========================== -->
      <div
        id="navbarNav"
        class="collapse navbar-collapse"
      >

        <ul class="navbar-nav ms-auto align-items-lg-center">

          <!-- =========================
               Logged In
          ========================== -->

          <template v-if="globalStore.user.token">

            <!-- Dashboard -->

            <li class="nav-item">

              <router-link
                class="nav-link"
                to="/contributions"
              >

                <i class="bi bi-speedometer2 me-1"></i>

                Dashboard

              </router-link>

            </li>


            <!-- Contributions -->

            <!-- <li class="nav-item">

              <router-link
                class="nav-link"
                to="/contributions"
              >

                <i class="bi bi-cash-stack me-1"></i>

                Contributions

              </router-link>

            </li> -->


            <!-- User Email -->

            <li class="nav-item ms-lg-2 ">

              <span class="nav-link text-warning">

                <i class="bi bi-person-circle me-1 text-warning"></i>

                {{ globalStore.user.email }}

              </span>

            </li>


            <!-- Logout -->

            <li class="nav-item ms-lg-2">

              <button
                type="button"
                class="btn logout-btn"
                @click="logout"
              >

                <i class="bi bi-box-arrow-right me-1"></i>

                Logout

              </button>

            </li>

          </template>


          <!-- =========================
               Logged Out
          ========================== -->

          <template v-else>

            <!-- Login -->

            <li class="nav-item">

              <router-link
                class="nav-link"
                to="/login"
              >

                <i class="bi bi-box-arrow-in-right me-1"></i>

                Login

              </router-link>

            </li>


            <!-- Register -->

            <li class="nav-item ms-lg-2">

              <router-link
                class="btn register-btn"
                to="/register"
              >

                <i class="bi bi-person-plus me-1"></i>

                Register

              </router-link>

            </li>

          </template>

        </ul>

      </div>

    </div>
  </nav>
</template>


<script setup>

import { useRouter } from "vue-router";

import { useGlobalStore } from "@/stores/global";


// =========================
// Router & Store
// =========================

const router = useRouter();

const globalStore = useGlobalStore();


// =========================
// Logout
// =========================

const logout = () => {

  localStorage.removeItem("token");

  globalStore.setUserDetails(null);

  router.push("/login");

};

</script>


<style scoped>

/* =========================
   Navbar
========================= */

.navbar {
  min-height: 60px;

  background: #1e3a5f;

  box-shadow:
    0 2px 8px rgba(0, 0, 0, 0.08);
}


/* =========================
   Brand
========================= */

.navbar-brand {
  color: #f5f7fa;

  letter-spacing: 0.3px;

  text-decoration: none;
}


.navbar-brand:hover {
  color: #f4c95d;
}


/* =========================
   Navigation Links
========================= */

.nav-link {
  display: flex;

  align-items: center;

  padding: 0.65rem 0.8rem !important;

  border-radius: 7px;

  font-size: 0.9rem;

  color: #d9e2ec;

  text-decoration: none;

  transition:
    background-color 0.2s ease,
    color 0.2s ease;
}


.nav-link:hover {
  color: #f4c95d;

  background:
    rgba(255, 255, 255, 0.06);
}


/* =========================
   Active Link
========================= */

.nav-link.router-link-active {
  color: #f4c95d;
}


/* =========================
   User Email
========================= */

.user-email {
  max-width: 220px;

  overflow: hidden;

  text-overflow: ellipsis;

  white-space: nowrap;

  color: #d9e2ec !important;

  cursor: default;
}


.user-email:hover {
  background: transparent;
}


/* =========================
   Buttons
========================= */

.login-btn,
.register-btn,
.logout-btn {
  border-radius: 7px;

  font-size: 0.88rem;

  font-weight: 600;

  padding: 0.55rem 1rem;

  transition:
    background-color 0.2s ease,
    border-color 0.2s ease,
    color 0.2s ease;
}


/* =========================
   Register
========================= */

.register-btn {
  color: #263238;

  background: #f4c95d;

  border: 1px solid #f4c95d;
}


.register-btn:hover {
  color: #263238;

  background: #e9b949;

  border-color: #e9b949;
}


/* =========================
   Logout
========================= */

.logout-btn {
  color: #263238;

  background: #f4c95d;

  border: 1px solid #f4c95d;
}


.logout-btn:hover {
  color: #263238;

  background: #e9b949;

  border-color: #e9b949;
}


/* =========================
   Mobile Toggle
========================= */

.navbar-toggler {
  border-color: rgba(255, 255, 255, 0.3);
}


.navbar-toggler:focus {
  box-shadow:
    0 0 0 0.15rem rgba(244, 201, 93, 0.3);
}


/* =========================
   Mobile
========================= */

@media (max-width: 991.98px) {

  .navbar-nav {
    padding-top: 0.75rem;

    padding-bottom: 0.75rem;

    align-items: stretch !important;
  }


  .nav-link {
    width: 100%;

    padding:
      0.7rem 0.75rem !important;
  }


  .user-email {
    max-width: none;
  }


  .register-btn,
  .logout-btn {
    display: block;

    width: 100%;

    margin-top: 0.5rem;

    text-align: center;
  }

}

</style>