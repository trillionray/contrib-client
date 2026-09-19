<script>
import NavbarComponent from "./components/NavbarComponent.vue";
import Footer from "./components/Footer.vue";
import { useGlobalStore } from "./stores/global";
import { onBeforeMount, ref } from "vue";

import api from "./api";

import { Notyf } from "notyf";
import "notyf/notyf.min.css";


export default {

  components: {
    NavbarComponent,
    Footer
  },

  setup() {

    const { setUserDetails } =
      useGlobalStore();

    const isServerReady =
      ref(false);

    const notyf =
      new Notyf();


    onBeforeMount(async () => {

      try {

        // Wake Render server
        await api.get("/wake");

        // Show success notification
        notyf.success(
          "Server is ready."
        );

        // Set user details
        setUserDetails(
          localStorage.getItem("token")
        );

        // Allow application to render
        isServerReady.value = true;

      } catch (error) {

        console.error(
          "Unable to wake server:",
          error
        );

        notyf.error(
          "Unable to connect to the server."
        );

      }

    });


    return {
      isServerReady
    };

  }

}
</script>


<template>

  <!-- Loading screen -->
  <div
    v-if="!isServerReady"
    class="server-loading"
  >

    <div
      class="spinner-border text-warning"
      role="status"
    ></div>

    <h5 class="mt-4">
      Connecting to server...
    </h5>

    <p class="text-muted mb-0">
      Please wait while we wake up the server.
    </p>

  </div>


  <!-- Application -->
  <template v-else>

    <NavbarComponent />

    <router-view />

    <Footer />

  </template>

</template>


<style scoped>

.server-loading {

  min-height: 100vh;

  display: flex;

  flex-direction: column;

  align-items: center;

  justify-content: center;

  background: #eef3f7;

  text-align: center;

}

.server-loading h5 {

  color: #1e3a5f;

  font-weight: 600;

}

</style>