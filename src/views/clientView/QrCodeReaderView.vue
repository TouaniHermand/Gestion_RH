
<template>
    <main>
        <div class="nav">
            <nav style="--bs-breadcrumb-divider: '>';" aria-label="breadcrumb" >
                <ol class="breadcrumb">
                <li class="breadcrumb-item active" aria-current="page">Account</li>
                </ol>
            </nav>
        </div>
        <div v-if="isLoading" class="loading-overlay">
            <div class="spinner"></div>
        </div>
        <div class="wrapper">
            <nav class="navbar navbar-expand-lg bg-body-tertiary bg-dark  border-body" data-bs-theme="dark">
                <div class="container-fluid">
                    <a class="navbar-brand" href="#" v-if="user">Welcome to staffpulse {{ user.nom }}</a>
                    <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarText" aria-controls="navbarText" aria-expanded="false" aria-label="Toggle navigation">
                    <span class="navbar-toggler-icon"></span>
                    </button>
                </div>
                <div class="cont" @click="logout">
                    <ion-icon name="log-out" title="Logout"></ion-icon>
                </div>
            </nav>
        <div class="container">
            <div class="scan">
                <p>{{ decodedString }}</p>
                <p>{{ error }}</p>
                <p v-if="morningScanTime">Scan du matin : {{ morningScanTime }}</p>
                <p v-if="eveningScanTime">Scan du soir : {{ eveningScanTime }}</p>
           </div>
            <div class=" qr__code">
                <div v-if="showCamera">
                    <qrcode-stream @init="onInit" @decode="onDecode"></qrcode-stream>
                </div>
            </div>
            <div class="button">
                <button @click="startMorningScan"  :disabled="disableMorningScan">Scanner le matin</button>
                <button @click="startEveningScan" :disabled="disableEveningScan">Scanner le soir</button>
            </div>
        </div>
    </div>
    </main>
</template>

<script>
import { QrcodeStream } from 'vue3-qrcode-reader';
import axios from 'axios'
import { toast } from "vue3-toastify";


export default {
    data() {
        return {
            error: '',
            decodedString: '',
            morningScanTime: '',
            eveningScanTime: '',
            showCamera: false, // Variable pour contrôler la visibilité de la caméra
            disableEveningScan: true, // Variable pour désactiver le bouton de scan du soir initialement
            disableMorningScan: false, // Variable pour désactiver le bouton de scan du soir initialement
            time: 1000,
            heure_arrivee:'',
            heure_depart:'',
            mois:'',
            jours_present:'',
            user:null,
            months : [
                "Janvier", "Février", "Mars", "Avril", "Mai", "Juin",
                "Juillet", "Août", "Septembre", "Octobre", "Novembre", "Décembre"
            ],
            isLoading: false
        };
    },
    components: {
        QrcodeStream
    },
    methods: {
        async onInit(promise) {
            try {
                const { capabilities } = await promise;
            } catch (error) {
                this.handleError(error);
            }
        },

        async onDecode(decodedString) {
            this.decodedString = decodedString;
            const currentTime = new Date();

            if (this.morningScanTime === '') {
                // Premier scan du matin
                this.morningScanTime = currentTime.toLocaleString();
                this.speakText(`Scan performed at ${currentTime.getHours()+':'+currentTime.getMinutes()}`);
                this.showCamera = false; // Fermer la caméra après le scan
                this.disableEveningScan = true;
                this.heure_arrivee = `${currentTime.getHours()+':'+currentTime.getMinutes()}`
                this.mois = `${this.months[currentTime.getMonth()]}`
                this.jours_present = currentTime.getDate()
                // Vérifier si l'heure actuelle permet d'activer le bouton "Scanner le soir"
                this.checkEveningScanActivation(currentTime);
            } else if (this.eveningScanTime === '') {
                // Premier scan du soir
                this.eveningScanTime = currentTime.toLocaleString();
                this.speakText(`Scan performed at ${currentTime.getHours()+':'+currentTime.getMinutes()}`);
                this.heure_depart = `${currentTime.getHours()+':'+currentTime.getMinutes()}`
                this.showCamera = false; // Fermer la caméra après le scan 
            } 

            
            if(this.morningScanTime && this.eveningScanTime){
                try {
                    const  result =  await axios.post('http://localhost:3333/presences',{
                        heure_arrivee: this.heure_arrivee,
                        heure_depart: this.heure_depart,
                        mois: this.mois,
                        jours_present: this.jours_present
                    },{headers:{Authorization: 'Bearer ' + localStorage.getItem('token')}})

                    toast.success(result.data.message, {
                        autoClose: 2000
                    });
                } catch (error) {
                    toast.error(error.response.data, {
                        autoClose: 2000
                    });
                }
                setTimeout(() => {
                    this.morningScanTime=''
                    this.eveningScanTime=''
                    this.decodedString=''
                }, 60000);
            }
            
            if(this.morningScanTime){
                this.disableMorningScan = true;
            }
        },

        speakText(text) {
            if (!text) return; // Ne rien faire si le texte est vide
            
            const utterance = new SpeechSynthesisUtterance(text);
            utterance.lang = 'en-US'; // Langue française
            
            // Récupérer la voix française disponible (optionnel)
            const englishVoice = speechSynthesis.getVoices().find(voice => voice.lang === 'en-US');
            if (englishVoice) {
                utterance.voice = englishVoice;
            }
            
            // Lancer la synthèse vocale
            speechSynthesis.speak(utterance);
        },
        

        checkEveningScanActivation(currentTime) {
            // Vérifier si l'heure est après 11h30
            if (currentTime.getHours() > 0 || (currentTime.getHours() === 0 && currentTime.getMinutes() >= 34)) {
                 // Activer le bouton "Scanner le soir"
                    this.disableEveningScan = false;
                    if(this.eveningScanTime){
                        this.disableEveningScan = true;
                        setTimeout(() => {
                            this.disableMorningScan = false;
                        }, 60000);
                    }
                }
        },
        handleError(error) {
            switch (error.name) {
                case 'NotAllowedError':
                    this.error = 'Permission d\'accès à la caméra refusée par l\'utilisateur';
                    break;
                case 'NotFoundError':
                    this.error = 'Aucun périphérique de caméra approprié n\'est installé';
                    break;
                case 'NotSupportedError':
                    this.error = 'La page n\'est pas servie via HTTPS (ou en localhost)';
                    break;
                case 'NotReadableError':
                    this.error = 'La caméra est peut-être déjà en cours d\'utilisation';
                    break;
                case 'OverconstrainedError':
                    this.error = 'Vous avez peut-être demandé la caméra avant qu\'il n\'y en ait une';
                    break;
                case 'StreamApiNotSupportedError':
                    this.error = 'Le navigateur semble manquer de certaines fonctionnalités';
                    break;
                default:
                    this.error = 'Erreur inattendue: ' + error.message;
                    break;
            }
        },

        startMorningScan() {
            this.showCamera = true; // Afficher la caméra pour le scan du matin
        },

        startEveningScan() {
            this.showCamera = true; // Afficher la caméra pour le scan du soir
        },

        logout (){
            this.isLoading = true; // Activer l'état de chargement
            
            toast.info('Disconnection', {
                autoClose: 1500
            });
            setTimeout(() => {
                localStorage.removeItem('token');
                this.$router.push('/');
                this.isLoading = false; // Désactiver l'état de chargement après la redirection
            }, 1500);
            }
    },

    mounted: async function() {
    try {
        toast.info('Welcome to the scan page', {
            autoClose: 2000
        });

        // Vérifier et activer le bouton "Scanner le soir" lorsque l'heure est après 11h30
        setInterval(() => {
            const currentTime = new Date();
            this.checkEveningScanActivation(currentTime);
        }, this.time); // Vérifier chaque minute

        const response = await axios.get('http://localhost:3333/user', {
            headers: {
                Authorization: 'Bearer ' + localStorage.getItem('token'),
            },
        });

        this.user = response.data;
        console.log(this.user); // Affichez les données utilisateur dans la console
    } catch (error) {
        console.error('Erreur lors de la récupération des données utilisateur :', error);
    }
}
};
</script>



<style scoped>

.nav {
    margin-left: 1em;
    background-color:rgb(232, 217, 188);
    margin-bottom: -1em;
}

.nav nav {
    background-color:rgb(232, 217, 188);
}

.loading-overlay {
  position: absolute;
  width: 100vw;
  height: 100vh;
  background-color: rgba(0,0,0,0.77);
  z-index: 2000;
  display: flex;
  align-items: center;
  justify-content: center;
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


.scan {
    margin-top: 1em;
    margin-bottom: 1em;
}

.scan p {
    font-size: large;
    font-weight: bolder;
    color: black;
}

main {
    height: 100vh;
    width: 100vw;
    background-color:rgb(232, 217, 188);
}

.container {
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;
}

.qr__code {
    height: 250px;
    width: 250px;
}


.wrapper {
    width: 1100px;
    max-width: 90%;
    margin: 0 auto;
    height: 90vh;
    background-color: #d5c8e8;
background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='8' height='8' viewBox='0 0 8 8'%3E%3Cg fill='%232f2b37' fill-opacity='0.1'%3E%3Cpath fill-rule='evenodd' d='M0 0h4v4H0V0zm4 4h4v4H4V4z'/%3E%3C/g%3E%3C/svg%3E");
}

*{
    box-sizing: border-box;
}





.cont {
    position: relative;
    width: 40px;
    height: 40px;
    border-radius: 50%;
    overflow: hidden;
    cursor: pointer;
    float: right;

}

.cont ion-icon {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    object-fit: cover;
    font-weight: bolder;
    color: blue;
}



nav {
  background-color: rgb(161, 184, 177);
  padding: 0.5em 0;
}

nav .container-fluid  ul {
    display: flex;
    justify-content:start;
    align-items: center;
    gap: 5em;
}

nav .container-fluid  a {
    font-family: 'Pacifico';
    font-style: italic;
    font-weight: bolder;
}

nav .container-fluid  ul a {
    list-style: none;
    text-decoration: none;
    font-size: large;
    font-weight: bold;
    color: bisque;
    font-style: italic;
}

nav .container-fluid  ul a:hover {
    color: bisque;
}

.container-fluid {
    display: flex;
}

.container-fluid span {
    font-size: 2.5em;
}

</style>