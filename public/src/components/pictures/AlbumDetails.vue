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
      Header: Header
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

    .album-header {
        margin: 16px;
        background-color: #b27fe5;
        padding: 16px;
        border-radius: 16px;
        box-shadow: 2px 2px 5px silver;
    }

    .name {
        text-align: center;
        font-weight: 300;
        font-size: 48px;
        color: white;
    }

    .description {
        font-weight: 400;
        font-style: italic;
        padding-top: 24px;
        text-align: center;
        margin: 0 25%;
        color: #FDECBA;
    }
</style>