<template>
  <main>
    <div class="container">
      <div class="nav">
        <nav style="--bs-breadcrumb-divider: '>';" aria-label="breadcrumb">
            <ol class="breadcrumb">
              <li class="breadcrumb-item">
                <router-link to="/">Home</router-link> 
              </li>
              <li class="breadcrumb-item active" aria-current="page">Sumbit Application</li>
            </ol>
        </nav>
      </div>
      <form @submit.prevent="Create" class="form-grid">
        <div class="left-column">
          <!-- Première partie du formulaire -->
          <div class="form-group">
            <label for="firstName">Prénom</label>
            <input type="text" id="firstName" v-model.trim="prenom" required>
          </div>
          <div class="form-group">
            <label for="lastName">Nom</label>
            <input type="text" id="lastName" v-model.trim="nom" required>
          </div>
          <div class="form-group">
            <label for="email">Email</label>
            <input type="email" id="email" v-model.trim="email" required>
          </div>
          <div class="form-group">
            <label for="dob">Date de Naissance</label>
            <input type="date" id="dob" v-model="date_naissance" required>
          </div>
        </div>
        <div class="middle-column">
          <!-- Deuxième partie du formulaire -->
          <div class="form-group">
            <label for="experience1">Expérience 1</label>
            <textarea id="experience1" v-model.trim="experience_1" required></textarea>
          </div>
          <!-- Bouton pour ajouter expérience 2 -->
          <div v-if="!showExperience2">
            <ion-icon name="add-circle-sharp" @click="addExperience2"></ion-icon>
          </div>
          <div v-if="showExperience2" class="form-group">
            <label for="experience2">Expérience 2</label>
            <textarea id="experience2" v-model.trim="experience_2" ></textarea>
          </div>
          <!-- Bouton pour ajouter expérience 3 -->
          <div v-if="showExperience2 && !showExperience3">
            <ion-icon name="add-circle-sharp" @click="addExperience3"></ion-icon>
          </div>
          <div v-if="showExperience3" class="form-group">
            <label for="experience3">Expérience 3</label>
            <textarea id="experience3" v-model.trim="experience_3" ></textarea>
          </div>
          <div class="form-group">
            <label for="yearsOfExperience">Années d'Expérience</label>
            <input type="number" id="yearsOfExperience" v-model.number="annees_experience" required>
          </div>
        </div>
        <div class="right-column">
          <!-- Troisième partie du formulaire -->
          <div class="form-group">
            <label for="diploma">Diplômes</label>
            <select id="diploma" v-model="diplomes">
              <option value="Baccalaureat">Baccalauréat</option>
              <option value="BTS">BTS</option>
              <option value="Licence">Licence</option>
              <option value="Master">Master</option>
            </select>
          </div>
          <div class="form-group">
            <label for="domaine">Domaine</label>
            <select id="domaine" v-model="domaine">
              <option value="communication">communication</option>
              <option value="comptabilite">comptabilité</option>
              <option value="informatique">informatique</option>
              <option value="ressources_humaines">Ressources humaines</option>
            </select>
          </div>
          <div class="form-group">
            <label for="motivationLetter">Lettre de Motivation</label>
            <textarea id="motivationLetter" v-model.trim="lettre_motivation" required></textarea>
          </div>
          <div class="form-group">
            <label for="thumbnailFile">Télécharger votre CV (PDF)</label>
            <input type="file" name='thumbnailFile' ref="thumbnailFile"  @change="handleFileUpload" accept="application/pdf"  required>
          </div>
          <button type="submit">Submit application</button>
        </div>
      </form>
    </div>
  </main>
</template>

<script>
import axios from 'axios';
import { ref } from 'vue';
import { toast } from "vue3-toastify";
import 'vue3-toastify/dist/index.css';

export default {
  setup() {
    const nom = ref('');
    const prenom = ref('');
    const email = ref('');
    const date_naissance = ref('');
    const experience_1 = ref('');
    const experience_2 = ref('');
    const experience_3 = ref('');
    const annees_experience = ref('');
    const diplomes = ref('');
    const domaine = ref('');
    const lettre_motivation = ref('');
    const thumbnailFile = ref(null);
    const showExperience2 = ref(false);
    const showExperience3 = ref(false);

    const handleFileUpload = (event) => {
      thumbnailFile.value = event.target.files[0];
      console.log(thumbnailFile.value);
    };

    const Create = async () => {
  try {

    const result = await axios.post('http://127.0.0.1:3333/candidats', {
            nom: nom.value,
            prenom: prenom.value,
            email: email.value,
            date_naissance: date_naissance.value,
            email: email.value,
            experience_1: experience_1.value,
            experience_2: experience_2.value,
            experience_3: experience_3.value,
            diplomes: diplomes.value,
            domaine: domaine.value,
            lettre_motivation: lettre_motivation.value,
            annees_experience: annees_experience.value,
            thumbnailFile: thumbnailFile.value
        }, {
          headers: {
            'Accept':'application/json',
            'Content-Type': 'multipart/form-data' // Définit le type de contenu pour envoyer un fichier
          }
        });
    console.log(result.data.message);
    toast.success(result.data.message, {
      autoClose: 1000
    });
    nom.value = ''
    prenom.value= ''
    email.value = ''
    date_naissance.value = ''
    experience_1.value = ''
    experience_2.value =''
    experience_3.value =''
    annees_experience.value = ''
    diplomes.value = ''
    domaine.value = ''
     lettre_motivation.value = ''
     thumbnailFile.value =  ''

  } catch (error) {
    console.error(error.response.data);
    toast.error(error.response.data, {
      autoClose: 1000
    });
  }
};


    const addExperience2 = () => {
      showExperience2.value = true;
    };

    const addExperience3 = () => {
      showExperience3.value = true;
    };

    return {
      nom,
      prenom,
      email,
      date_naissance,
      experience_1,
      experience_2,
      experience_3,
      annees_experience,
      diplomes,
      domaine,
      lettre_motivation,
      thumbnailFile,
      showExperience2,
      showExperience3,
      handleFileUpload,
      Create,
      addExperience2,
      addExperience3
    };
  }
};

</script>

<style scoped>
main {
  height: 100vh;
  width: 100vw;
  background: #333;
}

.container {
  height: 100vh;
  width: 100vw;
  margin: auto;
  padding: 10px;
  background-color: #f9f9f9;
  border: 1px solid #ddd;
  border-radius: 8px;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
  font-family: Arial, sans-serif;
}

.container .nav {
  display: flex;
  margin-bottom: 20px;
}

.form-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  grid-gap: 30px;
}

.left-column,
.middle-column,
.right-column {
  padding: 10px;
}



.form-group {
  margin-bottom: 15px;
}

label {
  font-weight: bold;
  display: block;
  margin-bottom: 5px;
}

input[type="text"],
input[type="date"],
input[type="number"],
input[type="email"],
select,
textarea {
  width: 100%;
  padding: 10px;
  font-size: 16px;
  border: 1px solid #ddd;
  border-radius: 4px;
  box-sizing: border-box;
  transition: border-color 0.3s ease-in-out;
}

input[type="text"]:focus,
input[type="date"]:focus,
input[type="number"]:focus,
textarea:focus {
  outline: none;
  border-color: #007bff;
}

button {
  background-color: #007bff;
  color: rgb(255, 255, 255);
  border: none;
  padding: 10px;
  border-radius: 5px;
  cursor: pointer;
  font-size: 16px;
  display: block;
  margin: 0 auto 0;
  margin-top: 5em;
}

ion-icon {
  background-color: #007bff;
  color: rgb(255, 255, 255);
  border: none;
  padding: 10px;
  border-radius: 50%;
  cursor: pointer;
  font-size: 16px;
  display: block;
  justify-content: flex-end;
  margin-top: -0.8em;
  margin-bottom: 1em;
}
</style>
