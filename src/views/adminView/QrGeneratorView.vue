<script setup>
import { ref ,watch } from 'vue';
import { onMounted } from 'vue';
import { toast } from "vue3-toastify";
import 'vue3-toastify/dist/index.css';
import axios from 'axios';
import { useRouter } from 'vue-router';
import Nav from '@/components/Nav.vue';
import QRCode from 'qrcode-generator';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import emailjs from 'emailjs-com';

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
  fetchEmployes();
})

const showFormCreate = ref(true)
const showFormUpdate = ref(false)




const  employees = ref(null)

const index = async () =>{
    try {
       const result = await axios.get('http://127.0.0.1:3333/employes',{
        headers: {
           Authorization: 'Bearer ' + localStorage.getItem('token'),
        },
       })
       employees.value = result.data
    } catch(error){
        console.log(error.response.data);
    }
}


const employe = ref(null)

const input1 = ref('');
const input2 = ref('');
const input3 = ref('');
const input4 = ref('');

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

       input1.value = employe.value.nom;
       input2.value = employe.value.prenom;
       input3.value = employe.value.email;
       input4.value = employe.value.contact;
    } catch(error){
        console.log(error.response.data);
    }
} 



const qrImageSrc = ref('');

// Méthode pour générer le code QR
const generateQRCode = () => {
  const qr = QRCode(10, 'M');
  qr.addData(`Name:${input1.value}/prenom:${input2.value}/email:${input3.value}`);
  qr.make();

  // Créez un élément image pour le code QR
  const qrImage = new Image();
  qrImage.src = qr.createDataURL();

  // Stockez l'URL de l'image QR générée dans la variable
  qrImageSrc.value = qrImage.src;

  // Affichez l'image QR dans la div avec l'id 'qrcode' (optionnel)
  const qrcodeDiv = document.getElementById('qrcode');
  qrcodeDiv.innerHTML = '';
  qrcodeDiv.appendChild(qrImage);
};


// Méthode pour télécharger le PDF
const downloadPDF = () => {
  if (!qrImageSrc.value) {
    alert('Veuillez d\'abord générer le code QR.');
    return;
  }

  // Initialisez un nouveau document PDF
  const pdf = new jsPDF();

  // Ajoutez l'image du code QR au PDF
  const qrImage = new Image();
  qrImage.src = qrImageSrc.value;
  pdf.addImage(qrImage, 'PNG', 10, 10, 50, 50); // Ajustez les coordonnées et la taille selon vos besoins

  // Téléchargez le PDF avec un nom de fichier basé sur input1 (par exemple)
  pdf.save(`${input1.value}_QR.pdf`);
  const qrcodeDiv = document.getElementById('qrcode');
  sendEmailWithPDF(pdf.output('blob'));
  qrcodeDiv.innerHTML = '';
};

const sendEmailWithPDF = (pdfBlob) => {
  // Remplacez ces valeurs par les vôtres depuis EmailJS
  const USER_ID = '9vpO93IyMW2mjkNW9-6ds';
  const SERVICE_ID = 'service_x1i1t4c';
  const TEMPLATE_ID = 'template_vdwrfa1';

  const senderEmail = 'willfriedtouani@gmail.com';
  const recipientEmail = 'willfriedtouani@gmail.com';

      const formData = new FormData();
      formData.append('from_email', senderEmail);
      formData.append('to_email', recipientEmail);
      formData.append('pdf', pdfBlob, 'details2.pdf');

  emailjs.sendForm(SERVICE_ID, TEMPLATE_ID, formData, USER_ID)
    .then((response) => {
      console.log('Email sent successfully:', response);
      alert('Email sent successfully!');
    })
    .catch((error) => {
      console.error('Error sending email:', error);
      alert('Failed to send email.');
    });
};

const  downloadPDF2 = ()=>{
    const details2Div = document.querySelector('.details2');
    html2canvas(details2Div).then((canvas) => {
    const pdf = new jsPDF('p', 'pt', 'a4');
    const imgData = canvas.toDataURL('image/png');
    const imgProps = pdf.getImageProperties(imgData);
    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;

    pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
    pdf.save('details2.pdf');
  })
}

const employes = ref([]);

const fetchEmployes = async () => {
  try {
    const result = await axios.get('http://127.0.0.1:3333/presences', {
      headers: {
        Authorization: 'Bearer ' + localStorage.getItem('token'),
      },
    });
    console.log(result);
    employes.value = result.data;
  } catch (error) {
    console.error(error.response.data);
  }
};


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
                        </div>

                        <table>
                            <thead>
                                <tr>
                                    <td>Nom</td>
                                    <td>Prenom</td>
                                    <td>Email</td>
                                    <td>Contact</td>
                                    <td>Actions</td>
                                </tr>
                            </thead>
                            <tbody>
                                <tr v-for="employe in employees" :key="employe.id">
                                    <td>{{ employe.nom }}</td>
                                    <td>{{ employe.prenom }}</td>
                                    <td>{{ employe.email }}</td>
                                    <td>{{ employe.contact }}</td>
                                    <td>
                                        <ion-icon name="qr-code-sharp" @click="toggleFormUpdate(employe.id)"></ion-icon>
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>

                    <!--====================================  Form Update ====================================-->

                    <div class="recentCustumers" v-if="showFormUpdate">
                        <div class="cardHeader">
                            <h2>Formulaire</h2>
                            <div id="qrcode"></div>
                        </div>
                        <form>     
                            <div class="form-floating mb-3 inputBox">
                                <input type="text" class="form-control"  id="nom"   required 
                                v-model="input1" 
                                >
                                <label for="nom" class="form-label">Nom</label>
                            </div>
                    
                            <div class="form-floating mb-3 inputBox">
                                <input type="text" class="form-control" id="prenom"  required
                                v-model="input2" 
                                >
                                <label for="prenom" class="form-label">Prenom</label>
                            </div>
                            <div class="form-floating mb-3 inputBox">
                                <input type="email" class="form-control"  id="email" placeholder="name@example.com" name="email" required 
                                v-model="input3" 
                                >
                                <label for="email" class="form-label">Email address</label>
                            </div>
                            <div class="form-floating mb-3 inputBox">
                                <input type="text" class="form-control"  id="contact"  required 
                                v-model="input4"
                                >
                                <label for="contact" class="form-label">Contact</label>
                            </div>
                        </form>
                            <div class="inputBox">
                                <button type="submit" class="btn" @click="generateQRCode">Générer le code QR</button>
                                <button type="submit" class="btn"  @click="downloadPDF" >Telecharger</button>
                            </div>
                    </div>
                </div>
                <div class="details2">
                    <div class="recentOrders">
                        <div class="cardHeader">
                            <h2>Attendance List</h2>
                            <ion-icon name="arrow-down-circle-sharp" @click="downloadPDF2"></ion-icon>
                        </div>

                        <table>
                            <thead>
                                <tr>
                                    <th>Nom</th>
                                    <th>Prénom</th>
                                    <th>Heure d'arrivée</th>
                                    <th>Heure de départ</th>
                                    <th>jour</th>
                                    <th>Mois</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr v-for="employe in employes" :key="employe.id">
                                <td>{{ employe.nom }}</td>
                                <td>{{ employe.prenom }}</td>
                                <td>
                                    <ul>
                                    <li v-for="presence in employe.presences" :key="presence.id">
                                        {{ presence.heure_arrivee }}
                                    </li>
                                    </ul>
                                </td>
                                <td>
                                    <ul>
                                    <li v-for="presence in employe.presences" :key="presence.id">
                                        {{ presence.heure_depart }}
                                    </li>
                                    </ul>
                                </td>
                                <td>
                                    <ul>
                                    <li v-for="presence in employe.presences" :key="presence.id">
                                        {{ presence.jours_present }}
                                    </li>
                                    </ul>
                                </td>
                                <td>
                                    <ul>
                                    <li v-for="presence in employe.presences" :key="presence.id">
                                        {{ presence.mois }}
                                    </li>
                                    </ul>
                                </td>
                                </tr>
                            </tbody>
                        </table>
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
    flex-direction: column;
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

.details table thead td,th {
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

.recentCustumers  .inputBox {
    display: flex;
    justify-content: center;
    flex-direction: column;
    margin: 0.5em auto;
    width: 95%;
}

.recentCustumers  .inputBox .btn {
    padding: 5px;
    width: 95%;
    background: #0b375c;
    color: white;
    font-weight: bolder;
    margin-bottom: 1em;
    margin: .5em auto;
}

#qrcode{
    height: 120px;
    width: 120px;
    margin: 0 auto;
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
  padding: 20px;
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
  border-radius: 50%;
  cursor: pointer;
}

.details2 table {
  width: 100%;
  border-collapse: collapse;
  margin-top: 10px;
  margin: 10px auto;
  text-align: left;
}

.details2 .recentOrders table thead th {
  padding: 10px;
  background-color: #f2f2f2;
  text-align: left;
}

.details2 .recentOrders table tbody tr {
  color: rgb(2, 1, 1);
  border-bottom: 1px solid rgba(0, 0, 0, 0.3);
}

.details2 .recentOrders table tbody tr:last-child {
  border-bottom: none;
}

.details2 .recentOrders table tbody tr:hover {
  background-color: #77a4c1;
  color: white;
}

.details2 .recentOrders table tbody tr ul {
  list-style: none;
  padding: 0;
  margin: 0;
}

.details2 .recentOrders table tbody tr td {
  padding: 10px;
}

.details2 .recentOrders table tbody td ul li {
  padding: 5px 0;
}

.details2 .recentOrders table tbody td:last-child {
  text-align: center;
}

.details2 .recentOrders table tbody td:last-child ion-icon {
  padding: 1px;
  cursor: pointer;
  font-size: 1.3em;
}

.details2 .recentOrders table tbody td:last-child ion-icon:nth-child(1) {
    color: red;
}

</style>
