<script>
import CarouselItem from "@/components/caroussel/CarousselItem.vue"

export default {
    name:"Caroussel",
    props: ['slides'],
    components:{
        CarouselItem
    },
    data: ()=>({
        currentSlide: 0,
        slideInterval: null,
    }),

    methods:{
        setCurrentSlide (index) {
            this.currentSlide = index
        }

    },

    mounted () {
        this.slideInterval = setInterval(()=>{
            const index = this.currentSlide < this.slides.length-1 ? this.currentSlide +1: 0;
            this.setCurrentSlide(index)
        },3000)
    },

    beforeMount(){
        clearInterval(this.slideInterval)
    }
}
</script>

<template>
            <CarouselItem v-for="(slide,index) in slides" 
            :slide="slide" 
            :key="index"
            :index="index"
            :currentSlide = "currentSlide"/>
</template>

<style scoped>
</style>