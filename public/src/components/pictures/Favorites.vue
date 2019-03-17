<template>
    <div class="container">
        <h1 class="title">Favoris</h1>
        <PhotoGrid :pictures="urlArray(pictures)"/>
    </div>
</template>
<script>
  import axios from 'axios'
  import PhotoGrid from './PhotoGrid.vue'

  export default {
    name: 'FavoriteList',
    components: {
      PhotoGrid
    },
    data: function () {
      return {
        pictures: []
      }
    },
    computed: {
      urlArray: function () {
        return pictures => pictures.map(function (picture) {
          return picture.url
        })
      }
    },
    methods: {
      listFavorites: function () {
        axios.get('/api/v1/pictures/favorites')
          .then(response => (this.pictures = response.data))
          .catch(error => (console.error(error)))
      }
    },
    created () {
      this.listFavorites()
    }
  }
</script>
<style scoped>
    .title {
        text-align: center;
        margin-top: 16px;
    }
</style>