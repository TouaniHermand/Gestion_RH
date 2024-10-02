<script setup>
import { ref ,watch } from 'vue';
import { onMounted } from 'vue';
import { toast } from "vue3-toastify";
import 'vue3-toastify/dist/index.css';
import axios from 'axios';
import { useRouter } from 'vue-router';
import Nav from '@/components/Nav.vue';

const router = useRouter()

const isActive = ref(false);

function toggleActive() {
    isActive.value = !isActive.value;
}

const show = ref(false)

const showModal = ()=>{
  show.value = !show.value
}


const user = ref(null)


onMounted(async () => {
  try {
    const response = await axios.get('http://localhost:3333/user', {
      headers: {
        Authorization: 'Bearer ' + localStorage.getItem('token'),
      },
    });
    user.value = response.data;
    console.log(user.value); // Affichez les données utilisateur dans la console
  } catch (error) {
    console.error('Erreur lors de la récupération des données utilisateur :', error);
  }

  index()
  Alldepartements()
})

const showFormCreate = ref(true)
const showFormUpdate = ref(false)

const toggleFormCreate = ()=>{
    showFormCreate.value = !showFormCreate.value
    if(showFormUpdate.value === true){
        showFormUpdate.value = false
    }
}



const  employes = ref(null)

const index = async () =>{
    try {
       const result = await axios.get('http://127.0.0.1:3333/employesDeparts',{
        headers: {
           Authorization: 'Bearer ' + localStorage.getItem('token'),
        },
       })
       employes.value = result.data
    } catch(error){
        console.log(error.response.data);
    }
}

const departements = ref(null)
const  options = ref(null)

const  Alldepartements = async ()=>{
    try {
       const result = await axios.get('http://127.0.0.1:3333/departements',{
        headers: {
           Authorization: 'Bearer ' + localStorage.getItem('token'),
        },
       })
       departements.value = result.data
       options.value =  departements.value.reduce((acc, c) => ({ ...acc, [c.id]: c.nom }),{})
       console.log(options.value)
    } catch(error){
        console.log(error.response.data);
    }
}

const  nom = ref('')
const  prenom = ref('')
const  email = ref('')
const  contact = ref('')
const  password= ref('')
const  role = ref('')
const  departementId = ref('')

const Create = async () =>{
    try {
        const result = await axios.post('http://127.0.0.1:3333/employes', {
            nom: nom.value,
            prenom: prenom.value,
            email: email.value,
            password: password.value,
            contact: contact.value,
            role: role.value,
            departementId: departementId.value,
        }, {
            headers: {
                Authorization: 'Bearer ' + localStorage.getItem('token'),
            }
        });
        nom.value= ''
        prenom.value = ''
        email.value=''
        password.value = ''
        contact.value = ''
        role.value = ''
        departementId.value = ''
        console.log(result.data.message);
        toast.success(result.data.message,{
            autoClose: 1000
        })
        index()

    } catch(error){
        console.log(error.response.data);
        toast.error(error.response.data,{
            autoClose: 2000
        })
    }
}



const employe = ref(null)

const nom_update = ref('');
const prenom_update = ref('');
const email_update = ref('');
const contact_update = ref('');
const role_update = ref('');
const departementId_update = ref(null);

const toggleFormUpdate = async(id)=>{
    showFormUpdate.value = !showFormUpdate.value
    if(showFormCreate.value === true){
        showFormCreate.value = false
    }

    try {
       const result = await axios.get(`http://127.0.0.1:3333/employes/${id}`,{
        headers: {
           Authorization: 'Bearer ' + localStorage.getItem('token'),
        },
       })
       employe.value = result.data
       console.log(employe.value)

       nom_update.value = employe.value.nom;
       prenom_update.value = employe.value.prenom;
       email_update.value = employe.value.email;
       contact_update.value = employe.value.contact;
       role_update.value = employe.value.role;
       departementId_update = employe.value.departementId;
    } catch(error){
        console.log(error.response.data);
    }
} 

const deleteEmploye = async (id)=>{
    try {
       const result = await axios.delete(`http://127.0.0.1:3333/employes/${id}`,{
        headers: {
           Authorization: 'Bearer ' + localStorage.getItem('token'),
        },
       })
       toast.success(result.data.message,{
            autoClose: 1000
        })

        index()
    } catch(error){
        console.log(error.response.data);
    }
}


const updateEmploye = async (id) => {
    try {
        const result = await axios.put(`http://127.0.0.1:3333/employes/${id}`, {
            nom: nom_update.value,
            prenom: prenom_update.value,
            email: email_update.value,
            contact: contact_update.value,
            role: role_update.value,
            departementId: departementId_update.value,
        }, {
            headers: {
                Authorization: 'Bearer ' + localStorage.getItem('token'),
            }
        });
        nom_update.value = ''
        prenom_update.value = ''
        email_update.value = ''
        contact_update.value = ''
        role_update.value = ''
        departementId_update.value = ''
        console.log(result.data.message);
        toast.success(result.data.message, {
            autoClose: 1000
        })
        index()
    } catch(error){
        console.log(error);
        toast.error(error.response, {
            autoClose: 2000
        })
    }
}



</script>

<template>
    <Nav/>
    <div class="main" :class="{ 'active': isActive }">
                <div class="topbar">
                    <div class="toggle" @click="toggleActive">
                        <ion-icon name="menu-outline"></ion-icon>
                    </div>
                    <div class="search">
                        <label for="">
                            <input type="text"  placeholder="search here" v-model="search" >
                            <ion-icon name="search-outline"></ion-icon>
                        </label>
                    </div>
                    <div class="user" @click="showModal">
                        <ion-icon name="person-circle-outline"></ion-icon>
                    </div>
                </div>
                <transition name="slide">
                    <div class="profile" v-if="show">
                            <h4>Informations sur le profil</h4>
                           <div>
                              <p>Nom: <span>{{user.nom}}</span> </p>
                           </div>
                           <div>
                              <p>Prenom: <span>{{user.prenom}}</span> </p>
                           </div>
                           <div>
                              <p>Prenom: <span>{{user.contact}}</span> </p>
                           </div>
                           <div>
                              <p>Email: <span>{{user.email}}</span> </p>
                           </div>
                           <div>
                              <p>Creation date: <span>{{user.created_at}}</span> </p>
                           </div>
                    </div>
                </transition>


                <!--============ Order Details List =========== -->
                <div class="details">
                    <div class="recentOrders">
                        <div class="cardHeader">
                            <h2>Employe List</h2>
                            <ion-icon name="person-add-sharp" @click="toggleFormCreate"></ion-icon>
                        </div>

                        <table>
                            <thead>
                                <tr>
                                    <td>Prenom</td>
                                    <td>Email</td>
                                    <td>Contact</td>
                                    <td>Role</td>
                                    <td>Departement</td>
                                    <td>Actions</td>
                                </tr>
                            </thead>
                            <tbody>
                                <tr v-for="employe in employes" :key="employe.id">
                                    <td>{{ employe.prenom }}</td>
                                    <td>{{ employe.email }}</td>
                                    <td>{{ employe.contact }}</td>
                                    <td>{{ employe.role }}</td>
                                    <td>{{ employe.nom }}</td>
                                    <td>
                                        <ion-icon name="create" @click="toggleFormUpdate(employe.id)"></ion-icon>
                                        <ion-icon name="trash-sharp" @click="deleteEmploye(employe.id)" ></ion-icon>
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>

                    <!--========== New Custumes ==================================-->
                    <div class="recentCustumers" v-if="showFormCreate">
                        <div class="cardHeader">
                            <h2>Formulaire</h2>
                        </div>
                        <form  @submit.prevent ="Create" >     
                            <div class="form-floating mb-3 inputBox">
                                <input type="text" class="form-control"  id="nom"   required  placeholder="Enter Your name"
                                v-model.trim="nom"
                                >
                                <label for="nom" class="form-label">Nom</label>
                            </div>
                    
                            <div class="form-floating mb-3 inputBox">
                                <input type="text" class="form-control" id="prenom"  required placeholder="Enter Your name"
                                v-model.trim="prenom"
                                >
                                <label for="prenom" class="form-label">Prenom</label>
                            </div>
                            <div class="form-floating mb-3 inputBox">
                                <input type="email" class="form-control"  id="email" placeholder="name@example.com" name="email" required 
                                v-model.trim="email"
                                >
                                <label for="email" class="form-label">Email address</label>
                            </div>
                            <div class="form-floating mb-3 inputBox">
                                <input type="text" class="form-control"  id="contact"  required placeholder="Enter Your name"
                                v-model.trim="contact"
                                >
                                <label for="contact" class="form-label">Contact</label>
                            </div>
                            <div class="form-floating mb-3 inputBox">
                                <input type="text" class="form-control"  id="role" placeholder="Enter Your name"
                                v-model.trim="role"
                                >
                                <label for="role" class="form-label">Role</label>
                            </div>
                            <div class="form-floating mb-3 inputBox">
                                <input type="password" class="form-control"  id="email" placeholder="name@example.com" name="email" required 
                                v-model.trim="password"
                                >
                                <label for="email" class="form-label">Password</label>
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

                    <!--====================================  Form Update ====================================-->

                    <div class="recentCustumers" v-if="showFormUpdate">
                        <div class="cardHeader">
                            <h2>Formulaire</h2>
                        </div>
                        <form @submit.prevent ="updateEmploye(employe.id)" >     
                            <div class="form-floating mb-3 inputBox">
                                <input type="text" class="form-control"  id="nom"   required 
                                v-model="nom_update" 
                                >
                                <label for="nom" class="form-label">Nom</label>
                            </div>
                    
                            <div class="form-floating mb-3 inputBox">
                                <input type="text" class="form-control" id="prenom"  required
                                v-model="prenom_update" 
                                >
                                <label for="prenom" class="form-label">Prenom</label>
                            </div>
                            <div class="form-floating mb-3 inputBox">
                                <input type="email" class="form-control"  id="email" placeholder="name@example.com" name="email" required 
                                v-model="email_update" 
                                >
                                <label for="email" class="form-label">Email address</label>
                            </div>
                            <div class="form-floating mb-3 inputBox">
                                <input type="text" class="form-control"  id="contact"  required 
                                v-model="contact_update"
                                >
                                <label for="contact" class="form-label">Contact</label>
                            </div>
                            <div class="form-floating mb-3 inputBox">
                                <input type="text" class="form-control"  id="role" 
                                v-model="role_update" 
                                >
                                <label for="role" class="form-label">Role</label>
                            </div>
                            <div class="form-floating mb-3 inputBox" >
                                <select class="form-select" aria-label="Default select example" v-model="departementId_update" required >
                                    <option selected disabled>Departement</option>
                                    <option :value="key"  v-for="(value, key) in options" :key="key">{{value}}</option>
                                </select>
                            </div>
                            <div class="inputBox">
                                <button type="submit" class="btn btn-info">Update</button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
</template>


<style scoped>

.profile {
  position: fixed;
  top: 60px; /* Ajustez selon votre mise en page */
  right: 20px; /* Ajustez selon votre mise en page */
  background-color: #0f0f0f8f;
  padding: 20px;
  border-radius: 8px;
  z-index: 999; /* Assurez-vous que le profil s'affiche au-dessus des autres éléments */
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.2);
  color: #ffffff;
}


.profile h4 {
    color: #0b375c;
}

.profile p {
    font-weight: bolder;
    font-style: italic;
}

/* Animation de transition */
.slide-enter-active, .slide-leave-active {
  transition: all 0.5s ease;
}
.slide-enter-from, .slide-leave-to {
  opacity: 0;
  transform: translateY(-20px);
}

* {
    font-family: "Ubuntu", sans-serif;
    margin: 0;
    padding: 0;
    box-sizing: border-box;
}

main {
    min-height: 100vh;
    overflow-x: hidden;
}

:root {
    --blue: #2a2185;
    --white: #fff;
    --gray: #f5f5f5;
    --black1: #222;
    --black2: #999;
}

.containers {
    position: relative;
    width: 100%;
}



/*
===================partie des composants============================
*/

.main {
    position: absolute;
    width: calc(100% - 300px);
    left: 300px;
    min-height: 100vh;
    background: #fff;
    transition: 0.5s;   
}

.main.active {
    width: calc(100% - 110px);
    left: 110px;
}

.topbar {
    width: 100%;
    height: 60px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 0 10px;
}

.topbar .toggle {
    position: relative;
    top: 0;
    width: 60px;
    height: 60px;
    justify-content: center;
    align-items: center;
    font-size: 2.5em;
    cursor: pointer;
}

.search {
    position: relative;
    width: 400px;
    margin: 0 10px;
}

.search label {
    position: relative;
    width: 100%;
}

.search label input {
    width: 100%;
    height: 40px;
    border-radius: 40px;
    padding: 5px 20px;
    outline: none;
    padding-left: 35px;
    font-size: 18px; 
    border: 1px solid #222;
}


.search label ion-icon {
    position: absolute;
    top: 0.5em;
    left: 10px;
    font-size: 1.2rem;
}

.user {
    position: relative;
    width: 40px;
    height: 40px;
    border-radius: 50%;
    overflow: hidden;
    cursor: pointer;
}

.user ion-icon {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    object-fit: cover;
}

/*======================  Order Details========================== */
.details {
    position: relative;
    width: 100%;
    padding: 20px;
    display: grid;
    grid-template-columns: 2fr 1fr;
    grid-gap: 30px;
}

.details .recentOrders {
    position: relative;
    display: grid;
    min-height: 550px;
    background: var(--white);
    padding: 20px;
    box-shadow: 0 7px 25px rgba(0, 0, 0, 0.48);
    border-radius: 20px;
}

.details .cardHeader {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
}

.cardHeader h2 {
    font-weight: 600;
    color: #0b375c;
}

.cardHeader ion-icon {
    position: relative;
    padding: 8px 10px;
    background: #0b375c;
    text-decoration: none;
    color: white;
    border-radius: 6px;
    font-size: 1.8em;
    border-radius: 50%;
    cursor: pointer;
}

.details table {
    width: 100%;
    border-collapse: collapse;
    margin-top: 10px;
}

.details table thead td {
    font-weight: 600;
}

.details .recentOrders table tr {
    color: rgb(2, 1, 1);
    border-bottom: 1px solid rgba(0,0, 0,0.3);
}

.details .recentOrders table tr:last-child {
    border-bottom: none;
}

.details .recentOrders table tbody tr:hover {
    background-color: #77a4c1;
    color: white;
}


.details .recentOrders table tr td {
    padding: 10px;
}

.details .recentOrders table tr td:last-child {
    text-align: end;
}

.details .recentOrders table tbody td:last-child ion-icon{
    padding: 1px;
    cursor: pointer;
    font-size:1em;
}

.details .recentOrders table tbody td:last-child ion-icon:nth-child(1) {
    color: green;
}

.details .recentOrders table tbody td:last-child ion-icon:nth-child(2) {
    color:red;
}


.recentCustumers {
    position: relative;
    display: grid;
    min-height: 550px;
    background-color: white;
    box-shadow:  0 7px 25px rgba(0, 0, 0, 0.48);
    border-radius: 20px;
}

.recentCustumers .cardHeader h2 {
    margin: 0 auto;
}

.recentCustumers form input {
    margin: 0 auto;
    width: 95%;
}

.recentCustumers form select{
    margin: 0 auto;
    width: 95%;
}

.recentCustumers form .inputBox {
    display: flex;
    justify-content: center;
}

.recentCustumers form .inputBox button {
    padding: 5px;
    width: 95%;
    background: #0b375c;
    color: white;
    font-weight: bolder;
    margin-bottom: 1em;
}
</style>
