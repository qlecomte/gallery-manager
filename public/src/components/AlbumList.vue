<template>
    <div class="container">
        <h1>List Albums</h1>
        <div v-for="album in albums">
            {{album}}
            <div><router-link :to="'/albums/' + album.id">Go to details</router-link></div>
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