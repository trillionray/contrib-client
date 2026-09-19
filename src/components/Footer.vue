<template>
  <footer class="footer">
    <div class="container">

      <!-- =========================
           Developer Information
      ========================== -->
      <div class="developer-credit">

        <span class="developer-label">
          Web App Developed By
        </span>

        <strong>
          Christopher K. Malinao
        </strong>

        <div class="developer-contact">

          <span>
            <i class="bi bi-telephone-fill me-1"></i>
            0996 098 6604
          </span>

          <span>
            <i class="bi bi-envelope-fill me-1"></i>
            topherkatigbak@gmail.com
          </span>

        </div>

      </div>


      <!-- =========================
           Footer Bottom
      ========================== -->
      <div class="footer-bottom">

        <span>
          © {{ currentYear }} All rights reserved.
        </span>

        <span class="developer-tag">
          <i class="bi bi-code-slash me-1"></i>
          Developed with care
        </span>

      </div>

    </div>
  </footer>
</template>


<script setup>

const currentYear =
  new Date().getFullYear();

</script>


<style scoped>

/* =========================
   Footer
========================= */

.footer {

  margin-top: auto;

  padding: 2.5rem 0 1rem;

  background: #1e3a5f;

  color: #cbd5df;

}


/* =========================
   Developer
========================= */

.developer-credit {

  display: flex;

  flex-direction: column;

  align-items: center;

  gap: 3px;

  padding-bottom: 1.8rem;

  text-align: center;

}


.developer-label {

  color: #9fb3c8;

  font-size: 0.68rem;

  font-weight: 600;

  text-transform: uppercase;

  letter-spacing: 0.7px;

}


.developer-credit strong {

  color: #f4c95d;

  font-size: 0.95rem;

  font-weight: 600;

}


/* =========================
   Developer Contact
========================= */

.developer-contact {

  display: flex;

  flex-direction: column;

  align-items: center;

  gap: 3px;

  margin-top: 3px;

  color: #b8c7d6;

  font-size: 0.74rem;

}


.developer-contact i {

  color: #f4c95d;

}


/* =========================
   Footer Bottom
========================= */

.footer-bottom {

  display: flex;

  align-items: center;

  justify-content: center;

  gap: 1rem;

  padding-top: 1rem;

  border-top:
    1px solid rgba(255, 255, 255, 0.12);

  color: #9fb3c8;

  font-size: 0.7rem;

}


.developer-tag {

  white-space: nowrap;

}


.developer-tag i {

  color: #f4c95d;

}


/* =========================
   Mobile
========================= */

@media (max-width: 767.98px) {

  .footer {

    padding-top: 2rem;

  }


  .developer-credit {

    padding-bottom: 1.5rem;

  }


  .footer-bottom {

    flex-direction: column;

    gap: 0.4rem;

    text-align: center;

  }

}

</style>