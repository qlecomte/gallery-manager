<template>
    <div class="container">
        <h1>Album Details</h1>
        <div>
            <div class="row no-gutter">
                <router-link class="col-lg-2 col-md-3 col-sm-6 col-xs-12 image"
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
        return picture => `${picture}?w=320&h=200`
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
    .row.no-gutter {
        margin-left: 0;
        margin-right: 0;
    }
    .row.no-gutter [class*='col-']:not(:first-child),
    .row.no-gutter [class*='col-']:not(:last-child) {
        padding-right: 0;
        padding-left: 0;
    }
    .row > div {
        background: lightgrey;
        border: 1px solid;
    }
</style>