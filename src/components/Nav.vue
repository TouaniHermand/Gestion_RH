<script setup>
import { toast } from "vue3-toastify";
import 'vue3-toastify/dist/index.css';
import axios from 'axios';
import { useRouter } from 'vue-router';
import { ref, onMounted } from "vue";

const  router = useRouter()

function toggleActive() {
    isActive.value = !isActive.value;
}

const  isLoading = ref(false)

const logout = ()=>{
    isLoading.value = true;
    toast.info('Disconnection',{
        autoClose: 1500
    })
    setTimeout(() => {
        localStorage.removeItem('token');
        router.push('/');
        isLoading.value = false; // Désactiver l'état de chargement après la redirection
    }, 1500);
}

const activeLinkIndex = ref(0);

const setActiveLink = (index) => {
    activeLinkIndex.value = index;
}

</script>


<template>
    <div v-if="isLoading" class="loading-overlay">
        <div class="spinner"></div>
    </div>
   <div class="navigation" :class="{ 'active': isActive }" >
    <ul>
        <li>
            <a href="#">
                <span class="icon"><ion-icon name="logo-twitch"></ion-icon></span>
                <span class="title">StaffPulse</span>
            </a>
        </li>
        <li :class="{ 'hovered': activeLinkIndex === 1 }" @mouseover="setActiveLink(1)">
            <router-link to="/dashboard">
                <span class="icon"><ion-icon name="home-outline"></ion-icon></span>
                <span class="title">Dashbord</span>
            </router-link>
        </li>
        <li :class="{ 'hovered': activeLinkIndex === 2 }" @mouseover="setActiveLink(2)">
            <router-link to="/employe" >
                <span class="icon"><ion-icon name="id-card-outline"></ion-icon></span>
                <span class="title">Gestion Employes</span>
            </router-link>
        </li>
        <li :class="{ 'hovered': activeLinkIndex === 3 }" @mouseover="setActiveLink(3)" >
            <router-link to="departements">
                <span class="icon"><ion-icon name="business-outline"></ion-icon></span>
                <span class="title">Gestion departements</span>
            </router-link>
        </li>
        <li :class="{ 'hovered': activeLinkIndex === 4 }" @mouseover="setActiveLink(4)" >
            <router-link to="/QRGenerator">
                <span class="icon"><ion-icon name="book-outline"></ion-icon></span>
                <span class="title">Rapport de presence</span>
            </router-link>
        </li>
        <li :class="{ 'hovered': activeLinkIndex === 5 }" @mouseover="setActiveLink(5)" >
            <router-link to="/recrutement"  >
                <span class="icon"><ion-icon name="card-outline"></ion-icon></span>
                <span class="title">Recrutement</span>
            </router-link>
        </li>
        <li :class="{ 'hovered': activeLinkIndex === 6 }" @mouseover="setActiveLink(6)" >
            <router-link to="/agenda">
                <span class="icon"><ion-icon name="calendar-number-sharp"></ion-icon></span>
                <span class="title">Agenda</span>
            </router-link>
        </li>
        <li >
            <a type="button" @click="logout" >
                <span class="icon"><ion-icon name="log-out-outline"></ion-icon></span>
                <span class="title">signOut</span>
            </a>
        </li>
    </ul>             
   </div>
</template>

<style scoped>
.navigation {
    position: fixed;
    width: 300px;
    height: 100%;
    background: #0b375c;
    border-left: 10px solid #0b375c;
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
</style>