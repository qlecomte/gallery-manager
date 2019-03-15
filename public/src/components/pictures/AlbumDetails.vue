<template>
    <div class="container">
        <h1 class="name">{{album.name}}</h1>
        <div class="description">{{album.description}}</div>
        <div>
            <div class="grid">
                <Thumbnail class="image"
                           tag="img"
                           v-for="picture in album.pictures"
                           :key="picture"
                           :url="picture"
                           :link="{path:'/pictures/' + getId(picture), query: {album: album.id}}"/>
            </div>
        </div>

    </div>
</template>
<script>
  import axios from 'axios'
  import Thumbnail from './Thumbnail.vue'

  export default {
    name: 'AlbumDetails',
    components: {
      Thumbnail
    },
    data: function () {
      return {
        album: {}
      }
    },
    computed: {
      getPicture: function () {
        return picture => picture
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
    .name {
        text-align: center;
        margin-top: 16px;
    }

    .description {
        margin: 16px 16px 16px;
    }


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