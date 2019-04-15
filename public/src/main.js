// main.js
import Vue from 'vue'
import VueRouter from 'vue-router'
import VueAxios from 'vue-axios'
import axios from 'axios'

import App from './App.vue'
import AlbumList from './components/pictures/AlbumList.vue'
import AlbumDetails from './components/pictures/AlbumDetails.vue'
import PictureDetails from './components/pictures/PictureDetails.vue'

import FavoriteList from './components/pictures/Favorites.vue'
import Calendar from './components/pictures/Calendar.vue'
import Map from './components/map/Map.vue'
import Importer from './components/settings/Importer.vue'
import NotFoundComponent from './components/NotFoundComponent.vue'
import NotImplementedComponent from './components/NotImplementedComponent.vue'

import './../styles/main.css'

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
  }, {
    name: 'Search',
    path: '/search',
    component: NotImplementedComponent
  }, {
    name: 'Map',
    path: '/map',
    component: Map
  }, {
    name: 'Calendar',
    path: '/calendar',
    component: Calendar
  }, {
    name: 'Favorite',
    path: '/favorites',
    component: FavoriteList
  }, {
    name: 'Tags',
    path: '/tags',
    component: NotImplementedComponent
  }, {
    name: 'Settings',
    path: '/settings/import',
    component: Importer
  }, {
    path: '*',
    component: NotFoundComponent
  }
]

const router = new VueRouter({ routes: routes })
new Vue(Vue.util.extend({ router }, App)).$mount('#app')
