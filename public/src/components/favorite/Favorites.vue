<template>
    <div class="container">
        <h1 class="title">Favoris</h1>
        <div class="grid">
                <Thumbnail class="image"
                           tag="img"
                           v-for="picture in pictures"
                           :key="picture"
                           :src="picture.url"
                           :link="{path:'/pictures/' + picture.id}"/>
        </div>
    </div>
</template>
<script>
  import axios from 'axios'
  import Thumbnail from '../pictures/Thumbnail.vue'

  export default {
    name: 'FavoriteList',
    components: {
      Thumbnail
    },
    data: function () {
      return {
        pictures: []
      }
    },
    methods: {
      listFavorites: function () {
        axios.get('/api/v1/pictures/favorites')
          .then(response => (this.pictures = response.data))
          .catch(error => (console.error(error)))
      }
    },
    beforeMount(){
      this.listFavorites()
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