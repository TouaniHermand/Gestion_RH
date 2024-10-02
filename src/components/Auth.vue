<script setup>
import axios from 'axios'
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { toast } from "vue3-toastify";
import 'vue3-toastify/dist/index.css';



const user = ref(null)
const router = useRouter()

const  headers = {
    'Accept': 'application/json',
    'App-User-Agent':'TodoHutMobileApp/1.0',
}

const  email = ref('')
const  password = ref('')
const isLoading = ref(false);

const  login = async ()=>{
    isLoading.value = true;
    try {
        const  result =  await axios.post('http://localhost:3333/login',{
            email: email.value,
            password: password.value
        },{headers})
        console.log(result.data);
        localStorage.setItem('token',result.data)

        const response = await axios.get('http://localhost:3333/user', {
        headers: {
            Authorization: 'Bearer ' + localStorage.getItem('token'),
        },
        });
        user.value = response.data;
        if(user.value.role === 'admin'){
           router.push('/dashboard')
           toast.success('You are logged in as an administrator',{
              autoClose: 3000
           })
        } else {
            email.value = ''
            password.value = ''
            toast.error('you are not authorized to access this page',{
               autoClose: 3000
            })
        }
    } catch(error){
        toast.error(error.response.data ,{
            autoClose: 2000
        })
    } finally {
        isLoading.value = false; // Désactiver l'état de chargement
    }

}


</script>


<template>
<main >
    <div v-if="isLoading" class="loading-overlay">
        <div class="spinner"></div>
    </div>
    <div class="container" id="container">
        <div class="form">
            <h2>Authentification...</h2>
            <form  @submit.prevent ="login">
                 
                <div class="form-floating mb-3 inputBox">
                    <input type="email" class="form-control"  id="email" placeholder="name@example.com" name="email" required 
                    v-model.trim="email"
                    >
                    <label for="email" class="form-label">Email address</label>
                </div>
        
                <div class="form-floating mb-3 inputBox">
                    <input type="password" class="form-control" id="password" placeholder="password" name="password" required
                    v-model.trim="password"
                    >
                    <label for="password" class="form-label">Password</label>
                </div>
                <div class="inputBox">
                    <button type="submit" class="btn btn-info">Login</button>
                </div>
            </form>
        </div>
    </div>  
</main>

</template>

<style scoped>
* {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
}

main {
    display: flex;
    align-items: center;
    justify-content: center;
    height: 100vh;
    background-color: #24232a;
}

.container {
    position: relative;
    border-radius: 8px;
    overflow: hidden;
}

.container::before {
    content: '';
    position: absolute;
    top: -50%;
    left: -50%;
    background: linear-gradient(0deg, transparent, #03fe78, #03fe78);
    transform-origin: bottom right;
    animation: animate 7s linear infinite;
}

.container::after {
    content: '';
    position: absolute;
    top: -50%;
    left: -50%;
    width: 10px;
    height: 10px;
    background: linear-gradient(0deg, transparent, #f69e3f, #d803fe);
    transform-origin: bottom right;
    animation: animate 7s linear infinite;
    animation-delay: 3s;
}


.form {
    position: relative;
    inset: 3px;
    border-radius: 3px;
    background: #24232a;
    z-index: 10;
    display: flex;
    flex-direction: column ;
    padding: 50px 40px;
}

.form ion-icon {
    font-size: 1em;
    cursor: pointer;
    margin-top: 10px;
    color: #03fe78;
}

.form h2 {
    text-align: center;
    letter-spacing: 0.1em;
    color: #03fe78;
    animation: focus-in-contract 1s ease-in-out;
}

.inputBox {
    position: relative;
    width: 300px;
    margin-top: 35px;
}

.inputBox button, .inputBox input {
   width: 100%;
   padding: 20px 10px 10px;
   background: transparent;
   border-color: #03fe78;
   font-size: 1em;
   outline: none;
   color: #03fe78;
}

.inputBox button {
    border: 1px solid #fff;
    color: #03fe78;
    cursor: pointer;
    margin-top: 20px;
    transition: all 1s ease;
    font-weight: bolder;
    font-size: larger;
}

.loading-overlay {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(0,0,0,0.77);
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 9999;
}

.spinner {
    border: 16px solid #f3f3f3;
    border-top: 16px solid #3498db;
    border-radius: 50%;
    width: 120px;
    height: 120px;
    animation: spin 2s linear infinite;
}

@keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
}

@keyframes animate {
    100% {
        transform: rotate(360deg)
    }
}

@keyframes focus-in-contract {
    0% {
    letter-spacing: 1em;
    transform: translateZ(300px);
    filter: blur(12px);
    opacity: 0;
  }
  100% {
    transform: translateZ(12px);
    filter: blur(0);
    opacity: 1;
  }
}



</style>
