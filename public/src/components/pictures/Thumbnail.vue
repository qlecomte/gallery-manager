<template>
    <router-link :to="link"
                 tag="img"
                 :src="getThumbnail(url)">
    </router-link>
</template>
<style scoped>
</style>
<script>
    export default {
      name: 'Thumbnail',
      props: {
        url: String,
        link: Object
      }, computed: {
        getThumbnail: function () {
          return pictureUrl => `${pictureUrl}?w=300&h=180`
        }
      }
    }
</script>