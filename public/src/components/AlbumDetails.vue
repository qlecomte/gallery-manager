<template>
    <div class="container">
        <h1>Album Details</h1><h2>{{album.name}}</h2>

        <div>
            <div class="row">
                <router-link class="image"
                        v-for="picture in album.pictures"
                        :key="picture"
                        :to="'/pictures/' + getId(picture)"
                        tag="img"
                        :src="getThumbnail(picture)">
                </router-link>
            </div>
        </div>

    </div>
</template>
<script>
  import axios from 'axios'

  export default {
    name: 'AlbumDetails',
    data: function () {
      return {
        album: {}
      }
    },
    computed: {
      getPicture: function () {
        return picture => picture
      }, getThumbnail: function () {
        return picture => `${picture}?w=300&h=180`
      }, getId: function () {
        return picture => {
          const regex = /^.*\/([a-zA-Z0-9]*)$/g
          const matches = regex.exec(picture)
          return matches[1]
        }
      }
    },
    methods: {
      getAlbum: function (id) {
        axios.get('/api/v1/albums/' + id)
          .then(response => (this.album = response.data))
          .catch(error => (console.error(error)))
      }
    },
    beforeMount(){
        this.getAlbum(this.$route.params.id)
    }
  }
</script>
<style scoped>
    .row {
        flex-wrap: wrap;
        display: flex;

    }
    .row > div {
        background: lightgrey;
        border: 1px solid;
    }
    .image {
        cursor: pointer;
        flex-grow: 1;
    }
</style>