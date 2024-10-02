<script>
export default {
    name: 'CarousselItem',
    props: ['slide','index','currentSlide']
}

</script>  

<template>
        <div v-show="currentSlide === index" >
            <img :src="slide" id="image_desktop" alt="Digital Version Desktop" title="Digital Version Desktop">
        </div>
</template>


<style scoped>

.desktop .desktop__content img {
    display: inline-block;
    margin-bottom: -3px;
    height: 63.5vh;
    width: 70%;
}

img  {
    display: inline-block;
    margin-bottom: -3px;
    max-width: 100%;
    height: 20em;
}
</style>