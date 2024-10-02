<script setup>
import { ref } from 'vue';
import { onMounted , computed} from 'vue';
import { toast } from "vue3-toastify";
import 'vue3-toastify/dist/index.css';
import axios from 'axios';
import { useRouter } from 'vue-router';
import Nav from '@/components/Nav.vue';
import Graphique from '@/components/Graphique.vue';



const  router = useRouter()
const isActive = ref(false);

function toggleActive() {
    isActive.value = !isActive.value;
}

const show = ref(false)

const showModal = ()=>{
  show.value = !show.value
}

toast.info('welcome to dashbord',{
    autoClose: 2000
})



const  employes = ref(null)

const index = async () =>{
    try {
       const result = await axios.get('http://127.0.0.1:3333/employes',{
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
const  Alldepartements = async ()=>{
    try {
       const result = await axios.get('http://127.0.0.1:3333/departements',{
        headers: {
           Authorization: 'Bearer ' + localStorage.getItem('token'),
        },
       })
       departements.value = result.data
    } catch(error){
        console.log(error.response.data);
    }
}

const totalEmployes = computed(() => {
  return employes.value ? employes.value.length : 0;
});

const totalDepartements = computed(() => {
  return departements.value ? departements.value.length : 0;
});

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
  fetchPresences();
})


const presences = ref([]);

const fetchPresences = async () => {
  try {
    const result = await axios.get('http://127.0.0.1:3333/presence', {
      headers: {
        Authorization: 'Bearer ' + localStorage.getItem('token'),
      },
    });
    presences.value = result.data;
  } catch (error) {
    console.error(error.response.data);
  }
};



const tauxPresenceGlobal = computed(() => {
  if (presences.value.length === 0) return 0;

  // Calculer le nombre total de présences
  const totalPresences = presences.value.length;

  // Ici, vous devrez déterminer le nombre total d'occasions de présence en fonction de votre logique métier
  // Par exemple, le nombre total de jours ouvrables dans la période concernée

  // Supposons que le nombre total d'occasions de présence est de 20 jours ouvrables
  const totalOccasionsPresence = 20;

  // Calculer le taux de présence global
  const taux = (totalPresences / totalOccasionsPresence) * 100;

  // Arrondir à deux décimales
  return taux.toFixed(2);
});
</script>

<template>
    <main>
        <div class="containers">
            <Nav :user="user"/>
<!--=================Main ===========================-->
            <div class="main" :class="{ 'active': isActive }">
                <div class="topbar">
                    <div class="toggle" @click="toggleActive">
                        <ion-icon name="menu-outline"></ion-icon>
                    </div>
                    <div class="search">
                        <label for="">
                            <input type="text"  placeholder="search here" >
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
<!--=======================Cards==================-->
                <div class="cardBoxx">
                    <div class="cards">
                        <div>
                            <div class="numbers">{{totalEmployes}}</div>
                            <div class="cardName">Employes</div>
                        </div>
                        <div class="iconBox">
                            <ion-icon name="footsteps-sharp"></ion-icon>
                        </div>
                    </div>
                    <div class="cards">
                        <div>
                            <div class="numbers">{{totalDepartements}}</div>
                            <div class="cardName">Departements</div>
                        </div>
                        <div class="iconBox">
                            <ion-icon name="paw-sharp"></ion-icon>
                        </div>
                    </div>
                    <div class="cards">
                        <div>
                            <div class="numbers">{{ tauxPresenceGlobal }}%</div>
                            <div class="cardName">Taux de presences Global</div>
                        </div>
                        <div class="iconBox">
                            <ion-icon name="globe-sharp"></ion-icon>
                        </div>
                    </div>
                </div>


                <!--============ Order Details List =========== -->
                <div class="details">
                    <div class="recentOrders">
                        <div class="cardHeader">
                            <h2><ion-icon name="podium-sharp"></ion-icon></h2>
                        </div>

                        <Graphique/>
                    </div>
                </div>
            </div>
            




        </div>
    </main>
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
    color: blue;
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

.navigation {
    position: fixed;
    width: 300px;
    height: 100%;
    background: #2a2185;
    border-left: 10px solid #2a2185;
    transition: 0.5s;
    overflow: hidden;
}

.navigation.active {
    width:80px;
}

.navigation ul {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
}

.navigation ul li {
    position: relative;
    width: 100%;
    list-style: none;
    border-top-left-radius: 30px;
    border-bottom-left-radius: 30px;
}

.navigation ul li:hover,
.navigation ul li.hovered {
    background: #fff;
}

.navigation ul li:nth-child(1) {
    margin-bottom: 40px;
    pointer-events: none;
}



.navigation ul li a {
    position: relative;
    display: block;
    width: 100%;
    display: flex;
    text-decoration: none;
    color: #fff;
}

.navigation ul li:hover a,
.navigation ul li.hovered a {
    color: #2a2185;
}

.navigation ul li a .icon {
    position: relative;
    display: block;
    min-width: 60px;
    height: 60px;
    line-height: 75px;
    text-align: center;
}

.navigation ul li a .icon ion-icon {
    font-size: 1.75em;
}

.navigation ul li a .title {
    position: relative;
    display: block;
    padding: 0 10px;
    height: 60px;
    line-height: 60px;
    text-align: start;
    white-space: nowrap;
}

.navigation ul li:hover a::before,
.navigation ul li.hovered a::before {
    content: '';
    position: absolute;
    right: 0;
    top: -50px;
    width: 50px;
    height: 50px;
    background-color: transparent;
    border-radius: 50%;
    box-shadow: 35px 35px 0 10px #fff;
    pointer-events: none;
}

.navigation ul li:hover a::after,
.navigation ul li.hovered a::after
 {
    content: '';
    position: absolute;
    right: 0;
    bottom: -50px;
    width: 50px;
    height: 50px;
    background-color: transparent;
    border-radius: 50%;
    box-shadow: 35px -35px 0 10px #fff;
    pointer-events: none;
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



/*============  Cards ===============*/

.cardBoxx {
    position: relative;
    width: 100%;
    padding: 20px;
    display: grid;
    grid-template-columns: repeat(3,1fr);
    grid-gap: 30px;
}

.cardBoxx .cards {
    position: relative;
    background-color: #fff;
    padding: 30px;
    border-radius: 10px;
    display: flex;
    justify-content: space-between;
    box-shadow: 0 7px  25px  rgba(0, 0,0, 0.5);
}

.cardBoxx .cards  .numbers {
    position: relative;
    font-weight: 500;
    font-size: 2.0rem;
    color: var(--blue)
}

.cardBoxx .cards  .cardName {
    color: var(--black2);
    font-size: 1.rem;
    margin-top: 5px;
}

.cardBoxx .cards  .iconBox {
    font-size: 2.5rem;
    color: var(--black2);
}

.cardBoxx .cards:hover {
    background: blue;
}

.cardBoxx .cards:hover .numbers,
.cardBoxx .cards:hover .iconBox,
.cardBoxx .cards:hover  .cardName {
    color: #fff;
}

.details {
    position: relative;
    width: 100%;
    padding: 20px;
    display: grid;
    grid-gap: 30px;
    margin-top: 3em;
}

.details .recentOrders {
    position: relative;
    display: grid;
    min-height: 300px;
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
</style>
