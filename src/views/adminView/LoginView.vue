<script setup>
import { ref,onMounted } from 'vue';
import axios from 'axios';
import { toast } from "vue3-toastify";
import 'vue3-toastify/dist/index.css';
import { useRouter } from 'vue-router';

const router = useRouter()
const isPanelActive = ref(false);
const  headers = {
    'Accept': 'application/json',
    'App-User-Agent':'TodoHutMobileApp/1.0',
}

const isLoading = ref(false);
const togglePanel = () => {
  isPanelActive.value = !isPanelActive.value;
};

onMounted(async () => {
  Alldepartements()
});


const departements = ref(null)
const  options = ref(null)

const  Alldepartements = async ()=>{
    try {
       const result = await axios.get('http://127.0.0.1:3333/Departs')
       console.log(result.data);
       departements.value = result.data
       options.value =  departements.value.reduce((acc, c) => ({ ...acc, [c.id]: c.nom }),{})
       console.log(options.value)
    } catch(error){
        console.log(error.response.data);
    }
}

const nom = ref('')
const prenom= ref('')
const email = ref('')
const password = ref('')
const contact = ref('')
const departementId= ref('')

const Create = async () =>{
    try {
        const result = await axios.post('http://127.0.0.1:3333/signup', {
            nom: nom.value,
            prenom: prenom.value,
            email: email.value,
            password: password.value,
            contact: contact.value,
            departementId: departementId.value,
        }, {
            headers: {
                Authorization: 'Bearer ' + localStorage.getItem('token'),
            }
        });
        nom.value = ''
        prenom.value = ''
        email.value = ''
        password.value = ''
        contact.value = ''
        departementId.value = ''
        console.log(result.data.message);
        toast.success(result.data.message,{
            autoClose: 1000
        })

    } catch(error){
        console.log(error.response.data);
        toast.error(error.response.data,{
            autoClose: 2000
        })
    }
}

const  email_login = ref('')
const password_login= ref('')

const passwordFieldType = ref('password');
const passwordFieldType2 = ref('password');

const togglePasswordVisibility = () => {
  passwordFieldType.value = passwordFieldType.value === 'password' ? 'text' : 'password';
};

const togglePasswordVisibility2 = () => {
  passwordFieldType2.value = passwordFieldType.value === 'password' ? 'text' : 'password';
};


const  login = async ()=>{
    isLoading.value = true;
    try {
        const  result =  await axios.post('http://localhost:3333/login',{
            email: email_login.value,
            password: password_login.value
        },{headers})
        console.log(result.data);
        localStorage.setItem('token',result.data)

           toast.success('logged in',{
              autoClose: 3000
           })
          router.push('/QrReader')
    } catch(error){
        toast.error(error.response.data ,{
            autoClose: 2000
        })
        console.log(error.message.data);
    } finally{
      isLoading.value = false;
    }
}
</script>


<template>
  <main>
    <div class="nav">
        <nav style="--bs-breadcrumb-divider: '>';" aria-label="breadcrumb">
            <ol class="breadcrumb">
              <li class="breadcrumb-item">
                <router-link to="/"  style="color: blue;">Home</router-link> 
              </li>
              <li class="breadcrumb-item active" aria-current="page">Account</li>
            </ol>
        </nav>
    </div>
    <div v-if="isLoading" class="loading-overlay">
        <div class="spinner"></div>
    </div>
    <div class="container" :class="{ 'panel-active': isPanelActive }" id="container">
      <div class="form-container sign-up-container">
        <form @submit.prevent="Create">
          <h1>Créer un compte</h1>
          <span  style="opacity:0;" >Utiliser compte gmail</span>

          <div class="form-floating mb-2 inputBox">
            <input type="text" class="form-control" id="nom" required placeholder="Enter Your name" v-model.trim="nom">
            <label for="nom" class="form-label">Nom</label>
          </div>
          
          <div class="form-floating mb-2 inputBox">
            <input type="text" class="form-control" id="prenom" required placeholder="Enter Your surname" v-model.trim="prenom">
            <label for="prenom" class="form-label">Prénom</label>
          </div>

          <div class="form-floating mb-2 inputBox">
            <input type="email" class="form-control" id="email" required placeholder="Enter Your email" v-model.trim="email">
            <label for="email" class="form-label">Email</label>
          </div>

          <div class="form-floating mb-2 inputBox">
            <input  class="form-control" id="password" required placeholder="Enter Your password" v-model.trim="password" :type="passwordFieldType">
            <label for="password" class="form-label">Mot de passe</label>
            <span class="password-toggle" @click="togglePasswordVisibility">
              <i class="fa fa-eye-slash" v-if="passwordFieldType === 'password'"></i>
              <i class="fa fa-eye" v-else ></i>
            </span>
          </div>

          <div class="form-floating mb-2 inputBox">
            <input type="text" class="form-control" id="contact" required placeholder="Enter Your contact" v-model.trim="contact">
            <label for="contact" class="form-label">Contact</label>
          </div>

          <div class="form-floating mb-3 inputBox" >
            <select class="form-select" aria-label="Default select example" v-model="departementId" required >
              <option selected disabled>Departement</option>
              <option :value="key"  v-for="(value, key) in options" :key="key">{{value}}</option>
            </select>
          </div>
          <div class="inputBox">
            <button type="submit" class="btn btn-info">Create</button>
          </div>
        </form>
      </div>
      
      <div class="form-container login-container">
        <form @submit.prevent="login">
          <h1>Se connecter</h1>
          <span>Je n'ai pas de compte</span>

          <div class="form-floating mb-2 inputBox">
            <input type="email" class="form-control" id="login-email" required placeholder="Enter Your email" v-model.trim="email_login">
            <label for="login-email" class="form-label">Email</label>
          </div>

          <div class="form-floating mb-2 inputBox">
            <input  class="form-control" id="password" required placeholder="Enter Your password" v-model.trim="password_login" :type="passwordFieldType2">
            <label for="password" class="form-label">Mot de passe</label>
            <span class="password-toggle" @click="togglePasswordVisibility2">
              <i class="fa fa-eye-slash" v-if="passwordFieldType === 'password'"></i>
              <i class="fa fa-eye" v-else ></i>
            </span>
          </div>

          <button class="btn btn-primary">Se connecter</button>
        </form>
      </div>

      <div class="overlay-container">
        <div class="overlay">
          <div class="overlay-panel overlay-left">
            <h1>Bienvenue!</h1>
            <p>Pour rester connecté, veuillez vous connecter avec vos informations personnelles</p>
            <button class="ghost btn btn-secondary" @click="togglePanel">Se connecter</button>
          </div>
          <div class="overlay-panel overlay-right">
            <h1>Bonjour, Ami!</h1>
            <p>Entrez vos informations personnelles et commencez votre voyage avec nous</p>
            <button class="ghost btn btn-secondary" @click="togglePanel">Créer un compte</button>
          </div>
        </div>
      </div>
    </div>
  </main>
</template>



<style scoped>
@import url('https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.14.0/css/all.min.css');
@import url('https://fonts.googleapis.com/css?family=Montserrat:400,800');

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

.password-toggle {
  position: absolute;
  right: 10px;
  top: 50%;
  transform: translateY(-50%);
  cursor: pointer;
}


* {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}

main {
  background: #f6f5f7;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  font-family: 'Montserrat', sans-serif;
  height: 100vh;
  background: linear-gradient(to bottom right, #ffcccc, #d46b6b),
              radial-gradient(circle, #66ffff, #0099cc);
}

.nav {
  margin-right: 70em;
}

.nav li a {
  text-decoration: #0099cc;
}

.container {
  position: relative;
  overflow: hidden;
  height: 550px; /* Set fixed height */
  width: 900px;
  max-width: 100%;
  background-color: #fff;
  border-radius: 10px;
  box-shadow: 0 8px 24px rgba(0, 32, 63, 0.45), 0 8px 8px rgba(0, 32, 63, 0.45);
}

.form-container {
  position: absolute;
  top: 0;
  height: 100%;
  transition: 0.6s ease-in-out;
}

.sign-up-container {
  left: 0;
  width: 50%;
  opacity: 0;
  z-index: 1;
}

.container.panel-active .sign-up-container {
  transform: translateX(100%);
  opacity: 1;
  z-index: 5;
  animation: show 0.6s;
}

@keyframes show {
  0%, 49.99% {
    opacity: 0;
    z-index: 1;
  }
  50%, 100% {
    opacity: 1;
    z-index: 5;
  }
}

.container.panel-active .login-container {
  transform: translateX(100%);
}

.login-container {
  left: 0;
  width: 50%;
  z-index: 2;
}

form {
  background-color: #fff;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  padding: 0 30px; /* Reduced padding */
  height: 100%;
  text-align: center;
}

.container .inputBox input, select {
  background-color: #e0f7fa;
  border: none;
  padding-top: 30px; /* Reduced padding */
  width: 300px;
}

button {
  background-color: #00796b;
  color: #fff;
  border: none;
  font-size: 16px;
  font-weight: bold;
  padding: 12px 24px; /* Reduced padding */
  margin-top: 16px; /* Reduced margin-top */
  letter-spacing: 1px;
  border-radius: 50px;
  transition: 0.2s ease-in;
}


button:hover {
  cursor: pointer;
  background-color: #004d40;
}

button:active {
  transform: scale(0.95);
}

.social-container {
  margin: 16px 0; /* Reduced margin */
}

.social-container a {
  display: inline-flex;
  justify-content: center;
  align-items: center;
  margin: 0 4px;
  height: 40px;
  width: 40px;
  border-radius: 50%;
  background-color: #e0f7fa;
  border: 1px solid rgba(0, 32, 63, 0.45);
}

h1 {
  margin: 0;
  font-size: 24px;
}

span {
  font-size: 14px;
}

a {
  text-decoration: none;
  font-size: 14px;
  margin: 8px 0 16px;
  color: #333;
}

.overlay-container {
  position: absolute;
  top: 0;
  left: 50%;
  width: 50%;
  height: 100%;
  overflow: hidden;
  z-index: 100;
  transition: transform 0.6s ease-in-out;
}

.container.panel-active .overlay-container {
  transform: translateX(-100%);
}

.overlay {
  background: linear-gradient(to right, #00796b, #004d40);
  color: #fff;
  position: relative;
  left: -100%;
  height: 100%;
  width: 200%;
  transform: translateX(0);
  transition: transform 0.6s ease-in-out;
}

.container.panel-active .overlay {
  transform: translateX(50%);
}

.overlay-panel {
  position: absolute;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  padding: 0 40px;
  text-align: center;
  top: 0;
  height: 100%;
  width: 50%;
  transform: translateX(0);
  transition: transform 0.6s ease-in-out;
}

.overlay-left {
  transform: translateX(-20%);
}

.container.panel-active .overlay-left {
  transform: translateX(0);
}

.overlay-right {
  right: 0;
  transform: translateX(0);
}

.container.panel-active .overlay-right {
  transform: translateX(20%);
}

p {
  font-size: 14px;
  font-weight: 100;
  line-height: 20px;
  letter-spacing: 0.5px;
  margin: 20px 0 30px;
}
</style>
