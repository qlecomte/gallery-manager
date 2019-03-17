<template>
    <div class="container">
        <h1 class="name">{{album.name}}</h1>
        <div class="description">{{album.description}}</div>
        <PhotoGrid :pictures="album.pictures" :albumId="album.id" />
    </div>
</template>
<script>
  import axios from 'axios'
  import PhotoGrid from './PhotoGrid.vue'

  export default {
    name: 'AlbumDetails',
    components: {
      PhotoGrid
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
    .name {
        text-align: center;
        margin-top: 16px;
    }

    .description {
        margin: 16px 16px 16px;
    }
</style>