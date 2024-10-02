<template>
  <Nav/>
  <div class="main" :class="{ 'active': isActive }">
    <div class="topbar">
      <div class="toggle" @click="toggleActive">
        <ion-icon name="menu-outline"></ion-icon>
      </div>
      <div class="search">
        <label for="">
          <input type="text" placeholder="search here" v-model="search">
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
          <p>Contact: <span>{{user.contact}}</span> </p>
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
          <h2>Candidate Screening</h2>
        </div>
        <div class="filter-group">
          <div class="filter-controls">
            <!-- Select for domain -->
            <div class="select">
              <select v-model="domain" class="filter-select">
                <option value="">Sélectionner un domaine</option>
                <option value="communication">Communication</option>
                <option value="comptabilite">Comptabilité</option>
                <option value="informatique">Informatique</option>
                <option value="ressources_humaines">Ressources humaines</option>
              </select>
              
              <!-- Select for diploma -->
              <select v-model="diplome" class="filter-select">
                <option value="">Sélectionner un diplôme</option>
                <option value="Baccalaureat">Baccalauréat</option>
                <option value="BTS">BTS</option>
                <option value="Licence">Licence</option>
                <option value="Master">Master</option>
              </select>
            </div>
            
            <div class="input">
              <input type="number" v-model.number="age" placeholder="Tranche d'âge" class="filter-input">
              <input type="number" v-model.number="experience" placeholder="Nbre d'annees d'experience" class="filter-input">
            </div>
            
            <!-- Button to trigger filtering -->
            <button @click="filterCandidates" class="filter-button">Filtrer</button>
          </div>
        </div>
        
        <!-- Display count of filtered candidates -->
        <div v-if="candidateCount > 0">
          <h3>{{ candidateCount }} candidats trouvés</h3>
        </div>
        
        <!-- Display filtered candidates -->
        <div v-if="filteredCandidates.length > 0" class="candidate">
          <ul class="candidate-list">
            <li v-for="candidate in filteredCandidates" :key="candidate.id" class="candidate-item">
              <div class="div">
                <div class="div1">
                  <div>Nom: {{ candidate.nom }}</div>
                  <div>Prénom: {{ candidate.prenom }}</div>
                  <div>Email: {{ candidate.email }}</div>
                  <div>Date de naissance: {{ candidate.date_naissance }}</div>
                  <div>Expérience 1: {{ candidate.experience_1 }}</div>
                  <div>CV: <a :href="`http://127.0.0.1:3333/uploads/${candidate.thumbnail}`" target="_blank">{{ candidate.thumbnail }}</a></div>
                  <iframe v-if="candidate.thumbnailFile" :src="`http://127.0.0.1:3333/uploads/${candidate.thumbnail}`" width="600" height="400"></iframe>
                </div>
                <div class="div2">
                  <div>Expérience 2: {{ candidate.experience_2 }}</div>
                  <div>Expérience 3: {{ candidate.experience_3 }}</div>
                  <div>Diplôme: {{ candidate.diplomes }}</div>
                  <div>Domaine: {{ candidate.domaine }}</div>
                  <div>Années d'expérience: {{ candidate.annees_experience }}</div>
                </div>
              </div>
              <div class="status" :class="['status', candidate.status.toLowerCase()]" >
                 <p>{{ candidate.status }}</p>
                 <ion-icon name="ellipsis-horizontal-circle-sharp" @click="toggleFormUpdate(candidate.id)" ></ion-icon>
              </div>
            </li>
          </ul>
        </div>
        <div v-else>
          <p>Aucun candidat ne correspond aux critères de filtrage.</p>
        </div>
      </div>
      <div class="recentCustumers" v-if="showFormUpdate">
            <div class="cardHeader">
                <h2>Update Status</h2>
            </div>
            <form @submit.prevent ="updateStatus(candidat.id)" >     
                <div class="form-floating mb-3 inputBox">
                    <label for="nom" class="form-label">Status:</label>
                    <select v-model="status_update">
                      <option value="Expectation">Expectation</option>
                      <option value="Reject">Reject</option>
                      <option value="Validate">Validate</option>
                    </select>
                </div>
        
                <div class="inputBox">
                    <button type="submit" class="btn btn-info">Update</button>
                </div>
            </form>
        </div>
    </div>
    <div class="details2">
      <div class="recentOrders">
        <div class="cardHeader">
          <h2>list of selected candidates</h2>
        </div>

        <div class="candidate-form-container">
          <div v-for="candidat in candidates" :key="candidat.id" class="candidate-row">
            <div class="candidate-info">
              <p><strong>Nom:</strong> {{ candidat.nom }}</p>
              <p><strong>Prénom:</strong> {{ candidat.prenom }}</p>
              <p><strong>Email:</strong> {{ candidat.email }}</p>
              <p><strong>Domaine:</strong> {{ candidat.domaine }}</p>
            </div>
            <ion-icon
              name="send-sharp"
              title="send email"
              @click="openEmailForm(candidat)"
              class="send-icon"
            ></ion-icon>
          </div>
        </div>

        <div v-if="activeForm !== null" class="overlay">
          <div class="candidate-form">
            <form @submit.prevent="sendEmail(candida)">
              <label for="email">Email:</label>
              <input type="email" id="email" v-model="email_candidate" required>

              <label for="heure">Heure:</label>
              <input type="text" id="heure" v-model="heure_candidate" required>

              <label for="date">Date:</label>
              <input type="date" id="date" v-model="date_candidate" required>
              <div class="button-container">
                <button type="submit">Send</button>
                <button type="button" @click="closeEmailForm">Close</button>
              </div>
            </form>
          </div>
        </div>

      </div>
    </div>
  </div>
</template>


<script setup>
import  FullCalendar from '@/components/FullCalendar.vue'
import { ref, onMounted } from 'vue';
import axios from 'axios';
import Nav from '@/components/Nav.vue';
import { toast } from "vue3-toastify";
import 'vue3-toastify/dist/index.css';
import emailjs from 'emailjs-com';
    // Reactive references for form inputs and filtered candidates
    const domain = ref('');
    const diplome = ref('');
    const age = ref(null);
    const experience = ref(null);
    const filteredCandidates = ref([]);
    const candidateCount = ref(0);

    // Method to filter candidates
    const filterCandidates = async () => {
      try {
        let apiUrl = 'http://127.0.0.1:3333/candidats/filters?';

        // Build API URL with selected criteria
        const params = {};
        if (domain.value) params.domain = domain.value;
        if (diplome.value) params.diplome = diplome.value;
        if (age.value !== null) params.age = age.value;
        if (experience.value !== null) params.experience = experience.value;
        
        const queryString = new URLSearchParams(params).toString();
        apiUrl += queryString;

        // Fetch filtered candidates
        const response = await axios.get(apiUrl);
        filteredCandidates.value = response.data;
        candidateCount.value = filteredCandidates.value.length;
      } catch (error) {
        console.error('Error filtering candidates:', error);
        // Handle error, e.g., show an error message to user
      }
    };

    // Method to load all candidates
    const loadAllCandidates = async () => {
      try {
        const response = await axios.get('http://127.0.0.1:3333/candidats');
        filteredCandidates.value = response.data;
      } catch (error) {
        console.error('Error loading candidates:', error);
        // Handle error, e.g., show an error message to user
      }
    };

    // Load all candidates on component mount
    onMounted( async () => {
      try {
        const response = await axios.get('http://localhost:3333/user', {
          headers: {
            Authorization: 'Bearer ' + localStorage.getItem('token'),
          },
        });
        user.value = response.data;// Affichez les données utilisateur dans la console
      } catch (error) {
        console.error('Erreur lors de la récupération des données utilisateur :', error);
      }
      loadAllCandidates();
      CandidatsValides()
    });

    const isActive = ref(false);

function toggleActive() {
    isActive.value = !isActive.value;
}

const show = ref(false)

const showModal = ()=>{
  show.value = !show.value
}


const user = ref(null)

const showFormUpdate = ref(false)
const candidat= ref(null)

const status_update = ref('');

const toggleFormUpdate = async(id)=>{
    showFormUpdate.value = !showFormUpdate.value

    try {
       const result = await axios.get(`http://127.0.0.1:3333/candidats/${id}`,{
        headers: {
           Authorization: 'Bearer ' + localStorage.getItem('token'),
        },
       })
       candidat.value = result.data
       status_update.value = candidat.value.status
    } catch(error){
        console.log(error.response.data);
    }
} 


const updateStatus = async (id) => {
    try {
        const result = await axios.put(`http://127.0.0.1:3333/candidats/${id}`, {
            status: status_update.value,
        }, {
            headers: {
                Authorization: 'Bearer ' + localStorage.getItem('token'),
            }
        });
        toast.success(result.data.message, {
            autoClose: 1000
        })

    } catch(error){
        console.log(error);
        toast.error(error.response, {
            autoClose: 1000
        })
    }
    loadAllCandidates()
    CandidatsValides()
}

const  candidates = ref([])

const  CandidatsValides = async ()=>{
  try {
    const result = await axios.get('http://127.0.0.1:3333/valides', {
      headers: {
        Authorization: 'Bearer ' + localStorage.getItem('token'),
      },
    });
    candidates.value = result.data
    console.log(result.data)
  } catch (error) {
    console.error(error.response.data);
  }
}

//K2DLFKJCP4RJZP7DC8WJMBL5
    const activeForm = ref(null);
    const email_candidate = ref('');
    const heure_candidate = ref('')
    const date_candidate = ref('')
    const nom_candidate = ref('');
    const candida = ref(null)

    const openEmailForm = async (candidat) => {
      activeForm.value = candidat.id;
      try {
       const result = await axios.get(`http://127.0.0.1:3333/candidats/${candidat.id}`,{
        headers: {
           Authorization: 'Bearer ' + localStorage.getItem('token'),
        },
        })
        candida.value = result.data
        email_candidate.value = result.data.email
        nom_candidate.value = result.data.nom
      } catch(error){
        console.log(error.response.data);
      }
    };
    


    const closeEmailForm = () => {
      activeForm.value = null;
    };


const tab = ref([23,455,6777,8888776,2334])
const events = ref({})

const sendEmail = (candida) => {
  const templateParams = {
    from_name: 'Touani',
    from_email: email_candidate.value,
    subject:`Félicitations ! Votre candidature  a été retenue`,
    message: ` 
      Cher/Chère ${candida.nom},

      Nous avons le plaisir de vous informer que votre candidature deposer au sein de FAROTY a été retenue.

      Après un examen attentif de votre dossier et de vos qualifications, nous sommes convaincus que votre profil correspond parfaitement à nos attentes et que vous avez le potentiel pour apporter une contribution significative à notre équipe.

      Nous souhaitons vous inviter à un entretien afin de mieux vous connaître et de discuter en détail de cette opportunité. Voici les informations concernant l'entretien :

      Date : ${date_candidate.value}
      Heure : ${heure_candidate.value}
      Lieu : FAROTY - Terminus Bonamoussadi
      Veuillez nous confirmer votre disponibilité à cette date. Si cette date ne vous convient pas, merci de nous le faire savoir afin que nous puissions convenir d'un autre rendez-vous.

      En attendant notre rencontre, n'hésitez pas à consulter notre site web https://faroty.com/ pour en savoir plus sur notre entreprise et notre équipe.

      Nous vous remercions de l'intérêt que vous portez à FAROTY et nous nous réjouissons de vous rencontrer.

      Cordialement,

      FAROTY
    `,
  };

  events.value = {
    title: `Entretien de M/Mme ${candida.nom}`,
    dateTime:`${date_candidate.value}T${heure_candidate.value}`
  }
  tab.value.push(events)
  console.log(tab.value);
  console.log(events.value);
  emailjs.send('service_x1i1t4c', 'template_vdwrfa1', templateParams,'QQ-SVpbB5i2gcdhqs')
    .then((response) => {
      console.log(email_candidate.value);
      console.log('SUCCESS!', response.status, response.text);
    }, (error) => {
      console.log('FAILED...', error);
  });
    closeEmailForm()
};

</script>

<style scoped>
.status {
  padding: 0.5em;
  border-radius: 0.25em;
  color: #fff;
  font-weight: bolder;
  display: flex;
  text-align: center;
  justify-content: space-between;
  flex-direction: column;
}


.status.expectation {
  background-color: orange;
}

.status.reject {
  background-color: red;
}

.status.validate {
  background-color: green;
}


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
    height: 650px;
    background: var(--white);
    padding: 20px;
    box-shadow: 0 7px 25px rgba(0, 0, 0, 0.48);
    border-radius: 20px;
}

.details .cardHeader {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    flex-direction: column;
}

.cardHeader h2 {
    font-weight: 600;
    color: #0b375c;
    margin-bottom: 1em;
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



h2, h3 {
  text-align: center;
  color: #333;
}

.filter-group {
  margin-bottom: 20px;
}

.filter-controls {
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  gap: 10px;
  margin-bottom: 20px;
}

.filter-select, .filter-input {
  flex: 1;
  min-width: 150px;
  padding: 10px;
  margin: 5px 0;
  border: 1px solid #ccc;
  border-radius: 4px;
  font-size: 16px;
}

.select {
  position: relative;
  float: left;
  display: flex;
  flex-direction: column;
} 

.input {
  position: relative;
  float: right;
  display: flex;
  flex-direction: column;
}

.filter-button {
  background-color: #012c59;
  color: white;
  border: none;
  cursor: pointer;
  width: 80px;
  height: 2em;
  transition: background-color 0.3s ease;
  display: flex;
  justify-content: center;
  margin-top: 2.5em;
  border-radius: 10px;
  font-weight: bolder;
}

.filter-button:hover {
  background-color: #0056b3;
}

.candidate {
  height: 300px;
  background-color: rgb(80, 86, 54);
  overflow: scroll;
}

.candidate-list {
  list-style: none;
  padding: 0;
}

.candidate-item {
  background-color: white;
  border: 1px solid #ddd;
  border-radius: 4px;
  padding: 15px;
  margin-bottom: 10px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
}

.candidate-item div {
  margin-bottom: 5px;
}

.candidate-item .div {
  display: flex;
  justify-content: space-between;
}

.candidate-item .status {
  display: flex;
  justify-content: center;
}

.candidate-item ion-icon {
  font-size: 2em;
  margin: 0 auto;
  cursor: pointer;
}

h3 {
  margin-bottom: 1em;
}

.recentCustumers {
    position: relative;
    display: grid;
    max-height: 250px;
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

.recentCustumers form  {
    display:flex;
    justify-content: space-around;
    flex-direction: column;
}

.recentCustumers form select{
    margin: 0 auto;
    width: 95%;
    padding-top: 1em;
    padding-bottom: 0.5em;
    text-align: center;
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
}

/*====================================*/

.details2 {
  position: relative;
  width: 100%;
  height: 100vh; /* Utiliser toute la hauteur de la vue */
  display: flex;
  justify-content: center;
  align-items: center;

}

.recentOrders {
  width: 100%;
  max-width: 800px;
  background: #fff;
  padding: 20px;
  box-shadow: 0 7px 25px rgba(0, 0, 0, 0.4);
  border-radius: 20px;
}

.cardHeader {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.cardHeader h2 {
  font-weight: 600;
  color: #0b375c;
  margin: 0;
}

.send-icon {
  padding: 8px 10px;
  background: #0b375c;
  color: white;
  border-radius: 50%;
  font-size: 1.8em;
  cursor: pointer;
}

.candidate-form-container {
  margin-top: 20px;
}

.candidate-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-bottom: 1px solid #ddd;
  padding-bottom: 10px;
  margin-bottom: 10px;
}

.candidate-info {
  flex: 1;
}

.overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
}

.candidate-form {
  background-color: #fff;
  padding: 20px;
  border-radius: 10px;
  width: 80%;
  max-width: 400px;
  margin-left: 15em;
}

form {
  margin-top: 20px;
}

label {
  display: block;
  font-weight: bold;
  margin-bottom: 5px;
}

input,
textarea {
  width: 100%;
  padding: 10px;
  margin-bottom: 10px;
  border: 1px solid #ccc;
  border-radius: 5px;
  resize: vertical;
}

.button-container {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 20px;
}

button {
  background-color: #0b375c;
  color: white;
  padding: 10px 20px;
  border: none;
  border-radius: 5px;
  cursor: pointer;
}

button:hover {
  background-color: #094c7c;
}
</style>
