<template>
    <div class="container">
        <h1 class="title">Mes photos</h1>
        <div v-for="album in albums">
            <router-link class="album-container" :to="'/albums/' + album.id">
                <img class="image" :src="getCover(album.cover)"/>
                <div class="overlay">{{album.name}}</div>
            </router-link>
        </div>
    </div>
</template>
<script>
  import axios from 'axios'

  export default {
    name: 'AlbumList',
    data: function () {
      return {
        albums: []
      }
    },
    computed: {
      getCover: function () {
        return albumUrl => albumUrl ? `${albumUrl}?w=300&h=180` : null
      }
    },
    methods: {
      listAlbums: function () {
        axios.get('/api/v1/albums')
          .then(response => (this.albums = response.data))
          .catch(error => (console.error(error)))
      }
    },
    beforeMount(){
      this.listAlbums()
    }
  }
</script>
<style scoped>
    .title {
        text-align: center;
        margin-top: 16px;
    }

    .album-container {
        position: relative;
        display: inline-block;
        width: 300px;
        height: 180px;
        background-color: grey;
    }

    .image {
        display: block;

    }

    .overlay {
        position: absolute;
        width: 100%;
        bottom: 0;
        background-color: black;
        color: white;
        text-align: center;
        opacity: 0.75;
    }
</style>