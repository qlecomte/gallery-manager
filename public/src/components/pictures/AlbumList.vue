<template>
    <div class="container">
        <h1 class="title">Mes photos</h1>
        <div class="grid">
            <router-link v-for="album in albums" :key="album.id" class="album-container" :to="'/albums/' + album.id">
                <img class="image" :src="getCover(album.cover)"/>
                <div class="overlay">{{album.name}}</div>
            </router-link>
        </div>

        <!--<div id="google-signin-button"></div>-->
    </div>
</template>
<script>
  import axios from 'axios'

  export default {
    name: 'AlbumList',
    data: function () {
      return {
        albums: []
      }
    },
    computed: {
      getCover: function () {
        return albumUrl => albumUrl ? `${albumUrl}?size=thumbnail` : null
      }
    },
    methods: {
      listAlbums: function () {
        axios.get('/api/v1/albums')
          .then(response => (this.albums = response.data))
          .catch(error => (console.error(error)))
      }, onSignIn: function (googleUser) {
        var profile = googleUser.getBasicProfile();
        const accessToken = googleUser.getAuthResponse(true).access_token;
        console.log('ID: ' + profile.getId());
        axios.get('https://photoslibrary.googleapis.com/v1/albums', {headers: {Authorization: `Bearer ${accessToken}`}})
          .then(response => {
            console.info(response.data)
          }).catch(error => (console.error(error)))
      }
    },
    mounted() {
      gapi.signin2.render('google-signin-button', {
        scope: 'profile email https://www.googleapis.com/auth/photoslibrary.readonly',
        onsuccess: this.onSignIn
      })
    },
    created () {
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
        grid-template-columns: repeat(6, calc((100% - (5 * 8px)) / 6));
        grid-column-gap: 8px;
        grid-row-gap: 8px;
        margin-left: 8px;
        margin-right: 8px;
    }

    .album-container {
        position: relative;
        display: inline-block;
        background-color: grey;

        width: 100%;
        height: 100%;
        object-fit: cover;
    }

    .image {
        display: block;

        width: 100%;
        height: 100%;
        object-fit: cover;
    }

    .overlay {
        position: absolute;
        width: 100%;
        bottom: 0;
        background-color: black;
        color: white;
        text-align: center;
        opacity: 0.75;
    }

    @media screen and (max-width: 1600px) {
        .grid {
            grid-template-columns: repeat(5, calc((100% - (4 * 8px)) / 5));
        }
    }

    @media screen and (max-width: 1280px) {
        .grid {
            grid-template-columns: repeat(4, calc((100% - (3 * 8px)) / 4));
        }
    }

    @media screen and (max-width: 768px) {
        .grid {
            grid-template-columns: repeat(2, calc((100% - (1 * 8px)) / 2));
        }
    }

    @media screen and (max-width: 480px) {
        .grid {
            grid-template-columns: repeat(1, 100%);
        }
    }

</style>