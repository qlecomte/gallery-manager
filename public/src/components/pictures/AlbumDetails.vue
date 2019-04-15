<template>
    <div class="container">
        <Header :name="album.name" :description="album.description" :cover="album.cover"/>
        <PhotoGrid :pictures="album.pictures" :albumId="album.id" />
    </div>
</template>
<script>
  import axios from 'axios'
  import PhotoGrid from './PhotoGrid.vue'
  import Header from './AlbumHeader.vue'

  export default {
    name: 'AlbumDetails',
    components: {
      PhotoGrid,
      Header
    },
    data: function () {
      return {
        album: {}
      }
    },
    methods: {
      getAlbum: function (id) {
        axios.get('/api/v1/albums/' + id)
          .then(response => (this.album = response.data))
          .catch(error => (console.error(error)))
      }
    },
    created () {
        this.getAlbum(this.$route.params.id)
    }
  }
</script>
<style scoped>
</style>