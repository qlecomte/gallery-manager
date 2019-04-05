<template>
    <div class="container">
        <div class="album-header" :style="{ backgroundImage: 'url(' + cover + '?size=full)' }">
            <div class="dim">
                <div class="name">{{name}}</div>
                <div class="description">{{description}}</div>
            </div>
        </div>
    </div>
</template>
<script>
  export default {
    name: 'AlbumHeader',
    props: {
      name: String,
      description: String,
      cover: String
    }
  }
</script>
<style scoped>

    .album-header {
        background: no-repeat center;
        background-size: cover;
        width: 100%;
    }

    .album-header .dim {
        background-color: #0009;
        padding: 48px 16px;
    }

    .name {
        text-align: center;
        font-weight: 300;
        font-size: 48px;
        color: white;
    }

    .description {
        font-weight: 400;
        font-style: italic;
        padding-top: 24px;
        text-align: center;
        margin: 0 25%;
        color: #FDECBA;
    }
</style>