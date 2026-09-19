<script>
  import NavbarComponent from './components/NavbarComponent.vue';
  import Footer from "./components/Footer.vue";
  import {useGlobalStore} from "./stores/global";
  import {onBeforeMount} from "vue"
   

  export default {
    components: {
      // BannerComponent,
      NavbarComponent,
      Footer
    },
    setup(){
      const {setUserDetails} = useGlobalStore();
      onBeforeMount(()=> {
        setUserDetails(localStorage.getItem("token"));
      })
    }
  }
</script>

<template>
  <NavbarComponent />

  <router-view />

  <Footer />
  
</template>
