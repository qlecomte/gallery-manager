<template>
    <div class="grid">
        <Thumbnail class="image"
                   tag="img"
                   v-for="picture in pictures"
                   :key="picture"
                   :url="picture"
                   :link="{path:'/pictures/' + getId(picture), query: {album: albumId}}"/>
    </div>
</template>
<style scoped>
    .grid {
        display: grid;
        grid-template-columns: repeat(6, calc(100% / 6));
    }

    .image {
        width: 100%;
        height: 100%;
        object-fit: cover;
    }

    @media screen and (max-width: 1600px) {
        .grid {
            grid-template-columns: repeat(5, calc(100% / 5));
        }
    }

    @media screen and (max-width: 1280px) {
        .grid {
            grid-template-columns: repeat(4, calc(100% / 4));
        }
    }

    @media screen and (max-width: 768px) {
        .grid {
            grid-template-columns: repeat(2, calc(100% / 2));
        }
    }

    @media screen and (max-width: 480px) {
        .grid {
            grid-template-columns: repeat(1, 100%);
        }
    }
</style>
<script>
    import Thumbnail from './Thumbnail.vue'
    export default {
      name: 'PhotoGrid',
      props:{
        pictures: Array,
        albumId: String,
      },
      components: {
        Thumbnail
      }, computed: {
        getId: function () {
          return picture => {
            const regex = /^.*\/([a-zA-Z0-9]*)$/g
            const matches = regex.exec(picture)
            return matches[1]
          }
        }
      }
    }
</script>