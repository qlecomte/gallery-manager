<template>
    <div class="container">
        <h1 class="title">Favoris</h1>
        <div class="grid">
            <router-link class="image"
                         v-for="picture in pictures"
                         :key="picture"
                         :to="{path:'/pictures/' + picture.id}"
                         tag="img"
                         :src="getThumbnail(picture.url)">
            </router-link>
        </div>
    </div>
</template>
<script>
  import axios from 'axios'
  import PictureService from '../../services/pictureService'

  export default {
    name: 'FavoriteList',
    data: function () {
      return {
        pictures: []
      }
    },
    computed: {
      getThumbnail: function () {
        return pictureUrl => PictureService.getThumbnail(pictureUrl)
      }
    },
    methods: {
      listAlbums: function () {
        axios.get('/api/v1/pictures/favorites')
          .then(response => (this.pictures = response.data))
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
</style>