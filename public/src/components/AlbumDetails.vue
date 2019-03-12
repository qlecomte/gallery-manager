<template>
    <div class="container">
        <h1>Album Details</h1><h2>{{album.name}}</h2>

        <div>
            <div class="grid">
                <router-link class="image"
                        v-for="picture in album.pictures"
                        :key="picture"
                        :to="{path:'/pictures/' + getId(picture), query: {album: album.id}}"
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
    .grid {
        display: grid;
        grid-template-columns: repeat(6, calc(100vw / 6));
    }

    .image {
        width: 100%;
        height: 100%;
        object-fit: cover;
    }

    @media screen and (max-width: 1600px) {
        .grid {
            grid-template-columns: repeat(5, calc(100vw / 5));
        }
    }

    @media screen and (max-width: 1280px) {
        .grid {
            grid-template-columns: repeat(4, calc(100vw / 4));
        }
    }

    @media screen and (max-width: 768px) {
        .grid {
            grid-template-columns: repeat(2, calc(100vw / 2));
        }
    }

    @media screen and (max-width: 480px) {
        .grid {
            grid-template-columns: repeat(1, 100vw);
        }
    }

    /*.grid {
        flex-wrap: wrap;
        display: flex;

    }
    .image {
        cursor: pointer;
        flex-grow: 1;
    }*/
</style>