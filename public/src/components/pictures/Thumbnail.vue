<template>
    <router-link :to="link">
        <img class="image" :src="getThumbnail(url)">
    </router-link>
</template>
<style scoped>
    .image {
        display: block;
        width: 100%;
        height: 100%;
        object-fit: cover;
    }

    .image:hover {
        box-shadow: 2px 2px 10px black;
        transform: scale(1.01, 1.01);
    }
</style>
<script>
    export default {
      name: 'Thumbnail',
      props: {
        url: String,
        link: Object
      }, computed: {
        getThumbnail: function () {
          return pictureUrl => `${pictureUrl}?size=thumbnail`
        }
      }
    }
</script>