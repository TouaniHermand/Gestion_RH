<template>
    <Nav />
    <div class="main" :class="{ 'active': isActive }">
      <div class="topbar">
        <div class="toggle" @click="toggleActive">
          <ion-icon name="menu-outline"></ion-icon>
        </div>
        <div class="search">
          <label>
            <input type="text" placeholder="search here" v-model="search" />
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
            <p>Nom: <span>{{ user.nom }}</span></p>
          </div>
          <div>
            <p>Prenom: <span>{{ user.prenom }}</span></p>
          </div>
          <div>
            <p>Contact: <span>{{ user.contact }}</span></p>
          </div>
          <div>
            <p>Email: <span>{{ user.email }}</span></p>
          </div>
          <div>
            <p>Creation date: <span>{{ user.created_at }}</span></p>
          </div>
        </div>
      </transition>
  
      <div class="details2">
        <div class="recentOrders">
          <div class="cardHeader">
            <h2>Agenda</h2>
          </div>
            <FullCalendar :options='calendarOptions'>
                <template v-slot:eventContent='arg'>
                <b>{{ arg.timeText }}</b>
                <i>{{ arg.event.title }}</i>
                </template>
            </FullCalendar>
        </div>
      </div>
    </div>
  </template>
  
<script setup>
import { ref, onMounted, computed } from 'vue';
import axios from 'axios';
import Nav from '@/components/Nav.vue';
import  FullCalendar from '@/components/FullCalendar.vue'

const show = ref(false);
const user = ref(null);
const events = ref([]);
const selectedDate = ref(null);
const newEvent = ref({ title: '' });
const attributes = ref([]);

const toggleActive = () => {
  show.value = !show.value;
};

const onDayClick = ({ date }) => {
  selectedDate.value = date;
};

const addEvent = () => {
  if (newEvent.value.title && selectedDate.value) {
    events.value.push({ title: newEvent.value.title, date: selectedDate.value });
    newEvent.value.title = '';
    updateAttributes();
    selectedDate.value = null;
  }
};

const updateAttributes = () => {
  attributes.value = events.value.map(event => ({
    date: event.date,
    customData: { title: event.title },
  }));
};

console.log(attributes);

onMounted(async () => {
  try {
    const response = await axios.get('http://localhost:3333/user', {
      headers: {
        Authorization: 'Bearer ' + localStorage.getItem('token'),
      },
    });
    user.value = response.data;
    console.log(user.value);
  } catch (error) {
    console.error('Erreur lors de la récupération des données utilisateur :', error);
  }
});


</script>

  
<style scoped>

  .container {
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 20px;
  }
  
  .main {
    position: absolute;
    width: calc(100% - 300px);
    left: 300px;
    min-height: 100vh;
    background: var(--white);
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
    border: 1px solid var(--black1);
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
  
  .profile {
    position: fixed;
    top: 60px;
    right: 20px;
    background-color: #0f0f0f8f;
    padding: 20px;
    border-radius: 8px;
    z-index: 999;
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
  .slide-enter-active,
  .slide-leave-active {
    transition: all 0.5s ease;
  }
  .slide-enter-from,
  .slide-leave-to {
    opacity: 0;
    transform: translateY(-20px);
  }
  
  .details2 {
    position: relative;
    width: 100%;
    padding: 20px;
    display: grid;
    grid-gap: 30px;
  }
  
  .details2 .recentOrders {
    position: relative;
    display: grid;
    min-height: 550px;
    background: var(--white);
    padding: 10px;
    box-shadow: 0 7px 25px rgba(0, 0, 0, 0.48);
    border-radius: 20px;
  }
  
  .details2 .recentOrders .cardHeader {
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
    cursor: pointer;
  }
  



</style>
  