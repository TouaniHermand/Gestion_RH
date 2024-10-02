import { createRouter, createWebHistory , createWebHashHistory} from 'vue-router'

import ClientView from '@/views/clientView/ClientView.vue'
import QrGeneratorView from '@/views/adminView/QrGeneratorView.vue'
import QrCodeReaderView from '@/views/clientView/QrCodeReaderView.vue'
import DashboardView from '@/views/adminView/DashboardView.vue'
import EmployeView from '@/views/adminView/EmployeView.vue'
import DepatementView from '@/views/adminView/DepatementView.vue'
import LoginView from '@/views/adminView/LoginView.vue'
import RecrutementView from '@/views/adminView/RecrutementView.vue'
import ApplicationView from '@/views/clientView/ApplicationView.vue'
import AgendaView from '@/views/adminView/AgendaView.vue'


const router = createRouter({
  history: createWebHashHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path:'/dashboard',
      name:'dashboard',
      component: DashboardView,
    },
    {
      path:'/',
      name:'page',
      component: ClientView
    },
    {
      path:'/QRGenerator',
      name:'GenerateCodeQr',
      component: QrGeneratorView
    },
    {
      path:'/QrReader',
      name:'ReaderCodeQr',
      component: QrCodeReaderView
    },
    {
      path:'/employe',
      name:'Employe',
      component: EmployeView
    },
    {
      path:'/departements',
      name:'Departement',
      component: DepatementView
    },
    {
      path:'/login',
      name: 'login',
      component: LoginView
    },
    {
      path:'/apply',
      name:'Application',
      component: ApplicationView
    },
    {
      path:"/recrutement",
      name:"ressource",
      component: RecrutementView
    },
    {
      path:"/agenda",
      name:"agenda",
      component: AgendaView
    }
  ]
})

export default router
