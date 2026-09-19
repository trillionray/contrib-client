import {defineStore} from "pinia";
import {reactive} from "vue";


import api from  "../api"

export const useGlobalStore = defineStore("global", ()=>{

	let user = reactive({
		fullName: null,
		token: localStorage.getItem("token"),
		email: null,
		isAdmin: null
	})

	async function setUserDetails(token){
		
		if(!token){
			user.fullName = null;
			user.token = null;
			user.email = null;
			user.isAdmin = null;
			return;
		}

		let {data} = await api.get("/users/details");

		console.log(data);
		user.fullName = data.fullName;
		user.token = token;
		user.email = data.email;
		user.isAdmin = data.isAdmin;
	}

	return {
		user,
		setUserDetails,
		// current
	}

})