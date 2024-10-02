import { defineStore } from "pinia"


//defineStore("numbers"()=>{}) numbers represente de ce store
//Chaque store doit avoir un identifiant unique et ensuite une fonction call back qui va 
//contenir nos differents etats(variables) et nos methodes que nous allons utiliser pour par exemple  mettre a jour notre etat 

export const useCounterStore = defineStore("numbers",{
    state: () =>{
        return {
            isActive: false
        }
    },
    actions: {

        toggle(){
          this.isActive= !this.isActive
        }
    },
    
    getters: {
      getShow: (state) =>{
          return state.showModal
      }
    }
})
