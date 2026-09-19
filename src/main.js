
// After bootstrap installation, import bootstrap and bootstrap-icons in main.js to be able to use bootstrap in all components.
import './assets/main.css';
import 'bootstrap/dist/css/bootstrap.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import 'bootstrap-icons/font/bootstrap-icons.min.css';
import 'notyf/notyf.min.css'; // <<

import { createApp } from 'vue'
import { createRouter, createWebHistory} from "vue-router"
import {createPinia} from "pinia";
import App from './App.vue'

// import HomePage from './pages/HomePage.vue';
import LoginPage from './pages/LoginPage.vue';
import RegisterPage from './pages/RegisterPage.vue';
import ErrorPage from "./pages/ErrorPage.vue";


import AddContribution from "./pages/AddContribution.vue";
import Contributions from './pages/Contributions.vue';

import AddMember from './pages/AddMember.vue';
import Members from './pages/Members.vue';

// createRouter serves as your entire map, holds the list of all pages in your project

// createWebHistory assigns the url style, it makes sure that our links look clean compared on using hashtag

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path : "/",
      name: "Home",
      component: Contributions
    },

    {
      path : "/login",
      name: "Login",
      component: LoginPage
    },
    {
      path : "/register",
      name: "Register",
      component: RegisterPage
    },
    {
      path : "/contributions/add",
      name: "AddContribution",
      component: AddContribution
    },
    {
      path: '/:catchAll(.*)',
      component: ErrorPage
    },
    {
      path : "/contributions",
      name: "Contributions",
      component: Contributions
    },    


    {
      path : "/members/add",
      name: "AddMember",
      component: AddMember
    }, 
    {
      path : "/members",
      name: "Members",
      component: Members
    },          
  ]
})

/* 
  - Every Vue application starts by creating a new application instance with the createApp function.
  - We then pass the App component into the createApp method. 
  - The App component is a "root component" that can contain other components as its children.    
  - The mount() method is used to render/inject the root component into the selected element from the DOM by its id.
*/
// createApp(App).mount('#app')
const app = createApp(App);
app.use(createPinia());
app.use(router)
app.mount("#app")