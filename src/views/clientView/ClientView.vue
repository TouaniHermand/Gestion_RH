<script setup>
import Auth from '@/components/Auth.vue';
import Caroussel from '@/components/caroussel/Caroussel.vue';
import { ref } from 'vue';
import 'vue3-toastify/dist/index.css';
import { toast } from "vue3-toastify";

import image1 from '@/assets/a-mobile.jpeg';
import image2 from '@/assets/b_mobile.jpeg';
import image3 from '@/assets/c_mobile.jpeg';
import image4 from '@/assets/d_mobile.jpeg';


const  timeZone = ref(document.getElementById('time'))

setInterval(() => {
  timeZone.value = new Date().toLocaleTimeString();
}, 1000);


const slides = [
    image1,
    image2,
    image3,
    image4
];

const showModal = ref(false)

const toggle = ()=>{
  showModal.value = !showModal.value
}

toast.info('Welcome to home page',{
    autoClose:  1500
})


</script>

<template>
<section class="banner">
    <div class="overplay" v-if="showModal">
        <div class="modal">
            <Auth/>
            <div @click="toggle">
                <ion-icon name="arrow-undo-circle-outline" title="exit" ></ion-icon>
            </div>
        </div>
    </div>
    <div class="wrapper">
        <header class="banner__header clearfix">
            <nav class="banner__nav">
                <a href="#" class="brand"><ion-icon name="logo-twitch"></ion-icon> StaffPulse</a>
                <ul>
                    <li>
                        <router-link to="/login">Attendances</router-link>
                    </li>
                    <li>
                        <router-link  to="/apply">Apply</router-link>
                    </li>
                    <li><a href="#">About us</a></li>
                    <div class="cont"  @click="toggle" >
                        <ion-icon name="log-in-outline" title="Login"></ion-icon>
                    </div>
                </ul>
            </nav>
        </header>
            <div class="banner__slider">
                    <div class="desktop">
                        <div class="desktop__toolbar">
                           <span class="red"></span>
                           <span class="orange"></span>
                           <span class="green"></span>
                       </div>
                       <div class="desktop__content">
                          <Caroussel :slides="slides"/>
                       </div>
                   </div>
                   <div class="mobile">
                        <div class="mobile__toolbar">
                            <span class="mobile__toolbar-microphone"></span>
                            <span class="mobile__toolbar-speaker"></span>
                        </div>
                        <div class="mobile__content">
                           <div class="mobile__content-top_bar">
                             <time class="time" id="time">{{ timeZone }}</time> <br>
                             <i class="fa fa-lock"></i><span class="website" id="website"> StaffPulse</span>
                           </div>
                            <Caroussel :slides="slides"/>
                        </div>
                   </div>
            </div> 
    </div>
</section>

<section class="sinup clearfix">
        <div class="wrapper">
            <div class="left">
                <h2>Welcome to StaffPulse</h2>
            </div>
        </div>
</section>

    <footer class="footer clearfix">
        <div class="wrapper">
            <div class="footer__secondary clearfix">
                <ul>
                    <li>StaffPulse &copy; 2024</li>
                    <li><a href="#"><i class="fi fi-gb"></i>English</a></li>
                    <li><a href="#">Brand</a></li>
                    <li><a href="#">Privacy</a></li>
                    <li><a href="#">Terms</a></li>
                    <li><a href="#">Press</a></li>
                    <li><a href="#">About us</a></li>
                </ul>
            </div>
        </div>
    </footer>
</template>

<style scoped>

.overplay {
  position: absolute;
  width: 100vw;
  height: 100vh;
  background-color: rgba(0,0,0,0.77);
  z-index: 2000;
  display: flex;
  align-items: center;
  justify-content: center;
}




.modal {
    position: relative;
    width: 380px;
    height: 445px;
    background-color: #1c1c1c;
    border-radius: 8px;
    overflow: hidden;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center
}




.clearfix:before , .clearfix:after {
     content: " ";
     display: table;
 }

 .clearfix:after {
    clear: both;
    display: block;
 }

.wrapper {
    width: 1100px;
    max-width: 90%;
    margin: 0 auto;
}

*{
    box-sizing: border-box;
}



.banner {
    background: radial-gradient(circle at 100%, #333, #333 50%, #eee 75%, #333 75%);
    color: white;
    height: 100vh;
    width: 100vw;
}

.banner__header {
    padding-top: 2em;
    text-align: center;
}

.banner__header .banner__nav .brand {
    font-family: 'Pacifico';
    display: inline;
    margin-top: -0.3em;
    text-decoration: none;
    color: white;
    font-size: 2.5em;
    font-weight: bolder;
    letter-spacing: -4.5px;
    float: left;
}


.banner_header .banner__nav ion-icon {
    float: right;
    font-size: 5em;
    padding: 2em;
    background-color: rgb(197, 152, 197);
}

.banner__header .banner__nav ul .cont {
    position: relative;
    width: 40px;
    height: 40px;
    border-radius: 50%;
    overflow: hidden;
    cursor: pointer;
    float: right;
}


.banner__header .banner__nav ul .cont ion-icon {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    object-fit: cover;
    font-weight: bolder;
}

.banner__header .banner__nav ul .cont ion-icon:hover {
    cursor: pointer;
    transform: scale(0.8,0.8);
    transition: all 0.3s ease-in-out;
}


.banner__header .banner__nav ul {
    list-style: none;
    padding: 0;
    margin: 0 0 0 35%;
}


.banner__header .banner__nav ul li {
    float: left;
    margin-right: 1.5em;
}

.banner__header .banner__nav ul li a {
    color: white;
    text-decoration: none;
    font-weight: 700;
    font-family: "Dancing Script", cursive;
    font-size: 1em;
}

.banner__header .banner__nav ul li a:hover {
    background-color: rgb(93, 182, 204);
    cursor: pointer;
    padding: .4em 1em;
    border-radius: 4em;
    transition: background-color 0.3s ease-in-out;
}

.banner__intro {
    text-align: center;
    margin-top: 6.5em;
}

.banner__intro  h1 {
    font-size: 4.5em;
    letter-spacing: -4px;
    text-shadow: -1px 1px 1px black; 
    margin: 0;
}

.banner__intro p {
    font-size: 1.3em;
    line-height: 1.8em;
    max-width: 75%;
    width: 800px;
    margin: .8em auto;
}

.banner__slider {
    margin-top: 7em;
    position: relative;
}

.banner__slider  .desktop {
    background-color: white;
    border-radius: 8px 8px 0 0;
    position: relative;
    z-index: 5;
}

.banner__slider  .desktop .desktop__toolbar {
    background-color: white;
    border-bottom: 2px solid rgb(94, 94, 155);
    padding: 0.3em 0 0.3em 1.2em;
    border-radius: 8px 8px 0 0;
} 

.banner__slider  .desktop .desktop__toolbar span {
    display: inline-block;
    height: 8px;
    width: 8px;
    border-radius: 8px;
    margin-right: 4px;  
}

.banner__slider  .desktop .desktop__toolbar  .red {
    background-color: #50f0ff;
}

.banner__slider  .desktop .desktop__toolbar  .orange {
    background-color: #f9be12
}

.banner__slider  .desktop .desktop__toolbar  .green {
    background-color: #e2660d;
}

.desktop .desktop__content {
    text-align: left;
}
 
.desktop .desktop__content img {
    display: inline-block;
    margin-bottom: -3px;
    height: 63.5vh;
    width: 70%;
}

.banner__slider .mobile {
    background-color: white;
    border-radius: 3em 3em 0 0;
    width: 30%;
    position: absolute;
    right: 0;
    top: -6%;
    z-index: 10;
    box-shadow: -2px -2px 40px rgba(0,0,0,0.2);
    max-width: 340px;   
    margin-top: 0.8em;
}

.banner__slider .mobile .mobile__toolbar {
    background-color: white;
    padding: 1.8em 0 1.2em 0em;
    border-radius: 3em 3em 0 0;
    text-align: center;
}

.banner__slider .mobile .mobile__toolbar .mobile__toolbar-microphone {
    display: inline-block;
    background-color: rgb(101, 101, 170);
    height: 10px;
    width: 10px;
    border-radius: 10px;  
}

.banner__slider .mobile .mobile__toolbar .mobile__toolbar-speaker {
    display: inline-block;
    background-color: rgb(101, 101, 170);
    height: 10px;
    width: 60px;
    border-radius: 10px;
}

.banner__slider .mobile .mobile__content {
    border: 1px solid  rgb(101, 101, 170);
    border-bottom: none;
    margin: 0 14px;
    overflow: hidden;
    border-radius: 4px  4px 0 0 ;
}

.banner__slider .mobile .mobile__content .mobile__content-top_bar {
    background-color: #f4f5f7;
    color: #4e5a5f;
    padding: 5px 0px;
    text-align: center;  
}


.banner__slider .mobile .mobile__content  .mobile__content-top_bar .time {
    font-weight: 700;
    font-size: 0.8em;
}

.banner__slider .mobile .mobile__content  .mobile__content-top_bar .website {
    font-size: 0.8em;
}

.banner__slider .mobile .mobile__content  img  {
    display: inline-block;
    margin-bottom: -3px;
    max-width: 100%;
}

.banner__slider .mobile .mobile__content .mobile__content-top_bar i {
    font-size: 0.6em;
}

.sinup{
    padding:2.5em 0 1.4em 0;
    border-bottom:1px solid #e9ebec;
}

.sinup .left{
    display: flex;
    justify-content: center;
}

.sinup .left h2{
    font-size:1.4em;
    color:#16b8fd;
    margin-top:-0.1em;
}




.footer .footer__column{
    float:left;
    width:25%;
    padding-bottom:2em;
}

.footer .footer__column h3{
    text-transform:uppercase;
    font-size:0.8em;
}

.footer .footer__column ul{
    list-style:none;
    margin:0;
    padding:0;
}

.footer .footer__column ul li a{
    color:#5e37ca;
    text-decoration:none;
    display:inline-block;
    margin-bottom:1em;
}

.footer .footer__column ul li a.wordpress_link{
    color:#52accc;
}

.footer .footer__column ul li a.facebook_link{
    color:#3b5998;
}

.footer .footer__column ul li a.google_plus_link{
    color:#cb3a2f;
}

.footer .footer__column ul li a.twitter_link{
    color:#1da1f2;
}

.footer .footer__column ul li a:hover{
    color:#42268f;
}

.footer .footer__column article h1{
    font-size:1.2em;
}

.footer .footer__column article h1 a{
    color:#4f5b60;
    text-decoration:none;
}

.footer .footer__column article p{
    color:#9399a2;
    font-size:.9em;line-height:1.4em;margin-bottom:0.2em;
}

.footer .footer__column article .read_more{
    text-decoration:none;
    text-transform:lowercase;
}

.footer .footer__column article .read_more:hover{
    color:#42268f;
}

.footer .footer__secondary{
    border-top:1px solid #e9ebec;
    padding:1.2em 0;
}

.footer .footer__secondary ul{
    list-style:none;
    margin:0;
    padding:0;
}

.footer .footer__secondary ul li{
    float:left;
    margin-right:1.8em;
    font-size:0.9em;
}

.footer .footer__secondary ul li a{
    text-decoration:none;
    color:#5e37ca;
}

.footer .footer__secondary ul li:hover{
    color:#42268f;
}


</style>