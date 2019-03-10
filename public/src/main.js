// main.js
import Vue from 'vue'
import VueRouter from 'vue-router'
import VueAxios from 'vue-axios'
import axios from 'axios'

import App from './App.vue'
import AlbumList from './components/AlbumList.vue'
import AlbumDetails from './components/AlbumDetails.vue'
import PictureDetails from './components/PictureDetails.vue'

import NotFoundComponent from './components/NotFoundComponent.vue'

Vue.use(VueRouter)
Vue.use(VueAxios, axios)

const routes = [
  {
    name: 'AlbumList',
    path: '/',
    component: AlbumList
  }, {
    name: 'AlbumDetails',
    path: '/albums/:id',
    component: AlbumDetails
  }, {
    name: 'PictureDetails',
    path: '/pictures/:id',
    component: PictureDetails
  }, { path: '*', component: NotFoundComponent }
]

const router = new VueRouter({ routes: routes })
new Vue(Vue.util.extend({ router }, App)).$mount('#app')
