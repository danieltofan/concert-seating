import Vue from 'vue'
import VueRouter from 'vue-router'
import Seating from '../views/Seating.vue'
import Itinerary from '../views/Itinerary.vue'

Vue.use(VueRouter)

const routes = [
  {
    // home route
    path: '/',
    name: 'home',
    component: Seating
  },
  {
    // itinerary route to display guest info
    path: '/itinerary/:id',
    name: 'itinerary',
    component: Itinerary,
    props: (route) => ({
      ...route.params
    })
  }
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

export default router
